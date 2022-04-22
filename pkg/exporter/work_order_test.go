// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"strconv"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/AlekSi/pointer"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

type woTestType struct {
	wo1 *ent.WorkOrder
	wo2 *ent.WorkOrder
}

func prepareWOData(ctx context.Context, t *testing.T) woTestType {
	PrepareData(ctx, t)
	client := ent.FromContext(ctx)
	// Add templates
	wotype1 := client.WorkOrderType.Create().
		SetName("woTemplate1").
		SetDescription("woTemplate1 = desc").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propStr).
		SetType(propertytype.TypeString).
		SetStringVal("t1").
		SetWorkOrderType(wotype1).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propStr2).
		SetType(propertytype.TypeString).
		SetWorkOrderType(wotype1).
		SaveX(ctx)
	propStrEnt := wotype1.QueryPropertyTypes().Where(propertytype.Name(propStr)).OnlyX(ctx)
	propStr2Ent := wotype1.QueryPropertyTypes().Where(propertytype.Name(propStr2)).OnlyX(ctx)

	wotype2 := client.WorkOrderType.Create().
		SetName("woTemplate2").
		SetDescription("woTemplate2 = desc").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameBool).
		SetType(propertytype.TypeBool).
		SetWorkOrderType(wotype2).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameInt).
		SetType(propertytype.TypeInt).
		SetWorkOrderType(wotype2).
		SetIntVal(100).
		SaveX(ctx)
	propBoolEnt := wotype2.QueryPropertyTypes().Where(propertytype.Name(propNameBool)).OnlyX(ctx)
	propIntEnt := wotype2.QueryPropertyTypes().Where(propertytype.Name(propNameInt)).OnlyX(ctx)

	projectType := client.ProjectType.Create().
		SetName("projTemplate").
		SaveX(ctx)

	// Add instances
	u1 := viewer.FromContext(ctx).(*viewer.UserViewer).User()
	st := workorder.StatusClosed
	priority := workorder.PriorityHigh
	project := client.Project.Create().
		SetName("Project 1").
		SetCreator(u1).
		SetType(projectType).
		SaveX(ctx)

	wo1 := client.WorkOrder.Create().
		SetName("WO1").
		SetDescription("WO1 - description").
		SetType(wotype1).
		SetLocation(client.Location.Query().Where(location.Name(parentLocation)).OnlyX(ctx)).
		SetProject(project).
		SetAssignee(u1).
		SetStatus(st).
		SetPriority(priority).
		SetOwner(u1).
		SetCreationDate(time.Now()).
		SaveX(ctx)

	client.Property.Create().
		SetType(propStrEnt).
		SetStringVal("string1").
		SetWorkOrder(wo1).
		SaveX(ctx)
	client.Property.Create().
		SetType(propStr2Ent).
		SetStringVal("string2").
		SetWorkOrder(wo1).
		SaveX(ctx)

	st = workorder.StatusPlanned
	priority = workorder.PriorityMedium
	u2 := viewer.MustGetOrCreateUser(ctx, "tester2@example.com", viewertest.DefaultRole)

	wo2 := client.WorkOrder.Create().
		SetName("WO2").
		SetDescription("WO2 - description").
		SetType(wotype2).
		SetLocation(client.Location.Query().Where(location.Name(childLocation)).OnlyX(ctx)).
		SetAssignee(u2).
		SetStatus(st).
		SetPriority(priority).
		SetOwner(u1).
		SetCreationDate(time.Now()).
		SaveX(ctx)

	client.Property.Create().
		SetType(propIntEnt).
		SetIntVal(600).
		SetWorkOrder(wo2).
		SaveX(ctx)
	client.Property.Create().
		SetType(propBoolEnt).
		SetBoolVal(true).
		SetWorkOrder(wo2).
		SaveX(ctx)

	/*
		Project 1 (of type 'projTemplate')
			WO1 ( type woTemplate1). loc: parent, (string props)
		WO2 ( type woTemplate2). loc: child (bool&int props)
	*/
	return woTestType{
		wo1,
		wo2,
	}
}

func TestEmptyDataExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	e := &Exporter{Log: log, Rower: WoRower{Log: log}}

	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.EqualValues(t, WoDataHeader, ln)
	}
}

func TestWOExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)

	e := &Exporter{Log: log, Rower: WoRower{Log: log}}

	ctx := viewertest.NewContext(context.Background(), client)
	data := prepareWOData(ctx, t)

	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		var wo ent.WorkOrder
		switch {
		case ln[1] == "Work Order Name":
			require.EqualValues(t, append(WoDataHeader, []string{propNameBool, propNameInt, propStr, propStr2}...), ln)
		case ln[0] == strconv.Itoa(data.wo1.ID):
			wo = *data.wo1
			require.EqualValues(t, ln[1:], []string{
				"WO1",
				wo.QueryProject().OnlyX(ctx).Name,
				wo.QueryTemplate().OnlyX(ctx).Name,
				workorder.StatusClosed.String(),
				GetStringDate(wo.CloseDate),
				"tester@example.com",
				viewertest.DefaultUser,
				workorder.PriorityHigh.String(),
				GetStringDate(pointer.ToTime(time.Now())),
				"",
				grandParentLocation + "; " + parentLocation,
				"",
				"",
				"string1",
				"string2",
			})
		case ln[0] == strconv.Itoa(data.wo2.ID):
			wo = *data.wo2
			require.EqualValues(t, ln[1:], []string{
				"WO2",
				"",
				wo.QueryTemplate().OnlyX(ctx).Name,
				workorder.StatusPlanned.String(),
				"",
				"tester2@example.com",
				viewertest.DefaultUser,
				workorder.PriorityMedium.String(),
				GetStringDate(pointer.ToTime(time.Now())),
				"",
				parentLocation + "; " + childLocation,
				"true",
				"600",
				"",
				"",
			})
		default:
			require.Fail(t, "line does not match")
		}
	}
}

func TestExportWOWithFilters(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	e := &Exporter{Log: log, Rower: WoRower{Log: log}}
	data := prepareWOData(ctx, t)

	userID := viewer.FromContext(ctx).(*viewer.UserViewer).User().ID
	f, err := json.Marshal([]equipmentFilterInput{
		{
			Name:      "WORK_ORDER_STATUS",
			Operator:  "IS_ONE_OF",
			StringSet: []string{"CLOSED"},
		},
		{
			Name:     "WORK_ORDER_ASSIGNED_TO",
			Operator: "IS_ONE_OF",
			IDSet:    []string{strconv.Itoa(userID)},
		},
	})
	require.NoError(t, err)

	linesCount := 0
	rows, err := e.Rower.Rows(ctx, string(f))
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		linesCount++
		if ln[0] == strconv.Itoa(data.wo1.ID) {
			wo := data.wo1
			require.EqualValues(t, ln[1:], []string{
				"WO1",
				wo.QueryProject().OnlyX(ctx).Name,
				wo.QueryTemplate().OnlyX(ctx).Name,
				workorder.StatusClosed.String(),
				GetStringDate(wo.CloseDate),
				"tester@example.com",
				viewertest.DefaultUser,
				workorder.PriorityHigh.String(),
				GetStringDate(pointer.ToTime(time.Now())),
				"",
				grandParentLocation + "; " + parentLocation,
				"string1",
				"string2",
			})
		}
	}
	require.Equal(t, 2, linesCount)
}

func TestWorkOrdersAsyncExport(t *testing.T) {
	testAsyncExport(t, exporttask.TypeWorkOrder)
}
