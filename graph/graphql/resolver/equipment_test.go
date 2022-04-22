// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentportdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentposition"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentpositiondefinition"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/AlekSi/pointer"
	"github.com/stretchr/testify/require"
)

func TestAddEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	label1, label2 := "label1", "label2"
	index1, index2 := 1, 2
	position1 := models.EquipmentPositionInput{
		Name:         "Position 1",
		Index:        &index1,
		VisibleLabel: &label1,
	}
	position2 := models.EquipmentPositionInput{
		Name:         "Position 2",
		Index:        &index2,
		VisibleLabel: &label2,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "equipment_type_name_1",
		Positions: []*models.EquipmentPositionInput{&position1, &position2},
	})
	require.NoError(t, err)

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	fetchedNode, err := qr.Node(ctx, equipment.ID)
	require.NoError(t, err)
	fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
	require.True(t, ok)

	require.Equal(t, equipment.ID, fetchedEquipment.ID)
	require.Equal(t, equipment.Name, fetchedEquipment.Name)
	require.Equal(t, equipment.QueryType().OnlyIDX(ctx), fetchedEquipment.QueryType().OnlyIDX(ctx))
	require.Equal(t, equipment.QueryLocation().OnlyIDX(ctx), fetchedEquipment.QueryLocation().OnlyIDX(ctx))
	require.Len(t, equipment.QueryPositions().AllX(ctx), 2)

	var (
		fetchedPositionNames   []string
		fetchedPositionLabels  []string
		fetchedPositionIndices []int
	)
	for _, position := range fetchedEquipment.QueryPositions().AllX(ctx) {
		require.Equal(t, equipment.ID, position.QueryParent().OnlyIDX(ctx))
		def := position.QueryDefinition().OnlyX(ctx)
		fetchedPositionNames = append(fetchedPositionNames, def.Name)
		fetchedPositionLabels = append(fetchedPositionLabels, def.VisibilityLabel)
		fetchedPositionIndices = append(fetchedPositionIndices, def.Index)
	}
	require.ElementsMatch(t, []string{"Position 1", "Position 2"}, fetchedPositionNames)
	require.ElementsMatch(t, []string{"label1", "label2"}, fetchedPositionLabels)
	require.ElementsMatch(t, []int{1, 2}, fetchedPositionIndices)
}

func prepareLocation(ctx context.Context, t *testing.T, mr generated.MutationResolver) *ent.Location {
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	return location
}

func TestAddEquipmentWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	location := prepareLocation(ctx, t, mr)
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "example_type_name",
		Properties: []*pkgmodels.PropertyTypeInput{
			{Name: "bar_prop", Type: propertytype.TypeString},
		},
	})
	require.NoError(t, err)

	val := "Bar"
	prop := models.PropertyInput{
		StringValue:    &val,
		PropertyTypeID: equipmentType.QueryPropertyTypes().OnlyIDX(ctx),
	}

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:       "equipment_name_1",
		Type:       equipmentType.ID,
		Location:   &location.ID,
		Properties: []*models.PropertyInput{&prop},
	})
	require.NoError(t, err)
	fetchedProperties, err := equipment.QueryProperties().All(ctx)
	require.NoError(t, err)
	require.Len(t, fetchedProperties, 1)
	typ := fetchedProperties[0].QueryType().OnlyX(ctx)
	require.Equal(t, typ.Name, "bar_prop")
	require.Equal(t, typ.Type, propertytype.TypeString)
	require.Equal(t, *fetchedProperties[0].StringVal, val)
}

func TestAddEditEquipmentWithNillableProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, pr, ptr := r.Mutation(), r.Property(), r.PropertyType()
	location := prepareLocation(ctx, t, mr)
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "example_type_name",
		Properties: []*pkgmodels.PropertyTypeInput{
			{Name: "str_prop", Type: propertytype.TypeString},
			{Name: "int_prop", Type: propertytype.TypeInt},
			{Name: "float_prop", Type: propertytype.TypeFloat},
			{Name: "bool_prop", Type: propertytype.TypeBool},
			{Name: "str_prop_with_default", Type: propertytype.TypeString, StringValue: pointer.ToString("Value")},
			{Name: "int_prop_with_default", Type: propertytype.TypeInt, IntValue: pointer.ToInt(45)},
			{Name: "float_prop_with_default", Type: propertytype.TypeFloat, FloatValue: pointer.ToFloat64(45.212)},
			{Name: "bool_prop_with_default", Type: propertytype.TypeBool, BooleanValue: pointer.ToBool(true)},
		},
	})
	require.NoError(t, err)

	intPropID := equipmentType.QueryPropertyTypes().Where(propertytype.Name("int_prop")).OnlyIDX(ctx)
	intPropWithDefaultID := equipmentType.QueryPropertyTypes().Where(propertytype.Name("int_prop_with_default")).OnlyIDX(ctx)
	boolPropID := equipmentType.QueryPropertyTypes().Where(propertytype.Name("bool_prop")).OnlyIDX(ctx)
	strPropID := equipmentType.QueryPropertyTypes().Where(propertytype.Name("str_prop")).OnlyIDX(ctx)

	equipmentType, err = mr.EditEquipmentType(ctx, models.EditEquipmentTypeInput{
		ID:   equipmentType.ID,
		Name: "example_type_name",
		Properties: []*pkgmodels.PropertyTypeInput{
			{ID: pointer.ToInt(intPropID), Name: "int_prop", Type: propertytype.TypeInt, IntValue: pointer.ToInt(12)},
			{ID: pointer.ToInt(intPropWithDefaultID), Name: "int_prop_with_default", Type: propertytype.TypeInt},
		},
	})
	require.NoError(t, err)

	propTypes := equipmentType.QueryPropertyTypes().AllX(ctx)
	require.Len(t, propTypes, 8)
	for _, propType := range propTypes {
		pRawVal, err := ptr.RawValue(ctx, propType)
		require.NoError(t, err)
		rawVal := *pRawVal
		require.NoError(t, err)
		switch propType.Name {
		case "str_prop":
			require.Nil(t, propType.StringVal)
			require.Equal(t, "", rawVal)
		case "int_prop":
			require.Equal(t, 12, pointer.GetInt(propType.IntVal))
			require.Equal(t, "12", rawVal)
		case "float_prop":
			require.Nil(t, propType.FloatVal)
			require.Equal(t, "", rawVal)
		case "bool_prop":
			require.Nil(t, propType.BoolVal)
			require.Equal(t, "", rawVal)
		case "str_prop_with_default":
			require.Equal(t, "Value", pointer.GetString(propType.StringVal))
			require.Equal(t, "Value", rawVal)
		case "int_prop_with_default":
			require.Nil(t, propType.IntVal)
			require.Equal(t, "", rawVal)
		case "float_prop_with_default":
			require.Equal(t, 45.212, pointer.GetFloat64(propType.FloatVal))
			require.Equal(t, "45.212", rawVal)
		case "bool_prop_with_default":
			require.Equal(t, true, pointer.GetBool(propType.BoolVal))
			require.Equal(t, "true", rawVal)
		default:
			t.Fatalf("prop type %q not found", propType.Name)
		}
	}

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_1",
		Type:     equipmentType.ID,
		Location: &location.ID,
		Properties: []*models.PropertyInput{
			{PropertyTypeID: intPropID, IntValue: pointer.ToInt(33)},
			{PropertyTypeID: intPropWithDefaultID},
			{PropertyTypeID: boolPropID},
			{PropertyTypeID: strPropID, StringValue: pointer.ToString("NewValue")},
		},
	})
	require.NoError(t, err)

	intProp := equipment.QueryProperties().Where(property.HasTypeWith(propertytype.ID(intPropID))).OnlyX(ctx)
	intPropWithDefault := equipment.QueryProperties().Where(property.HasTypeWith(propertytype.ID(intPropWithDefaultID))).OnlyX(ctx)

	equipment, err = mr.EditEquipment(ctx, models.EditEquipmentInput{
		ID:   equipment.ID,
		Name: "equipment_name_1",
		Properties: []*models.PropertyInput{
			{ID: pointer.ToInt(intProp.ID), PropertyTypeID: intPropID},
			{ID: pointer.ToInt(intPropWithDefault.ID), PropertyTypeID: intPropWithDefaultID, IntValue: pointer.ToInt(55)},
		},
	})
	require.NoError(t, err)

	fetchedProperties, err := equipment.QueryProperties().All(ctx)
	require.NoError(t, err)
	require.Len(t, fetchedProperties, 4)
	for _, prop := range fetchedProperties {
		pRawVal, err := pr.RawValue(ctx, prop)
		require.NoError(t, err)
		require.NotNil(t, pRawVal)
		rawVal := *pRawVal
		propTypeID := prop.QueryType().OnlyIDX(ctx)
		switch propTypeID {
		case intPropID:
			require.Nil(t, prop.IntVal)
			require.Equal(t, "", rawVal)
		case intPropWithDefaultID:
			require.Equal(t, 55, pointer.GetInt(prop.IntVal))
			require.Equal(t, "55", rawVal)
		case boolPropID:
			require.Nil(t, prop.BoolVal)
			require.Equal(t, "", rawVal)
		case strPropID:
			require.Equal(t, "NewValue", pointer.GetString(prop.StringVal))
			require.Equal(t, "NewValue", rawVal)
		default:
			t.Fatalf("prop type %q not found", propTypeID)
		}
	}
}

