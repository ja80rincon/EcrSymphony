// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"strconv"
	"testing"
	"time"

	"github.com/99designs/gqlgen/client"
	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/surveycellscan"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

func TestAddLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	c := r.GraphClient()

	var typ struct{ AddLocationType struct{ ID, Name string } }
	err := c.Post(`mutation {
		addLocationType(input: { name: "Planet" }) {
			id
			name
		}
	}`, &typ)
	require.NoError(t, err)
	require.Equal(t, "Planet", typ.AddLocationType.Name)

	type Location struct {
		ID           string
		Name         string
		LocationType struct {
			ID string
		}
		Latitude  float64
		Longitude float64
	}
	var rsp struct{ AddLocation Location }
	err = c.Post(`mutation($type: ID!) {
		addLocation(input: { name: "Earth", type: $type }) {
			id
			name
			locationType {
				id
			}
			longitude
			latitude	
		}
	}`, &rsp, client.Var("type", typ.AddLocationType.ID))
	require.NoError(t, err)
	require.Equal(t, typ.AddLocationType.ID, rsp.AddLocation.LocationType.ID)

	var n struct{ Node struct{ Name string } }
	err = c.Post(`query($id: ID!) {
		node(id: $id) {
			... on Location {
				name
			}
		}
	}`, &n, client.Var("id", rsp.AddLocation.ID))
	require.NoError(t, err)
	require.Equal(t, rsp.AddLocation.Name, n.Node.Name)
	require.Zero(t, rsp.AddLocation.Latitude)
	require.Zero(t, rsp.AddLocation.Longitude)

	var conn struct {
		Locations struct {
			Edges []struct {
				Node Location
			}
		}
	}
	err = c.Post(`query {
		locations {
			edges {
				node {
					id
					name
					locationType {
						id
					}
					longitude
					latitude	
				}
			}
		}
	}`, &conn)
	require.NoError(t, err)
	require.Len(t, conn.Locations.Edges, 1)
	require.Equal(t, rsp.AddLocation, conn.Locations.Edges[0].Node)
}

func TestAddLocationWithExternalID(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "location_type_name_1"})
	require.NoError(t, err)

	externalID := "externalID"
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "location_name_1",
		Type:       locationType.ID,
		ExternalID: &externalID,
	})
	require.NoError(t, err)

	locations, _ := qr.Locations(ctx, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil)
	require.Len(t, locations.Edges, 1, "Verifying 'Locations' return value")

	require.Equal(t, location.ID, locations.Edges[0].Node.ID, "Verifying saved location vs fetched location: ID")
	require.Equal(t, externalID, locations.Edges[0].Node.ExternalID, "Verifying ExternalID")
}

func TestAddLocationWithSameName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	locationTypeParent, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "type_parent"})
	require.NoError(t, err, "Adding parent location type")

	locationTypeChild, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "type_child"})
	require.NoError(t, err, "Adding child location type")

	parentLocation, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "parent_name_1",
		Type: locationTypeParent.ID,
	})
	require.NoError(t, err, "Adding parent location instance")
	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "child_name_1",
		Type:   locationTypeChild.ID,
		Parent: &parentLocation.ID,
	})
	require.NoError(t, err, "Adding first child location instance")
	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "child_name_2",
		Type:   locationTypeChild.ID,
		Parent: &parentLocation.ID,
	})
	require.NoError(t, err, "Adding second child location instance")
	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "child_name_1",
		Type:   locationTypeChild.ID,
		Parent: &parentLocation.ID,
	})
	require.Error(t, err, "Trying to add  child location instance with same name")
	parentNode, err := qr.Node(ctx, parentLocation.ID)
	require.NoError(t, err)
	parentLocation, ok := parentNode.(*ent.Location)
	require.True(t, ok)
	children := parentLocation.QueryChildren().AllX(ctx)

	onlyTopLevel := true
	require.Len(t, children, 2, "Parent location has two children")
	locs, err := qr.Locations(ctx, &onlyTopLevel, nil, nil, nil, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, locs.Edges, 1, "Only one location with no parents (aka top level)")
}

func TestAddLocationWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	strValue := "Foo"
	strPropType := pkgmodels.PropertyTypeInput{
		Name: "str_prop",
		Type: "string",
	}
	intPropType := pkgmodels.PropertyTypeInput{
		Name: "int_prop",
		Type: "int",
	}
	rangePropType := pkgmodels.PropertyTypeInput{
		Name: "rng_prop",
		Type: "range",
	}
	propTypeInputs := []*pkgmodels.PropertyTypeInput{&strPropType, &intPropType, &rangePropType}
	locType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name:       "location_type_name_1",
		Properties: propTypeInputs,
	})
	require.NoError(t, err, "Adding location type")

	strProp := models.PropertyInput{
		PropertyTypeID: locType.QueryPropertyTypes().Where(propertytype.Name("str_prop")).OnlyIDX(ctx),
		StringValue:    &strValue,
	}
	intValue := 5
	intProp := models.PropertyInput{
		PropertyTypeID: locType.QueryPropertyTypes().Where(propertytype.Name("int_prop")).OnlyIDX(ctx),
		StringValue:    nil,
		IntValue:       &intValue,
	}
	fl1, fl2 := 5.5, 7.8
	rngProp := models.PropertyInput{
		PropertyTypeID: locType.QueryPropertyTypes().Where(propertytype.Name("rng_prop")).OnlyIDX(ctx),
		RangeFromValue: &fl1,
		RangeToValue:   &fl2,
	}
	propInputs := []*models.PropertyInput{&strProp, &intProp, &rngProp}
	loc, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "location_name_1",
		Type:       locType.ID,
		Properties: propInputs,
	})
	require.NoError(t, err, "Adding location instance")

	fetchedNode, err := qr.Node(ctx, loc.ID)
	require.NoError(t, err, "Querying location instance")
	fetchedLoc, ok := fetchedNode.(*ent.Location)
	require.True(t, ok)

	intFetchProp := fetchedLoc.QueryProperties().Where(property.HasTypeWith(propertytype.Name("int_prop"))).OnlyX(ctx)
	require.Equal(t, pointer.GetInt(intFetchProp.IntVal), pointer.GetInt(intProp.IntValue), "Comparing properties: int value")
	require.Equal(t, intFetchProp.QueryType().OnlyIDX(ctx), intProp.PropertyTypeID, "Comparing properties: PropertyType value")

	strFetchProp := fetchedLoc.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_prop"))).OnlyX(ctx)
	require.Equal(t, pointer.GetString(strFetchProp.StringVal), pointer.GetString(strProp.StringValue), "Comparing properties: string value")
	require.Equal(t, strFetchProp.QueryType().OnlyIDX(ctx), strProp.PropertyTypeID, "Comparing properties: PropertyType value")

	rngFetchProp := fetchedLoc.QueryProperties().Where(property.HasTypeWith(propertytype.Name("rng_prop"))).OnlyX(ctx)
	require.Equal(t, pointer.GetFloat64(rngFetchProp.RangeFromVal), pointer.GetFloat64(rngProp.RangeFromValue), "Comparing properties: range value")
	require.Equal(t, pointer.GetFloat64(rngFetchProp.RangeToVal), pointer.GetFloat64(rngProp.RangeToValue), "Comparing properties: range value")
	require.Equal(t, rngFetchProp.QueryType().OnlyIDX(ctx), rngProp.PropertyTypeID, "Comparing properties: PropertyType value")
}

func TestDontAddDuplicateProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, _ := r.Mutation(), r.Query()
	strValue := "Foo"

	locType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
		Properties: []*pkgmodels.PropertyTypeInput{
			{
				Name: "str_prop",
				Type: propertytype.TypeString,
			},
		}})
	require.NoError(t, err, "Adding location type")
	eqType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "equip_type",
		Properties: []*pkgmodels.PropertyTypeInput{
			{
				Name: "str_prop",
				Type: propertytype.TypeString,
			},
		},
	})
	require.NoError(t, err, "Adding location type")

	strProp := models.PropertyInput{
		PropertyTypeID: locType.QueryPropertyTypes().Where(propertytype.Name("str_prop")).OnlyIDX(ctx),
		StringValue:    &strValue,
	}

	propInputs := []*models.PropertyInput{&strProp}
	loc, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "location_name_1",
		Type:       locType.ID,
		Properties: propInputs,
	})
	require.NoError(t, err, "Adding location instance")

	strFetchProp := loc.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_prop"))).OnlyX(ctx)
	require.Equal(t, pointer.GetString(strFetchProp.StringVal), pointer.GetString(strProp.StringValue), "Comparing properties: string value")
	require.Equal(t, strFetchProp.QueryType().OnlyIDX(ctx), strProp.PropertyTypeID, "Comparing properties: PropertyType value")

	require.NoError(t, err, "Adding location instance")

	strProp.StringValue = pointer.ToString("new value")
	loc, err = mr.EditLocation(ctx, models.EditLocationInput{
		ID:         loc.ID,
		Name:       "location_name_1",
		Properties: []*models.PropertyInput{&strProp},
	})
	require.NoError(t, err)
	strFetchProp = loc.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_prop"))).OnlyX(ctx)
	require.Equal(t, pointer.GetString(strFetchProp.StringVal), pointer.GetString(strProp.StringValue), "Comparing properties: string value")
	require.Equal(t, strFetchProp.QueryType().OnlyIDX(ctx), strProp.PropertyTypeID, "Comparing properties: PropertyType value")

	// same for equipment
	strProp = models.PropertyInput{
		PropertyTypeID: eqType.QueryPropertyTypes().Where(propertytype.Name("str_prop")).OnlyIDX(ctx),
		StringValue:    &strValue,
	}

	eq, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:       "equip_name",
		Location:   &loc.ID,
		Type:       eqType.ID,
		Properties: []*models.PropertyInput{&strProp},
	})
	require.NoError(t, err, "Adding location instance")
	strFetchProp = eq.QueryProperties().OnlyX(ctx)
	require.Equal(t, pointer.GetString(strFetchProp.StringVal), pointer.GetString(strProp.StringValue), "Comparing properties: string value")

	strProp.StringValue = pointer.ToString("new value")
	_, err = mr.EditLocation(ctx, models.EditLocationInput{
		ID:         eq.ID,
		Name:       "equip_name",
		Properties: []*models.PropertyInput{&strProp},
	})
	require.Error(t, err)
}

