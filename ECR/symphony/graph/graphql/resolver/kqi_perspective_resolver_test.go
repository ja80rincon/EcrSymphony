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

func TestAddRemoveKqiPerspective(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddKqiPerspectiveTest(ctx, t, mr)
	EditKqiPerspectiveTest(ctx, t, mr, id1, id2)
	RemoveKqiPerspectiveTest(ctx, t, mr, id1, id2)
}
func AddKqiPerspectiveTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	kqiPerspective1, err := mr.AddKqiPerspective(ctx, models.AddKqiPerspectiveInput{
		Name: "kqiPerspective_test_1",
	})
	require.NoError(t, err)

	kqiPerspective2, err := mr.AddKqiPerspective(ctx, models.AddKqiPerspectiveInput{
		Name: "kqiPerspective_test_2",
	})
	require.NoError(t, err)
	id1, id2 := kqiPerspective1.ID, kqiPerspective2.ID
	_, err = mr.AddKqiPerspective(ctx, models.AddKqiPerspectiveInput{
		Name: "kqiPerspective_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditKqiPerspectiveTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditKqiPerspective(ctx, models.EditKqiPerspectiveInput{
		ID:   id1,
		Name: "kqiPerspective_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditKqiPerspective(ctx, models.EditKqiPerspectiveInput{
		ID:   id2,
		Name: "kqiPerspective_test_1.1",
	})
	require.Error(t, err)
}

func RemoveKqiPerspectiveTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveKqiPerspective(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveKqiPerspective(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveKqiPerspective(ctx, id1)
	require.Error(t, err)
}
