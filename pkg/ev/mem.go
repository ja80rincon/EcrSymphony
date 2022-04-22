// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev

import (
	"context"
	"sync"
	"time"

	"github.com/hashicorp/go-multierror"
	"gocloud.dev/pubsub"
	"gocloud.dev/pubsub/mempubsub"
)

// MemFactory creates in memory based emitters and receivers.
type MemFactory struct {
	topic *pubsub.Topic
	subs  []*pubsub.Subscription
	mu    sync.Mutex
}

// NewEmitter creates an in memory topic emitter.
func (f *MemFactory) NewEmitter(context.Context) (Emitter, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.topic == nil {
		f.topic = mempubsub.NewTopic()
	}
	return &TopicEmitter{
		topic:   f.topic,
		encoder: MsgPackEncoder,
	}, nil
}

// NewReceiver creates an in memory topic receiver.
func (f *MemFactory) NewReceiver(_ context.Context, obj EventObject) (Receiver, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.topic == nil {
		f.topic = mempubsub.NewTopic()
	}
	sub := mempubsub.NewSubscription(f.topic, time.Second)
	f.subs = append(f.subs, sub)
	return &TopicReceiver{
		subscription: sub,
		decoder:      NewDecoder(obj, MsgPackDecode),
	}, nil
}

// Shutdown will shutdown all emitters and receivers
// previously creates by this factory.
func (f *MemFactory) Shutdown(ctx context.Context) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	err := multierror.Append(nil, f.topic.Shutdown(ctx))
	for _, sub := range f.subs {
		err = multierror.Append(err, sub.Shutdown(ctx))
	}
	return err.ErrorOrNil()
}
