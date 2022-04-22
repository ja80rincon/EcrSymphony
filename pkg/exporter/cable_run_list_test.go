// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/viewer"
)

func prepareCRLData(ctx context.Context) woTestType {
	client := ent.FromContext(ctx)
	locTypeL := client.LocationType.Create().
		SetName(locTypeNameL).
		SetIndex(0).
		SaveX(ctx)
	locTypeM := client.LocationType.Create().
		SetName(locTypeNameM).
		SetIndex(1).
		SaveX(ctx)

	gpLocation := client.Location.Create().
		SetName(grandParentLocation).
		SetType(locTypeL).
		SaveX(ctx)
	client.Location.Create().
		SetName(parentLocation).
		SetType(locTypeM).
		SetParent(gpLocation).
		SaveX(ctx)

	wotype1 := client.WorkOrderType.Create().
		SetName("woTemplate1").
		SetDescription("woTemplate1 = desc").
		SaveX(ctx)

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

	wo2 := client.WorkOrder.Create().
		SetName("WO2").
		SetDescription("WO2 - description").
		SetType(wotype1).
		SetLocation(client.Location.Query().Where(location.Name(parentLocation)).OnlyX(ctx)).
		SetProject(project).
		SetAssignee(u1).
		SetStatus(st).
		SetPriority(priority).
		SetOwner(u1).
		SetCreationDate(time.Now()).
		SaveX(ctx)

	ptyp := client.EquipmentPortType.Create().
		SetName("portType1").
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propNameInt).
		SetType(propertytype.TypeInt).
		SetLinkEquipmentPortType(ptyp).
		SetIntVal(100).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propStr).
		SetType(propertytype.TypeString).
		SetEquipmentPortType(ptyp).
		SetStringVal("t1").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propStr2).
		SetType(propertytype.TypeString).
		SetEquipmentPortType(ptyp).
		SetStringVal("t2").
		SaveX(ctx)

	equipmentType := client.EquipmentType.Create().
		SetName(equipmentTypeName).
		SaveX(ctx)

	port1 := client.EquipmentPortDefinition.Create().
		SetName(portName1).
		SetEquipmentPortTypeID(ptyp.ID).
		SaveX(ctx)
	port2 := client.EquipmentPortDefinition.Create().
		SetName(portName2).
		SetEquipmentPortTypeID(ptyp.ID).
		SaveX(ctx)
	port3 := client.EquipmentPortDefinition.Create().
		SetName(portName3).
		SetEquipmentPortTypeID(ptyp.ID).
		SaveX(ctx)
	port4 := client.EquipmentPortDefinition.Create().
		SetName(portName4).
		SetEquipmentPortTypeID(ptyp.ID).
		SaveX(ctx)

	ep1 := client.EquipmentPort.Create().
		SetDefinitionID(port1.ID).
		SaveX(ctx)
	ep2 := client.EquipmentPort.Create().
		SetDefinitionID(port2.ID).
		SaveX(ctx)

	client.Link.Create().
		SetWorkOrder(wo1).
		SetFutureState(enum.FutureStateInstall).
		AddPorts(ep1, ep2).
		SaveX(ctx)

	ep3 := client.EquipmentPort.Create().
		SetDefinitionID(port3.ID).
		SaveX(ctx)

	ep4 := client.EquipmentPort.Create().
		SetDefinitionID(port4.ID).
		SaveX(ctx)

	client.Equipment.Create().
		SetName(parentEquip).
		SetType(equipmentType).
		AddPorts(ep1, ep3).
		SaveX(ctx)
	client.Equipment.Create().
		SetName(currEquip).
		SetType(equipmentType).
		AddPorts(ep2, ep4).
		SaveX(ctx)

	l1 := client.Link.Create().
		SetWorkOrder(wo1).
		SetFutureState(enum.FutureStateInstall).
		AddPorts(ep3, ep4).
		SaveX(ctx)

	propType2 := ptyp.QueryLinkPropertyTypes().FirstX(ctx)

	client.Property.Create().
		SetTypeID(propType2.ID).
		SetIntVal(200).
		SetLink(l1).
		SaveX(ctx)
	return woTestType{
		wo1,
		wo2,
	}
}

func TestGenerateEmptyCRLRows(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	woTestType := prepareCRLData(ctx)
	core, _ := observer.New(zap.DebugLevel)
	rows, err := generateCRLRows(ctx, zap.New(core), woTestType.wo2)
	require.NoError(t, err)

	for _, ln := range rows {
		require.EqualValues(t, []string{

			"Link State",
			"Equipment Name A",
			"Port Name A",
			"Port Type A",
			"Equipment Name B",
			"Port Name B",
			"Port Type B",
		}, ln)
	}
}

func TestCRLExport(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	woTestType := prepareCRLData(ctx)
	core, _ := observer.New(zap.DebugLevel)
	rows, err := generateCRLRows(ctx, zap.New(core), woTestType.wo1)
	require.NoError(t, err)

	for _, ln := range rows {
		switch {
		case ln[2] == "Equipment Name A":
			require.EqualValues(t, []string{
				"Link State",
				propNameInt,
				"Equipment Name A",
				"Port Name A",
				"Port Type A",
				propStr,
				propStr2,
				"Equipment Name B",
				"Port Name B",
				"Port Type B",
				propStr,
				propStr2,
			}, ln)
		case ln[3] == portName1:
			require.EqualValues(t, ln, []string{
				string(enum.FutureStateInstall),
				"100",
				parentEquip,
				portName1,
				"portType1",
				"t1",
				"t2",
				currEquip,
				portName2,
				"portType1",
				"t1",
				"t2",
			})
		case ln[3] == portName3:
			require.EqualValues(t, ln, []string{
				string(enum.FutureStateInstall),
				"200",
				parentEquip,
				portName3,
				"portType1",
				"t1",
				"t2",
				currEquip,
				portName4,
				"portType1",
				"t1",
				"t2",
			})
		default:
			require.Fail(t, "line does not match")
		}
	}
}
