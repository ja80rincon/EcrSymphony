// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//+build wireinject

package main

import (
	"context"

	"contrib.go.opencensus.io/integrations/ocsql"
	"github.com/facebookincubator/symphony/graph/graphhttp"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
	"github.com/facebookincubator/symphony/pkg/hooks"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/server/metrics"
	"github.com/facebookincubator/symphony/pkg/server/xserver"
	"github.com/facebookincubator/symphony/pkg/telemetry"
	"github.com/facebookincubator/symphony/pkg/telemetry/ocgql"
	"github.com/facebookincubator/symphony/pkg/telemetry/ocpubsub"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"go.opencensus.io/stats/view"

	"github.com/google/wire"
	"gocloud.dev/server/health"
)

func newApplication(ctx context.Context, flags *cliFlags) (*application, func(), error) {
	wire.Build(
		wire.FieldsOf(new(*cliFlags),
			"ListenAddress",
			"MetricsAddress",
			"AuthURL",
			"EventPubsubURL",
			"ComplexityLimit",
			"LogConfig",
			"TelemetryConfig",
		),
		log.Provider,
		wire.Struct(
			new(application),
			"*",
		),
		newTenancy,
		wire.Struct(
			new(event.Eventer),
			"*",
		),
		newMySQLTenancy,
		newHealthChecks,
		ev.ProvideEmitter,
		wire.Bind(
			new(ev.EmitterFactory),
			new(ev.TopicFactory),
		),
		wire.Bind(
			new(ev.ReceiverFactory),
			new(ev.TopicFactory),
		),
		triggers.NewFactory,
		actions.NewFactory,
		wire.Struct(
			new(hooks.Flower),
			"*",
		),
		metrics.Provider,
		telemetry.ProvideViewExporter,
		provideViews,
		graphhttp.NewServer,
		wire.Struct(
			new(graphhttp.Config),
			"*",
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

func newMySQLTenancy(ctx context.Context, flags *cliFlags) (*viewer.MySQLTenancy, error) {
	return viewer.NewMySQLTenancy(ctx, flags.DatabaseURL, flags.TenancyConfig.TenantMaxConn)
}

func newHealthChecks(tenancy *viewer.MySQLTenancy) []health.Checker {
	return []health.Checker{tenancy}
}

func provideViews() []*view.View {
	views := xserver.DefaultViews()
	views = append(views, ocsql.DefaultViews...)
	views = append(views, ocgql.DefaultViews...)
	views = append(views, ocpubsub.DefaultViews...)
	views = append(views, ev.OpenCensusViews...)
	return views
}
