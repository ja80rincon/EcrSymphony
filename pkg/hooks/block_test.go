// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks_test

import (
	"context"
	"strconv"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"

	//	"github.com/facebookincubator/symphony/pkg/ent/blockinstance"
	"github.com/facebookincubator/symphony/pkg/ent/flow"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
	"github.com/facebookincubator/symphony/pkg/hooks"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func getExpressions(key string, value string) []*flowschema.VariableExpression {
	return []*flowschema.VariableExpression{
		{
			Type:                  enum.VariableDefinition,
			VariableDefinitionKey: key,
			Expression:            value,
		},
	}
}

func TestEndParamsVerifications(t *testing.T) {
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), c)
	client := ent.FromContext(ctx)
	flowHooker := hooks.Flower{
		TriggerFactory: triggers.NewFactory(),
		ActionFactory:  actions.NewFactory(),
	}
	flowHooker.HookTo(client)
	v := viewer.FromContext(ctx)
	u := v.(*viewer.UserViewer).User()

	wot1, err := client.WorkOrderType.Create().
		SetName("WOT1").
		Save(ctx)
	require.NoError(t, err)
	wot2, err := client.WorkOrderType.Create().
		SetName("WOT2").
		Save(ctx)
	require.NoError(t, err)
	wot3, err := client.WorkOrderType.Create().
		SetName("WOT3").
		Save(ctx)
	require.NoError(t, err)
	wo, err := client.WorkOrder.Create().
		SetName("WO").
		SetType(wot3).
		SetOwner(u).
		SetCreationDate(time.Now()).
		Save(ctx)
	require.NoError(t, err)

	param1 := "String Parameter"
	param2 := "String List Parameter"
	param3 := "String Parameter With Multiple Choice"
	param4 := "String List Parameter With Multiple Choice"
	param5 := "Int Parameter"
	param6 := "Work Order Parameter"
	param7 := "Work Order Type Parameter"
	flowItem, err := client.Flow.Create().
		SetName("Name").
		Save(ctx)
	require.NoError(t, err)
	flowDraft, err := client.FlowDraft.Create().
		SetName("Name").
		SetFlow(flowItem).
		SetEndParamDefinitions([]*flowschema.VariableDefinition{
			{
				Key:  param1,
				Type: enum.VariableTypeString,
			},
			{
				Key:            param2,
				Type:           enum.VariableTypeString,
				MultipleValues: true,
			},
			{
				Key:     param3,
				Type:    enum.VariableTypeString,
				Choices: []string{"\"First\"", "\"Second\"", "\"Third\""},
			},
			{
				Key:            param4,
				Type:           enum.VariableTypeString,
				MultipleValues: true,
				Choices:        []string{"\"First\"", "\"Second\"", "\"Third\""},
			},
			{
				Key:  param5,
				Type: enum.VariableTypeInt,
			},
			{
				Key:  param6,
				Type: enum.VariableTypeWorkOrder,
			},
			{
				Key:     param7,
				Type:    enum.VariableTypeWorkOrderType,
				Choices: []string{strconv.Itoa(wot1.ID), strconv.Itoa(wot2.ID)},
			},
		}).
		Save(ctx)
	require.NoError(t, err)

	tests := []struct {
		name       string
		inputs     []*flowschema.VariableExpression
		expectFail bool
	}{
		{
			name:       "string_match",
			inputs:     getExpressions(param1, "\"Check\""),
			expectFail: false,
		},
		{
			name:       "key_not_exists",
			inputs:     getExpressions("not_exists", "23"),
			expectFail: true,
		},
		{
			name: "duplicate_key",
			inputs: []*flowschema.VariableExpression{
				{
					VariableDefinitionKey: param1,
					Expression:            "\"Check1\"",
				},
				{
					VariableDefinitionKey: param1,
					Expression:            "\"Check2\"",
				},
			},
			expectFail: true,
		},
		{
			name: "two_types",
			inputs: []*flowschema.VariableExpression{
				{
					VariableDefinitionKey: param1,
					Expression:            "\"Check1\"",
				},
				{
					VariableDefinitionKey: param5,
					Expression:            "42",
				},
			},
			expectFail: false,
		},
		{
			name:       "single_for_list",
			inputs:     getExpressions(param2, "\"Check\""),
			expectFail: true,
		},
		{
			name:       "list_for_list",
			inputs:     getExpressions(param2, "[\"Check\"]"),
			expectFail: false,
		},
		{
			name:       "choice_not_exists",
			inputs:     getExpressions(param3, "\"First1\""),
			expectFail: true,
		},
		{
			name:       "choice_exists",
			inputs:     getExpressions(param3, "First"),
			expectFail: false,
		},
		{
			name:       "not_all_choice_exists",
			inputs:     getExpressions(param4, "[\"First\", \"Forth\"]"),
			expectFail: true,
		},
		{
			name:       "all_choices_exists",
			inputs:     getExpressions(param4, "[\"First\", \"Second\"]"),
			expectFail: false,
		},
		{
			name:       "valid_work_order",
			inputs:     getExpressions(param6, strconv.Itoa(wo.ID)),
			expectFail: false,
		},
		{
			name:       "invalid_work_order",
			inputs:     getExpressions(param6, "2345"),
			expectFail: true,
		},
		{
			name:       "valid_work_order_type",
			inputs:     getExpressions(param7, strconv.Itoa(wot1.ID)),
			expectFail: false,
		},
		{
			name:       "work_order_type_not_in_choices",
			inputs:     getExpressions(param7, strconv.Itoa(wot3.ID)),
			expectFail: true,
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			var inputs []*flowschema.VariableExpression
			b, err := client.Block.Create().
				SetFlowDraft(flowDraft).
				SetType(block.TypeEnd).
				SetCid(strconv.Itoa(i)).
				Save(ctx)
			require.NoError(t, err)
			for _, input := range tc.inputs {
				input.Type = enum.VariableDefinition
				input.BlockID = b.ID
				inputs = append(inputs, input)
			}
			err = b.Update().
				SetInputParams(inputs).
				Exec(ctx)
			require.Equal(t, tc.expectFail, err != nil)
		})
	}
}

