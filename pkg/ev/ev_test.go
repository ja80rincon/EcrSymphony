// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev_test

import (
	"bytes"
	"context"
	"errors"
	"strconv"
	"sync/atomic"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/ev/mocks"
	"github.com/stretchr/testify/require"
	"go.opencensus.io/stats/view"
	"go.opencensus.io/trace"
	"gocloud.dev/pubsub/mempubsub"
)

// nextURL is used to generate unique pubsub urls.
var nextURL uint64

func TestEventsOverTopic(t *testing.T) {
	type payload struct {
		S string
		I int
	}
	ctx := context.Background()
	url := mempubsub.Scheme + "://" + t.Name() +
		strconv.FormatUint(
			atomic.AddUint64(&nextURL, 1), 10,
		)

	emitter, err := ev.NewTopicEmitter(
		ctx, url, ev.MsgPackEncoder,
	)
	require.NoError(t, err)
	receiver, err := ev.NewTopicReceiver(
		ctx, url, ev.NewDecoder(&payload{}, ev.MsgPackDecode),
	)
	require.NoError(t, err)

	want := &ev.Event{
		Tenant: t.Name(),
		Name:   t.Name(),
		Object: &payload{
			S: t.Name(),
			I: 42,
		},
	}
	err = emitter.Emit(ctx, want)
	require.NoError(t, err)
	got, err := receiver.Receive(ctx)
	require.NoError(t, err)
	require.Equal(t, want.Tenant, got.Tenant)
	require.Equal(t, want.Name, got.Name)
	require.Equal(t, want.Object, got.Object)

	err = emitter.Shutdown(ctx)
	require.NoError(t, err)
	err = receiver.Shutdown(ctx)
	require.NoError(t, err)
}

type testExporter struct {
	spans []*trace.SpanData
}

func (t *testExporter) ExportSpan(s *trace.SpanData) {
	t.spans = append(t.spans, s)
}

func (t *testExporter) getSpans(name string) []*trace.SpanData {
	var spans []*trace.SpanData
	for _, span := range t.spans {
		if span.Name == name {
			spans = append(spans, span)
		}
	}
	return spans
}

func (t *testExporter) getChildren(span *trace.SpanData) []*trace.SpanData {
	var children []*trace.SpanData
	for _, child := range t.spans {
		if bytes.Equal(child.ParentSpanID[:], span.SpanID[:]) {
			children = append(children, child)
		}
	}
	return children
}