func TestAddAndDeleteEquipmentHyperlink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "equipment_type_name_1",
	})
	require.NoError(t, err)
	require.Equal(t, "equipment_type_name_1", equipmentType.Name)

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	require.Equal(t, equipmentType.ID, equipment.QueryType().OnlyIDX(ctx))

	category := "TSS"
	u := "http://some.url"
	displayName := "link to some url"
	hyperlink, err := mr.AddHyperlink(ctx, models.AddHyperlinkInput{
		EntityType:  models.ImageEntityEquipment,
		EntityID:    equipment.ID,
		URL:         u,
		DisplayName: &displayName,
		Category:    &category,
	})
	require.NoError(t, err)
	require.Equal(t, u, hyperlink.URL, "verifying hyperlink url")
	require.Equal(t, displayName, hyperlink.Name, "verifying hyperlink display name")
	require.Equal(t, category, hyperlink.Category, "verifying 1st hyperlink category")

	hyperlinks, err := equipment.QueryHyperlinks().All(ctx)
	require.NoError(t, err)
	require.Len(t, hyperlinks, 1, "verifying has 1 hyperlink")

	deletedHyperlink, err := mr.DeleteHyperlink(ctx, hyperlink.ID)
	require.NoError(t, err)
	require.Equal(t, hyperlink.ID, deletedHyperlink.ID, "verifying return id of deleted hyperlink")

	hyperlinks, err = equipment.QueryHyperlinks().All(ctx)
	require.NoError(t, err)
	require.Empty(t, hyperlinks, "verifying no hyperlinks remained")
}

func TestAddEquipmentWithoutLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "example_type_name",
	})
	require.NoError(t, err)

	_, err = mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name: "equipment_name_1",
		Type: equipmentType.ID,
	})
	require.Error(t, err)
}

func TestRemoveEquipmentWithChildren(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	position1 := models.EquipmentPositionInput{Name: "Position 1"}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "equipment_type_name_1",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	posDefID := equipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               equipmentType.ID,
		Parent:             &equipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)

	grandChildEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "grand_child_equipment",
		Type:               equipmentType.ID,
		Parent:             &childEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)
	_ = grandChildEquipment
	_, err = mr.RemoveEquipment(ctx, equipment.ID, nil)
	require.NoError(t, err)

	for _, e := range []*ent.Equipment{equipment, childEquipment, grandChildEquipment} {
		node, err := qr.Node(ctx, e.ID)
		require.True(t, ent.IsNotFound(err))
		require.Nil(t, node)
	}
	require.Zero(t, childEquipment.QueryPositions().CountX(ctx))
}

func TestRemoveEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	position1 := models.EquipmentPositionInput{Name: "Position 1"}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "equipment_type_name_1",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	pid := equipment.QueryPositions().OnlyIDX(ctx)

	_, err = mr.RemoveEquipment(ctx, equipment.ID, nil)
	require.NoError(t, err)

	for _, id := range []int{equipment.ID, pid} {
		n, err := qr.Node(ctx, id)
		require.Nil(t, n)
		require.True(t, ent.IsNotFound(err))
	}
}

func TestAttachEquipmentToPosition(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	position1 := models.EquipmentPositionInput{
		Name: "Position 1",
	}
	position2 := models.EquipmentPositionInput{
		Name: "Position 2",
	}
	position3 := models.EquipmentPositionInput{
		Name: "Position 3",
	}
	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{&position1, &position2, &position3},
	})
	require.NoError(t, err)

	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     parentEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	childEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "child_equipment_type",
	})
	require.NoError(t, err)

	posDefID := parentEquipmentType.QueryPositionDefinitions().Where(equipmentpositiondefinition.Name("Position 3")).OnlyIDX(ctx)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)

	fetchedParentNode, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	fetchedParentEquipment, ok := fetchedParentNode.(*ent.Equipment)
	require.True(t, ok)
	require.Equal(t, fetchedParentEquipment.QueryPositions().CountX(ctx), 3)

	fetchedPosition := parentEquipment.QueryPositions().Where(equipmentposition.HasDefinitionWith(equipmentpositiondefinition.Name("Position 3"))).OnlyX(ctx)
	require.NotNil(t, fetchedPosition)
	// child should not have positions, since its type (created above) doesn't have any positions associated with it (unlike its parent).
	require.Equal(t, childEquipment.QueryParentPosition().OnlyIDX(ctx), fetchedPosition.ID)
	require.Equal(t, fetchedPosition.QueryAttachment().FirstIDX(ctx), childEquipment.ID)

	_, err = mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.Error(t, err)
}

