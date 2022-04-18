// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

func TestAddLink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr, eqr := r.Mutation(), r.Query(), r.Equipment()
	locationType, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "location_type"})
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "parent_equipment_type",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)
	equipmentA, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_a",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	equipmentB, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_b",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})

	availablePorts, err := eqr.Ports(ctx, equipmentA, pointer.ToBool(true))
	require.NoError(t, err)
	allPorts, err := eqr.Ports(ctx, equipmentA, pointer.ToBool(false))
	require.NoError(t, err)
	require.Len(t, availablePorts, 1)
	require.Len(t, allPorts, 1)

	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
	})
	require.Nil(t, err)
	nodeA, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentA, ok := nodeA.(*ent.Equipment)
	require.True(t, ok)
	nodeB, err := qr.Node(ctx, equipmentB.ID)
	require.NoError(t, err)
	fetchedEquipmentB, ok := nodeB.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortA := fetchedEquipmentA.QueryPorts().OnlyX(ctx)
	fetchedPortB := fetchedEquipmentB.QueryPorts().OnlyX(ctx)

	require.Equal(t, fetchedPortA.QueryParent().OnlyIDX(ctx), equipmentA.ID)
	require.Equal(t, fetchedPortB.QueryParent().OnlyIDX(ctx), equipmentB.ID)

	linkA := fetchedPortA.QueryLink().OnlyX(ctx)
	linkB := fetchedPortA.QueryLink().OnlyX(ctx)

	require.Equal(t, linkA.ID, createdLink.ID)
	require.Equal(t, linkB.ID, createdLink.ID)

	fetchedPorts, err := createdLink.QueryPorts().All(ctx)
	require.NoError(t, err)
	require.Len(t, fetchedPorts, 2)

	availablePorts, err = eqr.Ports(ctx, equipmentA, pointer.ToBool(true))
	require.NoError(t, err)
	allPorts, err = eqr.Ports(ctx, equipmentA, pointer.ToBool(false))
	require.NoError(t, err)
	require.Len(t, availablePorts, 0)
	require.Len(t, allPorts, 1)
}

func TestAddLinkWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "location_type"})
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	linkStrValue := "Foo"
	linkStrPropType := pkgmodels.PropertyTypeInput{
		Name:        "link_str_prop",
		Type:        propertytype.TypeString,
		StringValue: &linkStrValue,
	}
	linkPropTypeInput := []*pkgmodels.PropertyTypeInput{&linkStrPropType}
	portType, err := mr.AddEquipmentPortType(ctx, models.AddEquipmentPortTypeInput{
		Name:           "example_type_a",
		LinkProperties: linkPropTypeInput,
	})
	require.Nil(t, err)

	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
		PortTypeID:   &portType.ID,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "parent_equipment_type",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	equipmentA, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_a",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	equipmentB, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_b",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)

	linkVal := "Bar"
	linkPropTypeID := portType.QueryLinkPropertyTypes().FirstIDX(ctx)
	linkProp := models.PropertyInput{
		StringValue:    &linkVal,
		PropertyTypeID: linkPropTypeID,
	}
	propInput := []*models.PropertyInput{&linkProp}
	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
		Properties: propInput,
	})
	require.Nil(t, err)
	fetchedNodeA, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentA, ok := fetchedNodeA.(*ent.Equipment)
	require.True(t, ok)
	fetchedNodeB, err := qr.Node(ctx, equipmentB.ID)
	require.NoError(t, err)
	fetchedEquipmentB, ok := fetchedNodeB.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortA := fetchedEquipmentA.QueryPorts().OnlyX(ctx)
	fetchedPortB := fetchedEquipmentB.QueryPorts().OnlyX(ctx)

	require.Equal(t, fetchedPortA.QueryParent().OnlyIDX(ctx), equipmentA.ID)
	require.Equal(t, fetchedPortB.QueryParent().OnlyIDX(ctx), equipmentB.ID)

	linkA := fetchedPortA.QueryLink().OnlyX(ctx)
	linkB := fetchedPortB.QueryLink().OnlyX(ctx)

	require.Equal(t, linkA.ID, createdLink.ID)
	require.Equal(t, linkB.ID, createdLink.ID)

	fetchedPorts, err := createdLink.QueryPorts().All(ctx)
	require.NoError(t, err)
	require.Len(t, fetchedPorts, 2)

	require.Equal(t, linkA.ID, createdLink.ID)
	require.Equal(t, linkB.ID, createdLink.ID)

	propA := linkA.QueryProperties().FirstX(ctx)
	propZ := linkB.QueryProperties().FirstX(ctx)

	require.Equal(t, pointer.GetString(propA.StringVal), linkVal)
	require.Equal(t, pointer.GetString(propZ.StringVal), linkVal)
}

func TestEditLinkWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type",
	})
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	linkStrValue := "Foo"
	linkStrPropType := pkgmodels.PropertyTypeInput{
		Name:        "link_str_prop",
		Type:        propertytype.TypeString,
		StringValue: &linkStrValue,
	}
	linkPropTypeInput := []*pkgmodels.PropertyTypeInput{&linkStrPropType}
	portType, _ := mr.AddEquipmentPortType(ctx, models.AddEquipmentPortTypeInput{
		Name:           "example_type_a",
		LinkProperties: linkPropTypeInput,
	})

	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
		PortTypeID:   &portType.ID,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "parent_equipment_type",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	equipmentA, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_a",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	equipmentB, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_b",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)

	linkVal := "Bar"
	linkPropTypeID := portType.QueryLinkPropertyTypes().FirstIDX(ctx)
	linkProp := models.PropertyInput{
		StringValue:    &linkVal,
		PropertyTypeID: linkPropTypeID,
	}
	propInput := []*models.PropertyInput{&linkProp}
	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
		Properties: propInput,
	})
	require.NoError(t, err)
	propID := createdLink.QueryProperties().FirstIDX(ctx)

	editedLinkVal := "Baz"
	editedLinkProp := models.PropertyInput{
		ID:             &propID,
		StringValue:    &editedLinkVal,
		PropertyTypeID: linkPropTypeID,
	}
	editedPropInput := []*models.PropertyInput{&editedLinkProp}
	editedLink, err := mr.EditLink(ctx, models.EditLinkInput{
		ID:         createdLink.ID,
		Properties: editedPropInput,
	})
	require.Nil(t, err)
	require.Equal(t, editedLink.ID, createdLink.ID)

	fetchedNodeA, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentA, ok := fetchedNodeA.(*ent.Equipment)
	require.True(t, ok)
	fetchedNodeB, err := qr.Node(ctx, equipmentB.ID)
	require.NoError(t, err)
	fetchedEquipmentB, ok := fetchedNodeB.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortA := fetchedEquipmentA.QueryPorts().OnlyX(ctx)
	fetchedPortB := fetchedEquipmentB.QueryPorts().OnlyX(ctx)

	require.Equal(t, fetchedPortA.QueryParent().OnlyIDX(ctx), equipmentA.ID)
	require.Equal(t, fetchedPortB.QueryParent().OnlyIDX(ctx), equipmentB.ID)

	linkA := fetchedPortA.QueryLink().OnlyX(ctx)
	linkB := fetchedPortB.QueryLink().OnlyX(ctx)

	require.Equal(t, linkA.ID, createdLink.ID)
	require.Equal(t, linkB.ID, createdLink.ID)

	fetchedPorts, err := createdLink.QueryPorts().All(ctx)
	require.NoError(t, err)
	require.Len(t, fetchedPorts, 2)

	require.Equal(t, linkA.ID, createdLink.ID)
	require.Equal(t, linkB.ID, createdLink.ID)

	propA := linkA.QueryProperties().FirstX(ctx)
	propZ := linkB.QueryProperties().FirstX(ctx)

	require.Equal(t, pointer.GetString(propA.StringVal), editedLinkVal)
	require.Equal(t, pointer.GetString(propZ.StringVal), editedLinkVal)
}

