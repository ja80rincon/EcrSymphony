// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"errors"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	action_mocks "github.com/facebookincubator/symphony/pkg/flowengine/actions/mocks"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	trigger_mocks "github.com/facebookincubator/symphony/pkg/flowengine/triggers/mocks"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestAddDeleteBlocksOfFlowDraft(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, br := r.Mutation(), r.Block()
	flowDraft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow Name",
	})
	require.NoError(t, err)
	blocks, err := flowDraft.QueryBlocks().All(ctx)
	require.NoError(t, err)
	require.Empty(t, blocks)

	sb, err := mr.AddStartBlock(ctx, flowDraft.ID, models.StartBlockInput{
		Cid: "start",
	})
	require.NoError(t, err)
	require.Equal(t, block.TypeStart, sb.Type)
	require.Equal(t, "start", sb.Cid)
	blockFlowID, err := sb.QueryFlowDraft().OnlyID(ctx)
	require.NoError(t, err)
	require.Equal(t, flowDraft.ID, blockFlowID)
	blockType, err := br.Details(ctx, sb)
	require.NoError(t, err)
	_, ok := blockType.(*models.StartBlock)
	require.True(t, ok)

	eb, err := mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "success",
	})
	require.NoError(t, err)
	require.Equal(t, block.TypeEnd, eb.Type)
	require.Equal(t, "success", eb.Cid)
	blockFlowID, err = eb.QueryFlowDraft().OnlyID(ctx)
	require.NoError(t, err)
	require.Equal(t, flowDraft.ID, blockFlowID)
	blockType, err = br.Details(ctx, eb)
	require.NoError(t, err)
	_, ok = blockType.(*models.EndBlock)
	require.True(t, ok)

	blocks, err = flowDraft.QueryBlocks().All(ctx)
	require.NoError(t, err)
	require.Len(t, blocks, 2)
	_, err = mr.DeleteBlock(ctx, eb.ID)
	require.NoError(t, err)
	blocks, err = flowDraft.QueryBlocks().All(ctx)
	require.NoError(t, err)
	require.Len(t, blocks, 1)

	require.Zero(t, sb.UIRepresentation)
	xPosition := 201
	yPosition := 21
	sb, err = mr.EditBlock(ctx, models.EditBlockInput{
		ID: sb.ID,
		UIRepresentation: &flowschema.BlockUIRepresentation{
			Name:      "NewStart",
			XPosition: xPosition,
			YPosition: yPosition,
		},
	})
	require.NoError(t, err)
	require.Equal(t, "NewStart", sb.UIRepresentation.Name)
	require.Equal(t, xPosition, sb.UIRepresentation.XPosition)
	require.Equal(t, yPosition, sb.UIRepresentation.YPosition)
}

func TestAddDeleteConnectors(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, br, fdr := r.Mutation(), r.Block(), r.FlowDraft()
	flowDraft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow Name",
	})
	require.NoError(t, err)
	startBlock, err := mr.AddStartBlock(ctx, flowDraft.ID, models.StartBlockInput{
		Cid: "start",
	})
	require.NoError(t, err)
	endBlock, err := mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "end",
	})
	require.NoError(t, err)
	endBlock2, err := mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "end2",
	})
	require.NoError(t, err)
	connector, err := mr.AddConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: startBlock.Cid,
		TargetBlockCid: endBlock.Cid,
	})
	require.NoError(t, err)
	sourceBlock, err := connector.Source.QueryParentBlock().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, startBlock.ID, sourceBlock.ID)
	_, err = mr.AddConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: startBlock.Cid,
		TargetBlockCid: endBlock.Cid,
	})
	require.Error(t, err)
	_, err = mr.AddConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: startBlock.Cid,
		TargetBlockCid: endBlock2.Cid,
	})
	require.NoError(t, err)

	blocks, err := br.NextBlocks(ctx, startBlock)
	require.NoError(t, err)
	require.Len(t, blocks, 2)
	require.EqualValues(t, []int{blocks[0].ID, blocks[1].ID}, []int{endBlock.ID, endBlock2.ID})
	blocks, err = br.PrevBlocks(ctx, startBlock)
	require.NoError(t, err)
	require.Empty(t, blocks)
	blocks, err = br.NextBlocks(ctx, endBlock)
	require.NoError(t, err)
	require.Empty(t, blocks)
	blocks, err = br.PrevBlocks(ctx, endBlock)
	require.NoError(t, err)
	require.Len(t, blocks, 1)
	require.Equal(t, blocks[0].ID, startBlock.ID)

	connectors, err := fdr.Connectors(ctx, flowDraft)
	require.NoError(t, err)
	require.Len(t, connectors, 2)

	_, err = mr.DeleteConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: endBlock.Cid,
		TargetBlockCid: startBlock.Cid,
	})
	require.Error(t, err)
	_, err = mr.DeleteConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: startBlock.Cid,
		TargetBlockCid: endBlock.Cid,
	})
	require.NoError(t, err)
	_, err = mr.DeleteConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: startBlock.Cid,
		TargetBlockCid: endBlock.Cid,
	})
	require.Error(t, err)
	blocks, err = br.NextBlocks(ctx, startBlock)
	require.NoError(t, err)
	require.Len(t, blocks, 1)
}

