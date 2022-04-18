// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"fmt"
	"testing"
	"time"

	"go.uber.org/zap/zaptest/observer"

	"go.uber.org/zap"

	"github.com/facebookincubator/symphony/pkg/ent/equipmenttype"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/stretchr/testify/require"

	"github.com/facebookincubator/symphony/pkg/ent/equipment"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
)

func prepareBOMData(ctx context.Context, t *testing.T) woTestType {
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

	equipment1 := client.Equipment.Query().
		Where(equipment.Name(currEquip)).FirstX(ctx)
	equipment2 := client.Equipment.Query().
		Where(equipment.Name(parentEquip)).FirstX(ctx)
	equipment1.Update().
		SetWorkOrder(wo1).
		SetFutureState(enum.FutureStateInstall).
		SaveX(ctx)
	equipment2.Update().
		SetWorkOrder(wo1).
		SetFutureState(enum.FutureStateInstall).
		SaveX(ctx)
	propertyType1 := client.PropertyType.Create().
		SetName("Part Number").
		SetType(propertytype.TypeString).
		SetEquipmentType(client.EquipmentType.Query().Where(equipmenttype.Name(equipmentTypeName)).FirstX(ctx)).
		SetStringVal("default").
		SaveX(ctx)
	propertyType2 := client.PropertyType.Create().
		SetName("Rack Loc").
		SetType(propertytype.TypeString).
		SetEquipmentType(client.EquipmentType.Query().Where(equipmenttype.Name(equipmentTypeName)).FirstX(ctx)).
		SetStringVal("default").
		SaveX(ctx)
	client.Property.Create().
		SetStringVal(propInstanceValue).
		SetEquipment(equipment1).
		SetType(propertyType1).
		SaveX(ctx)
	client.Property.Create().
		SetStringVal(propInstanceValue).
		SetEquipment(equipment2).
		SetType(propertyType1).
		SaveX(ctx)
	client.Property.Create().
		SetStringVal(propInstanceValue).
		SetEquipment(equipment1).
		SetType(propertyType2).
		SaveX(ctx)
	client.Property.Create().
		SetStringVal(propInstanceValue).
		SetEquipment(equipment2).
		SetType(propertyType2).
		SaveX(ctx)
	return woTestType{
		wo1,
		wo2,
	}
}

func TestGenerateEmptyBOMRows(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	woTestType := prepareBOMData(ctx, t)
	core, _ := observer.New(zap.DebugLevel)
	rows, err := generateWoBOMRows(ctx, zap.New(core), woTestType.wo2)
	require.NoError(t, err)

	for _, ln := range rows {
		require.NoError(t, err, "error reading row")
		require.EqualValues(t, []string{
			"Equipment Name",
			"Equipment Type",
			"State",
			fmt.Sprintf("Location (%s)", locTypeNameL),
			fmt.Sprintf("Location (%s)", locTypeNameM),
			fmt.Sprintf("Location (%s)", locTypeNameS),
		}, ln)
	}
}

func TestGenerateBOMRows(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	woTestType := prepareBOMData(ctx, t)
	core, _ := observer.New(zap.DebugLevel)
	rows, err := generateWoBOMRows(ctx, zap.New(core), woTestType.wo1)
	require.NoError(t, err)

	for _, ln := range rows {
		require.NoError(t, err, "error reading row")
		switch {
		case ln[0] == "Equipment Name":
			require.EqualValues(t, []string{
				"Equipment Name",
				"Equipment Type",
				"State",
				fmt.Sprintf("Location (%s)", locTypeNameL),
				fmt.Sprintf("Location (%s)", locTypeNameM),
				fmt.Sprintf("Location (%s)", locTypeNameS),
				"Part Number",
				"Rack Loc",
				propNameStr,
				propNameInt,
				newPropNameStr,
			}, ln)
		case ln[1] == equipmentTypeName:
			require.EqualValues(t, ln, []string{
				parentEquip,
				equipmentTypeName,
				string(enum.FutureStateInstall),
				grandParentLocation,
				parentLocation,
				childLocation,
				propInstanceValue,
				propInstanceValue,
				"",
				"",
				"",
			})
		case ln[1] == equipmentType2Name:
			require.EqualValues(t, ln, []string{
				currEquip,
				equipmentType2Name,
				string(enum.FutureStateInstall),
				grandParentLocation,
				parentLocation,
				childLocation,
				propInstanceValue,
				propInstanceValue,
				propInstanceValue,
				"15",
				"defaultVal2",
			})
		default:
			require.Fail(t, "line does not match")
		}
	}
}
