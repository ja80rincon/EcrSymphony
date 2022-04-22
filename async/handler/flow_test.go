// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package handler_test

import (
	"context"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent/flow"

	"github.com/facebookincubator/symphony/async/handler"
	"github.com/facebookincubator/symphony/async/worker"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/mocks"
)

func TestWorkflowCreated(t *testing.T) {
	c := mocks.Client{}
	var (
		workflowID, workflowName string
		workflowInput            worker.RunFlowInput
	)
	c.On("StartWorkflow", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Run(func(args mock.Arguments) {
			workflowID = args.Get(1).(client.StartWorkflowOptions).ID
			workflowName = args.Get(2).(string)
			workflowInput = args.Get(3).(worker.RunFlowInput)
		}).
		Return(nil, nil).
		Once()
	flowHandler := handler.NewFlowHandler(&c)
	entClient := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), entClient)
	entClient.Use(event.LogHook(flowHandler.Handle, log.NewNopLogger()))
	flw, err := entClient.Flow.Create().
		SetName("Flow").
		SetStatus(flow.StatusPublished).
		SetNewInstancesPolicy(flow.NewInstancesPolicyEnabled).
		Save(ctx)
	require.NoError(t, err)
	flwInstance, err := entClient.FlowInstance.Create().
		SetFlow(flw).
		SetBssCode("CODE123").
		SetStartDate(time.Now()).
		Save(ctx)
	require.NoError(t, err)
	require.Equal(t, worker.RunFlowWorkflowName, workflowName)
	require.Equal(t, flwInstance.ID, workflowInput.FlowInstanceID)
	parts := strings.Split(workflowID, "/")
	require.Len(t, parts, 2)
	require.Equal(t, viewertest.DefaultTenant, parts[0])
	require.Equal(t, strconv.Itoa(flwInstance.ID), parts[1])
}
