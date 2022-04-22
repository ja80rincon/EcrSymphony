// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks

import (
	"context"
	"errors"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent/flowinstance"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/blockinstance"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
)

func addUsageToVariableDefinitions(definitions []*flowschema.VariableDefinition, usage enum.VariableUsage) []*flowschema.VariableDefinition {
	var newDefinitions []*flowschema.VariableDefinition
	for _, definition := range definitions {
		definition.Usage = usage
		newDefinitions = append(newDefinitions, definition)
	}
	return newDefinitions
}

// VerifyStartParamDefinitionsHook verifies param definition of start block are correct.
func VerifyStartParamDefinitionsHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockFunc(func(ctx context.Context, mutation *ent.BlockMutation) (ent.Value, error) {
			variableDefinitions, _ := mutation.StartParamDefinitions()
			if err := flowengine.VerifyVariableDefinitions(ctx, variableDefinitions); err != nil {
				return nil, err
			}
			mutation.SetStartParamDefinitions(
				addUsageToVariableDefinitions(variableDefinitions, enum.VariableUsageInputAndOutput),
			)
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.If(
		hk,
		hook.And(
			hook.HasOp(ent.OpCreate|ent.OpUpdateOne),
			hook.HasFields(block.FieldStartParamDefinitions),
		))
}

// UpdateDraftChangedHook marks the block's draft has changes from the flow
func UpdateDraftChangedHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockFunc(func(ctx context.Context, mutation *ent.BlockMutation) (ent.Value, error) {
			var (
				draftID int
				err     error
			)
			if mutation.Op().Is(ent.OpCreate) {
				draftID, _ = mutation.FlowDraftID()
			} else {
				id, exists := mutation.ID()
				if !exists {
					return nil, fmt.Errorf("block has no id")
				}
				draftID, _ = mutation.Client().Block.Query().
					Where(block.ID(id)).
					QueryFlowDraft().
					OnlyID(ctx)
			}

			if draftID != 0 {
				if err = mutation.Client().FlowDraft.UpdateOneID(draftID).
					SetSameAsFlow(false).
					Exec(ctx); err != nil {
					return nil, fmt.Errorf("failed to update flow draft: %w", err)
				}
			}

			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne|ent.OpDeleteOne)
}

func getBlockType(ctx context.Context, mutation *ent.BlockMutation) (*block.Type, error) {
	blockType, exists := mutation.GetType()
	if exists {
		return &blockType, nil
	}
	blockID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block id is missing")
	}
	b, err := mutation.Client().Block.Get(ctx, blockID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch block: %w", err)
	}
	return &b.Type, nil
}

func getBlock(ctx context.Context, mutation *ent.BlockInstanceMutation) (*ent.Block, error) {
	blockID, exists := mutation.BlockID()
	if exists {
		return mutation.Client().Block.Get(ctx, blockID)
	}
	blockInstanceID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block instance id is missing")
	}
	return mutation.Client().Block.Query().
		Where(block.HasInstancesWith(blockinstance.ID(blockInstanceID))).
		Only(ctx)
}

func getFlowEndParamDefinitions(ctx context.Context, mutation *ent.BlockMutation) ([]*flowschema.VariableDefinition, error) {
	client := mutation.Client()
	flowDraftID, flowDraftExists := mutation.FlowDraftID()
	flowID, flowExists := mutation.FlowID()
	flowTemplateID, flowTemplateExists := mutation.FlowTemplateID()
	switch {
	case flowDraftExists:
		draft, err := client.FlowDraft.Get(ctx, flowDraftID)
		if err != nil {
			return nil, err
		}
		return draft.EndParamDefinitions, nil
	case flowExists:
		flw, err := client.Flow.Get(ctx, flowID)
		if err != nil {
			return nil, err
		}
		return flw.EndParamDefinitions, nil
	case flowTemplateExists:
		flowTemplate, err := client.FlowExecutionTemplate.Get(ctx, flowTemplateID)
		if err != nil {
			return nil, err
		}
		return flowTemplate.EndParamDefinitions, nil
	}
	if mutation.Op().Is(ent.OpCreate) {
		return nil, fmt.Errorf("block cannot be created without flow or flow draft")
	}
	blockID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block id is missing")
	}
	blk, err := client.Block.Query().
		Where(block.ID(blockID)).
		WithFlowDraft().
		WithFlow().
		WithFlowTemplate().
		Only(ctx)
	if err != nil {
		return nil, err
	}
	switch {
	case blk.Edges.FlowDraft != nil:
		return blk.Edges.FlowDraft.EndParamDefinitions, nil
	case blk.Edges.Flow != nil:
		return blk.Edges.Flow.EndParamDefinitions, nil
	case blk.Edges.FlowTemplate != nil:
		return blk.Edges.FlowTemplate.EndParamDefinitions, nil
	default:
		return nil, fmt.Errorf("block cannot be created without flow, flow draft or flow template")
	}
}