func TestAddLocationWithInvalidProperties(t *testing.T) {
	t.Skip("skipping test until mandatory props are added - T57858029")
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	latlongPropType := pkgmodels.PropertyTypeInput{
		Name: "lat_long_prop",
		Type: "gps_location",
	}
	propTypeInputs := []*pkgmodels.PropertyTypeInput{&latlongPropType}
	locType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name:       "location_type_name_1",
		Properties: propTypeInputs,
	})
	require.NoError(t, err)

	latlongProp := models.PropertyInput{
		PropertyTypeID: locType.QueryPropertyTypes().Where(propertytype.Name("lat_long_prop")).OnlyIDX(ctx),
	}
	propInputs := []*models.PropertyInput{&latlongProp}
	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "location_name_3",
		Type:       locType.ID,
		Properties: propInputs,
	})
	require.Error(t, err, "Adding location instance with invalid lat-long prop")
}

func TestAddMultiLevelLocations(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr, lr, ltr := r.Mutation(), r.Query(), r.Location(), r.LocationType()
	locationTypeA, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "ta"})
	locationTypeB, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "tb"})
	locationTypeC, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "tc"})
	locationTypeD, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "td"})
	locationTypeE, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "te"})

	locationA, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "a",
		Type: locationTypeA.ID,
	})
	require.NoError(t, err, "Adding 1st level location")
	cords, err := lr.ParentCoords(ctx, locationA)
	require.NoError(t, err)
	require.Nil(t, cords)

	locationB, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:      "b1",
		Type:      locationTypeB.ID,
		Parent:    &locationA.ID,
		Latitude:  pointer.ToFloat64(37.5),
		Longitude: pointer.ToFloat64(35.7),
	})
	require.NoError(t, err, "Adding 1st child of a location (2nd level)")

	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "b2",
		Type:   locationTypeB.ID,
		Parent: &locationA.ID,
	})
	require.NoError(t, err, "Adding 2nd child of a location (2nd level)")
	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "b3",
		Type:   locationTypeB.ID,
		Parent: &locationA.ID,
	})
	require.NoError(t, err, "Adding 3rd child of a location (2nd level)")
	locationC, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "c",
		Type:   locationTypeC.ID,
		Parent: &locationB.ID,
	})
	require.NoError(t, err, "Adding 1st child of b location (3rd level)")
	locationD, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "d",
		Type:   locationTypeD.ID,
		Parent: &locationC.ID,
	})
	require.NoError(t, err, "Adding 1st child of c location (4th level)")
	cords, err = lr.ParentCoords(ctx, locationD)
	require.NoError(t, err)
	require.Equal(t, 37.5, cords.Latitude)
	require.Equal(t, 35.7, cords.Longitude)

	locationE, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:      "e",
		Type:      locationTypeE.ID,
		Parent:    &locationD.ID,
		Latitude:  pointer.ToFloat64(47.5),
		Longitude: pointer.ToFloat64(45.7),
	})
	require.NoError(t, err, "Adding 1st child of d location (5th level)")
	cords, err = lr.ParentCoords(ctx, locationE)
	require.NoError(t, err)
	require.Equal(t, 47.5, cords.Latitude)
	require.Equal(t, 45.7, cords.Longitude)
	// Adding in wrong order
	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "b1",
		Type:   locationTypeA.ID,
		Parent: &locationB.ID,
	})
	require.Error(t, err, "Adding in wrong order")

	ca, _ := ltr.NumberOfLocations(ctx, locationTypeA)
	require.Equal(t, 1, ca, "Amount of instances from 'typeA' location type")

	cb, _ := ltr.NumberOfLocations(ctx, locationTypeB)
	require.Equal(t, 3, cb, "Amount of instances from 'typeB' location type")
	cc, _ := ltr.NumberOfLocations(ctx, locationTypeC)
	require.Equal(t, 1, cc, "Amount of instances from 'typeC' location type")
	cd, _ := ltr.NumberOfLocations(ctx, locationTypeD)
	require.Equal(t, 1, cd, "Amount of instances from 'typeD' location type")
	ce, _ := ltr.NumberOfLocations(ctx, locationTypeE)
	require.Equal(t, 1, ce, "Amount of instances from 'typeE' location type")

	i := 10
	onlyTopLevel := true
	locs, err := qr.Locations(ctx, &onlyTopLevel, nil, nil, nil, nil, &i, nil, nil, nil, nil)
	require.NoError(t, err, "Querying locations")

	require.Len(t, locs.Edges, 1, "Only one location with no parents (aka top level)")
	for _, loc := range locs.Edges {
		expeChildren := 1
		if loc.Node.Name == "a" {
			expeChildren = 3
		} else if loc.Node.Name == "b2" || loc.Node.Name == "b3" || loc.Node.Name == "e" {
			expeChildren = 0
		}
		childCound := loc.Node.QueryChildren().AllX(ctx)
		require.Len(t, childCound, expeChildren, "Counting children for every instance")
	}
}

