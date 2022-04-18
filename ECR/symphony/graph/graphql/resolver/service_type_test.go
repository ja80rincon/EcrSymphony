// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/servicetype"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestEditServiceType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	serviceType, err := mr.AddServiceType(ctx, models.ServiceTypeCreateData{Name: "example_type_name", HasCustomer: false})
	require.NoError(t, err)
	require.Equal(t, "example_type_name", serviceType.Name)

	newType, err := mr.EditServiceType(ctx, models.ServiceTypeEditData{
		ID:          serviceType.ID,
		Name:        "example_type_name_edited",
		HasCustomer: true,
	})
	require.NoError(t, err)
	require.Equal(t, "example_type_name_edited", newType.Name, "successfully edited service type name")
	require.Equal(t, true, newType.HasCustomer)

	serviceType, err = mr.AddServiceType(ctx, models.ServiceTypeCreateData{Name: "example_type_name_2"})
	require.NoError(t, err)
	_, err = mr.EditServiceType(ctx, models.ServiceTypeEditData{
		ID:   serviceType.ID,
		Name: "example_type_name_edited",
	})
	require.Error(t, err, "duplicate names")

	types, err := qr.ServiceTypes(ctx, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, types.Edges, 2)

	node, err := qr.Node(ctx, serviceType.ID)
	require.NoError(t, err)
	typ, ok := node.(*ent.ServiceType)
	require.True(t, ok)
	require.Equal(t, "example_type_name_2", typ.Name)
}

func TestEditServiceTypeWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	strValue := "Foo"
	strPropType := pkgmodels.PropertyTypeInput{
		Name:        "str_prop",
		Type:        "string",
		StringValue: &strValue,
	}
	propTypeInput := []*pkgmodels.PropertyTypeInput{&strPropType}
	serviceType, err := mr.AddServiceType(ctx, models.ServiceTypeCreateData{Name: "example_type_a", HasCustomer: true, Properties: propTypeInput})
	require.NoError(t, err)

	strProp := serviceType.QueryPropertyTypes().Where(propertytype.TypeEQ(propertytype.TypeString)).OnlyX(ctx)
	strValue = "Foo - edited"
	intValue := 5
	strPropType = pkgmodels.PropertyTypeInput{
		ID:          &strProp.ID,
		Name:        "str_prop_new",
		Type:        "string",
		StringValue: &strValue,
	}
	intPropType := pkgmodels.PropertyTypeInput{
		Name:     "int_prop",
		Type:     "int",
		IntValue: &intValue,
	}
	editedPropTypeInput := []*pkgmodels.PropertyTypeInput{&strPropType, &intPropType}
	newType, err := mr.EditServiceType(ctx, models.ServiceTypeEditData{
		ID:          serviceType.ID,
		Name:        "example_type_a",
		Properties:  editedPropTypeInput,
		HasCustomer: true,
	})
	require.NoError(t, err)
	require.Equal(t, serviceType.Name, newType.Name, "successfully edited service type name")

	strProp = serviceType.QueryPropertyTypes().Where(propertytype.TypeEQ(propertytype.TypeString)).OnlyX(ctx)
	require.Equal(t, "str_prop_new", strProp.Name, "successfully edited prop type name")
	require.Equal(t, strValue, pointer.GetString(strProp.StringVal), "successfully edited prop type string value")

	intProp := serviceType.QueryPropertyTypes().Where(propertytype.TypeEQ(propertytype.TypeInt)).OnlyX(ctx)
	require.Equal(t, "int_prop", intProp.Name, "successfully edited prop type name")
	require.Equal(t, intValue, pointer.GetInt(intProp.IntVal), "successfully edited prop type int value")

	intValue = 6
	intPropType = pkgmodels.PropertyTypeInput{
		ID:       &intProp.ID,
		Name:     "int_prop",
		Type:     "int",
		IntValue: &intValue,
	}
	editedPropTypeInput = []*pkgmodels.PropertyTypeInput{&intPropType}
	serviceType, err = mr.EditServiceType(ctx, models.ServiceTypeEditData{
		ID:          serviceType.ID,
		Name:        "example_type_a",
		Properties:  editedPropTypeInput,
		HasCustomer: true,
	})
	require.NoError(t, err)
	intProp = serviceType.QueryPropertyTypes().Where(propertytype.TypeEQ(propertytype.TypeInt)).OnlyX(ctx)
	require.Equal(t, "int_prop", intProp.Name, "successfully edited prop type name")
	require.Equal(t, intValue, pointer.GetInt(intProp.IntVal), "successfully edited prop type int value")
}

func TestRemoveServiceType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	serviceType, err := mr.AddServiceType(ctx, models.ServiceTypeCreateData{
		Name:        "example_type1",
		HasCustomer: false,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "s1",
		ServiceTypeID: serviceType.ID,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	dm := servicetype.DiscoveryMethodInventory
	serviceType2, err := mr.AddServiceType(ctx, models.ServiceTypeCreateData{
		Name:            "example_type2",
		HasCustomer:     false,
		DiscoveryMethod: &dm,
	})
	require.NoError(t, err)

	s2, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "s2",
		ServiceTypeID: serviceType2.ID,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)
	require.NotNil(t, s2)

	services, err := qr.Services(ctx, nil, pointer.ToInt(100), nil, nil, []*pkgmodels.ServiceFilterInput{})
	require.NoError(t, err)
	require.Len(t, services.Edges, 2)

	_, err = mr.RemoveServiceType(ctx, serviceType2.ID)
	require.NoError(t, err)
	services, err = qr.Services(ctx, nil, pointer.ToInt(100), nil, nil, []*pkgmodels.ServiceFilterInput{})
	require.NoError(t, err)
	require.Len(t, services.Edges, 1)
}
