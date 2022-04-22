// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/ev/mocks"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"go.opencensus.io/stats/view"
)

func TestFilterReceiver(t *testing.T) {
	v := ev.EventReceiveFilteredTotalView
	err := view.Register(v)
	require.NoError(t, err)
	defer view.Unregister(v)

	ctx := context.Background()
	foo := &ev.Event{Tenant: t.Name(), Name: "foo"}
	bar := &ev.Event{Tenant: t.Name(), Name: "bar"}

	var filter mocks.Filterer
	filter.On("Filter", ctx, foo).
		Return(false).
		Once()
	filter.On("Filter", ctx, bar).
		Return(true).
		Once()
	defer filter.AssertExpectations(t)

	var receiver mocks.Receiver
	receiver.On("Receive", ctx).
		Return(foo, nil).
		Once()
	receiver.On("Receive", ctx).
		Return(bar, nil).
		Once()
	receiver.On("Shutdown", ctx).
		Return(nil).
		Once()
	defer receiver.AssertExpectations(t)

	r := ev.FilterReceiver{
		Receiver: &receiver,
		Filter:   &filter,
	}
	evt, err := r.Receive(ctx)
	require.NoError(t, err)
	require.Equal(t, t.Name(), evt.Tenant)
	require.Equal(t, "bar", evt.Name)
	err = r.Shutdown(ctx)
	require.NoError(t, err)

	rows, err := view.RetrieveData(v.Name)
	require.NoError(t, err)
	require.Len(t, rows, 1)
	data, ok := rows[0].Data.(*view.CountData)
	require.True(t, ok)
	require.Equal(t, int64(1), data.Value)
}

func TestFilterers(t *testing.T) {
	t.Run("AllTrue", func(t *testing.T) {
		var filter mocks.Filterer
		filter.On("Filter", mock.Anything, mock.Anything).
			Return(true).
			Times(3)
		defer filter.AssertExpectations(t)

		ok := ev.Filters{&filter, &filter, &filter}.
			Filter(context.Background(), &ev.Event{})
		require.True(t, ok)
	})
	t.Run("OneFalse", func(t *testing.T) {
		var truthy mocks.Filterer
		truthy.On("Filter", mock.Anything, mock.Anything).
			Return(true).
			Once()
		defer truthy.AssertExpectations(t)

		var falsy mocks.Filterer
		falsy.On("Filter", mock.Anything, mock.Anything).
			Return(false).
			Once()
		defer falsy.AssertExpectations(t)

		ok := ev.Filters{&truthy, &falsy}.
			Filter(context.Background(), &ev.Event{})
		require.False(t, ok)
	})
	t.Run("Empty", func(t *testing.T) {
		ok := ev.Filters{}.Filter(
			context.Background(), &ev.Event{},
		)
		require.True(t, ok)
	})
}
