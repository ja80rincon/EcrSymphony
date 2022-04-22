// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/entrypoint"
	"github.com/facebookincubator/symphony/pkg/ent/exitpoint"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

func addDefaultEntryPoint(ctx context.Context, client *ent.Client, blockID int) error {
	if _, err := client.EntryPoint.Create().
		SetRole(flowschema.EntryPointRoleDefault).
		SetParentBlockID(blockID).
		Save(ctx); err != nil {
		return fmt.Errorf("failed to create default entry point: %w", err)
	}
	return nil
}

func addDefaultExitPoint(ctx context.Context, client *ent.Client, blockID int, role flowschema.ExitPointRole) error {
	if _, err := client.ExitPoint.Create().
		SetRole(role).
		SetParentBlockID(blockID).
		Save(ctx); err != nil {
		return fmt.Errorf("failed to create default exit point: %w", err)
	}
	return nil
}

// VerifyEntryPointTypeHook checks created entry point is allowed for specific block type
func VerifyEntryPointTypeHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.EntryPointFunc(func(ctx context.Context, mutation *ent.EntryPointMutation) (ent.Value, error) {
			parentBlockID, exists := mutation.ParentBlockID()
			if !exists {
				return nil, fmt.Errorf("entry point has no parent block")
			}
			client := mutation.Client()
			blk, err := client.Block.Get(ctx, parentBlockID)
			if err != nil {
				return nil, fmt.Errorf("cannot get parent block: %w", err)
			}
			switch blk.Type {
			case block.TypeEnd, block.TypeGoTo, block.TypeDecision, block.TypeSubFlow, block.TypeAction, block.TypeTrueFalse:
			default:
				return nil, fmt.Errorf("block type %v is not allowed entry points", blk.Type)
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate)
}

// UpdateDraftChangedForEntryHook marks the entry point's draft has changes from the flow
// nolint: dupl
func UpdateDraftChangedForEntryHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.EntryPointFunc(func(ctx context.Context, mutation *ent.EntryPointMutation) (ent.Value, error) {
			var (
				draftID int
				err     error
			)
			if mutation.Op().Is(ent.OpCreate) {
				blockID, exists := mutation.ParentBlockID()
				if !exists {
					return nil, fmt.Errorf("parent block id is missing for entry point")
				}
				draftID, _ = mutation.Client().Block.Query().
					Where(block.ID(blockID)).
					QueryFlowDraft().
					OnlyID(ctx)
			} else {
				entryPointID, exists := mutation.ID()
				if !exists {
					return nil, fmt.Errorf("entry point has no id")
				}
				draftID, _ = mutation.Client().EntryPoint.Query().
					Where(entrypoint.ID(entryPointID)).
					QueryParentBlock().
					QueryFlowDraft().
					OnlyID(ctx)
			}

			if draftID != 0 {
				if err = mutation.Client().FlowDraft.UpdateOneID(draftID).
					SetSameAsFlow(false).
					Exec(ctx); err != nil {
					return nil, fmt.Errorf("failed to update sameAsFlow field of flow draft : %w", err)
				}
			}

			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne|ent.OpDeleteOne)
}

// VerifyExitPointTypeHook checks created exit point is allowed for specific block type
func VerifyExitPointTypeHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.ExitPointFunc(func(ctx context.Context, mutation *ent.ExitPointMutation) (ent.Value, error) {
			parentBlockID, exists := mutation.ParentBlockID()
			if !exists {
				return nil, fmt.Errorf("entry point has no parent block")
			}
			client := mutation.Client()
			blk, err := client.Block.Get(ctx, parentBlockID)
			if err != nil {
				return nil, fmt.Errorf("cannot get parent block: %w", err)
			}
			role, exists := mutation.Role()
			if !exists {
				return nil, fmt.Errorf("entry point has no role")
			}
			switch blk.Type {
			case block.TypeStart, block.TypeTrigger, block.TypeSubFlow, block.TypeAction:
				if role != flowschema.ExitPointRoleDefault {
					return nil, fmt.Errorf("exit point role %v not valid for block type %v", role, blk.Type)
				}
			case block.TypeDecision:
				if role != flowschema.ExitPointRoleDefault && role != flowschema.ExitPointRoleDecision {
					return nil, fmt.Errorf("exit point role %v not valid for block type %v", role, blk.Type)
				}
			case block.TypeTrueFalse:
				if role != flowschema.ExitPointRoleTrue && role != flowschema.ExitPointRoleFalse {
					return nil, fmt.Errorf("exit point role %v not valid for block type %v", role, blk.Type)
				}
			default:
				return nil, fmt.Errorf("block type %v is not allowed exit points", blk.Type)
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate)
}

// AddDefaultEntryAndExitPointsHook adds for each block type its required entry and exit points
func AddDefaultEntryAndExitPointsHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockFunc(func(ctx context.Context, mutation *ent.BlockMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, mutation)
			if err != nil {
				return nil, err
			}
			blk, ok := value.(*ent.Block)
			if !ok {
				return nil, fmt.Errorf("")
			}
			client := mutation.Client()
			if blk.Type != block.TypeStart && blk.Type != block.TypeTrigger {
				if err := addDefaultEntryPoint(ctx, client, blk.ID); err != nil {
					return nil, err
				}
			}
			if blk.Type != block.TypeEnd && blk.Type != block.TypeGoTo && blk.Type != block.TypeTrueFalse {
				if err := addDefaultExitPoint(ctx, client, blk.ID, flowschema.ExitPointRoleDefault); err != nil {
					return nil, err
				}
			}
			if blk.Type == block.TypeTrueFalse {
				if err := addDefaultExitPoint(ctx, client, blk.ID, flowschema.ExitPointRoleTrue); err != nil {
					return nil, err
				}
				if err := addDefaultExitPoint(ctx, client, blk.ID, flowschema.ExitPointRoleFalse); err != nil {
					return nil, err
				}
			}
			return value, nil
		})
	}
	return hook.On(hk, ent.OpCreate)
}

