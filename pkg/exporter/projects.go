// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log"

	"github.com/AlekSi/pointer"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

const (
	dateTimeLayout = "01/02/2006 15:04"
)

type projectFilterInput struct {
	Name          enum.ProjectFilterType   `json:"name"`
	Operator      enum.FilterOperator      `jsons:"operator"`
	StringValue   string                   `json:"stringValue"`
	IDSet         []string                 `json:"idSet"`
	StringSet     []string                 `json:"stringSet"`
	PropertyValue models.PropertyTypeInput `json:"propertyValue"`
	BoolValue     bool                     `json:"boolValue"`
}

type ProjectRower struct {
	Log log.Logger
}

var ProjectDataHeader = []string{bom + "Project ID", "Project Name", "Description", "Work Orders", "Template", "Location", "Owner", "Priority", "Creation Time"}

func (er ProjectRower) Rows(ctx context.Context, filters string) ([][]string, error) {
	var (
		logger      = er.Log.For(ctx)
		client      = ent.FromContext(ctx)
		err         error
		filterInput []*models.ProjectFilterInput
	)
	if filters != "" {
		filterInput, err = paramToProjectFilterInput(filters)
		if err != nil {
			logger.Error("cannot filter projects", zap.Error(err))
			return nil, errors.Wrap(err, "cannot filter projects")
		}
	}

	fields := GetQueryFields(ExportEntityProjects)
	searchResult, err := ProjectSearch(ctx, client, filterInput, nil, fields)
	if err != nil {
		logger.Error("cannot query projects", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query projects")
	}

	projectsList := searchResult.Projects
	allRows := make([][]string, len(projectsList)+1)

	projectIDs := make([]int, len(projectsList))
	for i, p := range projectsList {
		projectIDs[i] = p.ID
	}

	propertyTypes, err := PropertyTypesSlice(ctx, projectIDs, client, enum.PropertyEntityProject)
	if err != nil {
		logger.Error("cannot query property types", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query property types")
	}

	title := append(ProjectDataHeader, propertyTypes...)

	allRows[0] = title
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, project := range projectsList {
		project, i := project, i

		cg.Go(func(ctx context.Context) error {
			row, err := projectToSlice(ctx, project, propertyTypes)
			if err != nil {
				return err
			}
			allRows[i+1] = row
			return nil
		})
	}
	if err := cg.Wait(); err != nil {
		logger.Error("error in wait", zap.Error(err))
		return nil, errors.WithMessage(err, "error in wait")
	}
	return allRows, nil
}

func projectToSlice(ctx context.Context, project *ent.Project, propertyTypes []string) ([]string, error) {
	properties, err := PropertiesSlice(ctx, project, propertyTypes, enum.PropertyEntityProject)
	if err != nil {
		return nil, err
	}

	var projectTemplate, projectLocation, projectCreator, projectDescription string

	template, err := project.QueryTemplate().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if template != nil {
		projectTemplate = template.Name
	}

	location, err := project.QueryLocation().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if location != nil {
		projectLocation = location.Name
		parent, err := location.QueryParent().Only(ctx)
		if err == nil && parent != nil {
			projectLocation = parent.Name + "; " + location.Name
		}
	}

	creator, err := project.QueryCreator().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if creator != nil {
		projectCreator = creator.Email
	}

	projectWorkOrders, err := project.QueryWorkOrders().Count(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}

	if project.Description != nil {
		projectDescription = projectDescriptionReplaceCharacters(*project.Description)
	}

	row := []string{
		strconv.Itoa(project.ID), project.Name,
		projectDescription, strconv.Itoa(projectWorkOrders),
		projectTemplate, projectLocation, projectCreator,
		project.Priority.String(),
		ProjectDateTimeFormat(&project.CreateTime),
	}
	row = append(row, properties...)

	return row, nil
}

func paramToProjectFilterInput(params string) ([]*models.ProjectFilterInput, error) {
	var inputs []projectFilterInput
	err := json.Unmarshal([]byte(params), &inputs)
	if err != nil {
		return nil, err
	}

	ret := make([]*models.ProjectFilterInput, 0, len(inputs))
	for _, f := range inputs {
		upperName := strings.ToUpper(f.Name.String())
		upperOp := strings.ToUpper(f.Operator.String())
		propertyValue := f.PropertyValue
		intIDSet, err := ToIntSlice(f.IDSet)
		if err != nil {
			return nil, fmt.Errorf("wrong id set %v: %w", f.IDSet, err)
		}
		inp := models.ProjectFilterInput{
			FilterType:    enum.ProjectFilterType(upperName),
			Operator:      enum.FilterOperator(upperOp),
			StringValue:   pointer.ToString(f.StringValue),
			IDSet:         intIDSet,
			StringSet:     f.StringSet,
			PropertyValue: &propertyValue,
			MaxDepth:      pointer.ToInt(5),
		}
		ret = append(ret, &inp)
	}
	return ret, nil
}

func ProjectFilter(query *ent.ProjectQuery, filters []*models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	var err error
	for _, f := range filters {
		if strings.HasPrefix(f.FilterType.String(), "PROJECT_") {
			if query, err = handleProjectFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func ProjectSearch(ctx context.Context, client *ent.Client, filters []*models.ProjectFilterInput, limit *int, fields []string) (*models.ProjectSearchResult, error) {
	var (
		query = client.Project.Query()
		err   error
	)
	query, err = ProjectFilter(query, filters)
	if err != nil {
		return nil, err
	}
	var projectResult models.ProjectSearchResult
	for _, field := range fields {
		switch field {
		case "count":
			projectResult.Count, err = query.Clone().Count(ctx)
			if err != nil {
				return nil, errors.Wrapf(err, "Count query failed")
			}
		case "projects":
			if limit != nil {
				query.Limit(*limit)
			}
			projectResult.Projects, err = query.All(ctx)
			if err != nil {
				return nil, errors.Wrapf(err, "Querying projects failed")
			}
		}
	}
	return &projectResult, nil
}

func ProjectDateTimeFormat(t *time.Time) string {
	return t.Format(dateTimeLayout)
}

func projectDescriptionReplaceCharacters(value string) string {
	return strings.ReplaceAll(
		strings.ReplaceAll(
			strings.ReplaceAll(
				strings.ReplaceAll(
					strings.ReplaceAll(value, "\n\r", " "),
					"\r\n", " "),
				"\n", "|||"),
			"\r", "|||"),
		",", "&&")
}
