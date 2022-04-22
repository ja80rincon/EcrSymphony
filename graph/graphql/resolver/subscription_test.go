// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"strconv"
	"strings"
	"sync"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent/flow"
	"github.com/facebookincubator/symphony/pkg/ent/flowinstance"
	"github.com/facebookincubator/symphony/pkg/ev"
	evmocks "github.com/facebookincubator/symphony/pkg/ev/mocks"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func websocket(client *client.Client, query string) *client.Subscription {
	sub := client.Websocket(query)
	next := sub.Next
	sub.Next = func(rsp interface{}) error {
		for {
			if err := next(rsp); err == nil ||
				!strings.HasPrefix(err.Error(), "expected data message, got") ||
				!strings.Contains(err.Error(), "ka") {
				return err
			}
		}
	}
	return sub
}

func TestSubscriptionWorkOrder(t *testing.T) {
	ctx := context.Background()
	var mf ev.MemFactory
	defer func() { _ = mf.Shutdown(ctx) }()

	var (
		factory   evmocks.Factory
		receiving = make(chan struct{}, 2)
	)
	factory.On("NewEmitter", mock.Anything).
		Return(func(ctx context.Context) ev.Emitter {
			emitter, err := mf.NewEmitter(ctx)
			require.NoError(t, err)
			return emitter
		}, nil).
		Once()
	factory.On("NewReceiver", mock.Anything, mock.Anything).
		Return(func(ctx context.Context, obj ev.EventObject) ev.Receiver {
			receiver, err := mf.NewReceiver(ctx, obj)
			require.NoError(t, err)
			receiving <- struct{}{}
			return receiver
		}, nil).
		Twice()
	defer factory.AssertExpectations(t)

	resolver := newTestResolver(t,
		withEventFactory(&factory),
	)
	defer resolver.Close()
	c := resolver.GraphClient()

	var typ string
	{
		var rsp struct{ AddWorkOrderType struct{ ID string } }
		err := c.Post(
			`mutation { addWorkOrderType(input: { name: "chore" }) { id } }`,
			&rsp,
		)
		require.NoError(t, err)
		typ = rsp.AddWorkOrderType.ID
	}

	var (
		sub = websocket(c, `subscription { workOrderAdded { id name workOrderType { name } } }`)
		wg  sync.WaitGroup
		sid string
	)
	wg.Add(1)
	go func() {
		defer wg.Done()
		var rsp struct {
			WorkOrderAdded struct {
				ID            string
				Name          string
				WorkOrderType struct {
					Name string
				}
			}
		}
		err := sub.Next(&rsp)
		require.NoError(t, err)
		sid = rsp.WorkOrderAdded.ID
		require.NotEmpty(t, sid)
		require.Equal(t, "clean", rsp.WorkOrderAdded.Name)
		require.Equal(t, "chore", rsp.WorkOrderAdded.WorkOrderType.Name)
		err = sub.Close()
		require.NoError(t, err)
	}()
	<-receiving

	var id string
	{
		var rsp struct{ AddWorkOrder struct{ ID string } }
		err := c.Post(
			`mutation($type: ID!) { addWorkOrder(input: { name: "clean", workOrderTypeId: $type }) { id } }`,
			&rsp,
			client.Var("type", typ),
		)
		require.NoError(t, err)
		id = rsp.AddWorkOrder.ID
	}
	wg.Wait()
	require.Equal(t, id, sid)

	sub = websocket(c, `subscription { workOrderDone { id } }`)
	wg.Add(1)
	go func() {
		defer wg.Done()
		var rsp struct{ WorkOrderDone struct{ ID string } }
		err := sub.Next(&rsp)
		require.NoError(t, err)
		sid = rsp.WorkOrderDone.ID
		require.NotEmpty(t, sid)
		err = sub.Close()
		require.NoError(t, err)
	}()
	<-receiving

	{
		var rsp struct{ EditWorkOrder struct{ ID string } }
		err := c.Post(`mutation($id: ID!) { editWorkOrder(input: { id: $id, name: "foo", status: DONE }) { id } }`,
			&rsp,
			client.Var("id", id),
		)
		require.NoError(t, err)
		id = rsp.EditWorkOrder.ID
	}
	wg.Wait()
	require.Equal(t, id, sid)
}

func TestSubscriptionFlowInstance(t *testing.T) {
	ctx := context.Background()
	var mf ev.MemFactory
	defer func() { _ = mf.Shutdown(ctx) }()

	var (
		factory   evmocks.Factory
		receiving = make(chan struct{}, 2)
	)
	factory.On("NewEmitter", mock.Anything).
		Return(func(ctx context.Context) ev.Emitter {
			emitter, err := mf.NewEmitter(ctx)
			require.NoError(t, err)
			return emitter
		}, nil).
		Once()
	factory.On("NewReceiver", mock.Anything, mock.Anything).
		Return(func(ctx context.Context, obj ev.EventObject) ev.Receiver {
			receiver, err := mf.NewReceiver(ctx, obj)
			require.NoError(t, err)
			receiving <- struct{}{}
			return receiver
		}, nil).
		Once()
	defer factory.AssertExpectations(t)

	resolver := newTestResolver(t,
		withEventFactory(&factory),
	)
	defer resolver.Close()
	c, mr := resolver.GraphClient(), resolver.Mutation()

	var (
		sub = websocket(c, `subscription { flowInstanceDone { id } }`)
		wg  sync.WaitGroup
		fid string
	)
	wg.Add(1)
	go func() {
		defer wg.Done()
		var rsp struct {
			FlowInstanceDone struct {
				ID string
			}
		}
		err := sub.Next(&rsp)
		require.NoError(t, err)
		fid = rsp.FlowInstanceDone.ID
		require.NotEmpty(t, fid)
		err = sub.Close()
		require.NoError(t, err)
	}()
	<-receiving

	ctx = viewertest.NewContext(context.Background(), resolver.client)
	draft, err := mr.AddFlowDraft(ctx, models.AddFlowDraftInput{
		Name: "Flow Draft",
	})
	require.NoError(t, err)
	_, err = mr.AddStartBlock(ctx, draft.ID, models.StartBlockInput{
		Cid: "start",
	})
	require.NoError(t, err)
	flw, err := mr.PublishFlow(ctx, models.PublishFlowInput{FlowDraftID: draft.ID, FlowInstancesPolicy: flow.NewInstancesPolicyEnabled})
	require.NoError(t, err)
	flowInstance, err := mr.StartFlow(ctx, models.StartFlowInput{
		FlowID: flw.ID,
	})
	require.NoError(t, err)
	err = resolver.client.FlowInstance.UpdateOne(flowInstance).
		SetStatus(flowinstance.StatusCompleted).
		Exec(ctx)
	require.NoError(t, err)
	wg.Wait()
	require.Equal(t, strconv.Itoa(flowInstance.ID), fid)
}
