// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev

import (
	"context"
	"errors"
	"sync"
)

// ErrShutdownPipe is the error used for emit or receive operations on a shutdown pipe.
var ErrShutdownPipe = errors.New("ev: emit/receive on shutdown pipe")

// A pipe is the shared event pipe.
type pipe struct {
	events chan *Event
	once   sync.Once
	done   chan struct{}
}

func (p *pipe) Emit(ctx context.Context, evt *Event) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-p.done:
		return ErrShutdownPipe
	default:
	}

	select {
	case <-ctx.Done():
		return ctx.Err()
	case p.events <- evt:
		return nil
	case <-p.done:
		return ErrShutdownPipe
	}
}

func (p *pipe) Receive(ctx context.Context) (*Event, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case <-p.done:
		return nil, ErrShutdownPipe
	default:
	}

	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case evt := <-p.events:
		return evt, nil
	case <-p.done:
		return nil, ErrShutdownPipe
	}
}

func (p *pipe) Shutdown(context.Context) error {
	p.once.Do(func() { close(p.done) })
	return nil
}

// Pipe creates a emitter/receiver pipe.
func Pipe() (Emitter, Receiver) {
	return BufferedPipe(0)
}

// BufferedPipe creates a buffered emitter/receiver pipe.
func BufferedPipe(size int) (Emitter, Receiver) {
	p := &pipe{
		events: make(chan *Event, size),
		done:   make(chan struct{}),
	}
	return p, p
}
