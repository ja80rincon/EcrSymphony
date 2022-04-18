// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// +build wireinject

package main

import (
	"context"
	"database/sql"
	"fmt"
	"net/url"

	"contrib.go.opencensus.io/integrations/ocsql"
	"github.com/facebook/ent/dialect"
	"github.com/facebookincubator/symphony/admin/graphql"
	"github.com/facebookincubator/symphony/pkg/database/mysql"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/server/metrics"
	"github.com/facebookincubator/symphony/pkg/server/xserver"
	"github.com/facebookincubator/symphony/pkg/strutil"
	"github.com/facebookincubator/symphony/pkg/telemetry/ocgql"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/google/wire"
	"go.opencensus.io/stats/view"
	"gocloud.dev/server/health"
	"gocloud.dev/server/health/sqlhealth"
)

// NewApplication creates a new admin application.
func NewApplication(ctx context.Context, flags *cliFlags) (*application, func(), error) {
	wire.Build(
		wire.FieldsOf(new(*cliFlags),
			"ListenAddress",
			"MetricsAddress",
			"DatabaseURL",
			"LogConfig",
			"TelemetryConfig",
		),
		mysql.Provide,
		provideTenancy,
		log.Provider,
		provideHealthCheckers,
		provideViews,
		graphql.NewHandler,
		wire.Struct(
			new(graphql.HandlerConfig),
			"*",
		),
		wire.Value(
			strutil.Stringer(dialect.MySQL),
		),
		wire.Bind(
			new(fmt.Stringer),
			new(strutil.Stringer),
		),
		wire.Bind(
			new(gqlutil.BeginTxExecQueryer),
			new(*sql.DB),
		),
		metrics.Provider,
		xserver.ServiceSet,
		wire.Struct(
			new(application),
			"*",
		),
	)
	return nil, nil, nil
}

func provideTenancy(ctx context.Context, u *url.URL) (viewer.Tenancy, error) {
	tenancy, err := viewer.NewMySQLTenancy(ctx, u, 5)
	if err != nil {
		return nil, err
	}
	return viewer.NewCacheTenancy(tenancy, nil), nil
}

func provideHealthCheckers(db *sql.DB) []health.Checker {
	return []health.Checker{sqlhealth.New(db)}
}

func provideViews() []*view.View {
	views := xserver.DefaultViews()
	views = append(views, ocsql.DefaultViews...)
	views = append(views, ocgql.DefaultViews...)
	return views
}