func TestRemoveLink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type",
	})
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "parent_equipment_type",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	equipmentA, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_a",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	equipmentB, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_b",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)
	link, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
	})
	require.Nil(t, err)
	require.NotNil(t, link)

	_, _ = mr.RemoveLink(ctx, link.ID, nil)
	fetchedNodeA, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentA, ok := fetchedNodeA.(*ent.Equipment)
	require.True(t, ok)
	fetchedNodeB, err := qr.Node(ctx, equipmentB.ID)
	require.NoError(t, err)
	fetchedEquipmentB, ok := fetchedNodeB.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortA := fetchedEquipmentA.QueryPorts().OnlyX(ctx)
	fetchedPortB := fetchedEquipmentB.QueryPorts().OnlyX(ctx)

	linkA, _ := fetchedPortA.QueryLink().Only(ctx)
	linkB, _ := fetchedPortB.QueryLink().Only(ctx)
	require.Nil(t, linkA)
	require.Nil(t, linkB)
}

func TestAddLinkWithWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr, wor := r.Mutation(), r.Query(), r.WorkOrder()

	workOrder := createWorkOrder(ctx, t, *r, "work_order_name_102")
	location := workOrder.QueryLocation().FirstX(ctx)

	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "parent_equipment_type",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	equipmentA, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_a",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	equipmentB, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_b",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})

	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)
	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)
	fetchedNodeA, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentA, ok := fetchedNodeA.(*ent.Equipment)
	require.True(t, ok)
	fetchedNodeB, err := qr.Node(ctx, equipmentB.ID)
	require.NoError(t, err)
	fetchedEquipmentB, ok := fetchedNodeB.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortA := fetchedEquipmentA.QueryPorts().OnlyX(ctx)
	fetchedPortB := fetchedEquipmentB.QueryPorts().OnlyX(ctx)

	require.Equal(t, fetchedPortA.QueryParent().OnlyIDX(ctx), equipmentA.ID)
	require.Equal(t, fetchedPortB.QueryParent().OnlyIDX(ctx), equipmentB.ID)

	linkA := fetchedPortA.QueryLink().OnlyX(ctx)
	linkB := fetchedPortB.QueryLink().OnlyX(ctx)

	require.Equal(t, linkA.ID, createdLink.ID)
	require.Equal(t, linkB.ID, createdLink.ID)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	linksToRemove, err := wor.LinksToRemove(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Len(t, linksToRemove, 0)

	linksToAdd, err := wor.LinksToAdd(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Len(t, linksToAdd, 1)
	require.Equal(t, linksToAdd[0].ID, createdLink.ID)
}

func TestRemoveLinkWithWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr, wor := r.Mutation(), r.Query(), r.WorkOrder()

	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)

	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "parent_equipment_type",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	equipmentA, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_a",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	equipmentB, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_b",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})

	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)
	link, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
	})
	require.NoError(t, err)
	require.NotNil(t, link)

	_, _ = mr.RemoveLink(ctx, link.ID, &workOrder.ID)

	fetchedNodeA, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentA, ok := fetchedNodeA.(*ent.Equipment)
	require.True(t, ok)
	fetchedNodeB, err := qr.Node(ctx, equipmentB.ID)
	require.NoError(t, err)
	fetchedEquipmentB, ok := fetchedNodeB.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortA := fetchedEquipmentA.QueryPorts().OnlyX(ctx)
	fetchedPortB := fetchedEquipmentB.QueryPorts().OnlyX(ctx)

	linkA := fetchedPortA.QueryLink().OnlyX(ctx)
	linkB := fetchedPortB.QueryLink().OnlyX(ctx)
	require.NotNil(t, linkA)
	require.NotNil(t, linkB)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	linksToRemove, err := wor.LinksToRemove(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Len(t, linksToRemove, 1)
	require.Equal(t, linksToRemove[0].ID, link.ID)

	linksToAdd, err := wor.LinksToAdd(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Empty(t, linksToAdd)
}
