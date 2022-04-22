// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/AlekSi/pointer"
	"github.com/stretchr/testify/require"
)

type locationSearchDataModels struct {
	loc1     *ent.Location
	loc2     *ent.Location
	locType1 *ent.LocationType
	locType2 *ent.LocationType
}

func prepareLocationData(ctx context.Context, r *TestResolver) locationSearchDataModels {
	mr := r.Mutation()
	locType1, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "loc_type1",
		Properties: []*pkgmodels.PropertyTypeInput{
			{
				Name: "date_established",
				Type: propertytype.TypeDate,
			},
			{
				Name: "stringProp",
				Type: propertytype.TypeString,
			},
		},
	})
	datePropDef := locType1.QueryPropertyTypes().Where(propertytype.Name("date_established")).OnlyX(ctx)
	strPropDef := locType1.QueryPropertyTypes().Where(propertytype.Name("stringProp")).OnlyX(ctx)

	loc1, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "loc_inst1",
		Type:       locType1.ID,
		ExternalID: pointer.ToString("12345"),
		Properties: []*models.PropertyInput{
			{
				PropertyTypeID: datePropDef.ID,
				StringValue:    pointer.ToString("1988-03-29"),
			},
			{
				PropertyTypeID: strPropDef.ID,
				StringValue:    pointer.ToString("testProp"),
			},
		},
	})

	locType2, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "loc_type2",
	})

	loc2, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "loc_inst2",
		Type:   locType2.ID,
		Parent: pointer.ToInt(loc1.ID),
	})

	equType, _ := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "eq_type",
	})
	if _, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "eq_inst",
		Type:     equType.ID,
		Location: &loc1.ID,
	}); err != nil {
		panic(err)
	}
	return locationSearchDataModels{
		loc1,
		loc2,
		locType1,
		locType2,
	}
}

func TestSearchLocationAncestors(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareLocationData(ctx, r)
	/*
		helper: data now is of type:
		 loc1 (loc_type1):
			eq_inst (eq_type)
			loc2 (loc_type2)
	*/
	qr := r.Query()
	limit := 100
	all, err := qr.Locations(ctx, nil, nil, nil, nil, nil, &limit, nil, nil, nil, []*pkgmodels.LocationFilterInput{})
	require.NoError(t, err)
	require.Len(t, all.Edges, 2)
	require.Equal(t, all.TotalCount, 2)
	maxDepth := 2
	f1 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeLocationInst,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.loc1.ID},
		MaxDepth:   &maxDepth,
	}
	res, err := qr.Locations(ctx, nil, nil, nil, nil, nil, &limit, nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res.Edges, 2)
	require.Equal(t, res.TotalCount, 2)

	f2 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeLocationInst,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.loc2.ID},
		MaxDepth:   &maxDepth,
	}
	res, err = qr.Locations(ctx, nil, nil, nil, nil, nil, &limit, nil, nil, nil, []*pkgmodels.LocationFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)
}

func TestSearchLocationByExternalID(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareLocationData(ctx, r)
	/*
		helper: data now is of type:
		 loc1 (loc_type1):
			eq_inst (eq_type)
			loc2 (loc_type2)
	*/
	qr := r.Query()
	resAll, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{})
	require.NoError(t, err)
	require.Len(t, resAll.Edges, 2)
	require.Equal(t, resAll.TotalCount, 2)

	f1 := pkgmodels.LocationFilterInput{
		FilterType:  enum.LocationFilterTypeLocationInstExternalID,
		Operator:    enum.FilterOperatorContains,
		StringValue: &data.loc1.ExternalID,
	}

	res, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)

	// same filter - with 'IS" operator
	f2 := pkgmodels.LocationFilterInput{
		FilterType:  enum.LocationFilterTypeLocationInstExternalID,
		Operator:    enum.FilterOperatorIs,
		StringValue: &data.loc1.ExternalID,
	}

	res, err = qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)
}

func TestSearchLocationByName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareLocationData(ctx, r)
	/*
		helper: data now is of type:
		 loc1 (loc_type1):
			eq_inst (eq_type)
			loc2 (loc_type2)
	*/
	qr := r.Query()

	f1 := pkgmodels.LocationFilterInput{
		FilterType:  enum.LocationFilterTypeLocationInstName,
		Operator:    enum.FilterOperatorIs,
		StringValue: &data.loc2.Name,
	}
	resAll, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{})
	require.NoError(t, err)
	require.Len(t, resAll.Edges, 2)
	require.Equal(t, resAll.TotalCount, 2)

	res, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)
}

func TestSearchLocationByType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareLocationData(ctx, r)
	/*
		helper: data now is of type:
		 loc1 (loc_type1):
			eq_inst (eq_type)
			loc2 (loc_type2)
	*/
	qr := r.Query()
	f1 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeLocationType,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.locType2.ID},
	}
	res, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)
}

func TestSearchLocationHasEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	prepareLocationData(ctx, r)
	/*
		helper: data now is of type:
		 loc1 (loc_type1):
			eq_inst (eq_type)
			loc2 (loc_type2)
	*/
	qr := r.Query()
	f1 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeLocationInstHasEquipment,
		Operator:   enum.FilterOperatorIs,
		BoolValue:  pointer.ToBool(true),
	}
	res, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)

	f2 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeLocationInstHasEquipment,
		Operator:   enum.FilterOperatorIs,
		BoolValue:  pointer.ToBool(false),
	}
	res, err = qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)
}

func TestSearchMultipleFilters(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareLocationData(ctx, r)
	/*
		helper: data now is of type:
		 loc1 (loc_type1):
			eq_inst (eq_type)
			loc2 (loc_type2)
	*/
	qr := r.Query()
	f1 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeLocationInst,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.loc1.ID},
		MaxDepth:   pointer.ToInt(2),
	}
	res, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res.Edges, 2)
	require.Equal(t, res.TotalCount, 2)

	f2 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeLocationType,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.locType2.ID},
	}
	res, err = qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1, &f2})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)
}

func TestSearchLocationProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	prepareLocationData(ctx, r)
	/*
		helper: data now is of type:
		 loc1 (loc_type1): - properties
			eq_inst (eq_type)
			loc2 (loc_type2)
	*/
	qr := r.Query()
	f1 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeProperty,
		Operator:   enum.FilterOperatorDateLessThan,
		PropertyValue: &pkgmodels.PropertyTypeInput{
			Type:        propertytype.TypeDate,
			Name:        "date_established",
			StringValue: pointer.ToString("2019-11-15"),
		},
	}

	res, err := qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)

	f2 := pkgmodels.LocationFilterInput{
		FilterType: enum.LocationFilterTypeProperty,
		Operator:   enum.FilterOperatorIs,
		PropertyValue: &pkgmodels.PropertyTypeInput{
			Type:        propertytype.TypeString,
			Name:        "stringProp",
			StringValue: pointer.ToString("testProp"),
		},
	}
	res, err = qr.Locations(ctx, nil, nil, nil, nil, nil, pointer.ToInt(100), nil, nil, nil, []*pkgmodels.LocationFilterInput{&f1, &f2})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
	require.Equal(t, res.TotalCount, 1)
}