func (h Flower) getSubFlow(ctx context.Context, mutation *ent.BlockMutation) (*ent.Flow, error) {
	client := mutation.Client()
	subFlowID, exists := mutation.SubFlowID()
	if exists {
		return client.Flow.Get(ctx, subFlowID)
	}
	if mutation.Op().Is(ent.OpCreate) {
		return nil, fmt.Errorf("block created without sub flow")
	}
	blockID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block id is missing")
	}
	return client.Block.Query().
		Where(block.ID(blockID)).
		QuerySubFlow().
		Only(ctx)
}

func (h Flower) getTriggerType(ctx context.Context, mutation *ent.BlockMutation) (triggers.TriggerType, error) {
	client := mutation.Client()
	triggerType, exists := mutation.TriggerType()
	if exists {
		return h.TriggerFactory.GetType(triggerType)
	}
	if mutation.Op().Is(ent.OpCreate) {
		return nil, fmt.Errorf("trigger block created without type")
	}
	blockID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block id is missing")
	}
	triggerBlock, err := client.Block.Get(ctx, blockID)
	if err != nil {
		return nil, err
	}
	if triggerBlock.TriggerType == nil {
		return nil, fmt.Errorf("trigger type is missing. id=%q", blockID)
	}
	return h.TriggerFactory.GetType(*triggerBlock.TriggerType)
}

func (h Flower) getActionType(ctx context.Context, mutation *ent.BlockMutation) (actions.ActionType, error) {
	client := mutation.Client()
	actionType, exists := mutation.ActionType()
	if exists {
		return h.ActionFactory.GetType(actionType)
	}
	if mutation.Op().Is(ent.OpCreate) {
		return nil, fmt.Errorf("action block created without type")
	}
	blockID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block id is missing")
	}
	actionBlock, err := client.Block.Get(ctx, blockID)
	if err != nil {
		return nil, err
	}
	if actionBlock.ActionType == nil {
		return nil, fmt.Errorf("action type is missing. id=%q", blockID)
	}
	return h.ActionFactory.GetType(*actionBlock.ActionType)
}

func (h Flower) getBlockInstanceInputs(ctx context.Context, mutation *ent.BlockInstanceMutation) ([]*flowschema.VariableValue, error) {
	client := mutation.Client()
	inputs, exists := mutation.Inputs()
	if exists || mutation.Op().Is(ent.OpCreate) {
		return inputs, nil
	}
	blockInstanceID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block instance id is missing")
	}
	blockInstance, err := client.BlockInstance.Get(ctx, blockInstanceID)
	if err != nil {
		return nil, err
	}
	return blockInstance.Inputs, nil
}

func (h Flower) getBlockInstanceOutputs(ctx context.Context, mutation *ent.BlockInstanceMutation) ([]*flowschema.VariableValue, error) {
	client := mutation.Client()
	outputs, exists := mutation.Outputs()
	if exists {
		return outputs, nil
	}
	blockInstanceID, exists := mutation.ID()
	if !exists {
		return nil, fmt.Errorf("block instance id is missing")
	}
	blockInstance, err := client.BlockInstance.Get(ctx, blockInstanceID)
	if err != nil {
		return nil, err
	}
	return blockInstance.Outputs, nil
}

