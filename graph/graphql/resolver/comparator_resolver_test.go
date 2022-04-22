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

func TestAddRemoveComparator(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddComparatorTest(ctx, t, mr)
	EditComparatorTest(ctx, t, mr, id1, id2)
	RemoveComparatorTest(ctx, t, mr, id1, id2)
}
func AddComparatorTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	comparator1, err := mr.AddComparator(ctx, models.AddComparatorInput{
		Name: "comparator_test_1",
	})
	require.NoError(t, err)

	comparator2, err := mr.AddComparator(ctx, models.AddComparatorInput{
		Name: "comparator_test_2",
	})
	require.NoError(t, err)
	id1, id2 := comparator1.ID, comparator2.ID
	_, err = mr.AddComparator(ctx, models.AddComparatorInput{
		Name: "comparator_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditComparatorTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditComparator(ctx, models.EditComparatorInput{
		ID:   id1,
		Name: "comparator_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditComparator(ctx, models.EditComparatorInput{
		ID:   id2,
		Name: "comparator_test_1.1",
	})
	require.Error(t, err)
}

func RemoveComparatorTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveComparator(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveComparator(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveComparator(ctx, id1)
	require.Error(t, err)
}
