// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"fmt"
	"strconv"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent/equipmentpositiondefinition"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

const strVal = "defVal"

func TestLocationHierarchy(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	locTypeL := client.LocationType.Create().
		SetName("example_type_large").
		SetIndex(0).
		SaveX(ctx)
	locTypeM := client.LocationType.Create().
		SetName("example_type_medium").
		SetIndex(1).
		SaveX(ctx)
	locTypeS := client.LocationType.Create().
		SetName("example_type_small").
		SetIndex(2).
		SaveX(ctx)

	locTypeHierarchy, err := LocationTypeHierarchy(ctx, client)
	require.NoError(t, err)

	require.Equal(t, locTypeHierarchy[0], locTypeL.Name)
	require.Equal(t, locTypeHierarchy[1], locTypeM.Name)
	require.Equal(t, locTypeHierarchy[2], locTypeS.Name)

	gpLocation := client.Location.Create().
		SetName("grand_parent_loc").
		SetType(locTypeL).
		SaveX(ctx)
	pLocation := client.Location.Create().
		SetName("parent_loc").
		SetType(locTypeM).
		SetParent(gpLocation).
		SaveX(ctx)
	clocation := client.Location.Create().
		SetName("child_loc").
		SetType(locTypeS).
		SetParent(pLocation).
		SaveX(ctx)

	equipmentType := client.EquipmentType.Create().
		SetName("equipment_type").
		SaveX(ctx)
	equipment := client.Equipment.Create().
		SetName("child_equipment").
		SetType(equipmentType).
		SetLocation(clocation).
		SaveX(ctx)

	locHierarchy, err := LocationHierarchyForEquipment(ctx, equipment, locTypeHierarchy)
	require.NoError(t, err)

	require.Equal(t, locHierarchy[0], gpLocation.Name)
	require.Equal(t, locHierarchy[1], pLocation.Name)
	require.Equal(t, locHierarchy[2], clocation.Name)
}

func TestParentHierarchy(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	mapType := "map"
	mapZoomLvl := 7
	locType := client.LocationType.Create().
		SetName("example_loc_type").
		SetMapType(mapType).
		SetMapZoomLevel(mapZoomLvl).
		SaveX(ctx)
	location := client.Location.Create().
		SetName("example_loc_inst").
		SetType(locType).
		SaveX(ctx)

	equipmentType := client.EquipmentType.Create().
		SetName("equipment_type").
		SaveX(ctx)
	client.EquipmentPositionDefinition.Create().
		SetName("Position 1").
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.EquipmentPositionDefinition.Create().
		SetName("Position 2").
		SetEquipmentType(equipmentType).
		SaveX(ctx)

	posDef1 := equipmentType.QueryPositionDefinitions().Where(equipmentpositiondefinition.Name("Position 1")).OnlyX(ctx)
	posDef2 := equipmentType.QueryPositionDefinitions().Where(equipmentpositiondefinition.Name("Position 2")).OnlyX(ctx)

	grandParentEquipment := client.Equipment.Create().
		SetName("grand_parent_equipment").
		SetType(equipmentType).
		SetLocation(location).
		SaveX(ctx)
	grandParentPosition := client.EquipmentPosition.Create().
		SetDefinitionID(posDef1.ID).
		SetNillableParentID(&grandParentEquipment.ID).
		SaveX(ctx)

	parentEquipment := client.Equipment.Create().
		SetName("parent_equipment").
		SetType(equipmentType).
		SetParentPosition(grandParentPosition).
		SaveX(ctx)
	parentPosition := client.EquipmentPosition.Create().
		SetDefinitionID(posDef2.ID).
		SetNillableParentID(&parentEquipment.ID).
		SaveX(ctx)

	childEquipment := client.Equipment.Create().
		SetName("child_equipment").
		SetType(equipmentType).
		SetParentPosition(parentPosition).
		SaveX(ctx)

	hierarchy := ParentHierarchyWithAllPositions(ctx, *childEquipment)

	require.Equal(t, hierarchy[0], "")
	require.Equal(t, hierarchy[1], "")
	require.Equal(t, hierarchy[2], grandParentEquipment.Name)
	require.Equal(t, hierarchy[3], posDef1.Name)
	require.Equal(t, hierarchy[4], parentEquipment.Name)
	require.Equal(t, hierarchy[5], posDef2.Name)
}

