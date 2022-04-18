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

func TestAddRemoveAlarmStatus(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddAlarmStatusTest(ctx, t, mr)
	EditAlarmStatusTest(ctx, t, mr, id1, id2)
	RemoveAlarmStatusTest(ctx, t, mr, id1, id2)
}
func AddAlarmStatusTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	alarmStatus1, err := mr.AddAlarmStatus(ctx, models.AddAlarmStatusInput{
		Name: "alarmStatus_test_1",
	})
	require.NoError(t, err)

	alarmStatus2, err := mr.AddAlarmStatus(ctx, models.AddAlarmStatusInput{
		Name: "alarmStatus_test_2",
	})
	require.NoError(t, err)
	id1, id2 := alarmStatus1.ID, alarmStatus2.ID
	_, err = mr.AddAlarmStatus(ctx, models.AddAlarmStatusInput{
		Name: "alarmStatus_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditAlarmStatusTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditAlarmStatus(ctx, models.EditAlarmStatusInput{
		ID:   id1,
		Name: "alarmStatus_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditAlarmStatus(ctx, models.EditAlarmStatusInput{
		ID:   id2,
		Name: "alarmStatus_test_1.1",
	})
	require.Error(t, err)
}

func RemoveAlarmStatusTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveAlarmStatus(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveAlarmStatus(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveAlarmStatus(ctx, id1)
	require.Error(t, err)
}
