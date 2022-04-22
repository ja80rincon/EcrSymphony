// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent/user"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

func TestAddRemoveCounterFamily(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddCounterFamilyTest(ctx, t, mr)
	EditCounterFamilyTest(ctx, t, mr, id1, id2)
	RemoveCounterFamilyTest(ctx, t, mr, id1, id2)
}
func AddCounterFamilyTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	counterFamily1, err := mr.AddCounterFamily(ctx, models.AddCounterFamilyInput{
		Name: "counterFamily_test_1",
	})
	require.NoError(t, err)

	counterFamily2, err := mr.AddCounterFamily(ctx, models.AddCounterFamilyInput{
		Name: "counterFamily_test_2",
	})
	require.NoError(t, err)
	id1, id2 := counterFamily1.ID, counterFamily2.ID
	_, err = mr.AddCounterFamily(ctx, models.AddCounterFamilyInput{
		Name: "counterFamily_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditCounterFamilyTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditCounterFamily(ctx, models.EditCounterFamilyInput{
		ID:   id1,
		Name: "counterFamily_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditCounterFamily(ctx, models.EditCounterFamilyInput{
		ID:   id2,
		Name: "counterFamily_test_1.1",
	})
	require.Error(t, err)
}

func RemoveCounterFamilyTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveCounterFamily(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveCounterFamily(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveCounterFamily(ctx, id1)
	require.Error(t, err)
}
