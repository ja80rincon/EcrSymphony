// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package handler_test

import (
	"context"
	"errors"
	"math/rand"
	"sync"
	"testing"

	"github.com/facebookincubator/symphony/async/handler"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/health"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
	"gocloud.dev/runtimevar/constantvar"
)

func newTestServer(t *testing.T, client *ent.Client, receiver ev.Receiver, handlers []handler.Handler) *handler.Server {
	return handler.NewServer(handler.Config{
		Tenancy: viewer.NewFixedTenancy(client),
		Features: constantvar.New(viewer.TenantFeatures{
			viewertest.DefaultTenant: viewertest.DefaultFeatures,
		}),
		Logger:       logtest.NewTestLogger(t),
		Receiver:     receiver,
		Handlers:     handlers,
		HealthPoller: health.NewPoller(logtest.NewTestLogger(t).Background(), nil),
	})
}

func getLogEntry() event.LogEntry {
	return event.LogEntry{
		Operation: ent.OpCreate,
		CurrState: &ent.Node{
			ID:   rand.Int(),
			Type: "Dog",
			Fields: []*ent.Field{
				{
					Type:  "string",
					Name:  "Name",
					Value: "Lassie",
				},
			},
		},
	}
}

func TestServer(t *testing.T) {
	emitter, receiver := ev.Pipe()
	defer func() {
		ctx := context.Background()
		_ = emitter.Shutdown(ctx)
		_ = receiver.Shutdown(ctx)
	}()
	logEntry := getLogEntry()
	client := viewertest.NewTestClient(t)
	ctx, cancel := context.WithCancel(context.Background())
	h := handler.Func(func(ctx context.Context, logger log.Logger, evt ev.EventObject) error {
		v := viewer.FromContext(ctx)
		require.Equal(t, t.Name(), v.Tenant())
		require.Equal(t, handler.ServiceName, v.Name())
		require.Equal(t, user.RoleOwner, v.Role())
		entry, ok := evt.(event.LogEntry)
		require.True(t, ok)
		require.EqualValues(t, logEntry, entry)
		cancel()
		return nil
	})
	server := newTestServer(t, client, receiver, []handler.Handler{
		handler.New(handler.HandleConfig{
			Name:    "handler",
			Handler: h,
		},
		)})
	var wg sync.WaitGroup
	defer server.Shutdown(ctx)
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := server.Serve(ctx)
		require.True(t, errors.Is(err, context.Canceled))
	}()

	err := emitter.Emit(ctx, &ev.Event{
		Tenant: t.Name(),
		Name:   event.EntMutation,
		Object: logEntry,
	})
	require.NoError(t, err)
	wg.Wait()
}

func TestServerBadData(t *testing.T) {
	ctx := context.Background()
	emitter, receiver := ev.Pipe()
	defer func() {
		_ = emitter.Shutdown(ctx)
		_ = receiver.Shutdown(ctx)
	}()

	client := viewertest.NewTestClient(t)
	server := newTestServer(t, client, receiver,
		[]handler.Handler{
			handler.New(handler.HandleConfig{
				Name:    "handler",
				Handler: handler.Func(func(context.Context, log.Logger, ev.EventObject) error { return nil }),
			}),
		})
	err := server.HandleEvent(ctx, &ev.Event{
		Tenant: viewertest.DefaultTenant,
		Name:   event.EntMutation,
		Object: []byte(""),
	})
	require.Error(t, err)
}

func TestServerHandlerError(t *testing.T) {
	emitter, receiver := ev.Pipe()
	defer func() {
		ctx := context.Background()
		_ = emitter.Shutdown(ctx)
		_ = receiver.Shutdown(ctx)
	}()
	logEntry := getLogEntry()
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	cancelledCtx, cancel := context.WithCancel(ctx)

	h := handler.Func(func(ctx context.Context, _ log.Logger, _ ev.EventObject) error {
		client := ent.FromContext(ctx)
		client.LocationType.Create().
			SetName("LocationType").
			SaveX(ctx)
		cancel()
		return errors.New("operation failed")
	})
	server := newTestServer(t, client, receiver, []handler.Handler{
		handler.New(handler.HandleConfig{
			Name:    "handler",
			Handler: h,
		},
		)})
	var wg sync.WaitGroup
	defer server.Shutdown(ctx)
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := server.Serve(cancelledCtx)
		require.True(t, errors.Is(err, context.Canceled))
	}()
	err := emitter.Emit(ctx, &ev.Event{
		Tenant: t.Name(),
		Name:   event.EntMutation,
		Object: logEntry,
	})
	require.NoError(t, err)
	wg.Wait()
	require.False(t, client.LocationType.Query().Where().ExistX(ctx))
}

func TestServerHandlerNoError(t *testing.T) {
	emitter, receiver := ev.Pipe()
	defer func() {
		ctx := context.Background()
		_ = emitter.Shutdown(ctx)
		_ = receiver.Shutdown(ctx)
	}()
	logEntry := getLogEntry()
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	cancelledCtx, cancel := context.WithCancel(ctx)

	h := handler.Func(func(ctx context.Context, _ log.Logger, _ ev.EventObject) error {
		client := ent.FromContext(ctx)
		client.LocationType.Create().
			SetName("LocationType").
			SaveX(ctx)
		cancel()
		return nil
	})
	server := newTestServer(t, client, receiver, []handler.Handler{
		handler.New(handler.HandleConfig{
			Name:    "handler",
			Handler: h,
		},
		)})
	var wg sync.WaitGroup
	defer server.Shutdown(ctx)
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := server.Serve(cancelledCtx)
		require.True(t, errors.Is(err, context.Canceled))
	}()
	err := emitter.Emit(ctx, &ev.Event{
		Tenant: t.Name(),
		Name:   event.EntMutation,
		Object: logEntry,
	})
	require.NoError(t, err)
	wg.Wait()
	require.True(t, client.LocationType.Query().Where().ExistX(ctx))
}
