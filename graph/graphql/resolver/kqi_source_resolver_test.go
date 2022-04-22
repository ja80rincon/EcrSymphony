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

func TestAddRemoveKqiSource(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddKqiSourceTest(ctx, t, mr)
	EditKqiSourceTest(ctx, t, mr, id1, id2)
	RemoveKqiSourceTest(ctx, t, mr, id1, id2)
}
func AddKqiSourceTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	kqiSource1, err := mr.AddKqiSource(ctx, models.AddKqiSourceInput{
		Name: "kqiSource_test_1",
	})
	require.NoError(t, err)

	kqiSource2, err := mr.AddKqiSource(ctx, models.AddKqiSourceInput{
		Name: "kqiSource_test_2",
	})
	require.NoError(t, err)
	id1, id2 := kqiSource1.ID, kqiSource2.ID
	_, err = mr.AddKqiSource(ctx, models.AddKqiSourceInput{
		Name: "kqiSource_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditKqiSourceTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditKqiSource(ctx, models.EditKqiSourceInput{
		ID:   id1,
		Name: "kqiSource_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditKqiSource(ctx, models.EditKqiSourceInput{
		ID:   id2,
		Name: "kqiSource_test_1.1",
	})
	require.Error(t, err)
}

func RemoveKqiSourceTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveKqiSource(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveKqiSource(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveKqiSource(ctx, id1)
	require.Error(t, err)
}