func TestGotoBlock(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, br := r.Mutation(), r.Block()
	flowDraft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow Name",
	})
	require.NoError(t, err)
	endBlock, err := mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "end",
	})
	require.NoError(t, err)

	b, err := mr.AddGotoBlock(ctx, flowDraft.ID, models.GotoBlockInput{
		Cid:            "goto_end",
		TargetBlockCid: pointer.ToString(endBlock.Cid),
	})
	require.NoError(t, err)
	details, err := br.Details(ctx, b)
	require.NoError(t, err)
	goTo, ok := details.(*models.GotoBlock)
	require.True(t, ok)
	require.Equal(t, endBlock.ID, goTo.Target.ID)
	require.Equal(t, flowschema.EntryPointRoleDefault, goTo.EntryPoint.Role)
}

func TestTriggerBlockNotExists(t *testing.T) {
	triggerFactory := trigger_mocks.Factory{}
	r := newTestResolver(t, withTriggerFactory(&triggerFactory))
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	draft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow",
	})
	require.NoError(t, err)
	triggerFactory.On("GetType", mock.Anything).
		Return(nil, errors.New("not found")).
		Once()
	_, err = mr.AddTriggerBlock(ctx, draft.ID, models.TriggerBlockInput{
		Cid:         "trigger_block",
		TriggerType: flowschema.TriggerTypeWorkOrder,
	})
	require.Error(t, err)

	triggerType := trigger_mocks.TriggerType{}
	description := "Some desc"
	triggerType.On("Description").
		Return(description)
	triggerType.On("Variables").
		Return([]*flowschema.VariableDefinition{})
	triggerFactory.On("GetType", mock.Anything).
		Return(&triggerType, nil).
		Times(4)
	_, err = mr.AddTriggerBlock(ctx, draft.ID, models.TriggerBlockInput{
		Cid:         "trigger_block",
		TriggerType: "Invalid",
	})
	require.Error(t, err)
	triggerBlock, err := mr.AddTriggerBlock(ctx, draft.ID, models.TriggerBlockInput{
		Cid:         "trigger_block",
		TriggerType: flowschema.TriggerTypeWorkOrder,
	})
	require.NoError(t, err)
	require.Equal(t, "trigger_block", triggerBlock.Cid)

	br := r.Block()
	details, err := br.Details(ctx, triggerBlock)
	require.NoError(t, err)
	trigger, ok := details.(*models.TriggerBlock)
	require.True(t, ok)
	require.Equal(t, description, trigger.TriggerType.Description())
	require.Equal(t, flowschema.ExitPointRoleDefault, trigger.ExitPoint.Role)
	triggerFactory.On("GetType", mock.Anything).
		Return(nil, errors.New("not found")).
		Once()
	_, err = br.Details(ctx, triggerBlock)
	require.Error(t, err)
}