func TestPropertiesForCSV(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	locType := client.LocationType.Create().
		SetName("example_loc_type").
		SaveX(ctx)
	location := client.Location.Create().
		SetName("example_loc_inst").
		SetType(locType).
		SaveX(ctx)

	equipmentType := client.EquipmentType.Create().
		SetName("equipment_type").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type1").
		SetType(propertytype.TypeInt).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type2").
		SetType(propertytype.TypeString).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type3").
		SetType(propertytype.TypeGpsLocation).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type4").
		SetType(propertytype.TypeRange).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type5").
		SetType(propertytype.TypeBool).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type6").
		SetType(propertytype.TypeNode).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type7").
		SetType(propertytype.TypeNode).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type8").
		SetType(propertytype.TypeNode).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type9").
		SetType(propertytype.TypeNode).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type10").
		SetType(propertytype.TypeRange).
		SetEquipmentType(equipmentType).
		SaveX(ctx)

	propType1 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type1")).OnlyX(ctx)
	propType2 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type2")).OnlyX(ctx)
	propType3 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type3")).OnlyX(ctx)
	propType4 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type4")).OnlyX(ctx)
	propType5 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type5")).OnlyX(ctx)
	propType6 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type6")).OnlyX(ctx)
	propType7 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type7")).OnlyX(ctx)
	propType8 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type8")).OnlyX(ctx)
	propType9 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type9")).OnlyX(ctx)
	propType10 := equipmentType.QueryPropertyTypes().Where(propertytype.Name("Property type10")).OnlyX(ctx)

	equipment := client.Equipment.Create().
		SetName("child_equipment").
		SetType(equipmentType).
		SetLocation(location).
		SaveX(ctx)

	client.Property.Create().
		SetType(propType1).
		SetIntVal(40).
		SetEquipment(equipment).
		SaveX(ctx)
	client.Property.Create().
		SetType(propType2).
		SetStringVal(strVal).
		SetEquipment(equipment).
		SaveX(ctx)

	latVal := 40.32
	longVal := 40.34
	client.Property.Create().
		SetType(propType3).
		SetLatitudeVal(latVal).
		SetLongitudeVal(longVal).
		SetEquipment(equipment).
		SaveX(ctx)
	coords := fmt.Sprintf("%f", latVal) + ", " + fmt.Sprintf("%f", longVal)

	fromVal := 10.0
	toVal := 20.0
	client.Property.Create().
		SetType(propType4).
		SetRangeFromVal(fromVal).
		SetRangeToVal(toVal).
		SetEquipment(equipment).
		SaveX(ctx)
	rangeVal := fmt.Sprintf("%.3f", fromVal) + " - " + fmt.Sprintf("%.3f", toVal)

	client.Property.Create().
		SetType(propType5).
		SetBoolVal(true).
		SetEquipment(equipment).
		SaveX(ctx)

	propEquipmentType := client.EquipmentType.Create().
		SetName("prop_equipment_type").
		SaveX(ctx)
	propEquipment := client.Equipment.Create().
		SetName("prop_equipment").
		SetType(propEquipmentType).
		SetLocation(location).
		SaveX(ctx)
	client.Property.Create().
		SetType(propType6).
		SetEquipment(propEquipment).
		SaveX(ctx)

	propLocationType := client.LocationType.Create().
		SetName("prop_loc_type").
		SaveX(ctx)
	propLocation := client.Location.Create().
		SetName("prop_loc_inst").
		SetType(propLocationType).
		SaveX(ctx)
	client.Property.Create().
		SetType(propType7).
		SetLocation(propLocation).
		SaveX(ctx)

	propServiceType := client.ServiceType.Create().
		SetName("prop_service_type").
		SetHasCustomer(false).
		SaveX(ctx)
	propService := client.Service.Create().
		SetName("prop_service_inst").
		SetType(propServiceType).
		SetStatus(service.StatusPending).
		SaveX(ctx)
	client.Property.Create().
		SetType(propType8).
		SetService(propService).
		SaveX(ctx)

	propWorkOrderType := client.WorkOrderType.Create().
		SetName("prop_work_order_type").
		SaveX(ctx)

	u := viewer.FromContext(ctx).(*viewer.UserViewer).User()
	propWorkOrder := client.WorkOrder.Create().
		SetName("Work Order").
		SetCreationDate(time.Now()).
		SetOwner(u).
		SetType(propWorkOrderType).
		SaveX(ctx)
	client.Property.Create().
		SetType(propType9).
		SetWorkOrder(propWorkOrder).
		SaveX(ctx)

	user := client.User.Create().
		SetAuthID("user").
		SetFirstName("FB").
		SetLastName("User").
		SaveX(ctx)
	client.Property.Create().
		SetType(propType10).
		SetLocation(propLocation).
		SetUserValue(user).
		SaveX(ctx)

	propertyTypes, err := PropertyTypesSlice(ctx, []int{equipment.ID}, client, enum.PropertyEntityEquipment)
	require.NoError(t, err)

	props, err := PropertiesSlice(ctx, equipment, propertyTypes, enum.PropertyEntityEquipment)
	require.NoError(t, err)
	require.Contains(t, props, strVal)
	require.Contains(t, props, strconv.Itoa(40))
	require.Contains(t, props, coords)
	require.Contains(t, props, rangeVal)
	require.Contains(t, props, strconv.FormatBool(true))
}