func TestMoveEquipmentToPosition(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	position1 := models.EquipmentPositionInput{
		Name: "Position 1",
	}

	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "equipment_type",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)

	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "child_equipment",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	posDefID := equipmentType.QueryPositionDefinitions().FirstIDX(ctx)

	fetchedPosition, err := mr.MoveEquipmentToPosition(ctx, &parentEquipment.ID, &posDefID, childEquipment.ID)
	require.NoError(t, err)

	fetchedChildNode, err := qr.Node(ctx, childEquipment.ID)
	require.NoError(t, err)
	fetchedChildEquipment, ok := fetchedChildNode.(*ent.Equipment)
	require.True(t, ok)

	require.NotNil(t, fetchedPosition)
	cid := childEquipment.QueryPositions().FirstIDX(ctx)
	require.Equal(t, fetchedChildEquipment.QueryPositions().FirstIDX(ctx), cid)
	require.Equal(t, fetchedPosition.QueryAttachment().FirstIDX(ctx), fetchedChildEquipment.ID)
	require.Zero(t, fetchedChildEquipment.QueryLocation().CountX(ctx))

	_, err = mr.MoveEquipmentToPosition(ctx, &childEquipment.ID, &posDefID, parentEquipment.ID)
	require.Error(t, err)
	require.Regexp(t, `equipment position \d+ cycle, parent \d+`, err.Error())
}

func TestDetachEquipmentFromPosition(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	position1 := models.EquipmentPositionInput{
		Name: "Position 1",
	}
	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)
	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     parentEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	childEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "child_equipment_type",
	})
	require.NoError(t, err)

	posDefID := parentEquipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)

	fetchedParentNode, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	fetchedParentEquipment, ok := fetchedParentNode.(*ent.Equipment)
	require.True(t, ok)
	fetchedPosition := fetchedParentEquipment.QueryPositions().FirstX(ctx)

	require.Equal(t, childEquipment.QueryParentPosition().FirstIDX(ctx), fetchedPosition.ID)
	require.Equal(t, fetchedPosition.QueryAttachment().FirstIDX(ctx), childEquipment.ID)

	// Detach equipment
	updatedPosition, err := mr.RemoveEquipmentFromPosition(ctx, fetchedPosition.ID, nil)
	require.NoError(t, err)
	require.Zero(t, updatedPosition.QueryAttachment().CountX(ctx))

	// Check the updated parent equipment position
	updatedParentNode, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	updatedParentEquipment, ok := updatedParentNode.(*ent.Equipment)
	require.True(t, ok)
	refetchedPosition := updatedParentEquipment.QueryPositions().FirstX(ctx)
	require.Nil(t, refetchedPosition.QueryAttachment().FirstX(ctx))

	// TODO: verify what's the expected behavior
	//
	// Verify child equipment is not attached to any position
	node, err := qr.Node(ctx, childEquipment.ID)
	require.True(t, ent.IsNotFound(err))
	require.Nil(t, node)

	// Detach nil equipment from position
	_, err = mr.RemoveEquipmentFromPosition(ctx, fetchedPosition.ID, nil)
	require.NoError(t, err)
}

func TestDetachEquipmentFromPositionWithWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr, wor := r.Mutation(), r.Query(), r.WorkOrder()

	workOrder := createWorkOrder(ctx, t, *r, "work_order_name_101")
	location := workOrder.QueryLocation().FirstX(ctx)

	position1 := models.EquipmentPositionInput{
		Name: "Position 1",
	}

	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)
	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     parentEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	childEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "child_equipment_type",
	})
	require.NoError(t, err)
	posDefID := parentEquipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)

	fetchedParentNode, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	fetchedParentEquipment, ok := fetchedParentNode.(*ent.Equipment)
	require.True(t, ok)
	fetchedPosition := fetchedParentEquipment.QueryPositions().OnlyX(ctx)

	require.Equal(t, childEquipment.QueryParentPosition().OnlyIDX(ctx), fetchedPosition.ID)
	require.Equal(t, fetchedPosition.QueryAttachment().OnlyIDX(ctx), childEquipment.ID)

	// Detach equipment
	_, err = mr.RemoveEquipmentFromPosition(ctx, fetchedPosition.ID, &workOrder.ID)
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	removedEquipment, err := wor.EquipmentToRemove(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Len(t, removedEquipment, 1)

	installedEquipment, err := wor.EquipmentToAdd(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Len(t, installedEquipment, 0)

	fetchedEquipment := removedEquipment[0]
	require.Equal(t, childEquipment.ID, fetchedEquipment.ID)
	require.Equal(t, childEquipment.Name, fetchedEquipment.Name)
}

func TestAddDetachEquipmentFromPositionSameWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr, wor := r.Mutation(), r.Query(), r.WorkOrder()

	workOrder := createWorkOrder(ctx, t, *r, "work_order_name_101")
	location := workOrder.QueryLocation().FirstX(ctx)

	position1 := models.EquipmentPositionInput{
		Name: "Position 1",
	}
	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)
	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     parentEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	posDefID := parentEquipmentType.QueryPositionDefinitions().OnlyIDX(ctx)
	childEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "child_equipment_type",
	})
	require.NoError(t, err)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
		WorkOrder:          &workOrder.ID,
	})
	require.NoError(t, err)

	fetchedParentNode, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	fetchedParentEquipment, ok := fetchedParentNode.(*ent.Equipment)
	require.True(t, ok)
	fetchedPosition := fetchedParentEquipment.QueryPositions().FirstX(ctx)

	require.Equal(t, childEquipment.QueryParentPosition().OnlyIDX(ctx), fetchedPosition.ID)
	require.Equal(t, fetchedPosition.QueryAttachment().OnlyIDX(ctx), childEquipment.ID)

	// Detach equipment
	_, err = mr.RemoveEquipmentFromPosition(ctx, fetchedPosition.ID, &workOrder.ID)
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	removedEquipment, err := wor.EquipmentToRemove(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Empty(t, removedEquipment)

	installedEquipment, err := wor.EquipmentToAdd(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Empty(t, installedEquipment)

	// Verify child equipment is not attached to any position
	node, err = qr.Node(ctx, childEquipment.ID)
	require.Nil(t, node)
	require.True(t, ent.IsNotFound(err))
}

func TestEquipmentPortsAreCreatedFromType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	index := 5
	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		Index:        &index,
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
	}

	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "equipment_type",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	fetchedNode, err := qr.Node(ctx, equipment.ID)
	require.NoError(t, err)
	fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
	require.True(t, ok)

	fetchedPort := fetchedEquipment.QueryPorts().OnlyX(ctx)
	def := fetchedPort.QueryDefinition().OnlyX(ctx)
	require.Equal(t, def.Name, portInput.Name)
	require.Equal(t, def.Index, index)
	require.Equal(t, def.VisibilityLabel, visibleLabel)
	require.Equal(t, def.Bandwidth, bandwidth)
}

func TestEquipmentParentLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	position1 := models.EquipmentPositionInput{
		Name: "Position 1",
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)
	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	posDefID := equipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               equipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)

	parentEqLocation, err := parentEquipment.QueryLocation().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, parentEqLocation.ID, location.ID)

	childEqLocation, err := childEquipment.Location(ctx)
	require.NoError(t, err)
	require.Nil(t, childEqLocation)
}

func TestEquipmentParentEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, er := r.Mutation(), r.Equipment()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	position1 := models.EquipmentPositionInput{
		Name: "Position 1",
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{&position1},
	})
	require.NoError(t, err)
	parentEquipment, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	posDefID := equipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	childEquipment, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               equipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	descendantEquipment, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "descendant_equipment",
		Type:               equipmentType.ID,
		Parent:             &childEquipment.ID,
		PositionDefinition: &posDefID,
	})

	parentEqPosition, _ := parentEquipment.QueryParentPosition().Only(ctx)
	require.Nil(t, parentEqPosition)

	childEqPosition := childEquipment.QueryParentPosition().OnlyX(ctx)
	require.Equal(t, parentEquipment.ID, childEqPosition.QueryParent().OnlyIDX(ctx))

	descendantEqPosition := descendantEquipment.QueryParentPosition().OnlyX(ctx)
	require.Equal(t, childEquipment.ID, descendantEqPosition.QueryParent().OnlyIDX(ctx))

	pDescendants, err := er.DescendentsIncludingSelf(ctx, parentEquipment)
	require.NoError(t, err)
	require.Len(t, pDescendants, 3)
	cdescendants, err := er.DescendentsIncludingSelf(ctx, childEquipment)
	require.NoError(t, err)
	require.Len(t, cdescendants, 2)
	ddescendants, err := er.DescendentsIncludingSelf(ctx, descendantEquipment)
	require.NoError(t, err)
	require.Len(t, ddescendants, 1)
}

func TestEditEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	devVal := "defVal"
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "equipment_type_name_1",
		Properties: []*pkgmodels.PropertyTypeInput{
			{Name: "bar_prop", Type: propertytype.TypeString},
			{Name: "foo_prop", Type: propertytype.TypeString, StringValue: &devVal},
		},
	})
	require.NoError(t, err)

	val := "Bar"
	propTypeAID := equipmentType.QueryPropertyTypes().Where(propertytype.Name("bar_prop")).OnlyIDX(ctx)
	propTypeBID := equipmentType.QueryPropertyTypes().Where(propertytype.Name("foo_prop")).OnlyIDX(ctx)
	prop := models.PropertyInput{
		StringValue:    &val,
		PropertyTypeID: propTypeAID,
	}
	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:       "equipment_name_1",
		Type:       equipmentType.ID,
		Location:   &location.ID,
		Properties: []*models.PropertyInput{&prop},
	})
	require.NoError(t, err)

	val = "Foo"
	valB := "newprop val"
	propAid := equipment.QueryProperties().FirstIDX(ctx)
	prop = models.PropertyInput{
		ID:             &propAid,
		StringValue:    &val,
		PropertyTypeID: propTypeAID,
	}
	newProp := models.PropertyInput{
		StringValue:    &valB,
		PropertyTypeID: propTypeBID,
	}

	newEquipment, err := mr.EditEquipment(ctx, models.EditEquipmentInput{
		ID:         equipment.ID,
		Name:       "edited",
		Properties: []*models.PropertyInput{&prop, &newProp},
	})
	require.NoError(t, err)

	fetchedNode, err := qr.Node(ctx, equipment.ID)
	require.NoError(t, err)
	fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
	require.True(t, ok)
	propTypeA := fetchedEquipment.QueryProperties().Where(property.HasTypeWith(propertytype.Name("bar_prop"))).OnlyX(ctx)
	propTypeB := fetchedEquipment.QueryProperties().Where(property.HasTypeWith(propertytype.Name("foo_prop"))).OnlyX(ctx)

	require.Equal(t, fetchedEquipment.Name, newEquipment.Name)
	require.Equal(t, fetchedEquipment.QueryLocation().OnlyIDX(ctx), newEquipment.QueryLocation().OnlyIDX(ctx))
	require.Equal(t, val, pointer.GetString(propTypeA.StringVal))
	require.Equal(t, valB, pointer.GetString(propTypeB.StringVal))

	equipmentB, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:       "equipment_name_1",
		Type:       equipmentType.ID,
		Location:   &location.ID,
		Properties: []*models.PropertyInput{&prop},
	})
	require.NoError(t, err)
	_, err = mr.EditEquipment(ctx, models.EditEquipmentInput{
		ID:   equipmentB.ID,
		Name: "edited",
	})
	require.Error(t, err)
}

func TestEditEquipmentPort(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	strValue := "Foo"
	strPropType := pkgmodels.PropertyTypeInput{
		Name:        "str_prop",
		Type:        propertytype.TypeString,
		StringValue: &strValue,
	}
	propTypeInput := []*pkgmodels.PropertyTypeInput{&strPropType}
	portType, err := mr.AddEquipmentPortType(ctx, models.AddEquipmentPortTypeInput{
		Name:       "example_type_a",
		Properties: propTypeInput,
	})
	require.NoError(t, err)

	portInput := models.EquipmentPortInput{
		Name:       "Port 1",
		PortTypeID: &portType.ID,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "equipment_type_name_1",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)

	portDef := equipmentType.QueryPortDefinitions().FirstX(ctx)
	propTypeID := portDef.QueryEquipmentPortType().QueryPropertyTypes().FirstIDX(ctx)

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	val := "Bar"
	prop := models.PropertyInput{
		StringValue:    &val,
		PropertyTypeID: propTypeID,
	}

	port := equipment.QueryPorts().FirstX(ctx)
	editedEquipmentPort, err := mr.EditEquipmentPort(ctx, models.EditEquipmentPortInput{
		Side: &models.LinkSide{
			Equipment: equipment.ID,
			Port:      port.QueryDefinition().FirstIDX(ctx),
		},
		Properties: []*models.PropertyInput{&prop},
	})
	require.NoError(t, err)
	editedProperty := editedEquipmentPort.QueryProperties().FirstX(ctx)
	require.Equal(t, val, pointer.GetString(editedProperty.StringVal))
}

