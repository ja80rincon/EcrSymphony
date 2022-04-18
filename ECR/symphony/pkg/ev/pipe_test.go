// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev_test

import (
	"context"
	"errors"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/stretchr/testify/require"
)

func TestPipe(t *testing.T) {
	ctx := context.Background()
	evt := &ev.Event{
		Tenant: t.Name(),
		Name:   t.Name(),
		Object: "foobar",
	}
	t.Run("Unbuffered", func(t *testing.T) {
		emitter, receiver := ev.Pipe()
		defer func() {
			err := emitter.Shutdown(ctx)
			require.NoError(t, err)
			err = receiver.Shutdown(ctx)
			require.NoError(t, err)
		}()
		go func() {
			err := emitter.Emit(ctx, evt)
			require.NoError(t, err)
		}()
		got, err := receiver.Receive(ctx)
		require.NoError(t, err)
		require.Equal(t, evt, got)
	})
	t.Run("Buffered", func(t *testing.T) {
		emitter, receiver := ev.BufferedPipe(1)
		defer func() {
			err := emitter.Shutdown(ctx)
			require.NoError(t, err)
			err = receiver.Shutdown(ctx)
			require.NoError(t, err)
		}()
		err := emitter.Emit(ctx, evt)
		require.NoError(t, err)
		got, err := receiver.Receive(ctx)
		require.NoError(t, err)
		require.Equal(t, evt, got)
	})
	t.Run("Shutdown", func(t *testing.T) {
		emitter, receiver := ev.BufferedPipe(1)
		err := emitter.Emit(ctx, evt)
		require.NoError(t, err)
		err = emitter.Shutdown(ctx)
		require.NoError(t, err)
		_, err = receiver.Receive(ctx)
		require.True(t, errors.Is(err, ev.ErrShutdownPipe))
	})
	t.Run("DoneCtx", func(t *testing.T) {
		emitter, receiver := ev.Pipe()
		ctx, cancel := context.WithCancel(ctx)
		cancel()
		err := emitter.Emit(ctx, evt)
		require.True(t, errors.Is(err, context.Canceled))
		_, err = receiver.Receive(ctx)
		require.True(t, errors.Is(err, context.Canceled))
	})
}