// VerifyInputParamsHook verifies input params of block are correct.
func (h Flower) VerifyInputParamsHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockFunc(func(ctx context.Context, mutation *ent.BlockMutation) (ent.Value, error) {
			params, _ := mutation.InputParams()
			blockType, err := getBlockType(ctx, mutation)
			if err != nil {
				return nil, err
			}
			var definitions []*flowschema.VariableDefinition
			switch *blockType {
			case block.TypeEnd:
				endParamDefinitions, err := getFlowEndParamDefinitions(ctx, mutation)
				if err != nil {
					return nil, fmt.Errorf("failed to fetch flow end param definitions: %w", err)
				}
				definitions = endParamDefinitions
			case block.TypeSubFlow:
				subFlow, err := h.getSubFlow(ctx, mutation)
				if err != nil {
					return nil, fmt.Errorf("failed to fetch sub flow: %w", err)
				}
				startBlock, err := subFlow.QueryBlocks().
					Where(block.TypeEQ(block.TypeStart)).
					Only(ctx)
				if err != nil {
					return nil, fmt.Errorf("failed to find start of sub flow: %w", err)
				}
				definitions = startBlock.StartParamDefinitions
			case block.TypeTrigger:
				triggerType, err := h.getTriggerType(ctx, mutation)
				if err != nil {
					return nil, err
				}
				allDefinitions, err := flowengine.FindAllNestedVariables(ctx,
					triggerType.Variables(), params, []enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput})
				if err != nil {
					return nil, fmt.Errorf("failed to extract all definitions: %w", err)
				}
				definitions = allDefinitions
			case block.TypeAction:
				actionType, err := h.getActionType(ctx, mutation)
				if err != nil {
					return nil, err
				}
				allDefinitions, err := flowengine.FindAllNestedVariables(ctx,
					actionType.Variables(), params, []enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput})
				if err != nil {
					return nil, fmt.Errorf("failed to extract all definitions: %w", err)
				}
				definitions = allDefinitions
			}
			if definitions != nil {
				if err := flowengine.VerifyVariableExpressions(ctx, params, definitions); err != nil {
					return nil, err
				}
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.If(
		hk,
		hook.And(
			hook.HasOp(ent.OpCreate|ent.OpUpdateOne),
			hook.HasFields(block.FieldInputParams),
		))
}

// TriggerBlockHook verifies that trigger is of valid trigger type
func (h Flower) TriggerBlockHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockFunc(func(ctx context.Context, m *ent.BlockMutation) (ent.Value, error) {
			blockType, _ := m.GetType()
			if blockType != block.TypeTrigger {
				return next.Mutate(ctx, m)
			}
			triggerType, exists := m.TriggerType()
			if !exists {
				return nil, errors.New("trigger block with no trigger type")
			}
			if _, err := h.TriggerFactory.GetType(triggerType); err != nil {
				return nil, fmt.Errorf("trigger type %s does not exist: %w", triggerType, err)
			}
			inputParams, exists := m.InputParams()
			if exists {
				for _, param := range inputParams {
					if len(param.BlockVariables) != 0 {
						return nil, fmt.Errorf("trigger input param cannot depend on other blocks. key=%s", param.VariableDefinitionKey)
					}
				}
			}
			return next.Mutate(ctx, m)
		})
	}
	return hook.If(
		hk,
		hook.And(
			hook.HasOp(ent.OpCreate),
			hook.HasFields(block.FieldType),
		))
}

// TriggerBlockHook verifies that trigger is of valid action type
func (h Flower) ActionBlockHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockFunc(func(ctx context.Context, m *ent.BlockMutation) (ent.Value, error) {
			blockType, exists := m.GetType()
			if !exists {
				return next.Mutate(ctx, m)
			}
			if blockType != block.TypeAction {
				return next.Mutate(ctx, m)
			}
			actionType, exists := m.ActionType()
			if !exists {
				return nil, errors.New("action block with no action type")
			}
			if _, err := h.ActionFactory.GetType(actionType); err != nil {
				return nil, fmt.Errorf("action type %s does not exist", actionType)
			}
			return next.Mutate(ctx, m)
		})
	}
	return hook.On(hk, ent.OpCreate)
}

