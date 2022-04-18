// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev

import (
	"context"
	"errors"
	"math"

	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/hashicorp/go-multierror"
	"go.opencensus.io/stats"
	"go.opencensus.io/tag"
	"go.opencensus.io/trace"
	"go.uber.org/zap"
	"golang.org/x/sync/semaphore"
)

// EventHandler represents types than can handle incoming events.
type EventHandler interface {
	HandleEvent(context.Context, *Event) error
}

// The EventHandlerFunc type is an adapter to allow the use of
// ordinary functions as event handlers.
type EventHandlerFunc func(context.Context, *Event) error

// HandleEvent returns f(ctx, evt).
func (f EventHandlerFunc) HandleEvent(ctx context.Context, evt *Event) error {
	return f(ctx, evt)
}

// LoggingEventHandler is an event handler wrapper that logs handled events.
type LoggingEventHandler struct {
	Handler EventHandler
	Logger  log.Logger
}

// HandleEvent logs handled events.
func (l LoggingEventHandler) HandleEvent(ctx context.Context, evt *Event) (err error) {
	logger := l.Logger.For(ctx).
		With(zap.Object("data", evt))
	defer func() {
		if r := recover(); r != nil {
			logger.Error("event handler panic",
				zap.Any("error", r),
			)
			panic(r)
		}
		logger.Debug("handled event",
			zap.Error(err),
		)
	}()

	return l.Handler.HandleEvent(ctx, evt)
}

// Service handles incoming events.
type Service struct {
	receiver    Receiver
	sem         *semaphore.Weighted
	concurrency int64
	handler     EventHandler
	onError     func(context.Context, error)
}

// Config configures event handling service.
type Config struct {
	// Receiver is used when receiving events.
	Receiver Receiver

	// Handler is used to process incoming events.
	Handler EventHandler

	// OnError is used for error reporting.
	OnError func(context.Context, error)
}

// Option enables optional service customization.
type Option func(*options) error

// options aggregates multiple Option types.
type options struct {
	filters     Filters
	concurrency int64
}

// WithTenant filters out events not matching tenant.
func WithTenant(tenant string) Option {
	filter := FiltererFunc(func(_ context.Context, evt *Event) bool {
		return evt.Tenant == tenant
	})
	return func(opts *options) error {
		opts.filters = append(opts.filters, filter)
		return nil
	}
}

// WithEvent filters out events whose name doesn't match
// any of the passed in event names.
func WithEvent(event ...string) Option {
	events := make(map[string]struct{}, len(event))
	for _, name := range event {
		events[name] = struct{}{}
	}
	filter := FiltererFunc(func(_ context.Context, evt *Event) bool {
		_, ok := events[evt.Name]
		return ok
	})
	return func(opts *options) error {
		opts.filters = append(opts.filters, filter)
		return nil
	}
}

// WithMaxConcurrency limits the service execution concurrency.
func WithMaxConcurrency(concurrency int64) Option {
	return func(opts *options) error {
		if concurrency <= 0 {
			return errors.New("concurrency must be positive")
		}
		opts.concurrency = concurrency
		return nil
	}
}

// NewService creates a new service from config and options.
func NewService(cfg Config, opts ...Option) (*Service, error) {
	if cfg.Receiver == nil {
		return nil, errors.New("receiver is nil")
	}
	if cfg.Handler == nil {
		return nil, errors.New("handler is nil")
	}

	o := &options{concurrency: math.MaxInt64}
	for _, opt := range opts {
		if err := opt(o); err != nil {
			return nil, err
		}
	}
	receiver := cfg.Receiver
	if len(o.filters) > 0 {
		receiver = FilterReceiver{
			Receiver: receiver,
			Filter:   o.filters,
		}
	}
	if cfg.OnError == nil {
		cfg.OnError = func(context.Context, error) {}
	}
	// increment concurrency in concurrent mode to account
	// for the acquire call in Run.
	if o.concurrency > 1 && o.concurrency < math.MaxInt64 {
		o.concurrency++
	}

	return &Service{
		receiver: receiver,
		sem: semaphore.NewWeighted(
			o.concurrency,
		),
		concurrency: o.concurrency,
		handler:     cfg.Handler,
		onError:     cfg.OnError,
	}, nil
}

// traceStatus convert an error to a trace status.
func traceStatus(err error) trace.Status {
	var code int32
	switch {
	case err == nil, errors.Is(err, context.Canceled):
		return trace.Status{Code: trace.StatusCodeOK}
	case errors.Is(err, ErrServiceStopped):
		code = trace.StatusCodeFailedPrecondition
	case errors.Is(err, context.DeadlineExceeded):
		code = trace.StatusCodeDeadlineExceeded
	default:
		code = trace.StatusCodeUnknown
	}
	return trace.Status{
		Code:    code,
		Message: err.Error(),
	}
}

// handle a single event.
func (s *Service) handle(evt *Event) {
	ctx, _ := tag.New(context.Background(), evt.tags()...)
	var err error
	defer func() {
		if err != nil {
			stats.Record(ctx, EventHandleErrorTotal.M(1))
		}
	}()

	ctx, span := trace.StartSpanWithRemoteParent(
		ctx, evt.Name, evt.SpanContext,
	)
	span.AddAttributes(
		trace.StringAttribute("tenant", evt.Tenant),
	)
	defer s.endSpan(span, &err)

	if err = s.handler.HandleEvent(ctx, evt); err != nil {
		s.onError(ctx, err)
	}
}

func (s *Service) startSpan(ctx context.Context, name string) (context.Context, *trace.Span) {
	return trace.StartSpan(ctx, name,
		trace.WithSampler(func(p trace.SamplingParameters) trace.SamplingDecision {
			return trace.SamplingDecision{
				Sample: p.ParentContext.IsSampled(),
			}
		}),
	)
}

func (Service) endSpan(span *trace.Span, err *error) {
	span.SetStatus(traceStatus(*err))
	span.End()
}

// ErrServiceStopped is returned by the Service's
// Run method after a call to Stop.
var ErrServiceStopped = errors.New("ev: Service stopped")

// Run runs a receive loop breaking on error.
func (s *Service) Run(ctx context.Context) (err error) {
	ctx, span := s.startSpan(ctx, "Service.Run")
	defer s.endSpan(span, &err)

	if !s.sem.TryAcquire(1) {
		return ErrServiceStopped
	}
	defer s.sem.Release(1)

	for {
		evt, err := s.receiver.Receive(ctx)
		if err != nil {
			return err
		}
		if s.concurrency == 1 {
			s.handle(evt)
			continue
		}

		if err := s.sem.Acquire(ctx, 1); err != nil {
			return err
		}
		go func() {
			defer s.sem.Release(1)
			s.handle(evt)
		}()
	}
}

// Stop stops a running service.
func (s *Service) Stop(ctx context.Context) (err error) {
	ctx, span := s.startSpan(ctx, "Service.Stop")
	defer s.endSpan(span, &err)

	defer func() {
		err = multierror.Append(err,
			s.sem.Acquire(ctx, s.concurrency),
		).ErrorOrNil()
	}()
	return s.receiver.Shutdown(ctx)
}