func TestAddLocationCellScans(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr, qr := r.Mutation(), r.Query()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	require.Equal(t, "location_type_name_1", locationType.Name)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	require.Equal(t, "location_name_1", location.Name)

	bsID := "BSID-1"
	timestamp := 1564523995
	cellDataGsm := models.SurveyCellScanData{
		NetworkType:    surveycellscan.NetworkTypeGSM,
		SignalStrength: -60,
		BaseStationID:  &bsID,
		Timestamp:      &timestamp,
	}
	cellDataLte := models.SurveyCellScanData{
		NetworkType:    surveycellscan.NetworkTypeLTE,
		SignalStrength: -70,
		BaseStationID:  &bsID,
		Timestamp:      &timestamp,
	}

	cellScans := []*models.SurveyCellScanData{&cellDataGsm, &cellDataLte}
	cells, err := mr.AddCellScans(ctx, cellScans, location.ID)
	require.NoError(t, err, "Adding cell scans")

	fetchedNode, err := qr.Node(ctx, location.ID)
	require.NoError(t, err, "Fetching location")
	fetchedLocation, ok := fetchedNode.(*ent.Location)
	require.True(t, ok)

	fetchedCells, _ := fetchedLocation.QueryCellScan().All(ctx)
	require.Equal(t, len(fetchedCells), len(cellScans))

	var cellIDs []int
	for _, cell := range cells {
		cellIDs = append(cellIDs, cell.ID)
	}
	var fetchedCellIDs []int
	for _, fetchedCell := range fetchedCells {
		fetchedCellIDs = append(fetchedCellIDs, fetchedCell.ID)
	}
	require.ElementsMatch(t, cellIDs, fetchedCellIDs, "cell scan with same IDs should exist on location")
}

func TestEditLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	require.Equal(t, "location_type_name_1", locationType.Name)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	newLocation, err := mr.EditLocation(ctx, models.EditLocationInput{
		ID:        location.ID,
		Name:      "new_location_name",
		Latitude:  30,
		Longitude: 30,
	})
	require.NoError(t, err)

	fetchedNode, err := qr.Node(ctx, location.ID)
	require.NoError(t, err)
	fetchedLocation, ok := fetchedNode.(*ent.Location)
	require.True(t, ok)
	require.Equal(t, newLocation.Name, fetchedLocation.Name)
	require.Equal(t, newLocation.Latitude, fetchedLocation.Latitude)
	require.Equal(t, newLocation.Longitude, fetchedLocation.Longitude)
}

func TestEditLocationWithExternalID(t *testing.T) {
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
	fetchedNode, err := qr.Node(ctx, location.ID)
	require.NoError(t, err)
	fetchedLocation, ok := fetchedNode.(*ent.Location)
	require.True(t, ok)
	require.Equal(t, "", fetchedLocation.ExternalID)

	externalID1 := "externalID1"
	_, err = mr.EditLocation(ctx, models.EditLocationInput{
		ID:         location.ID,
		Name:       location.Name,
		Latitude:   location.Latitude,
		Longitude:  location.Longitude,
		ExternalID: &externalID1,
	})
	require.NoError(t, err)
	fetchedNode, err = qr.Node(ctx, location.ID)
	require.NoError(t, err)
	fetchedLocation, ok = fetchedNode.(*ent.Location)
	require.True(t, ok)
	require.Equal(t, externalID1, fetchedLocation.ExternalID)

	externalID2 := "externalID2"
	_, err = mr.EditLocation(ctx, models.EditLocationInput{
		ID:         location.ID,
		Name:       location.Name,
		Latitude:   location.Latitude,
		Longitude:  location.Longitude,
		ExternalID: &externalID2,
	})
	require.NoError(t, err)
	fetchedNode, err = qr.Node(ctx, location.ID)
	require.NoError(t, err)
	fetchedLocation, ok = fetchedNode.(*ent.Location)
	require.True(t, ok)
	require.Equal(t, externalID2, fetchedLocation.ExternalID)
}

func TestEditLocationWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()

	pTypes := pkgmodels.PropertyTypeInput{
		Name: "str_prop",
		Type: "string",
	}

	p2Types := pkgmodels.PropertyTypeInput{
		Name: "str_prop2",
		Type: "string",
	}

	locType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name:       "type_name_1",
		Properties: []*pkgmodels.PropertyTypeInput{&pTypes, &p2Types},
	})
	require.NoError(t, err)
	pTypeID := locType.QueryPropertyTypes().AllX(ctx)

	strValue := "Foo"
	strProp := models.PropertyInput{
		PropertyTypeID: pTypeID[0].ID,
		StringValue:    &strValue,
	}
	strValue2 := "Bar"
	strProp2 := models.PropertyInput{
		PropertyTypeID: pTypeID[1].ID,
		StringValue:    &strValue2,
	}

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "inst_name_1",
		Type:       locType.ID,
		Properties: []*models.PropertyInput{&strProp, &strProp2},
	})
	require.NoError(t, err)
	fetchedNode, err := qr.Node(ctx, location.ID)
	require.NoError(t, err)
	fetchedLoc, ok := fetchedNode.(*ent.Location)
	require.True(t, ok)
	fetchedProps, _ := fetchedLoc.QueryProperties().All(ctx)

	// Property[] -> PropertyInput[]
	var propInputClone []*models.PropertyInput
	for _, v := range fetchedProps {
		require.NotNil(t, v.StringVal)
		strValue := *v.StringVal + "-2"
		propInput := &models.PropertyInput{
			ID:             &v.ID,
			PropertyTypeID: v.QueryType().OnlyIDX(ctx),
			StringValue:    &strValue,
		}
		propInputClone = append(propInputClone, propInput)
	}

	_, err = mr.EditLocation(ctx, models.EditLocationInput{
		ID:         location.ID,
		Name:       "location_name_1",
		Properties: propInputClone,
	})
	require.NoError(t, err, "Editing location")

	newFetchedNode, err := qr.Node(ctx, location.ID)
	require.NoError(t, err)
	newFetchedLoc, ok := newFetchedNode.(*ent.Location)
	require.True(t, ok)
	existA := newFetchedLoc.QueryProperties().Where(property.StringVal("Foo-2")).ExistX(ctx)
	require.NoError(t, err)
	require.True(t, existA, "Property with the new name should exist on location")
	existB := newFetchedLoc.QueryProperties().Where(property.StringVal("Bar-2")).ExistX(ctx)
	require.NoError(t, err)
	require.True(t, existB, "Property with the new name should exist on location")
	existC := newFetchedLoc.QueryProperties().Where(property.StringVal("Bar")).ExistX(ctx)
	require.NoError(t, err)
	require.False(t, existC, "Property with the old name should not exist on location")
}

