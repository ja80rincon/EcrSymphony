// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent/flow"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestEndBlockInputParams(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, br, ivr := r.Mutation(), r.Block(), r.VariableExpression()

	flowDraft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow",
		EndParamDefinitions: []*flowschema.VariableDefinition{
			{
				Key:  "param1",
				Type: enum.VariableTypeString,
			},
			{
				Key:  "param2",
				Type: enum.VariableTypeInt,
			},
		},
	})
	require.NoError(t, err)
	endBlock, err := mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "good_end",
	})
	require.NoError(t, err)
	inputParams, err := br.InputParamDefinitions(ctx, endBlock)
	require.NoError(t, err)
	require.Len(t, inputParams, 2)
	outputParams, err := br.OutputParamDefinitions(ctx, endBlock)
	require.NoError(t, err)
	require.Empty(t, outputParams)
	endBlock2, err := mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "bad_end",
		Params: []*models.VariableExpressionInput{
			{
				Type:                  enum.VariableDefinition,
				VariableDefinitionKey: refString("param1"),
				Expression:            "\"value\"",
			},
		},
	})
	require.NoError(t, err)

	endDetails, err := br.Details(ctx, endBlock2)
	require.NoError(t, err)
	end, ok := endDetails.(*models.EndBlock)
	require.True(t, ok)
	require.Len(t, end.Params, 1)
	def, err := ivr.VariableDefinition(ctx, end.Params[0])
	require.NoError(t, err)
	require.Equal(t, "param1", def.Key)
	require.Equal(t, "param1", def.Name())
	require.Empty(t, end.Params[0].BlockVariables)
}

func TestStartBlockParamDefinitionsUsed(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, br, bvr := r.Mutation(), r.Block(), r.BlockVariable()

	flowDraft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow",
		EndParamDefinitions: []*flowschema.VariableDefinition{
			{
				Key:  "param1",
				Type: enum.VariableTypeString,
			},
		},
	})
	require.NoError(t, err)
	startBlock, err := mr.AddStartBlock(ctx, flowDraft.ID, models.StartBlockInput{
		Cid: "start",
		ParamDefinitions: []*flowschema.VariableDefinition{
			{
				Key:  "start_param",
				Type: enum.VariableTypeString,
			},
		},
	})
	require.NoError(t, err)
	inputParams, err := br.InputParamDefinitions(ctx, startBlock)
	require.NoError(t, err)
	require.Len(t, inputParams, 1)
	outputParams, err := br.OutputParamDefinitions(ctx, startBlock)
	require.NoError(t, err)
	require.Len(t, outputParams, 1)
	endBlock, err := mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "end",
		Params: []*models.VariableExpressionInput{
			{
				Type:                  enum.VariableDefinition,
				VariableDefinitionKey: refString("param1"),
				Expression:            "${b_0}",
				BlockVariables: []*models.BlockVariableInput{
					{
						Type:                  enum.VariableDefinition,
						BlockCid:              startBlock.Cid,
						VariableDefinitionKey: refString("start_param"),
					},
				},
			},
		},
	})
	require.NoError(t, err)
	require.Len(t, endBlock.InputParams, 1)
	param := endBlock.InputParams[0]
	require.Len(t, param.BlockVariables, 1)
	b, err := bvr.Block(ctx, param.BlockVariables[0])
	require.NoError(t, err)
	require.Equal(t, startBlock.ID, b.ID)
	inputParam, err := bvr.InputVariableDefinition(ctx, param.BlockVariables[0])
	require.NoError(t, err)
	require.EqualValues(t, outputParams[0], inputParam)
}

func TestSubFlowBlockInputParams(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, br, ver := r.Mutation(), r.Block(), r.VariableExpression()

	endParamDefinitions := []*flowschema.VariableDefinition{
		{
			Key:  "end_param1",
			Type: enum.VariableTypeString,
		},
		{
			Key:  "end_param2",
			Type: enum.VariableTypeInt,
		},
	}
	startParamDefinitions := []*flowschema.VariableDefinition{
		{
			Key:  "start_param",
			Type: enum.VariableTypeString,
		},
	}
	draft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name:                "Sub Flow",
		EndParamDefinitions: endParamDefinitions,
	})
	require.NoError(t, err)
	_, err = mr.AddStartBlock(ctx, draft.ID, models.StartBlockInput{
		Cid:              "start",
		ParamDefinitions: startParamDefinitions,
	})
	require.NoError(t, err)
	flw, err := mr.PublishFlow(ctx, models.PublishFlowInput{FlowDraftID: draft.ID, FlowInstancesPolicy: flow.NewInstancesPolicyEnabled})
	require.NoError(t, err)
	flowDraft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow",
	})
	require.NoError(t, err)
	subFlowBlock, err := mr.AddSubflowBlock(ctx, flowDraft.ID, models.SubflowBlockInput{
		Cid:    "sub_flow",
		FlowID: flw.ID,
	})
	require.NoError(t, err)
	inputParams, err := br.InputParamDefinitions(ctx, subFlowBlock)
	require.NoError(t, err)
	require.EqualValues(t, inputParams, startParamDefinitions)
	outputParams, err := br.OutputParamDefinitions(ctx, subFlowBlock)
	require.NoError(t, err)
	require.EqualValues(t, outputParams, endParamDefinitions)
	subFlowBlock2, err := mr.AddSubflowBlock(ctx, flowDraft.ID, models.SubflowBlockInput{
		Cid:    "sub_flow2",
		FlowID: flw.ID,
		Params: []*models.VariableExpressionInput{
			{
				Type:                  enum.VariableDefinition,
				VariableDefinitionKey: refString("start_param"),
				Expression:            "\"Value\"",
			},
		},
	})
	require.NoError(t, err)
	subFlowDetails, err := br.Details(ctx, subFlowBlock2)
	require.NoError(t, err)
	subflow, ok := subFlowDetails.(*models.SubflowBlock)
	require.True(t, ok)
	require.Len(t, subflow.Params, 1)
	def, err := ver.VariableDefinition(ctx, subflow.Params[0])
	require.NoError(t, err)
	require.Equal(t, "start_param", def.Key)
	require.Equal(t, "start_param", def.Name())
	require.Empty(t, subflow.Params[0].BlockVariables)
}
