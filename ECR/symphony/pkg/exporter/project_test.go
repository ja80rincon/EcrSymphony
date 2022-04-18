// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"strconv"
	"testing"
	"time"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"encoding/json"
)

type projectTestType struct {
	project1 *ent.Project
	project2 *ent.Project
}

func prepareProjectData(ctx context.Context, t *testing.T) projectTestType {
	PrepareData(ctx, t)
	client := ent.FromContext(ctx)

	projectType1 := client.ProjectType.Create().
		SetName("ProjectTypeName1").
		SetDescription("ProjectTypeDescription1").
		SaveX(ctx)

	projectTemplate1 := client.ProjectTemplate.Create().
		SetName("ProjectTemplateName1").
		SetDescription("ProjectTemplateDescription1").
		SaveX(ctx)

	creator1 := viewer.MustGetOrCreateUser(ctx, "tester@example.com", viewertest.DefaultRole)
	organization := viewer.GetOrCreateOrganization(ctx, "MyOrganization")

	client.PropertyType.Create().
		SetName(propStr).
		SetType(propertytype.TypeString).
		SetStringVal("t1").
		SetProjectType(projectType1).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propStr2).
		SetType(propertytype.TypeString).
		SetProjectType(projectType1).
		SaveX(ctx)

	propStrEnt := projectType1.QueryProperties().Where(propertytype.Name(propStr)).OnlyX(ctx)

	propStr2Ent := projectType1.QueryProperties().Where(propertytype.Name(propStr2)).OnlyX(ctx)

	project1 := client.Project.Create().
		SetName("ProjectName1").
		SetDescription("ProjectDescription1").
		SetType(projectType1).
		SetTemplate(projectTemplate1).
		SetPriority(project.PriorityHigh).
		SetLocation(client.Location.Query().Where(location.Name(parentLocation)).OnlyX(ctx)).
		SetCreator(creator1).
		SaveX(ctx)

	client.Property.Create().
		SetType(propStrEnt).
		SetStringVal("string10").
		SetProject(project1).
		SaveX(ctx)

	client.Property.Create().
		SetType(propStr2Ent).
		SetStringVal("string20").
		SetProject(project1).
		SaveX(ctx)

	projectType2 := client.ProjectType.Create().
		SetName("ProjectTypeName2").
		SetDescription("ProjectTypeDescription2").
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propNameBool).
		SetType(propertytype.TypeBool).
		SetProjectType(projectType2).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propNameInt).
		SetType(propertytype.TypeInt).
		SetProjectType(projectType2).
		SetIntVal(100).
		SaveX(ctx)

	propBoolEnt := projectType2.QueryProperties().Where(propertytype.Name(propNameBool)).OnlyX(ctx)

	propIntEnt := projectType2.QueryProperties().Where(propertytype.Name(propNameInt)).OnlyX(ctx)

	projectTemplate2 := client.ProjectTemplate.Create().
		SetName("ProjectTemplateName2").
		SetDescription("ProjectTemplateDescription2").
		SaveX(ctx)

	creator2 := viewer.MustGetOrCreateUser(ctx, "tester2@example.com", viewertest.DefaultRole)

	project2 := client.Project.Create().
		SetName("ProjectName2").
		SetDescription("ProjectDescription2").
		SetType(projectType2).
		SetTemplate(projectTemplate2).
		SetPriority(project.PriorityMedium).
		SetLocation(client.Location.Query().Where(location.Name(childLocation)).OnlyX(ctx)).
		SetCreator(creator2).
		SaveX(ctx)

	client.Property.Create().
		SetType(propIntEnt).
		SetIntVal(600).
		SetProject(project2).
		SaveX(ctx)

	client.Property.Create().
		SetType(propBoolEnt).
		SetBoolVal(true).
		SetProject(project2).
		SaveX(ctx)

	workOrderType := client.WorkOrderType.Create().
		SetName("woTemplate1").
		SetDescription("woTemplate1 = desc").
		SaveX(ctx)

	client.WorkOrder.Create().
		SetName("WO1").
		SetDescription("WO1 - description").
		SetType(workOrderType).
		SetLocation(client.Location.Query().Where(location.Name(parentLocation)).OnlyX(ctx)).
		SetProject(project2).
		SetAssignee(creator2).
		SetStatus(workorder.StatusClosed).
		SetPriority(workorder.PriorityMedium).
		SetOwner(creator2).
		SetCreationDate(time.Now()).
		SetOrganization(organization).
		SaveX(ctx)

	return projectTestType{
		project1,
		project2,
	}
}

func TestEmptyProjectDataExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	logProject := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	e := &Exporter{Log: logProject, Rower: ProjectRower{Log: logProject}}

	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.EqualValues(t, ProjectDataHeader, ln)
	}
}

func TestProjectExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	logProject := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)

	e := &Exporter{Log: logProject, Rower: ProjectRower{Log: logProject}}

	ctx := viewertest.NewContext(context.Background(), client)
	data := prepareProjectData(ctx, t)

	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		var projectTest ent.Project
		switch {
		case ln[1] == "Project Name":
			require.EqualValues(t, append(ProjectDataHeader, []string{propNameBool, propNameInt, propStr, propStr2}...), ln)
		case ln[0] == strconv.Itoa(data.project1.ID):
			projectTest = *data.project1
			require.EqualValues(t, ln[1:], []string{
				"ProjectName1",
				"ProjectDescription1",
				"0",
				projectTest.QueryTemplate().OnlyX(ctx).Name,
				grandParentLocation + "; " + parentLocation,
				"tester@example.com",
				project.PriorityHigh.String(),
				ProjectDateTimeFormat(pointer.ToTime(time.Now())),
				"",
				"",
				"string10",
				"string20",
			})
		case ln[0] == strconv.Itoa(data.project2.ID):
			projectTest = *data.project2
			require.EqualValues(t, ln[1:], []string{
				"ProjectName2",
				"ProjectDescription2",
				"1",
				projectTest.QueryTemplate().OnlyX(ctx).Name,
				parentLocation + "; " + childLocation,
				"tester2@example.com",
				project.PriorityMedium.String(),
				ProjectDateTimeFormat(pointer.ToTime(time.Now())),
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

func TestExportProjectWithFilters(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	logProject := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	e := &Exporter{Log: logProject, Rower: ProjectRower{Log: logProject}}
	data := prepareProjectData(ctx, t)

	userID := viewer.FromContext(ctx).(*viewer.UserViewer).User().ID
	f, err := json.Marshal([]projectFilterInput{
		{
			Name:        enum.ProjectFilterTypeProjectName,
			Operator:    enum.FilterOperatorContains,
			StringValue: "ProjectName",
		},
		{
			Name:     enum.ProjectFilterTypeProjectCreator,
			Operator: enum.FilterOperatorIsOneOf,
			IDSet:    []string{strconv.Itoa(userID)},
		},
	})
	require.NoError(t, err)

	linesCount := 0
	rows, err := e.Rower.Rows(ctx, string(f))
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		linesCount++
		if ln[0] == strconv.Itoa(data.project1.ID) {
			projectTest := data.project1
			require.EqualValues(t, ln[1:], []string{
				"ProjectName1",
				"ProjectDescription1",
				"0",
				projectTest.QueryTemplate().OnlyX(ctx).Name,
				grandParentLocation + "; " + parentLocation,
				"tester@example.com",
				project.PriorityHigh.String(),
				ProjectDateTimeFormat(pointer.ToTime(time.Now())),
				"string10",
				"string20",
			})
		}
	}
	require.Equal(t, 2, linesCount)
}

func TestProjectsAsyncExport(t *testing.T) {
	testAsyncExport(t, exporttask.TypeProject)
}