// TODO test fails on sandcastle
// func TestGetLocationsDifferentContext(t *testing.T) {
//	ra, err := newTestResolver(t)
//	require.NoError(t, err)
//	defer ra.drv.Close()
//	ctx1 := viewertest.NewContext(context.Background(), viewertest.WithTenant(ra.tenant))
//	mra, qra := ra.Mutation(), ra.Query()
//
//	rb, err := newTestResolver(t)
//	require.NoError(t, err)
//	defer rb.drv.Close()
//	ctx2 := viewertest.NewContext(context.Background(), viewertest.WithTenant(rb.tenant))
//	mrb, qrb := rb.Mutation(), rb.Query()
//
//	locationType1, err := mra.AddLocationType(ctx1, "location_type_1", nil, nil, nil, nil)
//	require.NoError(t, err)
//	location1, err := mra.AddLocation(ctx1, "location_1", 32.33, 34.66, locationType1.ID, nil, nil)
//	require.NoError(t, err)
//
//	locationType2, err := mrb.AddLocationType(ctx2, "location_type_1", nil, nil, nil, nil)
//	require.NoError(t, err)
//	location2, err := mrb.AddLocation(ctx2, "location_1", 32.33, 34.66, locationType2.ID, nil, nil)
//	require.NoError(t, err)
//
//	locs1, _ := qra.Locations(ctx1, nil, nil, nil, nil, nil, nil, nil, nil)
//	require.Len(t, locs1.Edges, 1, "tenant 1 has one location")
//	require.Equal(t, locs1.Edges[0].Node.ID, location1.ID, "verifying location ID in tenant 1")
//	locs2, _ := qrb.Locations(ctx2, nil, nil, nil, nil, nil, nil, nil, nil)
//	require.Len(t, locs2.Edges, 1, "tenant 2 has one location")
//	require.Equal(t, locs2.Edges[0].Node.ID, location2.ID, "verifying location ID in tenant 2")
//
//	locsTypes1, _ := qra.LocationTypes(ctx1, nil, nil, nil, nil)
//	require.Len(t, locsTypes1.Edges, 1, "tenant 1 has one location")
//	require.Equal(t, locsTypes1.Edges[0].Node.ID, locationType1.ID, "verifying location type ID in tenant 2")
//
//	locsTypes2, _ := qrb.LocationTypes(ctx2, nil, nil, nil, nil)
//	require.Len(t, locsTypes2.Edges, 1, "tenant 2 has one locationtype ")
//	require.Equal(t, locsTypes2.Edges[0].Node.ID, locationType2.ID, "verifying location type ID in tenant 2")
// }

func TestAddAndDeleteLocationImages(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, lr := r.Mutation(), r.Location()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	require.Equal(t, "location_type_name_1", locationType.Name)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	require.Equal(t, locationType.ID, location.QueryType().OnlyIDX(ctx))

	now := time.Now()
	category := "TSS"
	file1, err := mr.AddImage(ctx, models.AddImageInput{
		EntityType:  models.ImageEntityLocation,
		EntityID:    location.ID,
		ImgKey:      uuid.New().String(),
		FileName:    "file_name.png",
		FileSize:    123,
		Modified:    now,
		ContentType: "image/png",
		Category:    &category,
	})
	require.NoError(t, err)
	require.Equal(t, "file_name.png", file1.Name, "verifying 1st image file name")
	require.Equal(t, category, file1.Category, "verifying 1st image file category")

	file2, err := mr.AddImage(ctx, models.AddImageInput{
		EntityType:  models.ImageEntityLocation,
		EntityID:    location.ID,
		ImgKey:      uuid.New().String(),
		FileName:    "file_name.png",
		FileSize:    123,
		Modified:    now,
		ContentType: "image/png",
		Category:    &category,
	})
	require.NoError(t, err)
	require.Equal(t, "file_name.png", file2.Name, "verifying 2nd image file name")
	require.Equal(t, category, file2.Category, "verifying 2nd image file category")

	file3, err := mr.AddImage(ctx, models.AddImageInput{
		EntityType:  models.ImageEntityLocation,
		EntityID:    location.ID,
		ImgKey:      uuid.New().String(),
		FileName:    "file_name_1.png",
		FileSize:    123,
		Modified:    now,
		ContentType: "image/png",
		Category:    &category,
	})
	require.NoError(t, err)
	require.Equal(t, "file_name_1.png", file3.Name, "verifying 3rd image file name")
	require.Equal(t, category, file3.Category, "verifying 3rd image file category")

	deletedFile, err := mr.DeleteImage(ctx, "LOCATION", location.ID, file1.ID)
	require.NoError(t, err)
	require.Equal(t, file1.ID, deletedFile.ID, "verifying return type of deleted file")

	files, err := lr.Images(ctx, location)
	require.NoError(t, err)
	require.Len(t, files, 2, "verifying 2 files remained")
}