func createFlowWithStartBlock(ctx context.Context, t *testing.T, definitions []*flowschema.VariableDefinition) *ent.Flow {
	client := ent.FromContext(ctx)
	flow, err := client.Flow.Create().
		SetName("Name").
		SetNewInstancesPolicy(flow.NewInstancesPolicyEnabled).
		SetStatus(flow.StatusPublished).
		Save(ctx)
	require.NoError(t, err)
	_, err = client.Block.Create().
		SetType(block.TypeStart).
		SetCid("start").
		SetFlow(flow).
		SetStartParamDefinitions(definitions).
		Save(ctx)
	require.NoError(t, err)
	return flow
}

func TestSimpleSubFlowParamsVerifications(t *testing.T) {
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), c)
	client := ent.FromContext(ctx)
	flowHooker := hooks.Flower{
		TriggerFactory: triggers.NewFactory(),
		ActionFactory:  actions.NewFactory(),
	}
	flowHooker.HookTo(client)
	subFlow := createFlowWithStartBlock(ctx, t, []*flowschema.VariableDefinition{
		{
			Key:  "start1",
			Type: enum.VariableTypeString,
		},
	})

	flowItem, err := client.Flow.Create().
		SetName("Flow1").
		Save(ctx)
	require.NoError(t, err)
	flowDraft, err := client.FlowDraft.Create().
		SetName("Flow1").
		SetFlow(flowItem).
		Save(ctx)
	require.NoError(t, err)

	tests := []struct {
		name       string
		inputs     []*flowschema.VariableExpression
		expectFail bool
	}{
		{
			name: "key_match",
			inputs: []*flowschema.VariableExpression{
				{
					Type:                  enum.VariableDefinition,
					VariableDefinitionKey: "start1",
					Expression:            "\"Check\"",
				},
			},
			expectFail: false,
		},
		{
			name: "key_not_match",
			inputs: []*flowschema.VariableExpression{
				{
					Type:                  enum.VariableDefinition,
					VariableDefinitionKey: "start2",
					Expression:            "\"Check\"",
				},
			},
			expectFail: true,
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			var inputs []*flowschema.VariableExpression
			b, err := client.Block.Create().
				SetFlowDraft(flowDraft).
				SetType(block.TypeSubFlow).
				SetSubFlow(subFlow).
				SetCid(strconv.Itoa(i)).
				Save(ctx)
			require.NoError(t, err)
			for _, input := range tc.inputs {
				input.BlockID = b.ID
				inputs = append(inputs, input)
			}
			err = b.Update().
				SetInputParams(inputs).
				Exec(ctx)
			if tc.expectFail {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
			}
		})
	}
}

