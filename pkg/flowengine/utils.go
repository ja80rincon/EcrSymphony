// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package flowengine

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/entrypoint"
	"github.com/facebookincubator/symphony/pkg/ent/exitpoint"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

func copyConnectors(ctx context.Context, oldToNewEntryPoint map[int]*ent.EntryPoint, oldToNewExitPoint map[int]*ent.ExitPoint) error {
	client := ent.FromContext(ctx)
	for oldExitPointID, exitPoint := range oldToNewExitPoint {
		entryPointIDs, err := client.EntryPoint.Query().
			Where(entrypoint.HasPrevExitPointsWith(exitpoint.ID(oldExitPointID))).
			IDs(ctx)
		if err != nil {
			return fmt.Errorf("failed to query next entry points: %w", err)
		}
		for _, entryPointID := range entryPointIDs {
			newEntryPoint, ok := oldToNewEntryPoint[entryPointID]
			if !ok {
				return fmt.Errorf("failed to find next entry point: id=%v", entryPointID)
			}
			if err := exitPoint.Update().
				AddNextEntryPoints(newEntryPoint).
				Exec(ctx); err != nil {
				return fmt.Errorf("failed to add connector: %w", err)
			}
		}
	}
	return nil
}

func getDefaultEntryPoint(ctx context.Context, blk *ent.Block) (*ent.EntryPoint, error) {
	client := ent.FromContext(ctx)
	entryPoint, err := client.EntryPoint.Query().
		Where(entrypoint.HasParentBlockWith(block.ID(blk.ID))).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get new entry point: %w", err)
	}
	return entryPoint, nil
}

func getOrCreateExitPoint(ctx context.Context, exitPoint *ent.ExitPoint, newBlock *ent.Block) (*ent.ExitPoint, error) {
	client := ent.FromContext(ctx)
	predicates := []predicate.ExitPoint{
		exitpoint.HasParentBlockWith(block.ID(newBlock.ID)),
		exitpoint.RoleEQ(exitPoint.Role),
	}
	if exitPoint.Cid != nil {
		predicates = append(predicates, exitpoint.Cid(*exitPoint.Cid))
	} else {
		predicates = append(predicates, exitpoint.CidIsNil())
	}
	newExitPoint, err := client.ExitPoint.Query().
		Where(predicates...).
		Only(ctx)
	if err != nil {
		if !ent.IsNotFound(err) {
			return nil, fmt.Errorf("failed to get new exit point: %w", err)
		}
		newExitPoint, err = client.ExitPoint.Create().
			SetParentBlock(newBlock).
			SetRole(exitPoint.Role).
			SetNillableCid(exitPoint.Cid).
			Save(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to create new exit point: %w", err)
		}
	}
	return newExitPoint, nil
}

func copyInputParams(ctx context.Context, blk *ent.Block, oldToNewBlock map[int]*ent.Block) error {
	newBlock := oldToNewBlock[blk.ID]
	var newInputParams []*flowschema.VariableExpression
	for _, param := range blk.InputParams {
		newParam := &flowschema.VariableExpression{
			BlockID:               newBlock.ID,
			Type:                  param.Type,
			VariableDefinitionKey: param.VariableDefinitionKey,
			PropertyTypeID:        param.PropertyTypeID,
			Expression:            param.Expression,
		}
		for _, blockVariable := range param.BlockVariables {
			newBlockRef, ok := oldToNewBlock[blockVariable.BlockID]
			if !ok {
				return fmt.Errorf("failed to create find block ref: %v", blockVariable.BlockID)
			}
			newBlockVariable := &flowschema.BlockVariable{
				BlockID:                   newBlockRef.ID,
				Type:                      blockVariable.Type,
				VariableDefinitionKey:     blockVariable.VariableDefinitionKey,
				PropertyTypeID:            blockVariable.PropertyTypeID,
				CheckListItemDefinitionID: blockVariable.CheckListItemDefinitionID,
			}
			newParam.BlockVariables = append(newParam.BlockVariables, newBlockVariable)
		}
		newInputParams = append(newInputParams, newParam)
	}
	if err := newBlock.Update().
		SetInputParams(newInputParams).
		Exec(ctx); err != nil {
		return fmt.Errorf("failed to copy input params to copied block: %w", err)
	}
	return nil
}

// CopyBlocks copies all blocks from blockQuery and add them to flow via callback
func CopyBlocks(ctx context.Context, blocksQuery *ent.BlockQuery, addToFlow func(b *ent.BlockCreate)) error {
	client := ent.FromContext(ctx)
	blocks, err := blocksQuery.
		WithSubFlow().
		WithGotoBlock().
		WithEntryPoint().
		WithExitPoints().
		All(ctx)
	if err != nil {
		return fmt.Errorf("failed to fetch flow blocks: %w", err)
	}
	oldToNewBlock := make(map[int]*ent.Block, len(blocks))
	oldToNewEntryPoint := make(map[int]*ent.EntryPoint)
	oldToNewExitPoint := make(map[int]*ent.ExitPoint)
	for _, blk := range blocks {
		blockCreate := client.Block.Create().
			SetCid(blk.Cid).
			SetType(blk.Type).
			SetStartParamDefinitions(blk.StartParamDefinitions).
			SetNillableTriggerType(blk.TriggerType).
			SetNillableActionType(blk.ActionType).
			SetUIRepresentation(blk.UIRepresentation)
		addToFlow(blockCreate)
		if blk.Edges.SubFlow != nil {
			blockCreate.SetSubFlow(blk.Edges.SubFlow)
		}
		newBlock, err := blockCreate.Save(ctx)
		if err != nil {
			return fmt.Errorf("failed to create new block: %w", err)
		}
		oldToNewBlock[blk.ID] = newBlock
		if blk.Edges.EntryPoint != nil {
			entryPoint := blk.Edges.EntryPoint
			newEntryPoint, err := getDefaultEntryPoint(ctx, newBlock)
			if err != nil {
				return err
			}
			oldToNewEntryPoint[entryPoint.ID] = newEntryPoint
		}
		for _, exitPoint := range blk.Edges.ExitPoints {
			newExitPoint, err := getOrCreateExitPoint(ctx, exitPoint, newBlock)
			if err != nil {
				return err
			}
			oldToNewExitPoint[exitPoint.ID] = newExitPoint
		}
	}
	if err := copyConnectors(ctx, oldToNewEntryPoint, oldToNewExitPoint); err != nil {
		return err
	}
	for _, blk := range blocks {
		newBlock := oldToNewBlock[blk.ID]
		switch newBlock.Type {
		case block.TypeEnd, block.TypeDecision, block.TypeSubFlow, block.TypeTrigger, block.TypeAction, block.TypeTrueFalse:
			if err := copyInputParams(ctx, blk, oldToNewBlock); err != nil {
				return err
			}
		case block.TypeGoTo:
			newGotoBlock, ok := oldToNewBlock[blk.Edges.GotoBlock.ID]
			if !ok {
				return fmt.Errorf("failed to find goto block: %v", blk.Edges.GotoBlock.ID)
			}
			if err := newBlock.Update().
				SetGotoBlock(newGotoBlock).
				Exec(ctx); err != nil {
				return fmt.Errorf("failed to update goto block: %w", err)
			}
		}
	}
	return nil
}
