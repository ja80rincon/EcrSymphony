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

type woFilterInput struct {
	Name          enum.EquipmentFilterType `json:"name"`
	Operator      enum.FilterOperator      `jsons:"operator"`
	StringValue   string                   `json:"stringValue"`
	IDSet         []string                 `json:"idSet"`
	StringSet     []string                 `json:"stringSet"`
	PropertyValue models.PropertyTypeInput `json:"propertyValue"`
	BoolValue     bool                     `json:"boolValue"`
}

type WoRower struct {
	Log log.Logger
}

var WoDataHeader = []string{bom + "Work Order ID", "Work Order Name", "Project Name", "Template", "Status", "Close Date", "Assignee", "Owner", "Priority", "Created date", "Target date", "Location"}

func (er WoRower) Rows(ctx context.Context, filtersParam string) ([][]string, error) {
	var (
		logger      = er.Log.For(ctx)
		err         error
		filterInput []*models.WorkOrderFilterInput
	)
	if filtersParam != "" {
		filterInput, err = paramToWOFilterInput(filtersParam)
		if err != nil {
			logger.Error("cannot filter work orders", zap.Error(err))
			return nil, errors.Wrap(err, "cannot filter work orders")
		}
	}
	client := ent.FromContext(ctx)
	fields := GetQueryFields(ExportEntityWorkOrders)
	searchResult, err := WorkOrderSearch(ctx, client, filterInput, nil, fields)
	if err != nil {
		logger.Error("cannot query work orders", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query work orders")
	}

	wosList := searchResult.WorkOrders
	allrows := make([][]string, len(wosList)+1)

	woIDs := make([]int, len(wosList))
	for i, w := range wosList {
		woIDs[i] = w.ID
	}
	propertyTypes, err := PropertyTypesSlice(ctx, woIDs, client, enum.PropertyEntityWorkOrder)
	if err != nil {
		logger.Error("cannot query property types", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query property types")
	}

	title := append(WoDataHeader, propertyTypes...)

	allrows[0] = title
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, wo := range wosList {
		wo, i := wo, i

		cg.Go(func(ctx context.Context) error {
			row, err := woToSlice(ctx, wo, propertyTypes)
			if err != nil {
				return err
			}
			allrows[i+1] = row
			return nil
		})
	}
	if err := cg.Wait(); err != nil {
		logger.Error("error in wait", zap.Error(err))
		return nil, errors.WithMessage(err, "error in wait")
	}
	return allrows, nil
}

func woToSlice(ctx context.Context, wo *ent.WorkOrder, propertyTypes []string) ([]string, error) {
	properties, err := PropertiesSlice(ctx, wo, propertyTypes, enum.PropertyEntityWorkOrder)
	if err != nil {
		return nil, err
	}
	var projName, locName, templateName, date string

	proj, err := wo.QueryProject().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if proj != nil {
		projName = proj.Name
	}

	loc, err := wo.QueryLocation().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if loc != nil {
		locName = loc.Name
		parent, err := loc.QueryParent().Only(ctx)
		if err == nil && parent != nil {
			locName = parent.Name + "; " + locName
		}
	}
	templa, err := wo.QueryTemplate().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if templa != nil {
		templateName = templa.Name
	}
	if v := wo.CloseDate; v != nil {
		date = GetStringDate(v)
	}

	assigneeName := ""
	assignee, err := wo.QueryAssignee().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if assignee != nil {
		assigneeName = assignee.Email
	}

	ownerName := ""
	owner, err := wo.QueryOwner().Only(ctx)
	if ent.MaskNotFound(err) != nil {
		return nil, err
	}
	if owner != nil {
		ownerName = owner.Email
	}

	row := []string{
		strconv.Itoa(wo.ID), wo.Name, projName, templateName, wo.Status.String(), date, assigneeName,
		ownerName, wo.Priority.String(), GetStringDate(&wo.CreationDate),
		GetStringDate(wo.InstallDate), locName,
	}
	row = append(row, properties...)

	return row, nil
}

func GetStringDate(t *time.Time) string {
	if t == nil {
		return ""
	}
	y, m, d := t.Date()
	if y != 1 || m != time.January || d != 1 {
		return fmt.Sprintf("%d %v %d", d, m.String(), y)
	}
	return ""
}

func paramToWOFilterInput(params string) ([]*models.WorkOrderFilterInput, error) {
	var inputs []woFilterInput
	err := json.Unmarshal([]byte(params), &inputs)
	if err != nil {
		return nil, err
	}

	ret := make([]*models.WorkOrderFilterInput, 0, len(inputs))
	for _, f := range inputs {
		upperName := strings.ToUpper(f.Name.String())
		upperOp := strings.ToUpper(f.Operator.String())
		propertyValue := f.PropertyValue
		intIDSet, err := ToIntSlice(f.IDSet)
		if err != nil {
			return nil, fmt.Errorf("wrong id set %v: %w", f.IDSet, err)
		}
		inp := models.WorkOrderFilterInput{
			FilterType:    enum.WorkOrderFilterType(upperName),
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

func WorkOrderFilter(query *ent.WorkOrderQuery, filters []*models.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	var err error
	for _, f := range filters {
		switch {
		case strings.HasPrefix(f.FilterType.String(), "WORK_ORDER_"):
			if query, err = handleWorkOrderFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "LOCATION_INST"):
			if query, err = handleWOLocationFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func WorkOrderSearch(ctx context.Context, client *ent.Client, filters []*models.WorkOrderFilterInput, limit *int, fields []string) (*models.WorkOrderSearchResult, error) {
	var (
		query = client.WorkOrder.Query()
		err   error
	)
	query, err = WorkOrderFilter(query, filters)
	if err != nil {
		return nil, err
	}
	var woResult models.WorkOrderSearchResult
	for _, field := range fields {
		switch field {
		case "count":
			woResult.Count, err = query.Clone().Count(ctx)
			if err != nil {
				return nil, errors.Wrapf(err, "Count query failed")
			}
		case "workOrders":
			if limit != nil {
				query.Limit(*limit)
			}
			woResult.WorkOrders, err = query.All(ctx)
			if err != nil {
				return nil, errors.Wrapf(err, "Querying work orders failed")
			}
		}
	}
	return &woResult, nil
}
