// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package graphql

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/NYTimes/gziphandler"
	"github.com/facebook/ent/dialect"
	"github.com/facebookincubator/symphony/admin/graphql/directive"
	"github.com/facebookincubator/symphony/admin/graphql/exec"
	"github.com/facebookincubator/symphony/admin/graphql/resolver"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/gorilla/mux"
	"go.opencensus.io/plugin/ochttp"
	"golang.org/x/sync/semaphore"
)

// HandlerConfig configures graphql handler.
type HandlerConfig struct {
	DB      gqlutil.BeginTxExecQueryer
	Dialect fmt.Stringer
	Tenancy viewer.Tenancy
	Logger  log.Logger
}

// NewHandler creates a graphql http handler.
func NewHandler(cfg HandlerConfig) http.Handler {
	srv := gqlutil.NewServer(
		exec.NewExecutableSchema(
			exec.Config{
				Resolvers: resolver.New(
					resolver.Config{
						Logger: cfg.Logger,
						Migrator: resolver.NewMigrator(
							resolver.MigratorConfig{
								Logger:  cfg.Logger,
								Dialect: cfg.Dialect,
							},
						),
					},
				),
				Directives: directive.New(),
			},
		),
	)
	srv.Use(gqlutil.DBInjector{DB: cfg.DB})
	srv.Use(TenancyInjector{
		Tenancy: cfg.Tenancy,
		Dialect: cfg.Dialect.String(),
	})
	srv.AroundOperations(
		func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
			return next(privacy.DecisionContext(ctx, privacy.Allow))
		},
	)
	srv.SetRecoverFunc(gqlutil.RecoverFunc(cfg.Logger))

	router := mux.NewRouter()
	router.Use(func(next http.Handler) http.Handler {
		return http.TimeoutHandler(next, 30*time.Second, "request timed out")
	})
	router.Path("/graphiql").
		Handler(
			ochttp.WithRouteTag(
				playground.Handler(
					"GraphQL playground",
					"/query",
				),
				"graphiql",
			),
		)
	router.Path("/query").
		Handler(
			ochttp.WithRouteTag(
				gziphandler.GzipHandler(srv),
				"query",
			),
		)
	return router
}

// TenancyInjector injects viewer.Tenancy into request context.
type TenancyInjector struct {
	Tenancy viewer.Tenancy
	Dialect string
}

var _ interface {
	graphql.HandlerExtension
	graphql.ResponseInterceptor
} = TenancyInjector{}

// ExtensionName returns the extension name.
func (TenancyInjector) ExtensionName() string {
	return "TenancyInjector"
}

// Validate validates the executable schema.
func (ti TenancyInjector) Validate(graphql.ExecutableSchema) error {
	if ti.Tenancy == nil {
		return errors.New("tenancy is nil")
	}
	return nil
}

// InterceptResponse injects a tenancy into context before calling next.
func (ti TenancyInjector) InterceptResponse(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
	tenancy := ti.Tenancy
	if ti.Dialect == dialect.MySQL {
		if tx := gqlutil.TxFromContext(ctx); tx != nil {
			drv := ent.Driver(
				gqlutil.DrvFromTx(ti.Dialect, tx),
			)
			tenancy = &mysqlDBSwitch{
				db:     tx,
				client: ent.NewClient(drv),
				sem:    semaphore.NewWeighted(1),
			}
		}
	}
	ctx = viewer.NewTenancyContext(ctx, tenancy)
	return next(ctx)
}

type mysqlDBSwitch struct {
	db     gqlutil.ExecQueryer
	client *ent.Client
	sem    *semaphore.Weighted
}

// ClientFor locks the switch and swaps the underlying database.
func (ts *mysqlDBSwitch) ClientFor(ctx context.Context, tenant string) (_ *ent.Client, err error) {
	if err := ts.sem.Acquire(ctx, 1); err != nil {
		return nil, err
	}
	defer func() {
		if r := recover(); r != nil {
			ts.sem.Release(1)
			panic(r)
		}
		if err != nil {
			ts.sem.Release(1)
		}
	}()
	query := fmt.Sprintf("USE `%s`", viewer.DBName(tenant))
	if _, err := ts.db.ExecContext(ctx, query); err != nil {
		return nil, fmt.Errorf("cannot switch tenancy: %w", err)
	}
	return ts.client, nil
}

// Release releases switch lock.
func (ts *mysqlDBSwitch) Release() {
	ts.sem.Release(1)
}
