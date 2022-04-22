// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev

import (
	"context"

	"go.opencensus.io/stats"
)

// Filterer represents types than can filter events.
type Filterer interface {
	Filter(context.Context, *Event) bool
}

// The FiltererFunc type is an adapter to allow the use of
// ordinary functions as event filters.
type FiltererFunc func(context.Context, *Event) bool

// Filter returns f(ctx, evt).
func (f FiltererFunc) Filter(ctx context.Context, evt *Event) bool {
	return f(ctx, evt)
}

// Filters is a slice of event filters.
type Filters []Filterer

// Filter is true iff all underlying filters return true.
func (filters Filters) Filter(ctx context.Context, evt *Event) bool {
	for _, f := range filters {
		if !f.Filter(ctx, evt) {
			return false
		}
	}
	return true
}

// FilterReceiver is a Receiver wrapper that filters incoming events.
type FilterReceiver struct {
	Receiver
	Filter Filterer
}

// Receive returns the next incoming message passing filter.
func (f FilterReceiver) Receive(ctx context.Context) (*Event, error) {
	for {
		evt, err := f.Receiver.Receive(ctx)
		if err != nil || f.Filter.Filter(ctx, evt) {
			return evt, err
		}
		_ = stats.RecordWithTags(ctx, evt.tags(),
			EventReceiveFilteredTotal.M(1),
		)
	}
}
