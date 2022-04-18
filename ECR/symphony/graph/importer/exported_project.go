// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package importer

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/projecttype"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

const minimalProjectLineLength = 5

// processExportedEquipment imports project csv generated from the export feature
// nolint: staticcheck, dupl
func (m *importer) processExportedProject(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := m.logger.For(ctx)
	nextLineToSkipIndex := -1
	client := m.ClientFrom(ctx)
	userViewer, ok := viewer.FromContext(ctx).(*viewer.UserViewer)
	if !ok {
		http.Error(w, "import can only be done by user", http.StatusInternalServerError)
	}
	u := userViewer.User()
	log.Debug("Exported Project - started")
	var (
		err                    error
		modifiedCount, numRows int
		errs                   Errors
		commitRuns             []bool
	)
	if err := r.ParseMultipartForm(maxFormSize); err != nil {
		log.Warn("parsing multipart form", zap.Error(err))
		http.Error(w, "cannot parse form", http.StatusInternalServerError)
		return
	}
	skipLines, verifyBeforeCommit, err := m.parseImportArgs(r)
	if err != nil {
		errorReturn(w, "can't parse form or arguments", log, err)
		return
	}

	if pointer.GetBool(verifyBeforeCommit) {
		commitRuns = []bool{false, true}
	} else {
		commitRuns = []bool{true}
	}
	startSaving := false

	for fileName := range r.MultipartForm.File {
		first, _, err := m.newReader(fileName, r)
		if err != nil {
			errorReturn(w, fmt.Sprintf("cannot handle file: %q", fileName), log, err)
			return
		}
		importHeader, err := NewImportHeader(first, ImportEntityProject)
		if err != nil {
			errorReturn(w, "error on header", log, err)
			return
		}

		if err = m.inputValidationsProject(ctx, importHeader); err != nil {
			errorReturn(w, "first line validation error", log, err)
			return
		}

		for _, commit := range commitRuns {
			// if we encounter errors on the "verifyBefore" flow - don't run the commit=true phase
			if commit && pointer.GetBool(verifyBeforeCommit) && len(errs) != 0 {
				break
			} else if commit && len(errs) == 0 {
				startSaving = true
			}
			if len(skipLines) > 0 {
				nextLineToSkipIndex = 0
			}

			numRows, modifiedCount = 0, 0
			_, reader, err := m.newReader(fileName, r)
			if err != nil {
				errorReturn(w, fmt.Sprintf("cannot handle file: %q", fileName), log, err)
				return
			}
			for {
				untrimmedLine, err := reader.Read()
				if err != nil {
					if err == io.EOF {
						break
					}
					log.Warn("cannot read row", zap.Error(err))
					continue
				}
				numRows++
				if shouldSkipLine(skipLines, numRows, nextLineToSkipIndex) {
					log.Warn("skipping line", zap.Error(err), zap.Int("line_number", numRows))
					nextLineToSkipIndex++
					continue
				}

				importLine, err := NewImportRecord(m.trimLine(untrimmedLine), importHeader)
				if err != nil {
					errs = append(errs, ErrorLine{Line: numRows, Error: err.Error(), Message: "validating line"})
					continue
				}
				name := importLine.Name()
				projTypName := importLine.TypeName()
				projType, err := client.ProjectType.Query().Where(projecttype.Name(projTypName)).Only(ctx)
				if err != nil {
					errs = append(errs, ErrorLine{Line: numRows, Error: err.Error(), Message: fmt.Sprintf("couldn't find project type %q", projTypName)})
					continue
				}

				id := importLine.ID()
				description := importLine.Description()
				priority := project.Priority(strings.ToUpper(importLine.Priority()))
				if err := project.PriorityValidator(priority); err != nil {
					errs = append(errs, ErrorLine{Line: numRows, Error: err.Error(), Message: fmt.Sprintf("priority is invalid %q", priority)})
					continue
				}

				if id == 0 {
					// new project
					loc, err := m.verifyOrCreateLocationHierarchy(ctx, importLine, false, nil)
					if err != nil {
						errs = append(errs, ErrorLine{Line: numRows, Error: err.Error(), Message: "error while verifying project location hierarchy"})
						continue
					}
					var locID *int
					if loc != nil {
						locID = &loc.ID
					}

					var propInputs []*models.PropertyInput
					if importLine.Len() > importHeader.PropertyStartIdx() {
						propInputs, err = m.validatePropertiesForProjectType(ctx, importLine, projType)
						if err != nil {
							errs = append(errs, ErrorLine{Line: numRows, Error: err.Error(), Message: fmt.Sprintf("validating property for type %q", projType.Name)})
							continue
						}
					}

					if commit {
						if _, err := m.createProject(ctx, m.r.Mutation(), name, projType, &description, &priority, &u.ID, locID, propInputs); err == nil {
							modifiedCount++
						} else {
							errTxt := err.Error()
							if strings.Contains(errTxt, "already exists") {
								errTxt = "already exists"
							}
							errs = append(errs, ErrorLine{Line: numRows, Error: errTxt, Message: fmt.Sprintf("error while creating project  %q", name)})
						}
					}
				}
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	err = writeSuccessMessage(w, modifiedCount, numRows, errs, !*verifyBeforeCommit || len(errs) == 0, startSaving)
	if err != nil {
		errorReturn(w, "cannot marshal message", log, err)
		return
	}
	log.Debug("Exported Project - Done", zap.Any("errors list", errs), zap.Int("all_lines", numRows), zap.Int("edited_added_rows", modifiedCount))
}

func (m *importer) inputValidationsProject(ctx context.Context, importHeader ImportHeader) error {
	firstLine := importHeader.line
	if len(firstLine) < minimalProjectLineLength {
		return errors.New("first line too short. should include: 'Project ID', 'Project Name', 'Project Type' , 'Description', 'Priority'")
	}
	locStart, _ := importHeader.LocationsRangeIdx()
	if !equal(firstLine[:locStart], []string{"Project ID", "Project Name", "Project Type", "Description"}) {
		return errors.New("first line misses sequence; 'Project ID', 'Project Name', 'Project Type' , 'Description'")
	}
	if !equal(firstLine[importHeader.PriorityIdx():importHeader.PropertyStartIdx()], []string{"Priority"}) {
		return errors.New("first line misses sequence: 'Priority'")
	}
	err := m.validateAllLocationTypeExist(ctx, locStart, importHeader.LocationTypesRangeArr(), false)
	return err
}

func (m *importer) validatePropertiesForProjectType(ctx context.Context, l ImportRecord, projType *ent.ProjectType) ([]*models.PropertyInput, error) {
	var pInputs []*models.PropertyInput
	propTypes, err := projType.QueryProperties().All(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, errors.Wrap(err, "can't query property types for project type")
	}
	for _, ptype := range propTypes {
		ptypeName := ptype.Name
		idx := l.title.Find(ptypeName)
		if idx == -1 {
			continue
		}
		value := l.line[idx]
		pInput, err := getPropInput(*ptype, value)
		if err != nil {
			return nil, err
		}
		if pInput != nil {
			pInputs = append(pInputs, pInput)
		}
	}
	return pInputs, nil
}
