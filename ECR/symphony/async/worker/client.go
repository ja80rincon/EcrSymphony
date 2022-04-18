// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker

import (
	"context"
	"fmt"
	"time"

	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/health"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/opentracing/opentracing-go"
	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
)

const (
	TaskListName = "async"
)

// DomainFactory returns workers of specific domain with all workflows and activities registered
type DomainFactory interface {
	NewWorkers(workflowserviceclient.Interface, worker.Options) []worker.Worker
	GetDomain() Domain
}

// Config is the configuration for the client
type Config struct {
	Client       workflowserviceclient.Interface
	Factories    []DomainFactory
	Tenancy      viewer.Tenancy
	Tracer       opentracing.Tracer
	Logger       log.Logger
	HealthPoller health.Poller
}

// Client is responsible to connect to cadence and run workers that handle available tasks
type Client struct {
	client       workflowserviceclient.Interface
	factories    []DomainFactory
	tenancy      viewer.Tenancy
	tracer       opentracing.Tracer
	logger       log.Logger
	workers      []worker.Worker
	healthPoller health.Poller
}

// NewClient returns back client based on given configuration
func NewClient(cfg Config) *Client {
	return &Client{
		client:       cfg.Client,
		factories:    cfg.Factories,
		tenancy:      cfg.Tenancy,
		tracer:       cfg.Tracer,
		logger:       cfg.Logger,
		healthPoller: cfg.HealthPoller,
	}
}

// Run creates workers and make them start polling for tasks.
func (cc *Client) Run(ctx context.Context) error {
	if err := cc.healthPoller.Wait(ctx); err != nil {
		return fmt.Errorf("failed to wait for health checks: %w", err)
	}
	cc.logger.For(ctx).Info("starting to serve tasks")
	workerOptions := worker.Options{
		Logger: cc.logger.For(ctx),
		Tracer: cc.tracer,
		ContextPropagators: []workflow.ContextPropagator{
			NewContextPropagator(cc.tenancy),
		},
		DisableStickyExecution: true,
		WorkerStopTimeout:      5 * time.Second, // graceful shutdown period
	}
	for _, f := range cc.factories {
		workers := f.NewWorkers(cc.client, workerOptions)
		cc.workers = append(cc.workers, workers...)
	}
	g := ctxgroup.WithContext(ctx)
	for _, w := range cc.workers {
		w := w
		g.Go(func(ctx context.Context) error {
			if err := w.Run(); err != nil {
				return fmt.Errorf("failed to run worker: %w", err)
			}
			return nil
		})
	}
	return g.Wait()
}

// Shutdown terminates the polling workers.
func (cc *Client) Shutdown() {
	g := ctxgroup.WithContext(context.Background())
	for _, w := range cc.workers {
		w := w
		g.Go(func(_ context.Context) error {
			w.Stop()
			return nil
		})
	}
}

// GetCadenceClient returns the cadence client.
func (cc *Client) GetCadenceClient(domain string) client.Client {
	return client.NewClient(cc.client, domain, &client.Options{
		Tracer: cc.tracer,
		ContextPropagators: []workflow.ContextPropagator{
			NewContextPropagator(cc.tenancy),
		},
	})
}