func TestAddAndDeleteLocationHyperlink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)
	require.Equal(t, "location_type_name_1", locationType.Name)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	require.Equal(t, locationType.ID, location.QueryType().OnlyIDX(ctx))

	category := "TSS"
	url := "http://some.url"
	displayName := "link to some url"
	hyperlink, err := mr.AddHyperlink(ctx, models.AddHyperlinkInput{
		EntityType:  models.ImageEntityLocation,
		EntityID:    location.ID,
		URL:         url,
		DisplayName: &displayName,
		Category:    &category,
	})
	require.NoError(t, err)
	require.Equal(t, url, hyperlink.URL, "verifying hyperlink url")
	require.Equal(t, displayName, hyperlink.Name, "verifying hyperlink display name")
	require.Equal(t, category, hyperlink.Category, "verifying 1st hyperlink category")

	hyperlinks, err := location.QueryHyperlinks().All(ctx)
	require.NoError(t, err)
	require.Len(t, hyperlinks, 1, "verifying has 1 hyperlink")

	deletedHyperlink, err := mr.DeleteHyperlink(ctx, hyperlink.ID)
	require.NoError(t, err)
	require.Equal(t, hyperlink.ID, deletedHyperlink.ID, "verifying return id of deleted hyperlink")

	hyperlinks, err = location.QueryHyperlinks().All(ctx)
	require.NoError(t, err)
	require.Len(t, hyperlinks, 0, "verifying no hyperlinks remained")
}

func TestDeleteLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location",
		Type: locationType.ID,
	})
	require.NotNil(t, location, "location exists before deletion")
	require.NoError(t, err)

	deletedLocationID, err := mr.RemoveLocation(ctx, location.ID)
	require.NoError(t, err)
	require.Equal(t, deletedLocationID, location.ID, "returned id from deletion matched location id")

	fetchedNode, err := qr.Node(ctx, location.ID)
	require.True(t, ent.IsNotFound(err))
	require.Nil(t, fetchedNode, "no location with that id")
}

func TestDeleteLocationWithEquipmentsFails(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	c := r.GraphClient()

	var lt struct{ AddLocationType struct{ ID string } }
	err := c.Post(`mutation {
		addLocationType(input: {
			name: "City"
			properties: [{
				type: string
				name: "foo"
				stringValue: "bar"
			}]
		}) {
			id
		}
	}`, &lt)
	require.NoError(t, err)

	var l struct{ AddLocation struct{ ID string } }
	err = c.Post(`mutation($type: ID!) {
		addLocation(input: {
			name: "Tel Aviv"
			type: $type
		}) {
			id
		}
	}`, &l, client.Var("type", lt.AddLocationType.ID))
	require.NoError(t, err)

	var et struct{ AddEquipmentType struct{ ID string } }
	err = c.Post(`mutation {
		addEquipmentType(input: {
			name: "Router"
		}) {
			id
		}
	}`, &et)
	require.NoError(t, err)

	var e struct{ AddEquipment struct{ ID string } }
	err = c.Post(`mutation($type: ID!, $location: ID!) {
		addEquipment(input: {
			name: "Cisco"
			type: $type
			location: $location
		}) {
			id
		}
	}`, &e,
		client.Var("type", et.AddEquipmentType.ID),
		client.Var("location", l.AddLocation.ID),
	)
	require.NoError(t, err)

	var id string
	err = c.Post(`mutation($id: ID!) { removeLocation(id: $id) }`,
		&id, client.Var("id", l.AddLocation.ID))
	require.Error(t, err, "can't remove location with equipment")

	var n struct{ Location struct{ ID string } }
	err = c.Post(
		`query($id: ID!) { location: node(id: $id) { ... on Location { id } } }`,
		&n,
		client.Var("id", l.AddLocation.ID),
	)
	require.NoError(t, err)
	require.Equal(t, l.AddLocation.ID, n.Location.ID)
}

func TestQueryParentLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type",
	})
	require.NoError(t, err)

	parentLocation, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "parent_location",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	childLocation, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "child_location",
		Type:   locationType.ID,
		Parent: &parentLocation.ID,
	})
	require.NoError(t, err)

	parentParent, err := parentLocation.Parent(ctx)
	require.NoError(t, err)
	require.Nil(t, parentParent, "nil returns for parent if there isn't one")

	childParent, err := childLocation.QueryParent().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, childParent.ID, parentLocation.ID, "verify parent id for child location")
}

