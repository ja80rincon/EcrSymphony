// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"sort"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

func TestAddWorkerTypesSameName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	workerType, err := mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
		Name: "example_type_name",
	})
	require.NoError(t, err)
	require.Equal(t, "example_type_name", workerType.Name)
	_, err = mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
		Name: "example_type_name",
	})
	require.Error(t, err)
}

func TestQueryWorkerTypes(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	for _, suffix := range []string{"a", "b"} {
		_, err := mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
			Name: "example_type_" + suffix,
		})
		require.NoError(t, err)
	}
	types, _ := qr.WorkerTypes(ctx, nil, nil, nil, nil)
	require.Len(t, types.Edges, 2)

	var names = make([]string, len(types.Edges))
	for i, v := range types.Edges {
		names[i] = v.Node.Name
	}
	sort.Strings(names)
	require.Equal(t, names, []string{"example_type_a", "example_type_b"})
}

func TestAddWorkerTypeWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	extID := "12345"
	ptype := pkgmodels.PropertyTypeInput{
		Name:        "str_prop",
		Type:        "string",
		Index:       pointer.ToInt(5),
		StringValue: pointer.ToString("Foo"),
		ExternalID:  &extID,
	}
	workerType, err := mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
		Name:          "example_type_a",
		PropertyTypes: []*pkgmodels.PropertyTypeInput{&ptype},
	})
	require.NoError(t, err)

	fetchedNode, err := qr.Node(ctx, workerType.ID)
	require.NoError(t, err)
	fetchedWorkerType, ok := fetchedNode.(*ent.WorkerType)
	require.True(t, ok)
	fetchedPropertyTypes := fetchedWorkerType.QueryPropertyTypes().AllX(ctx)
	require.Len(t, fetchedPropertyTypes, 1)
	require.Equal(t, fetchedPropertyTypes[0].Name, "str_prop")
	require.Equal(t, fetchedPropertyTypes[0].Type, propertytype.TypeString)
	require.Equal(t, fetchedPropertyTypes[0].Index, 5)
	require.Equal(t, fetchedPropertyTypes[0].ExternalID, extID)
}

func TestRemoveWorkerType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	strPropType := pkgmodels.PropertyTypeInput{
		Name:        "str_prop",
		Type:        propertytype.TypeString,
		StringValue: pointer.ToString("Foo"),
	}

	workerType, err := mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
		Name:          "example_type_a",
		PropertyTypes: []*pkgmodels.PropertyTypeInput{&strPropType},
	})
	require.NoError(t, err)

	_, err = mr.RemoveWorkerType(ctx, workerType.ID)
	require.NoError(t, err)

	deletedNode, err := qr.Node(ctx, workerType.ID)
	require.True(t, ent.IsNotFound(err))
	require.Nil(t, deletedNode)
	require.Zero(t, workerType.QueryPropertyTypes().CountX(ctx))
}

func TestEditWorkerType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	workerType, err := mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
		Name: "example_type_name",
	})
	require.NoError(t, err)
	require.Equal(t, "example_type_name", workerType.Name)

	newType, err := mr.EditWorkerType(ctx, models.EditWorkerTypeInput{
		ID:   workerType.ID,
		Name: "example_type_name_edited",
	})
	require.NoError(t, err)
	require.Equal(t, "example_type_name_edited", newType.Name, "successfully edited worker type name")

	workerType, err = mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
		Name: "example_type_name_2",
	})
	require.NoError(t, err)
	_, err = mr.EditWorkerType(ctx, models.EditWorkerTypeInput{
		ID:   workerType.ID,
		Name: "example_type_name_edited",
	})
	require.Error(t, err, "duplicate names")

	types, err := qr.WorkerTypes(ctx, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, types.Edges, 2)

	node, err := qr.Node(ctx, workerType.ID)
	require.NoError(t, err)
	typ, ok := node.(*ent.WorkerType)
	require.True(t, ok)
	require.Equal(t, "example_type_name_2", typ.Name)
}

func TestEditWorkerTypeWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	strPropType := pkgmodels.PropertyTypeInput{
		Name:        "str_prop",
		Type:        propertytype.TypeString,
		StringValue: pointer.ToString("Foo"),
	}
	propTypeInput := []*pkgmodels.PropertyTypeInput{&strPropType}
	eqType, err := mr.AddWorkerType(ctx, models.AddWorkerTypeInput{
		Name:          "example_type_a",
		PropertyTypes: propTypeInput,
	})
	require.NoError(t, err)

	strProp := eqType.QueryPropertyTypes().
		Where(propertytype.TypeEQ(propertytype.TypeString)).
		OnlyX(ctx)
	strPropType = pkgmodels.PropertyTypeInput{
		ID:          &strProp.ID,
		Name:        "str_prop_new",
		Type:        propertytype.TypeString,
		StringValue: pointer.ToString("Foo - edited"),
	}
	intPropType := pkgmodels.PropertyTypeInput{
		Name:     "int_prop",
		Type:     propertytype.TypeInt,
		IntValue: pointer.ToInt(5),
	}
	editedPropTypeInput := []*pkgmodels.PropertyTypeInput{&strPropType, &intPropType}
	newType, err := mr.EditWorkerType(ctx, models.EditWorkerTypeInput{
		ID:            eqType.ID,
		Name:          "example_type_a",
		PropertyTypes: editedPropTypeInput,
	})
	require.NoError(t, err)
	require.Equal(t, eqType.Name, newType.Name, "successfully edited worker type name")

	strProp = eqType.QueryPropertyTypes().
		Where(propertytype.TypeEQ(propertytype.TypeString)).
		OnlyX(ctx)
	require.Equal(t, "str_prop_new", strProp.Name, "successfully edited prop type name")
	require.Equal(t, "Foo - edited", pointer.GetString(strProp.StringVal), "successfully edited prop type string value")

	intProp := eqType.QueryPropertyTypes().
		Where(propertytype.TypeEQ(propertytype.TypeInt)).
		OnlyX(ctx)
	require.Equal(t, "int_prop", intProp.Name, "successfully edited prop type name")
	require.Equal(t, 5, pointer.GetInt(intProp.IntVal), "successfully edited prop type int value")

	intPropType = pkgmodels.PropertyTypeInput{
		Name:     "int_prop",
		Type:     propertytype.TypeInt,
		IntValue: pointer.ToInt(6),
	}
	editedPropTypeInput = []*pkgmodels.PropertyTypeInput{&intPropType}
	_, err = mr.EditWorkerType(ctx, models.EditWorkerTypeInput{
		ID:            eqType.ID,
		Name:          "example_type_a",
		PropertyTypes: editedPropTypeInput,
	})
	require.Error(t, err, "duplicate property type names")
}
