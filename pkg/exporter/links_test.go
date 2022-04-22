// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"strconv"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentportdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentpositiondefinition"
	"github.com/facebookincubator/symphony/pkg/ent/equipmenttype"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

const (
	portANameTitle      = "Port A Name"
	portBNameTitle      = "Port B Name"
	equipmentANameTitle = "Equipment A Name"
	equipmentATypeTitle = "Equipment A Type"
	equipmentBNameTitle = "Equipment B Name"
	equipmentBTypeTitle = "Equipment B Type"
	serviceNamesTitle   = "Service Names"
)

// prepareLinkData: data will be of type:
// loc(grandParent):
//	loc(parent):
//		parentEquipment(equipemtnType): with portType1 (has 2 string props)
//			(on parentEquipment -> )childEquipment(equipemtnType2): with port2 and port3
//		childEquipment2(equipemtnType2): with port2 and port3
//		Link: parentEquipment(port1) <-> childEquipment(port2)
//		Links: childEquipment(port3) <-> childEquipment2(port3)
func prepareLinkData(ctx context.Context, t *testing.T) {
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
	pLocation := client.Location.Create().
		SetName(parentLocation).
		SetType(locTypeM).
		SetParent(gpLocation).
		SaveX(ctx)

	ptyp := client.EquipmentPortType.Create().
		SetName("portType1").
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propStr).
		SetType(propertytype.TypeString).
		SetLinkEquipmentPortType(ptyp).
		SetStringVal("t1").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propStr2).
		SetType(propertytype.TypeString).
		SetLinkEquipmentPortType(ptyp).
		SaveX(ctx)

	equipmentType := client.EquipmentType.Create().
		SetName(equipmentTypeName).
		SaveX(ctx)

	client.EquipmentPortDefinition.Create().
		SetName(portName1).
		SetEquipmentPortTypeID(ptyp.ID).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	port2 := client.EquipmentPortDefinition.Create().
		SetName(portName2).
		SaveX(ctx)
	port3 := client.EquipmentPortDefinition.Create().
		SetName(portName3).
		SaveX(ctx)

	position1 := client.EquipmentPositionDefinition.Create().
		SetName(positionName).
		SaveX(ctx)

	equipmentType2 := client.EquipmentType.Create().
		SetName(equipmentType2Name).
		AddPortDefinitions(port2, port3).
		AddPositionDefinitions(position1).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propNameStr).
		SetType(propertytype.TypeString).
		SetEquipmentType(equipmentType2).
		SetStringVal(propDefValue).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameInt).
		SetType(propertytype.TypeInt).
		SetEquipmentType(equipmentType2).
		SetIntVal(propDevValInt).
		SaveX(ctx)

	parentEquipment := client.Equipment.Create().
		SetName(parentEquip).
		SetType(equipmentType).
		SetLocation(pLocation).
		SaveX(ctx)

	posDef1 := equipmentType2.QueryPositionDefinitions().Where(equipmentpositiondefinition.Name(positionName)).OnlyX(ctx)

	parentPos := client.EquipmentPosition.Create().
		SetDefinitionID(posDef1.ID).
		SetNillableParentID(&parentEquipment.ID).
		SaveX(ctx)

	childEquip1 := client.Equipment.Create().
		SetName(currEquip).
		SetType(equipmentType2).
		SetParentPosition(parentPos).
		SaveX(ctx)

	childEquip2 := client.Equipment.Create().
		SetName(currEquip2).
		SetType(equipmentType2).
		SetLocation(pLocation).
		SaveX(ctx)

	portDef1 := equipmentType.QueryPortDefinitions().Where(equipmentportdefinition.Name(portName1)).OnlyX(ctx)
	portDef2 := equipmentType2.QueryPortDefinitions().Where(equipmentportdefinition.Name(portName2)).OnlyX(ctx)
	portDef3 := equipmentType2.QueryPortDefinitions().Where(equipmentportdefinition.Name(portName3)).OnlyX(ctx)

	propType2 := portDef1.QueryEquipmentPortType().QueryLinkPropertyTypes().Where(propertytype.Name(propStr2)).OnlyX(ctx)

	ep1 := client.EquipmentPort.Create().
		SetDefinitionID(portDef1.ID).
		SetParentID(parentEquipment.ID).
		SaveX(ctx)
	ep2 := client.EquipmentPort.Create().
		SetDefinitionID(portDef2.ID).
		SetParentID(childEquip1.ID).
		SaveX(ctx)

	l1 := client.Link.Create().
		AddPorts(ep1, ep2).
		SaveX(ctx)

	client.Property.Create().
		SetTypeID(propType2.ID).
		SetStringVal("p2").
		SetLink(l1).
		SaveX(ctx)

	ep3 := client.EquipmentPort.Create().
		SetDefinitionID(portDef3.ID).
		SetParentID(childEquip1.ID).
		SaveX(ctx)

	ep4 := client.EquipmentPort.Create().
		SetDefinitionID(portDef3.ID).
		SetParentID(childEquip2.ID).
		SaveX(ctx)

	l2 := client.Link.Create().
		AddPorts(ep3, ep4).
		SaveX(ctx)

	serviceType := client.ServiceType.Create().
		SetName("L2 Service").
		SetHasCustomer(false).
		SaveX(ctx)

	client.Service.Create().
		SetName("S1").
		SetTypeID(serviceType.ID).
		SetStatus(service.StatusPending).
		AddLinks(l1, l2).
		SaveX(ctx)

	client.Service.Create().
		SetName("S2").
		SetTypeID(serviceType.ID).
		SetStatus(service.StatusPending).
		AddLinks(l1).
		SaveX(ctx)
}

func TestEmptyLinksDataExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	e := &Exporter{Log: log, Rower: LinksRower{Log: log}}

	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.EqualValues(t, []string{
			"\ufeffLink ID",
			"Work Order",
			portANameTitle,
			equipmentANameTitle,
			equipmentATypeTitle,
			"Parent Equipment (3) A",
			"Position (3) A",
			"Parent Equipment (2) A",
			"Position (2) A",
			"Parent Equipment A",
			"Equipment Position A",
			portBNameTitle,
			equipmentBNameTitle,
			equipmentBTypeTitle,
			"Parent Equipment (3) B",
			"Position (3) B",
			"Parent Equipment (2) B",
			"Position (2) B",
			"Parent Equipment B",
			"Equipment Position B",
			serviceNamesTitle,
		}, ln)
	}
}

func TestLinksExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	e := &Exporter{Log: log, Rower: LinksRower{Log: log}}

	prepareLinkData(ctx, t)
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		switch {
		case ln[2] == portANameTitle:
			require.EqualValues(t, []string{
				"\ufeffLink ID",
				"Work Order",
				portANameTitle,
				equipmentANameTitle,
				equipmentATypeTitle,
				locTypeNameL,
				locTypeNameM,
				"Parent Equipment (3) A",
				"Position (3) A",
				"Parent Equipment (2) A",
				"Position (2) A",
				"Parent Equipment A",
				"Equipment Position A",
				portBNameTitle,
				equipmentBNameTitle,
				equipmentBTypeTitle,
				locTypeNameL,
				locTypeNameM,
				"Parent Equipment (3) B",
				"Position (3) B",
				"Parent Equipment (2) B",
				"Position (2) B",
				"Parent Equipment B",
				"Equipment Position B",
				serviceNamesTitle,
				propStr,
				propStr2,
			}, ln)
		case ln[2] == portName1:
			require.EqualValues(t, ln[1:], []string{
				"",
				portName1,
				parentEquip,
				equipmentTypeName,
				grandParentLocation,
				parentLocation,
				"",
				"",
				"",
				"",
				"",
				"",
				portName2,
				currEquip,
				equipmentType2Name,
				grandParentLocation,
				parentLocation,
				"",
				"",
				"",
				"",
				parentEquip,
				positionName,
				"S1;S2",
				"t1",
				"p2",
			})
		case ln[2] == portName3:
			require.EqualValues(t, ln[1:], []string{
				"",
				portName3,
				currEquip,
				equipmentType2Name,
				grandParentLocation,
				parentLocation,
				"",
				"",
				"",
				"",
				parentEquip,
				positionName,
				portName3,
				currEquip2,
				equipmentType2Name,
				grandParentLocation,
				parentLocation,
				"",
				"",
				"",
				"",
				"",
				"",
				"S1",
				"",
				"",
			})
		default:
			require.Fail(t, "line does not match", ln)
		}
	}
}

func TestLinksWithFilters(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	e := &Exporter{Log: log, Rower: LinksRower{Log: log}}
	prepareLinkData(ctx, t)
	loc := client.Location.Query().Where(location.Name(parentLocation)).OnlyX(ctx)
	equipType := client.EquipmentType.Query().Where(equipmenttype.Name(equipmentTypeName)).OnlyX(ctx)
	_ = equipType
	maxDepth := 2
	f1, err := json.Marshal([]linksFilterInput{
		{
			Name:     "LOCATION_INST",
			Operator: "IS_ONE_OF",
			IDSet:    []string{strconv.Itoa(loc.ID)},
			MaxDepth: &maxDepth,
		},
		{
			Name:     "EQUIPMENT_TYPE",
			Operator: "IS_ONE_OF",
			IDSet:    []string{strconv.Itoa(equipType.ID)},
			MaxDepth: &maxDepth,
		},
	})
	require.NoError(t, err)

	f2, err := json.Marshal([]linksFilterInput{
		{
			Name:     "PROPERTY",
			Operator: "IS",
			PropertyValue: models.PropertyTypeInput{
				Name:        propStr2,
				Type:        "string",
				StringValue: pointer.ToString("p2"),
			},
			MaxDepth: &maxDepth,
		},
	})
	require.NoError(t, err)

	f3, err := json.Marshal([]linksFilterInput{
		{
			Name:     "PROPERTY",
			Operator: "IS",
			PropertyValue: models.PropertyTypeInput{
				Name:        propStr,
				Type:        "string",
				StringValue: pointer.ToString("t1"),
			},
			MaxDepth: &maxDepth,
		},
	})
	require.NoError(t, err)

	for _, filter := range [][]byte{f1, f2, f3} {
		rows, err := e.Rower.Rows(ctx, string(filter))
		require.NoError(t, err, "error getting rows")
		linesCount := 0
		for _, ln := range rows {
			linesCount++
			require.NoError(t, err, "error reading row")
			require.True(t, ln[2] == portName1 || ln[2] == portANameTitle)
			if ln[2] == portName1 {
				require.EqualValues(t, []string{
					"",
					portName1,
					parentEquip,
					equipmentTypeName,
					grandParentLocation,
					parentLocation,
					"",
					"",
					"",
					"",
					"",
					"",
					portName2,
					currEquip,
					equipmentType2Name,
					grandParentLocation,
					parentLocation,
					"",
					"",
					"",
					"",
					parentEquip,
					positionName,
					"S1;S2",
					"t1",
					"p2",
				}, ln[1:])
			}
		}
		require.Equal(t, 2, linesCount)
	}
}

func TestLinksAsyncExport(t *testing.T) {
	testAsyncExport(t, exporttask.TypeLink)
}
