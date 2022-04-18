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

func TestAddRemoveKqiTemporalFrequency(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddKqiTemporalFrequencyTest(ctx, t, mr)
	EditKqiTemporalFrequencyTest(ctx, t, mr, id1, id2)
	RemoveKqiTemporalFrequencyTest(ctx, t, mr, id1, id2)
}
func AddKqiTemporalFrequencyTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	kqiTemporalFrequency1, err := mr.AddKqiTemporalFrequency(ctx, models.AddKqiTemporalFrequencyInput{
		Name: "kqiTemporalFrequency_test_1",
	})
	require.NoError(t, err)

	kqiTemporalFrequency2, err := mr.AddKqiTemporalFrequency(ctx, models.AddKqiTemporalFrequencyInput{
		Name: "kqiTemporalFrequency_test_2",
	})
	require.NoError(t, err)
	id1, id2 := kqiTemporalFrequency1.ID, kqiTemporalFrequency2.ID
	_, err = mr.AddKqiTemporalFrequency(ctx, models.AddKqiTemporalFrequencyInput{
		Name: "kqiTemporalFrequency_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditKqiTemporalFrequencyTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditKqiTemporalFrequency(ctx, models.EditKqiTemporalFrequencyInput{
		ID:   id1,
		Name: "kqiTemporalFrequency_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditKqiTemporalFrequency(ctx, models.EditKqiTemporalFrequencyInput{
		ID:   id2,
		Name: "kqiTemporalFrequency_test_1.1",
	})
	require.Error(t, err)
}

func RemoveKqiTemporalFrequencyTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveKqiTemporalFrequency(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveKqiTemporalFrequency(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveKqiTemporalFrequency(ctx, id1)
	require.Error(t, err)
}