func TestEventTelemetry(t *testing.T) {
	te := &testExporter{}
	trace.RegisterExporter(te)
	defer trace.UnregisterExporter(te)

	err := view.Register(ev.OpenCensusViews...)
	defer view.Unregister(ev.OpenCensusViews...)

	ctx := context.Background()
	factory := ev.TopicFactory(
		mempubsub.Scheme + "://" + t.Name() +
			strconv.FormatUint(
				atomic.AddUint64(&nextURL, 1), 10,
			),
	)
	require.Implements(t, (*ev.Factory)(nil), factory)

	emitter, err := factory.NewEmitter(ctx)
	require.NoError(t, err)
	defer emitter.Shutdown(ctx)

	receiver, err := factory.NewReceiver(ctx, nil)
	require.NoError(t, err)
	defer receiver.Shutdown(ctx)
	receiver, err = factory.NewReceiver(ctx, nil)
	require.NoError(t, err)
	defer receiver.Shutdown(ctx)

	withSpan := func(ctx context.Context, name string, f func(context.Context)) {
		ctx, span := trace.StartSpan(ctx, name, trace.WithSampler(trace.AlwaysSample()))
		defer span.End()
		f(ctx)
	}

	events := map[string]struct{}{"foo": {}, "bar": {}, "baz": {}}
	for name := range events {
		withSpan(ctx, name, func(ctx context.Context) {
			err := emitter.Emit(ctx, &ev.Event{Tenant: t.Name(), Name: name})
			require.NoError(t, err)
		})
	}
	for range events {
		withSpan(ctx, "recv", func(ctx context.Context) {
			evt, err := receiver.Receive(ctx)
			require.NoError(t, err)
			_, ok := events[evt.Name]
			require.True(t, ok)
		})
	}

	ctx, cancel := context.WithCancel(ctx)
	cancel()

	withSpan(ctx, "emit_canceled", func(ctx context.Context) {
		err = emitter.Emit(ctx, &ev.Event{})
		require.True(t, errors.Is(err, context.Canceled))
	})
	withSpan(ctx, "recv_canceled", func(ctx context.Context) {
		_, err = receiver.Receive(ctx)
		require.True(t, errors.Is(err, context.Canceled))
	})

	{
		rows, err := view.RetrieveData(ev.EventNumReceiversView.Name)
		require.NoError(t, err)
		require.Len(t, rows, 1)
		data, ok := rows[0].Data.(*view.LastValueData)
		require.True(t, ok)
		require.Equal(t, float64(2), data.Value)
	}

	for _, v := range []*view.View{
		ev.EventEmittedTotalView,
		ev.EventReceivedTotalView,
	} {
		rows, err := view.RetrieveData(v.Name)
		require.NoError(t, err)
		require.Len(t, rows, len(events))
		for _, row := range rows {
			data, ok := row.Data.(*view.CountData)
			require.True(t, ok)
			require.Equal(t, int64(1), data.Value)
		}
	}

	for _, v := range []*view.View{
		ev.EventEmitErrorTotalView,
		ev.EventReceiveErrorTotalView,
	} {
		rows, err := view.RetrieveData(v.Name)
		require.NoError(t, err)
		require.Len(t, rows, 1)
		data, ok := rows[0].Data.(*view.CountData)
		require.True(t, ok)
		require.Equal(t, int64(1), data.Value)
	}

	for name := range events {
		spans := te.getSpans(name)
		require.Len(t, spans, 1)

		children := te.getChildren(spans[0])
		require.Len(t, children, 1)
		child := children[0]
		require.EqualValues(t, trace.StatusCodeOK, child.Code)
		require.Equal(t, "ev.Emit", child.Name)
		require.Equal(t, t.Name(), child.Attributes["tenant"])
		require.Equal(t, name, child.Attributes["name"])
	}

	spans := te.getSpans("ev.Receive")
	require.Len(t, spans, len(events)+1)
	for _, span := range spans {
		if span.Code == trace.StatusCodeOK {
			require.Equal(t, t.Name(), span.Attributes["tenant"])
			require.Contains(t, events, span.Attributes["name"])
		}
	}
}

func TestProviders(t *testing.T) {
	ctx := context.Background()

	var emitter mocks.Emitter
	emitter.On("Shutdown", ctx).
		Return(nil).
		Twice()
	defer emitter.AssertExpectations(t)

	var receiver mocks.Receiver
	receiver.On("Shutdown", ctx).
		Return(nil).
		Twice()
	defer receiver.AssertExpectations(t)

	var factory mocks.Factory
	factory.On("NewEmitter", ctx).
		Return(&emitter, nil).
		Once()
	factory.On("NewReceiver", ctx, nil).
		Return(&receiver, nil).
		Once()
	defer factory.AssertExpectations(t)

	{
		emitter, cleanup, err := ev.ProvideEmitter(ctx, &factory)
		require.NoError(t, err)
		cleanup()
		err = emitter.Shutdown(ctx)
		require.NoError(t, err)
	}
	{
		receiver, cleanup, err := ev.ProvideReceiver(ctx, &factory, nil)
		require.NoError(t, err)
		cleanup()
		err = receiver.Shutdown(ctx)
		require.NoError(t, err)
	}
}

func TestErrFactory(t *testing.T) {
	var factory ev.ErrFactory
	require.Implements(t, (*ev.Factory)(nil), factory)
	require.Implements(t, (*error)(nil), factory)

	ctx := context.Background()
	_, err := factory.NewEmitter(ctx)
	require.Error(t, err)
	_, err = factory.NewReceiver(ctx, "")
	require.Error(t, err)
}