/*
func TestInstanceParamsVerifications(t *testing.T) {
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), c)
	client := ent.FromContext(ctx)
	flowHooker := hooks.Flower{
		TriggerFactory: triggers.NewFactory(),
		ActionFactory:  actions.NewFactory(),
	}
	flowHooker.HookTo(client)
	flowItem := createFlowWithStartBlock(ctx, t, []*flowschema.VariableDefinition{
		{
			Key:       "start1",
			Type:      enum.VariableTypeString,
			Mandatory: true,
		},
		{
			Key:            "start2",
			Type:           enum.VariableTypeInt,
			MultipleValues: true,
		},
		{
			Key:     "start3",
			Type:    enum.VariableTypeString,
			Choices: []string{"\"A\"", "\"B\"", "\"C\""},
		},
	})
	flowInstance, err := client.FlowInstance.Create().
		SetFlow(flowItem).
		Save(ctx)
	require.NoError(t, err)
	blockStart, err := flowInstance.QueryTemplate().
		QueryBlocks().
		Where(block.TypeEQ(block.TypeStart)).
		Only(ctx)
	require.NoError(t, err)
	_, err = client.BlockInstance.Create().
		SetBlock(blockStart).
		SetFlowInstance(flowInstance).
		Save(ctx)
	require.Error(t, err)
	mandatoryProp := &flowschema.VariableValue{
		VariableDefinitionKey: "start1",
		Value:                 "\"value\"",
	}
	_, err = client.BlockInstance.Create().
		SetBlock(blockStart).
		SetFlowInstance(flowInstance).
		SetInputs([]*flowschema.VariableValue{mandatoryProp}).
		Save(ctx)
	require.NoError(t, err)
	_, err = client.BlockInstance.Create().
		SetBlock(blockStart).
		SetFlowInstance(flowInstance).
		SetInputs([]*flowschema.VariableValue{
			mandatoryProp,
			{
				VariableDefinitionKey: "Start2",
				Value:                 "[1, 2, 3]",
			},
		}).
		Save(ctx)
	require.Error(t, err)
	_, err = client.BlockInstance.Create().
		SetBlock(blockStart).
		SetFlowInstance(flowInstance).
		SetInputs([]*flowschema.VariableValue{
			mandatoryProp,
			{
				VariableDefinitionKey: "start2",
				Value:                 "[1, 2, 3]",
			},
		}).
		Save(ctx)
	require.NoError(t, err)
	_, err = client.BlockInstance.Create().
		SetBlock(blockStart).
		SetFlowInstance(flowInstance).
		SetInputs([]*flowschema.VariableValue{
			mandatoryProp,
			{
				VariableDefinitionKey: "start3",
				Value:                 "\"D\"",
			},
		}).
		Save(ctx)
	require.Error(t, err)
	bInstance, err := client.BlockInstance.Create().
		SetBlock(blockStart).
		SetFlowInstance(flowInstance).
		SetInputs([]*flowschema.VariableValue{
			mandatoryProp,
			{
				VariableDefinitionKey: "start3",
				Value:                 "\"C\"",
			},
		}).
		Save(ctx)
	require.NoError(t, err)

	err = bInstance.Update().
		SetStatus(blockinstance.StatusCompleted).
		Exec(ctx)
	require.Error(t, err)
	err = bInstance.Update().
		SetStatus(blockinstance.StatusCompleted).
		SetOutputs([]*flowschema.VariableValue{mandatoryProp}).
		Exec(ctx)
	require.NoError(t, err)
}
*/
