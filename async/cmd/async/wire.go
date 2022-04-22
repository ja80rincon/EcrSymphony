// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// +build wireinject

package main

import (
	"context"
	"fmt"
	"net/http"

	"contrib.go.opencensus.io/integrations/ocsql"
	"github.com/facebookincubator/symphony/async/handler"
	"github.com/facebookincubator/symphony/async/worker"
	"github.com/facebookincubator/symphony/pkg/cadence"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
	poller "github.com/facebookincubator/symphony/pkg/health"
	"github.com/facebookincubator/symphony/pkg/hooks"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/server/metrics"
	"github.com/facebookincubator/symphony/pkg/server/xserver"
	"github.com/facebookincubator/symphony/pkg/telemetry/ocpubsub"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/opentracing/opentracing-go"
	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"
	"gocloud.dev/runtimevar"

	"github.com/google/wire"
	"go.opencensus.io/stats/view"
	"gocloud.dev/blob"
	"gocloud.dev/server/health"
)

// NewApplication creates a new async application.
func NewApplication(ctx context.Context, flags *cliFlags) (*application, func(), error) {
	wire.Build(
		wire.FieldsOf(new(*cliFlags),
			"ListenAddress",
			"MetricsAddress",
			"DatabaseURL",
			"LogConfig",
			"EventPubURL",
			"TelemetryConfig",
			"TenancyConfig",
		),
		log.Provider,
		metrics.Provider,
		newTenancy,
		wire.Struct(
			new(event.Eventer),
			"*",
		),
		viewer.SyncFeatures,
		viewer.NewMySQLTenancy,
		wire.FieldsOf(
			new(viewer.Config),
			"TenantMaxConn",
		),
		ev.ProvideEmitter,
		wire.Bind(
			new(ev.EmitterFactory),
			new(ev.TopicFactory),
		),
		ev.ProvideReceiver,
		provideReceiverFactory,
		wire.InterfaceValue(
			new(ev.EventObject),
			event.LogEntry{},
		),
		triggers.NewFactory,
		actions.NewFactory,
		wire.Struct(
			new(hooks.Flower),
			"*",
		),
		provideHealthCheckers,
		http.NotFoundHandler,
		xserver.ServiceSet,
		provideViews,
		poller.NewPoller,
		wire.Struct(
			new(handler.Config), "*",
		),
		handler.NewServer,
		provideCadenceClient,
		newWorkerFactories,
		wire.Struct(
			new(worker.Config), "*",
		),
		worker.NewClient,
		worker.NewHealthChecker,
		newBucket,
		newHandlers,
		wire.Struct(
			new(application), "*",
		),
	)
	return nil, nil, nil
}

func newTenancy(tenancy *viewer.MySQLTenancy, eventer *event.Eventer, flower *hooks.Flower) viewer.Tenancy {
	return viewer.NewCacheTenancy(tenancy, func(client *ent.Client) {
		eventer.HookTo(client)
		flower.HookTo(client)
	})
}

func provideHealthCheckers(
	tenancy *viewer.MySQLTenancy,
	checker *worker.HealthChecker,
	features *runtimevar.Variable,
) []health.Checker {
	return []health.Checker{tenancy, checker, features}
}

func provideViews() []*view.View {
	views := xserver.DefaultViews()
	views = append(views, ocsql.DefaultViews...)
	views = append(views, ocpubsub.DefaultViews...)
	views = append(views, ev.OpenCensusViews...)
	return views
}

func provideReceiverFactory(flags *cliFlags) ev.ReceiverFactory {
	return flags.EventSubURL
}

func newBucket(ctx context.Context, flags *cliFlags) (*blob.Bucket, func(), error) {
	bucket, err := blob.OpenBucket(ctx, flags.ExportBucketURL.String())
	if err != nil {
		return nil, nil, fmt.Errorf("cannot open blob bucket: %w", err)
	}
	return bucket, func() { _ = bucket.Close() }, nil
}

func provideCadenceClient(logger log.Logger, flags *cliFlags) (workflowserviceclient.Interface, func(), error) {
	return cadence.ProvideClient(logger.Background(), flags.CadenceAddr)
}

func newHandlers(bucket *blob.Bucket, flags *cliFlags, client *worker.Client, tenancy viewer.Tenancy, tracer opentracing.Tracer) []handler.Handler {
	return []handler.Handler{
		handler.New(handler.HandleConfig{
			Name:    "activity_log",
			Handler: handler.Func(handler.HandleActivityLog),
		}),
		handler.New(handler.HandleConfig{
			Name: "export_task",
			Handler: handler.NewExportHandler(
				bucket, flags.ExportBucketPrefix, client.GetCadenceClient(worker.ExportDomainName.String())),
		}, handler.WithTransaction(false)),
		handler.New(handler.HandleConfig{
			Name:    "flow",
			Handler: handler.NewFlowHandler(client.GetCadenceClient(worker.FlowDomainName.String())),
		}, handler.WithTransaction(false)),
	}
}

func newWorkerFactories(logger log.Logger, bucket *blob.Bucket, flags *cliFlags) []worker.DomainFactory {
	return []worker.DomainFactory{
		worker.NewFlowFactory(logger),
		worker.NewExportFactory(logger, bucket, flags.ExportBucketPrefix),
	}
}