func TestAddLinkToNewlyAddedPortDefinition(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	strValue := "Foo"
	strPropType := pkgmodels.PropertyTypeInput{
		Name:        "str_prop",
		Type:        propertytype.TypeString,
		StringValue: &strValue,
	}
	propTypeInput := []*pkgmodels.PropertyTypeInput{&strPropType}

	portType, err := mr.AddEquipmentPortType(ctx, models.AddEquipmentPortTypeInput{
		Name:       "example_type_a",
		Properties: propTypeInput,
	})
	require.NoError(t, err)

	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		PortTypeID:   &portType.ID,
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
	}
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "equipment_type_name_1",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	equipmentA, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	portDefID := equipmentType.QueryPortDefinitions().Where(equipmentportdefinition.Name("Port 1")).OnlyIDX(ctx)

	editedPort := models.EquipmentPortInput{
		ID:   &portDefID,
		Name: "Port 1 - edited",
	}
	newPort := models.EquipmentPortInput{
		Name: "Port - new",
	}
	editedPortDefInput := []*models.EquipmentPortInput{&editedPort, &newPort}
	_, err = mr.EditEquipmentType(ctx, models.EditEquipmentTypeInput{
		ID:    equipmentType.ID,
		Name:  "equipment_type_name_1",
		Ports: editedPortDefInput,
	})
	require.NoError(t, err)
	equipmentZ, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name_2",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	oldPA := equipmentA.
		QueryPorts().
		Where(equipmentport.HasDefinitionWith(equipmentportdefinition.Name("Port 1 - edited"))).
		OnlyX(ctx)
	require.NotNil(t, oldPA)
	oldPZ := equipmentZ.
		QueryPorts().
		Where(equipmentport.HasDefinitionWith(equipmentportdefinition.Name("Port 1 - edited"))).
		OnlyX(ctx)
	require.NotNil(t, oldPZ)

	newPZ := equipmentZ.
		QueryPorts().
		Where(equipmentport.HasDefinitionWith(equipmentportdefinition.Name("Port - new"))).
		OnlyX(ctx)
	require.NotNil(t, newPZ)

	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: newPZ.QueryDefinition().OnlyIDX(ctx)},
			{Equipment: equipmentZ.ID, Port: oldPZ.QueryDefinition().OnlyIDX(ctx)},
		},
	})
	require.NoError(t, err)

	fetchedNodeA, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentA, ok := fetchedNodeA.(*ent.Equipment)
	require.True(t, ok)
	fetchedNodeZ, err := qr.Node(ctx, equipmentZ.ID)
	require.NoError(t, err)
	fetchedEquipmentZ, ok := fetchedNodeZ.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortA := fetchedEquipmentA.QueryPorts().Where(equipmentport.HasDefinitionWith(equipmentportdefinition.Name("Port - new"))).OnlyX(ctx)
	fetchedPortZ := fetchedEquipmentZ.QueryPorts().Where(equipmentport.HasDefinitionWith(equipmentportdefinition.Name("Port 1 - edited"))).OnlyX(ctx)

	require.Equal(t, fetchedPortA.QueryParent().OnlyIDX(ctx), equipmentA.ID)
	require.Equal(t, fetchedPortZ.QueryParent().OnlyIDX(ctx), equipmentZ.ID)

	linkA := fetchedPortA.QueryLink().OnlyX(ctx)
	linkZ := fetchedPortZ.QueryLink().OnlyX(ctx)
	require.Equal(t, linkA.ID, createdLink.ID)
	require.Equal(t, linkZ.ID, createdLink.ID)
}