func TestGetLocationsByType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	locationType1, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_1",
	})
	require.NoError(t, err)
	locationType2, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_2",
	})
	require.NoError(t, err)

	location1, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_1",
		Type: locationType1.ID,
	})
	require.NoError(t, err)

	location2, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_2",
		Type: locationType2.ID,
	})
	require.NoError(t, err)

	allLocations, err := qr.Locations(ctx, nil, []int{locationType1.ID, locationType2.ID}, nil, nil, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, allLocations.Edges, 2)

	locationsType1, err := qr.Locations(ctx, nil, []int{locationType1.ID}, nil, nil, nil, nil, nil, nil, nil, nil)

	require.NoError(t, err)
	require.Len(t, locationsType1.Edges, 1, "one location of this type")
	require.Equal(t, locationsType1.Edges[0].Node.ID, location1.ID)

	locationsType2, err := qr.Locations(ctx, nil, []int{locationType2.ID}, nil, nil, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, locationsType2.Edges, 1, "one location of this type")
	require.Equal(t, locationsType2.Edges[0].Node.ID, location2.ID)
}

func TestOnlyTopLevelLocationsFilter(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type",
	})
	require.NoError(t, err)

	location1, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	_, err = mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "location_2",
		Type:   locationType.ID,
		Parent: &location1.ID,
	})
	require.NoError(t, err)

	onlyTopLevel := true
	onlyTopLevelLocations, err := qr.Locations(ctx, &onlyTopLevel, nil, nil, nil, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, onlyTopLevelLocations.Edges, 1, "one top level location")
	require.Equal(t, onlyTopLevelLocations.Edges[0].Node.ID, location1.ID)

	onlyTopLevel = false
	allLocations, err := qr.Locations(ctx, &onlyTopLevel, nil, nil, nil, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, allLocations.Edges, 2, "two not-only top level locations")
}

func TestGetLocationsByName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	c := r.GraphClient()

	var typ struct{ AddLocationType struct{ ID string } }
	err := c.Post(`mutation { addLocationType(input: { name: "City" }) { id } }`, &typ)
	require.NoError(t, err)

	names := []string{"New York", "New Jersey"}
	for _, name := range names {
		var rsp struct{ AddLocation struct{ ID string } }
		err := c.Post(`mutation($name: String!, $type: ID!) { addLocation(input: { name: $name, type: $type }) { id } }`,
			&rsp, client.Var("name", name), client.Var("type", typ.AddLocationType.ID),
		)
		require.NoError(t, err)
	}
	const query = `query($name: String!) { locations(name: $name) { totalCount } }`
	var rsp struct{ Locations struct{ TotalCount int } }
	err = c.Post(query, &rsp, client.Var("name", "new"))
	require.NoError(t, err)
	require.Equal(t, len(names), rsp.Locations.TotalCount)

	err = c.Post(query, &rsp, client.Var("name", "old"))
	require.NoError(t, err)
	require.Zero(t, rsp.Locations.TotalCount)
}

func TestMoveLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type",
	})
	require.NoError(t, err)

	parentOld, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	loc, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "loc2",
		Type:   locationType.ID,
		Parent: &parentOld.ID,
	})
	require.NoError(t, err)
	require.Equal(t, loc.QueryParent().OnlyX(ctx).ID, parentOld.ID)

	parentNew, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc3",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	loc, err = mr.MoveLocation(ctx, loc.ID, &parentNew.ID)
	require.NoError(t, err)
	require.Equal(t, loc.QueryParent().OnlyX(ctx).ID, parentNew.ID)

	// switch roles, should fail
	_, err = mr.MoveLocation(ctx, parentNew.ID, &loc.ID)
	require.Error(t, err, "verifying the parent can't be a descendant")
	require.Equal(t, loc.QueryParent().OnlyX(ctx).ID, parentNew.ID, "verifying that nothing changed")

	// clearing parent
	loc, err = mr.MoveLocation(ctx, loc.ID, nil)
	require.NoError(t, err)
	p, err := loc.QueryParent().Only(ctx)
	require.Error(t, err, "no parent - ent not found")
	require.Nil(t, p, "no parent")
}

func TestMoveLocationDuplicateName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type",
	})
	require.NoError(t, err)

	parent, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc1",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	loc, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "loc2",
		Type:   locationType.ID,
		Parent: &parent.ID,
	})
	require.NoError(t, err)
	require.Equal(t, loc.QueryParent().OnlyX(ctx).ID, parent.ID)

	loc2, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc2",
		Type: locationType.ID,
	})
	require.NoError(t, err)
	_, err = mr.MoveLocation(ctx, loc2.ID, &parent.ID)
	require.Error(t, err, "verifying duplicate names throws an error")
	p2, err := loc2.QueryParent().Only(ctx)
	require.Error(t, err, "no parent - ent not found")
	require.Nil(t, p2, "no parent")

	_, err = mr.MoveLocation(ctx, loc.ID, nil)
	require.Error(t, err)
	require.Equal(t, loc.QueryParent().OnlyX(ctx).ID, parent.ID)
}

func TestMoveLocationWrongHierarchy(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	typA, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "ta"})
	require.NoError(t, err)

	typB, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{Name: "tb"})
	require.NoError(t, err)

	loc1, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc1",
		Type: typA.ID,
	})
	require.NoError(t, err)
	loc2, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc2",
		Type: typB.ID,
	})
	require.NoError(t, err)

	_, err = mr.MoveLocation(ctx, loc1.ID, &loc2.ID)
	require.Error(t, err)
}