// AddDefaultEntryAndExitPointsHook deletes all the entry and exit points of a block
func DeleteEntryAndExitPointsHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockFunc(func(ctx context.Context, mutation *ent.BlockMutation) (ent.Value, error) {
			client := mutation.Client()
			id, ok := mutation.ID()
			if !ok {
				return nil, fmt.Errorf("failed to query block to delete")
			}
			entryPoints, err := client.EntryPoint.Query().
				Where(entrypoint.HasParentBlockWith(block.ID(id))).
				All(ctx)
			if err != nil {
				return nil, fmt.Errorf("failed to query entry points: %w", err)
			}
			for _, entryPoint := range entryPoints {
				if err := client.EntryPoint.DeleteOne(entryPoint).Exec(ctx); err != nil {
					return nil, fmt.Errorf("failed to delete entry point: %w", err)
				}
			}
			exitPoints, err := client.ExitPoint.Query().
				Where(exitpoint.HasParentBlockWith(block.ID(id))).
				All(ctx)
			if err != nil {
				return nil, fmt.Errorf("failed to query exit points: %w", err)
			}
			for _, exitPoint := range exitPoints {
				if err := client.ExitPoint.DeleteOne(exitPoint).Exec(ctx); err != nil {
					return nil, fmt.Errorf("failed to delete exit point: %w", err)
				}
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpDeleteOne)
}

// UpdateDraftChangedForExitHook marks the exit point's draft has changes from the flow
// nolint: dupl
func UpdateDraftChangedForExitHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.ExitPointFunc(func(ctx context.Context, mutation *ent.ExitPointMutation) (ent.Value, error) {
			var (
				draftID int
				err     error
			)
			if mutation.Op().Is(ent.OpCreate) {
				blockID, exists := mutation.ParentBlockID()
				if !exists {
					return nil, fmt.Errorf("parent block id is missing for exit point")
				}
				draftID, _ = mutation.Client().Block.Query().
					Where(block.ID(blockID)).
					QueryFlowDraft().
					OnlyID(ctx)
			} else {
				exitPointID, exists := mutation.ID()
				if !exists {
					return nil, fmt.Errorf("exit point has no id")
				}
				draftID, _ = mutation.Client().ExitPoint.Query().
					Where(exitpoint.ID(exitPointID)).
					QueryParentBlock().
					QueryFlowDraft().
					OnlyID(ctx)
			}

			if draftID != 0 {
				if err = mutation.Client().FlowDraft.UpdateOneID(draftID).
					SetSameAsFlow(false).
					Exec(ctx); err != nil {
					return nil, fmt.Errorf("failed to update sameAsFlow field of flow draft : %w", err)
				}
			}

			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne|ent.OpDeleteOne)
}