// VerifyBlockInstanceInputsHook verifies inputs of block instance are correct.
func (h Flower) VerifyBlockInstanceInputsHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockInstanceFunc(func(ctx context.Context, mutation *ent.BlockInstanceMutation) (ent.Value, error) {
			variables, err := h.getBlockInstanceInputs(ctx, mutation)
			if err != nil {
				return nil, fmt.Errorf("failed to query instance inputs: %w", err)
			}
			b, err := getBlock(ctx, mutation)
			if err != nil {
				return nil, fmt.Errorf("failed to query block: %w", err)
			}
			definitions, err := flowengine.GetInputVariableDefinitions(ctx, b, h.TriggerFactory, h.ActionFactory)
			if err != nil {
				return nil, fmt.Errorf("failed to get input variable definitions: %w", err)
			}
			if err := flowengine.VerifyVariableValues(ctx, variables, definitions); err != nil {
				return nil, err
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne)
}

// VerifyBlockInstanceOutputsHook verifies outputs of block instance are correct.
func (h Flower) VerifyBlockInstanceOutputsHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockInstanceFunc(func(ctx context.Context, mutation *ent.BlockInstanceMutation) (ent.Value, error) {
			if status, _ := mutation.Status(); status != blockinstance.StatusCompleted {
				return next.Mutate(ctx, mutation)
			}
			variables, err := h.getBlockInstanceOutputs(ctx, mutation)
			if err != nil {
				return nil, fmt.Errorf("failed to query instance outputs: %w", err)
			}
			b, err := getBlock(ctx, mutation)
			if err != nil {
				return nil, fmt.Errorf("failed to query block: %w", err)
			}
			definitions, err := flowengine.GetOutputVariableDefinitions(ctx, b, h.TriggerFactory, h.ActionFactory)
			if err != nil {
				return nil, fmt.Errorf("failed to get input variable definitions: %w", err)
			}
			if err := flowengine.VerifyVariableValues(ctx, variables, definitions); err != nil {
				return nil, err
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.If(
		hk,
		hook.And(
			hook.HasOp(ent.OpUpdateOne),
			hook.HasFields(blockinstance.FieldStatus),
		))
}

// UpdateFlowInstanceStatus if the blockInstance status is failed or if is the endBlockInstance is completed
func UpdateFlowInstanceStatus() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.BlockInstanceFunc(func(ctx context.Context, mutation *ent.BlockInstanceMutation) (ent.Value, error) {
			var (
				flowInstanceID int
				err            error
				blockID        int
			)
			status, _ := mutation.Status()
			if mutation.Op().Is(ent.OpCreate) {
				flowInstanceID, _ = mutation.FlowInstanceID()
				blockID, _ = mutation.BlockID()
			} else {
				id, exists := mutation.ID()
				if !exists {
					return nil, fmt.Errorf("blockinstance has no id")
				}
				flowInstanceID, _ = mutation.Client().BlockInstance.Query().
					Where(blockinstance.ID(id)).
					QueryFlowInstance().
					OnlyID(ctx)
				blockID, _ = mutation.Client().BlockInstance.Query().
					Where(blockinstance.ID(id)).
					QueryBlock().
					OnlyID(ctx)
			}

			b := mutation.Client().Block.Query().
				Where(block.ID(blockID)).
				OnlyX(ctx)

			if flowInstanceID != 0 && status == blockinstance.StatusFailed {
				if err = mutation.Client().FlowInstance.UpdateOneID(flowInstanceID).
					SetStatus(flowinstance.StatusFailed).
					Exec(ctx); err != nil {
					return nil, fmt.Errorf("failed to update flow instance: %w", err)
				}
			} else if flowInstanceID != 0 && status == blockinstance.StatusCompleted && block.TypeEnd == b.Type {
				if err = mutation.Client().FlowInstance.UpdateOneID(flowInstanceID).
					SetStatus(flowinstance.StatusCompleted).
					Exec(ctx); err != nil {
					return nil, fmt.Errorf("failed to update flow instance: %w", err)
				}
			}

			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne)
}
