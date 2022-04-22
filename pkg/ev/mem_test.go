// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/stretchr/testify/require"
)

func TestMemFactory(t *testing.T) {
	var factory ev.MemFactory
	require.Implements(t, (*ev.Factory)(nil), &factory)
	require.Implements(t, (*ev.Shutdowner)(nil), &factory)

	ctx := context.Background()
	var emitters []ev.Emitter
	for i := 0; i < 10; i++ {
		emitter, err := factory.NewEmitter(ctx)
		require.NoError(t, err)
		emitters = append(emitters, emitter)
	}

	var receivers []ev.Receiver
	for i := 0; i < 20; i++ {
		receiver, err := factory.NewReceiver(ctx, "")
		require.NoError(t, err)
		receivers = append(receivers, receiver)
	}

	const obj = "foo"
	for _, emitter := range emitters {
		err := emitter.Emit(ctx, &ev.Event{Object: obj})
		require.NoError(t, err)
	}
	for _, receiver := range receivers {
		evt, err := receiver.Receive(ctx)
		require.NoError(t, err)
		require.Equal(t, obj, evt.Object)
	}

	err := factory.Shutdown(ctx)
	require.NoError(t, err,
		"first shutdown should succeed",
	)
	err = factory.Shutdown(ctx)
	require.Error(t, err,
		"second shutdown should error",
	)
}
