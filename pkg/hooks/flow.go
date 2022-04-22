// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks

import (
	"context"
	"errors"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/flow"
	"github.com/facebookincubator/symphony/pkg/ent/flowdraft"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
)

// Flower validates various parts of flow
type Flower struct {
	TriggerFactory triggers.Factory
	ActionFactory  actions.Factory
}

// HookTo returns add to ent client hooks to validate flow creation.
func (h *Flower) HookTo(client *ent.Client) {
	client.Flow.Use(h.MandatoryInputsOfBlocksExistHook())
	client.Block.Use(
		h.VerifyInputParamsHook(),
		h.TriggerBlockHook(),
		h.ActionBlockHook(),
	)
	/* client.BlockInstance.Use(
		h.VerifyBlockInstanceInputsHook(),
		h.VerifyBlockInstanceOutputsHook(),
	)*/
}

func (h Flower) mandatoryVariablesOnBlocks(ctx context.Context, client *ent.Client, flowID int) error {
	blocks, err := client.Flow.Query().
		Where(flow.ID(flowID)).
		QueryBlocks().
		Where(block.TypeNEQ(block.TypeStart)).
		All(ctx)
	if err != nil {
		return fmt.Errorf("failed to query blocks: %w", err)
	}
	for _, blk := range blocks {
		varDefinitions, err := flowengine.GetInputVariableDefinitions(ctx, blk, h.TriggerFactory, h.ActionFactory)
		if err != nil {
			return err
		}
		if err := flowengine.VerifyMandatoryVariableExpressions(ctx, blk.InputParams, varDefinitions); err != nil {
			return err
		}
	}
	return nil
}

// MandatoryInputsOfBlocksExistHook verifies that blocks of flow have expressions for their mandatory variables
func (h Flower) MandatoryInputsOfBlocksExistHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.FlowFunc(func(ctx context.Context, m *ent.FlowMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, m)
			if err != nil {
				return nil, err
			}
			resultFlow, ok := value.(*ent.Flow)
			if !ok {
				return nil, fmt.Errorf("result of flow mutation is not found")
			}
			tx := ent.TxFromContext(ctx)
			if tx == nil {
				if err := h.mandatoryVariablesOnBlocks(ctx, m.Client(), resultFlow.ID); err != nil {
					return nil, fmt.Errorf("mandatory variables in flow are missing: %w", err)
				}
			} else {
				tx.OnCommit(func(next ent.Committer) ent.Committer {
					return ent.CommitFunc(func(ctx context.Context, tx *ent.Tx) error {
						if err := h.mandatoryVariablesOnBlocks(ctx, tx.Client(), resultFlow.ID); err != nil {
							return rollbackAndErr(
								tx, fmt.Errorf("mandatory variables in flow are missing: %w", err))
						}
						return next.Commit(ctx, tx)
					})
				})
			}
			return value, nil
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne)
}

// VerifyEndParamDefinitionsHook verifies end param definition of flow mixin are correct.
func VerifyEndParamDefinitionsHook() ent.Hook {
	type GetSetEndParamDefinitions interface {
		EndParamDefinitions() ([]*flowschema.VariableDefinition, bool)
		SetEndParamDefinitions([]*flowschema.VariableDefinition)
	}
	hk := func(next ent.Mutator) ent.Mutator {
		return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
			getterSetter, ok := m.(GetSetEndParamDefinitions)
			if !ok {
				return next.Mutate(ctx, m)
			}
			variableDefinitions, exists := getterSetter.EndParamDefinitions()
			if !exists {
				return next.Mutate(ctx, m)
			}
			if err := flowengine.VerifyVariableDefinitions(ctx, variableDefinitions); err != nil {
				return nil, err
			}
			getterSetter.SetEndParamDefinitions(
				addUsageToVariableDefinitions(variableDefinitions, enum.VariableUsageInputAndOutput),
			)
			return next.Mutate(ctx, m)
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne)
}

// UpdateSameAsFlowOnDraftChangeHook sets SetSameAsFlow to false upon draft change
func UpdateSameAsFlowOnDraftChangeHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.FlowDraftFunc(func(ctx context.Context, m *ent.FlowDraftMutation) (ent.Value, error) {
			m.SetSameAsFlow(false)
			return next.Mutate(ctx, m)
		})
	}
	return hook.If(hk,
		hook.And(
			hook.Not(hook.HasFields(flowdraft.FieldSameAsFlow)),
			hook.HasOp(ent.OpUpdateOne),
		),
	)
}

// DenyCreationOfInstanceOfDisabledFlowHook denied creation of flow instance based on flow status
func DenyCreationOfInstanceOfDisabledFlowHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.FlowInstanceFunc(func(ctx context.Context, m *ent.FlowInstanceMutation) (ent.Value, error) {
			client := m.Client()
			flowID, exists := m.FlowID()
			if !exists {
				return nil, errors.New("flow instance must have flow on creation")
			}
			f, err := client.Flow.Get(ctx, flowID)
			if err != nil {
				return nil, fmt.Errorf("failed to query flow: %w", err)
			}
			if f.NewInstancesPolicy != flow.NewInstancesPolicyEnabled {
				return nil, errors.New("cannot create flow instance while new instances policy not enabled")
			}
			if f.Status != flow.StatusPublished {
				return nil, errors.New("cannot create flow instance of a not published flow")
			}
			return next.Mutate(ctx, m)
		})
	}
	return hook.On(hk, ent.OpCreate)
}

// CopyFlowToFlowExecutionTemplateHook copies on instance creation the flow to flow template and link the instance to it
func CopyFlowToFlowExecutionTemplateHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.FlowInstanceFunc(func(ctx context.Context, m *ent.FlowInstanceMutation) (ent.Value, error) {
			client := m.Client()
			flowID, exists := m.FlowID()
			if !exists {
				return nil, errors.New("flow instance must have flow on creation")
			}
			f, err := client.Flow.Get(ctx, flowID)
			if err != nil {
				return nil, fmt.Errorf("failed to query flow: %w", err)
			}
			flowExecutionTemplate, err := client.FlowExecutionTemplate.Create().
				SetName(f.Name).
				SetNillableDescription(f.Description).
				SetEndParamDefinitions(f.EndParamDefinitions).
				Save(ctx)
			if err != nil {
				return nil, fmt.Errorf("failed to create flow execution template: %w", err)
			}
			blockQuery := client.Block.Query().
				Where(block.HasFlowWith(flow.ID(flowID)))
			setFlowDraft := func(b *ent.BlockCreate) {
				b.SetFlowTemplate(flowExecutionTemplate)
			}
			if err := flowengine.CopyBlocks(ctx, blockQuery, setFlowDraft); err != nil {
				return nil, err
			}
			m.SetTemplateID(flowExecutionTemplate.ID)
			return next.Mutate(ctx, m)
		})
	}
	return hook.On(hk, ent.OpCreate)
}