func TestDistanceKm(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type",
	})
	require.NoError(t, err)

	lat := 32.0738666
	long := 34.772906

	l, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:      "loc2",
		Type:      locationType.ID,
		Latitude:  &lat,
		Longitude: &long,
	})
	require.NoError(t, err)

	distance, err := r.Location().DistanceKm(ctx, l, 32.0872002, 34.7814602)
	require.NoError(t, err)
	require.InEpsilon(t, 1.69, distance, 0.01)
}

func TestNearestSites(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	isSite := true
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name:   "location_type",
		IsSite: &isSite,
	})
	require.NoError(t, err)

	// Meir Park
	userLat, userLong := 32.0738666, 34.772906
	locations := []struct {
		Name string
		Lat  float64
		Long float64
	}{
		{
			"Home", 32.0872002, 34.7814602, // 1.69 km
		},
		{
			"Migdal Hamea", 32.0865561, 34.7811125, // 1.61 km
		},
		{
			"FB Rothschild Offices", 32.0627892, 34.7692868, // 1.28 km
		},
		{
			"Bograshov Beach", 32.0782175, 34.7632941, // 1.03 km
		},
		{
			"FB Sarona Offices", 32.0714457, 34.7891338, // 1.55 km
		},
	}

	for _, l := range locations {
		_, err := mr.AddLocation(ctx, models.AddLocationInput{
			Name:      l.Name,
			Type:      locationType.ID,
			Latitude:  &l.Lat,
			Longitude: &l.Long,
		})
		require.NoError(t, err)
	}

	nearestLocs, err := qr.NearestSites(ctx, userLat, userLong, 1)
	require.NoError(t, err)
	require.Len(t, nearestLocs, 1)
	require.Equal(t, "Bograshov Beach", nearestLocs[0].Name)

	nearestLocs, err = qr.NearestSites(ctx, userLat, userLong, 3)
	require.NoError(t, err)
	require.Len(t, nearestLocs, 3)
	require.Equal(t, "Bograshov Beach", nearestLocs[0].Name)
	require.Equal(t, "FB Rothschild Offices", nearestLocs[1].Name)
	require.Equal(t, "FB Sarona Offices", nearestLocs[2].Name)
}

func TestAddLocationWithEquipmentProperty(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	elt, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "example_type",
	})
	require.NoError(t, err)

	el, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "equipment_location_name",
		Type: elt.ID,
	})

	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "equipment_type",
	})
	require.NoError(t, err)

	equipment, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment_name",
		Type:     equipmentType.ID,
		Location: &el.ID,
	})

	index := 0
	eqPropType := pkgmodels.PropertyTypeInput{
		Name:  "eq_prop",
		Type:  "node",
		Index: &index,
	}

	propTypeInputs := []*pkgmodels.PropertyTypeInput{&eqPropType}
	lt, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name:       "example_type_2",
		Properties: propTypeInputs,
	})
	require.NoError(t, err)

	propType := lt.QueryPropertyTypes().OnlyX(ctx)
	eqPropInput := models.PropertyInput{
		PropertyTypeID: propType.ID,
		NodeIDValue:    &equipment.ID,
	}

	l, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "location_name",
		Type:       lt.ID,
		Properties: []*models.PropertyInput{&eqPropInput},
	})
	require.NoError(t, err)

	eqProp := l.QueryProperties().Where(property.HasTypeWith(propertytype.Name("eq_prop"))).OnlyX(ctx)
	eqValue := eqProp.QueryEquipmentValue().OnlyX(ctx)

	require.Equal(t, "equipment_name", eqValue.Name)
}

func TestAddLocationWithLocationProperty(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, pr := r.Mutation(), r.Property()

	elt, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "regular_location_type",
	})
	require.NoError(t, err)

	el, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_1",
		Type: elt.ID,
	})

	index := 0
	locationPropType := pkgmodels.PropertyTypeInput{
		Name:     "location_prop",
		Type:     propertytype.TypeNode,
		NodeType: pointer.ToString("location"),
		Index:    &index,
	}

	propTypeInputs := []*pkgmodels.PropertyTypeInput{&locationPropType}
	lt, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name:       "location_type_with_location_prop",
		Properties: propTypeInputs,
	})
	require.NoError(t, err)

	propType := lt.QueryPropertyTypes().OnlyX(ctx)
	locationPropInput := models.PropertyInput{
		PropertyTypeID: propType.ID,
		NodeIDValue:    &el.ID,
	}

	l, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "location_name",
		Type:       lt.ID,
		Properties: []*models.PropertyInput{&locationPropInput},
	})
	require.NoError(t, err)

	locationProp := l.QueryProperties().Where(property.HasTypeWith(propertytype.Name("location_prop"))).OnlyX(ctx)
	locationValue := locationProp.QueryLocationValue().OnlyX(ctx)
	rawValue, err := pr.RawValue(ctx, locationProp)
	require.NoError(t, err)
	require.Equal(t, strconv.Itoa(locationValue.ID), pointer.GetString(rawValue))
	namedNode, err := pr.NodeValue(ctx, locationProp)
	require.NoError(t, err)
	location, ok := namedNode.(*ent.Location)
	require.True(t, ok)
	require.Equal(t, location.ID, locationValue.ID)
	require.Equal(t, "location_1", locationValue.Name)
}
