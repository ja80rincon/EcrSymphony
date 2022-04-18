// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package migrations_test

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap/zaptest"

	"github.com/facebookincubator/symphony/graph/cmd/entscript/migrations"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"

	"go.uber.org/zap"
)

func TestMigrateWorkOrderStatus(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(
		context.Background(),
		client,
	)
	u, ok := viewer.FromContext(ctx).(*viewer.UserViewer)
	require.True(t, ok)
	user := u.User()
	typ, err := client.WorkOrderType.
		Create().
		SetName("testing").
		Save(ctx)
	require.NoError(t, err)

	var ids []int
	names := []string{"planned_ow", "pend_wo", "done_wo"}
	origStatus := []workorder.Status{workorder.StatusPlanned, workorder.StatusPending, workorder.StatusDone}

	for i, name := range names {
		order, err := client.WorkOrder.Create().
			SetName(name).
			SetStatus(origStatus[i]).
			SetCreationDate(time.Now()).
			SetOwner(user).
			SetType(typ).
			Save(ctx)
		require.NoError(t, err)
		ids = append(ids, order.ID)
	}

	logger := zaptest.NewLogger(t, zaptest.WrapOptions(zap.AddCaller()))
	t.Log("starting migration")
	err = migrations.MigrateWorkOrderStatus(ctx, logger)
	require.NoError(t, err)

	expectedStatus := []workorder.Status{workorder.StatusPlanned, workorder.StatusPlanned, workorder.StatusClosed}
	for i, orderID := range ids {
		order, err := client.WorkOrder.Get(ctx, orderID)
		require.NoError(t, err)
		require.EqualValues(t, expectedStatus[i], order.Status)
	}
}
