// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev_test

import (
	"context"
	"errors"
	"io"
	"sync"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/ev/mocks"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"go.opencensus.io/trace"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

func TestService(t *testing.T) {
	ctx := context.Background()
	foo := &ev.Event{Name: "foo"}
	bar := &ev.Event{Name: "bar"}
	baz := &ev.Event{Name: "baz"}

	var handler mocks.EventHandler
	handler.On("HandleEvent", mock.Anything, foo).
		Return(nil).
		Once()
	handler.On("HandleEvent", mock.Anything, bar).
		Return(nil).
		Once()
	handler.On("HandleEvent", mock.Anything, baz).
		Return(errors.New("bad event")).
		Once()
	defer handler.AssertExpectations(t)

	var receiver mocks.Receiver
	for _, evt := range []*ev.Event{foo, bar, baz} {
		receiver.On("Receive", mock.Anything).
			Return(evt, nil).
			Once()
	}
	receiver.On("Receive", mock.Anything).
		Return(nil, context.Canceled).
		Once()
	receiver.On("Shutdown", mock.Anything).
		Return(nil).
		Once()
	defer receiver.AssertExpectations(t)

	var onErrCalled bool
	onError := func(_ context.Context, err error) {
		require.EqualError(t, err, "bad event")
		onErrCalled = true
	}
	defer func() { require.True(t, onErrCalled) }()

	svc, err := ev.NewService(
		ev.Config{
			Receiver: &receiver,
			Handler:  &handler,
			OnError:  onError,
		},
		ev.WithMaxConcurrency(1),
	)
	require.NoError(t, err)
	defer func() {
		err := svc.Stop(ctx)
		require.NoError(t, err)
	}()

	var wg sync.WaitGroup
	wg.Add(1)
	defer wg.Wait()

	go func() {
		defer wg.Done()
		err := svc.Run(ctx)
		require.True(t, errors.Is(err, context.Canceled))
	}()
}

func TestLoggingEventHandler(t *testing.T) {
	ctx := context.Background()
	foo := &ev.Event{Name: "foo", Tenant: t.Name()}
	bar := &ev.Event{Name: "bar", Tenant: t.Name()}
	baz := &ev.Event{Name: "baz", Tenant: t.Name()}

	var handler mocks.EventHandler
	handler.On("HandleEvent", ctx, foo).
		Return(nil).
		Once()
	handler.On("HandleEvent", ctx, bar).
		Return(io.ErrUnexpectedEOF).
		Once()
	handler.On("HandleEvent", ctx, baz).
		Panic("oh no!").
		Once()
	defer handler.AssertExpectations(t)

	core, o := observer.New(zap.DebugLevel)
	logger := log.NewDefaultLogger(zap.New(core))

	h := ev.LoggingEventHandler{
		Handler: &handler,
		Logger:  logger,
	}
	err := h.HandleEvent(ctx, foo)
	require.NoError(t, err)
	err = h.HandleEvent(ctx, bar)
	require.True(t, errors.Is(err, io.ErrUnexpectedEOF))
	require.Panics(t, func() { _ = h.HandleEvent(ctx, baz) })

	require.Equal(t, 3, o.Len())
	require.Equal(t, 2, o.
		FilterMessage("handled event").
		Len(),
	)
	require.Equal(t, 1, o.
		FilterMessage("handled event").
		FilterField(zap.Error(io.ErrUnexpectedEOF)).
		Len(),
	)
	require.Equal(t, 1, o.
		FilterMessage("event handler panic").
		FilterField(zap.Any("error", "oh no!")).
		Len(),
	)
}

func TestNewService(t *testing.T) {
	ctx := context.Background()
	t.Run("Simple", func(t *testing.T) {
		var receiver mocks.Receiver
		receiver.On("Shutdown", mock.Anything).
			Run(func(args mock.Arguments) {
				ctx, ok := args.Get(0).(context.Context)
				require.True(t, ok)
				require.NotNil(t, trace.FromContext(ctx))
			}).
			Return(nil).
			Once()
		defer receiver.AssertExpectations(t)

		svc, err := ev.NewService(ev.Config{
			Receiver: &receiver,
			Handler:  &mocks.EventHandler{},
		})
		require.NoError(t, err)
		require.NotNil(t, svc)

		err = svc.Stop(ctx)
		require.NoError(t, err)
	})
	t.Run("NoHandler", func(t *testing.T) {
		_, err := ev.NewService(ev.Config{
			Receiver: &mocks.Receiver{},
		})
		require.EqualError(t, err, "handler is nil")
	})
	t.Run("NoReceiver", func(t *testing.T) {
		_, err := ev.NewService(ev.Config{
			Handler: &mocks.EventHandler{},
		})
		require.EqualError(t, err, "receiver is nil")
	})
	t.Run("BadConcurrency", func(t *testing.T) {
		_, err := ev.NewService(ev.Config{
			Receiver: &mocks.Receiver{},
			Handler:  &mocks.EventHandler{},
		}, ev.WithMaxConcurrency(0))
		require.EqualError(t, err, "concurrency must be positive")
	})
}