func TestActionBlockNotExists(t *testing.T) {
	actionFactory := action_mocks.Factory{}
	r := newTestResolver(t, withActionFactory(&actionFactory))
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, br := r.Mutation(), r.Block()
	draft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow",
	})
	require.NoError(t, err)
	actionFactory.On("GetType", mock.Anything).
		Return(nil, errors.New("not found")).
		Once()
	_, err = mr.AddActionBlock(ctx, draft.ID, models.ActionBlockInput{
		Cid:        "action_block",
		ActionType: flowschema.ActionTypeWorkOrder,
	})
	require.Error(t, err)

	description := "Some desc"
	actionType := action_mocks.ActionType{}
	actionType.On("Description").
		Return(description)
	actionType.On("Variables").
		Return([]*flowschema.VariableDefinition{})
	actionFactory.On("GetType", mock.Anything).
		Return(&actionType, nil).
		Times(3)
	actionBlock, err := mr.AddActionBlock(ctx, draft.ID, models.ActionBlockInput{
		Cid:        "action_block",
		ActionType: flowschema.ActionTypeWorkOrder,
	})
	require.NoError(t, err)
	require.Equal(t, "action_block", actionBlock.Cid)
	details, err := br.Details(ctx, actionBlock)
	require.NoError(t, err)
	action, ok := details.(*models.ActionBlock)
	require.True(t, ok)
	require.Equal(t, description, action.ActionType.Description())
	require.Equal(t, flowschema.ExitPointRoleDefault, action.ExitPoint.Role)
	require.Equal(t, flowschema.EntryPointRoleDefault, action.EntryPoint.Role)
	actionFactory.On("GetType", mock.Anything).
		Return(nil, errors.New("not found")).
		Once()
	_, err = br.Details(ctx, actionBlock)
	require.Error(t, err)
}

func TestDecisionBlock(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, br, fdr := r.Mutation(), r.Block(), r.FlowDraft()
	flowDraft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow Name",
	})
	require.NoError(t, err)
	_, err = mr.AddStartBlock(ctx, flowDraft.ID, models.StartBlockInput{
		Cid: "start",
	})
	require.NoError(t, err)
	_, err = mr.AddEndBlock(ctx, flowDraft.ID, models.EndBlockInput{
		Cid: "end",
	})
	require.NoError(t, err)

	condition1 := models.VariableExpressionInput{
		Type:       enum.DecisionDefinition,
		Expression: "${b_0}",
		BlockVariables: []*models.BlockVariableInput{
			{
				Type:                  enum.VariableDefinition,
				BlockCid:              "start",
				VariableDefinitionKey: refString("param"),
			},
		},
	}

	decisionBlock, err := mr.AddDecisionBlock(ctx, flowDraft.ID, models.DecisionBlockInput{
		Cid: "decision",
		Routes: []*models.DecisionRouteInput{
			{
				Cid:       pointer.ToString("option1"),
				Condition: &condition1,
			},
			{
				Cid:       pointer.ToString("option2"),
				Condition: &condition1,
			},
			{
				Cid:       pointer.ToString("option3"),
				Condition: &condition1,
			},
		},
	})
	require.NoError(t, err)

	details, err := br.Details(ctx, decisionBlock)
	require.NoError(t, err)
	decision, ok := details.(*models.DecisionBlock)
	require.True(t, ok)
	require.Equal(t, flowschema.ExitPointRoleDefault, decision.DefaultExitPoint.Role)
	require.Nil(t, decision.DefaultExitPoint.Cid)
	require.Len(t, decision.Routes, 3)
	for _, route := range decision.Routes {
		require.Equal(t, flowschema.ExitPointRoleDecision, route.ExitPoint.Role)
		require.NotNil(t, route.ExitPoint.Cid)
	}

	defaultRole := flowschema.ExitPointRoleDefault
	_, err = mr.AddConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: "decision",
		SourcePoint: &models.ExitPointInput{
			Role: &defaultRole,
		},
		TargetBlockCid: "start",
	})
	require.Error(t, err)
	_, err = mr.AddConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: "decision",
		SourcePoint: &models.ExitPointInput{
			Role: &defaultRole,
		},
		TargetBlockCid: "end",
	})
	require.NoError(t, err)
	_, err = mr.AddConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: "decision",
		SourcePoint: &models.ExitPointInput{
			Cid: pointer.ToString("option1"),
		},
		TargetBlockCid: "end",
	})
	require.NoError(t, err)
	_, err = mr.AddConnector(ctx, flowDraft.ID, models.ConnectorInput{
		SourceBlockCid: "decision",
		SourcePoint: &models.ExitPointInput{
			Role: &defaultRole,
			Cid:  pointer.ToString("option2"),
		},
		TargetBlockCid: "end",
	})
	require.Error(t, err)

	nextBlocks, err := br.NextBlocks(ctx, decisionBlock)
	require.NoError(t, err)
	require.Len(t, nextBlocks, 1)
	require.Equal(t, "end", nextBlocks[0].Cid)
	connectors, err := fdr.Connectors(ctx, flowDraft)
	require.NoError(t, err)
	require.Len(t, connectors, 2)
}
