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

func TestAddRemoveEventSeverity(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddEventSeverityTest(ctx, t, mr)
	EditEventSeverityTest(ctx, t, mr, id1, id2)
	RemoveEventSeverityTest(ctx, t, mr, id1, id2)
}
func AddEventSeverityTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	eventSeverity1, err := mr.AddEventSeverity(ctx, models.AddEventSeverityInput{
		Name: "eventSeverity_test_1",
	})
	require.NoError(t, err)

	eventSeverity2, err := mr.AddEventSeverity(ctx, models.AddEventSeverityInput{
		Name: "eventSeverity_test_2",
	})
	require.NoError(t, err)
	id1, id2 := eventSeverity1.ID, eventSeverity2.ID
	_, err = mr.AddEventSeverity(ctx, models.AddEventSeverityInput{
		Name: "eventSeverity_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditEventSeverityTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditEventSeverity(ctx, models.EditEventSeverityInput{
		ID:   id1,
		Name: "eventSeverity_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditEventSeverity(ctx, models.EditEventSeverityInput{
		ID:   id2,
		Name: "eventSeverity_test_1.1",
	})
	require.Error(t, err)
}

func RemoveEventSeverityTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveEventSeverity(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveEventSeverity(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveEventSeverity(ctx, id1)
	require.Error(t, err)
}