func TestAddEquipmentTypeWithPortConnections(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	portNameConnection1 := "Port1"
	createdEquipment, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "EquipmentType1",
		Ports: []*models.EquipmentPortInput{
			{
				Name: "Port1",
			},
			{
				Name: "Port2",
				ConnectedPorts: []*models.EquipmentPortConnectionInput{
					{
						Name: &portNameConnection1,
					},
				},
			},
		},
	})
	require.NoError(t, err)
	require.NotNil(t, createdEquipment)
	definitions, err := createdEquipment.QueryPortDefinitions().WithConnectedPorts().All(ctx)
	require.NoError(t, err)
	require.NotNil(t, definitions)
	require.Equal(t, 2, len(definitions))
	require.Equal(t, 1, len(definitions[0].Edges.ConnectedPorts))
	require.Equal(t, 1, len(definitions[1].Edges.ConnectedPorts))
	require.Equal(t, "Port2", definitions[0].Edges.ConnectedPorts[0].Name)
	require.Equal(t, "Port1", definitions[1].Edges.ConnectedPorts[0].Name)
}

func TestAddEquipmentTypeWithMultiplePortConnections(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	portName1 := "OUT1"
	portName2 := "OUT2"
	portName3 := "IN1"
	createdEquipment, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "EquipmentType1",
		Ports: []*models.EquipmentPortInput{
			{
				Name: portName1,
				ConnectedPorts: []*models.EquipmentPortConnectionInput{
					{
						Name: &portName3,
					},
				},
			},
			{
				Name: portName2,
				ConnectedPorts: []*models.EquipmentPortConnectionInput{
					{
						Name: &portName3,
					},
				},
			},
			{
				Name: portName3,
				ConnectedPorts: []*models.EquipmentPortConnectionInput{
					{
						Name: &portName1,
					},
					{
						Name: &portName2,
					},
				},
			},
		},
	})
	require.NoError(t, err)
	require.NotNil(t, createdEquipment)
	definitions, err := createdEquipment.QueryPortDefinitions().WithConnectedPorts().All(ctx)
	require.NoError(t, err)
	require.NotNil(t, definitions)
	require.Equal(t, 3, len(definitions))
	require.Equal(t, 1, len(definitions[0].Edges.ConnectedPorts))
	require.Equal(t, 1, len(definitions[1].Edges.ConnectedPorts))
	require.Equal(t, 2, len(definitions[2].Edges.ConnectedPorts))
	require.Equal(t, portName3, definitions[0].Edges.ConnectedPorts[0].Name)
	require.Equal(t, portName3, definitions[1].Edges.ConnectedPorts[0].Name)
	require.Equal(t, portName1, definitions[2].Edges.ConnectedPorts[0].Name)
	require.Equal(t, portName2, definitions[2].Edges.ConnectedPorts[1].Name)
}

func TestEditEquipmentTypeWithPortConnections(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	portNameConnection1 := "Port1"
	createdEquipment, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "EquipmentType1",
		Ports: []*models.EquipmentPortInput{
			{
				Name: "Port1",
			},
			{
				Name: "Port2",
				ConnectedPorts: []*models.EquipmentPortConnectionInput{
					{
						Name: &portNameConnection1,
					},
				},
			},
		},
	})
	require.NoError(t, err)
	require.NotNil(t, createdEquipment)
	definitions, err := createdEquipment.QueryPortDefinitions().WithConnectedPorts().All(ctx)
	require.NoError(t, err)
	require.NotNil(t, definitions)
	require.Equal(t, 2, len(definitions))
	require.Equal(t, 1, len(definitions[0].Edges.ConnectedPorts))
	require.Equal(t, 1, len(definitions[1].Edges.ConnectedPorts))
	require.Equal(t, "Port2", definitions[0].Edges.ConnectedPorts[0].Name)
	require.Equal(t, "Port1", definitions[1].Edges.ConnectedPorts[0].Name)

	editedEquipmentType, err := mr.EditEquipmentType(ctx, models.EditEquipmentTypeInput{
		ID:   createdEquipment.ID,
		Name: createdEquipment.Name,
		Ports: []*models.EquipmentPortInput{
			{
				Name: definitions[0].Name,
				ID:   &definitions[0].ID,
			},
			{
				Name:           definitions[1].Name,
				ID:             &definitions[1].ID,
				ConnectedPorts: []*models.EquipmentPortConnectionInput{}, // clear connections
			},
		},
	})

	require.NoError(t, err)
	require.NotNil(t, createdEquipment)
	definitions, err = editedEquipmentType.QueryPortDefinitions().WithConnectedPorts().All(ctx)
	require.NoError(t, err)
	require.NotNil(t, definitions)
	require.Equal(t, 2, len(definitions))
	require.Equal(t, 0, len(definitions[0].Edges.ConnectedPorts))
	require.Equal(t, 0, len(definitions[1].Edges.ConnectedPorts))
}
