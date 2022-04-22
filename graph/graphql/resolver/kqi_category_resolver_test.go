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

func TestAddRemoveKqiCategory(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddKqiCategoryTest(ctx, t, mr)
	EditKqiCategoryTest(ctx, t, mr, id1, id2)
	RemoveKqiCategoryTest(ctx, t, mr, id1, id2)
}
func AddKqiCategoryTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	kqiCategory1, err := mr.AddKqiCategory(ctx, models.AddKqiCategoryInput{
		Name: "kqiCategory_test_1",
	})
	require.NoError(t, err)

	kqiCategory2, err := mr.AddKqiCategory(ctx, models.AddKqiCategoryInput{
		Name: "kqiCategory_test_2",
	})
	require.NoError(t, err)
	id1, id2 := kqiCategory1.ID, kqiCategory2.ID
	_, err = mr.AddKqiCategory(ctx, models.AddKqiCategoryInput{
		Name: "kqiCategory_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditKqiCategoryTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditKqiCategory(ctx, models.EditKqiCategoryInput{
		ID:   id1,
		Name: "kqiCategory_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditKqiCategory(ctx, models.EditKqiCategoryInput{
		ID:   id2,
		Name: "kqiCategory_test_1.1",
	})
	require.Error(t, err)
}

func RemoveKqiCategoryTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveKqiCategory(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveKqiCategory(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveKqiCategory(ctx, id1)
	require.Error(t, err)
}