func TestPropertyTypesForCSV(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	locType := client.LocationType.Create().
		SetName("example_loc_type").
		SaveX(ctx)
	location := client.Location.Create().
		SetName("example_loc_inst").
		SetType(locType).
		SaveX(ctx)

	equipmentType := client.EquipmentType.Create().
		SetName("equipment_type").
		SaveX(ctx)

	strVal := strVal
	intVal := 40
	client.PropertyType.Create().
		SetName("Property type1").
		SetType(propertytype.TypeInt).
		SetIntVal(intVal).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Property type2").
		SetType(propertytype.TypeString).
		SetStringVal(strVal).
		SetEquipmentType(equipmentType).
		SaveX(ctx)

	latVal := 40.32
	longVal := 40.34
	client.PropertyType.Create().
		SetName("Property type3").
		SetType(propertytype.TypeGpsLocation).
		SetLatitudeVal(latVal).
		SetLongitudeVal(longVal).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	coords := fmt.Sprintf("%f", latVal) + ", " + fmt.Sprintf("%f", longVal)

	fromVal := 10.0
	toVal := 20.0
	client.PropertyType.Create().
		SetName("Property type4").
		SetType(propertytype.TypeRange).
		SetRangeFromVal(fromVal).
		SetRangeToVal(toVal).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	rangeVal := fmt.Sprintf("%.3f", fromVal) + " - " + fmt.Sprintf("%.3f", toVal)

	boolVal := true
	client.PropertyType.Create().
		SetName("Property type5").
		SetType(propertytype.TypeBool).
		SetBoolVal(true).
		SetEquipmentType(equipmentType).
		SaveX(ctx)

	equipment := client.Equipment.Create().
		SetName("child_equipment").
		SetType(equipmentType).
		SetLocation(location).
		SaveX(ctx)

	propertyTypes, err := PropertyTypesSlice(ctx, []int{equipment.ID}, client, enum.PropertyEntityEquipment)
	require.NoError(t, err)

	props, err := PropertiesSlice(ctx, equipment, propertyTypes, enum.PropertyEntityEquipment)
	require.NoError(t, err)
	require.Contains(t, props, strVal)
	require.Contains(t, props, strconv.Itoa(intVal))
	require.Contains(t, props, coords)
	require.Contains(t, props, rangeVal)
	require.Contains(t, props, strconv.FormatBool(boolVal))
}

func TestSamePropertyTypesForCSV(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	locType := client.LocationType.Create().
		SetName("example_loc_type").
		SaveX(ctx)
	location := client.Location.Create().
		SetName("example_loc_inst").
		SetType(locType).
		SaveX(ctx)

	equipmentTypeA := client.EquipmentType.Create().
		SetName("equipment_typeA").
		SaveX(ctx)
	equipmentTypeB := client.EquipmentType.Create().
		SetName("equipment_typeB").
		SaveX(ctx)

	client.PropertyType.Create().
		SetName("Ptype1").
		SetType(propertytype.TypeInt).
		SetIntVal(40).
		SetEquipmentType(equipmentTypeA).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Ptype1").
		SetType(propertytype.TypeInt).
		SetIntVal(40).
		SetEquipmentType(equipmentTypeB).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName("Ptype2").
		SetType(propertytype.TypeInt).
		SetIntVal(40).
		SetEquipmentType(equipmentTypeB).
		SaveX(ctx)

	equipmentTypeB.QueryPropertyTypes().Where(propertytype.Name("Ptype2")).OnlyX(ctx)
	equipment := client.Equipment.Create().
		SetName("child_equipment").
		SetType(equipmentTypeA).
		SetLocation(location).
		SaveX(ctx)
	propertyTypes, err := PropertyTypesSlice(ctx, []int{equipment.ID}, client, enum.PropertyEntityEquipment)
	require.Len(t, propertyTypes, 1)

	pa := equipmentTypeA.QueryPropertyTypes().OnlyX(ctx)
	require.Contains(t, propertyTypes, pa.Name)
	require.NoError(t, err)
}
