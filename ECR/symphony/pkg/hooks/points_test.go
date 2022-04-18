// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks_test

import (
	"context"
	"strconv"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/entrypoint"
	"github.com/facebookincubator/symphony/pkg/ent/exitpoint"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
	"github.com/facebookincubator/symphony/pkg/hooks"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestDefaultBlockEntryExitPointsAddedDeleted(t *testing.T) {
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), c)
	client := ent.FromContext(ctx)
	flowHooker := hooks.Flower{
		TriggerFactory: triggers.NewFactory(),
		ActionFactory:  actions.NewFactory(),
	}
	flowHooker.HookTo(client)

	tests := []struct {
		blockType        block.Type
		entryPointExists bool
		exitPointCount   int
	}{
		{
			blockType:        block.TypeStart,
			entryPointExists: false,
			exitPointCount:   1,
		},
		{
			blockType:        block.TypeEnd,
			entryPointExists: true,
			exitPointCount:   0,
		},
		{
			blockType:        block.TypeGoTo,
			entryPointExists: true,
			exitPointCount:   0,
		},
		{
			blockType:        block.TypeDecision,
			entryPointExists: true,
			exitPointCount:   1,
		},
		{
			blockType:        block.TypeSubFlow,
			entryPointExists: true,
			exitPointCount:   1,
		},
		{
			blockType:        block.TypeTrigger,
			entryPointExists: false,
			exitPointCount:   1,
		},
		{
			blockType:        block.TypeAction,
			entryPointExists: true,
			exitPointCount:   1,
		},
	}

	for i, tc := range tests {
		t.Run(tc.blockType.String(), func(t *testing.T) {
			mutation := client.Block.Create().
				SetCid(strconv.Itoa(i)).
				SetType(tc.blockType)
			switch tc.blockType {
			case block.TypeTrigger:
				mutation.SetTriggerType(flowschema.TriggerTypeWorkOrder)
			case block.TypeAction:
				mutation.SetActionType(flowschema.ActionTypeWorkOrder)
			}
			blk, err := mutation.Save(ctx)
			require.NoError(t, err)
			entryPoint, err := blk.QueryEntryPoint().Only(ctx)
			require.NoError(t, ent.MaskNotFound(err))
			require.Equal(t, !tc.entryPointExists, ent.IsNotFound(err))
			if tc.entryPointExists {
				require.Equal(t, flowschema.EntryPointRoleDefault, entryPoint.Role)
			}

			exitPoints, err := blk.QueryExitPoints().All(ctx)
			require.NoError(t, err)
			require.Len(t, exitPoints, tc.exitPointCount)
			for _, exitPoint := range exitPoints {
				require.Equal(t, flowschema.ExitPointRoleDefault, exitPoint.Role)
			}
			err = client.Block.DeleteOne(blk).Exec(ctx)
			require.NoError(t, err)
			if tc.entryPointExists {
				exists, err := client.EntryPoint.Query().
					Where(entrypoint.ID(entryPoint.ID)).
					Exist(ctx)
				require.NoError(t, err)
				require.False(t, exists)
			}
			for _, exitPoint := range exitPoints {
				exists, err := client.ExitPoint.Query().
					Where(exitpoint.ID(exitPoint.ID)).
					Exist(ctx)
				require.NoError(t, err)
				require.False(t, exists)
			}
		})
	}
}

func TestAddBlockEntryExitPoints(t *testing.T) {
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), c)
	client := ent.FromContext(ctx)
	flowHooker := hooks.Flower{
		TriggerFactory: triggers.NewFactory(),
		ActionFactory:  actions.NewFactory(),
	}
	flowHooker.HookTo(client)

	blk, err := client.Block.Create().
		SetCid("start").
		SetType(block.TypeStart).
		Save(ctx)
	require.NoError(t, err)
	_, err = client.ExitPoint.Create().
		SetRole(flowschema.ExitPointRoleDecision).
		SetParentBlock(blk).
		Save(ctx)
	require.Error(t, err)
	_, err = client.ExitPoint.Create().
		SetRole(flowschema.ExitPointRoleDefault).
		SetParentBlock(blk).
		Save(ctx)
	require.NoError(t, err)

	blk, err = client.Block.Create().
		SetCid("decision").
		SetType(block.TypeDecision).
		Save(ctx)
	require.NoError(t, err)
	exitPoint, err := client.ExitPoint.Create().
		SetRole(flowschema.ExitPointRoleDecision).
		SetCid("route1").
		SetParentBlock(blk).
		Save(ctx)
	require.NoError(t, err)
	_, err = client.ExitPoint.Create().
		SetRole(flowschema.ExitPointRoleDecision).
		SetCid("route1").
		SetParentBlock(blk).
		Save(ctx)
	require.Error(t, err)

	err = client.Block.DeleteOne(blk).Exec(ctx)
	require.NoError(t, err)
	exists, err := client.ExitPoint.Query().
		Where(exitpoint.ID(exitPoint.ID)).
		Exist(ctx)
	require.NoError(t, err)
	require.False(t, exists)
}
