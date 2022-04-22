// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package graphhttp

import (
	"net/http"

	"github.com/facebookincubator/symphony/graph/graphql"
	"github.com/facebookincubator/symphony/graph/importer"
	"github.com/facebookincubator/symphony/graph/jobs"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ev"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	flowactions "github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"

	"github.com/gorilla/mux"
)

type routerConfig struct {
	viewer struct {
		tenancy viewer.Tenancy
		authurl string
	}
	logger  log.Logger
	graphql struct{ complexityLimit int }
	events  struct{ ev.ReceiverFactory }
	flow    struct {
		triggerFactory triggers.Factory
		actionFactory  flowactions.Factory
	}
}

func newRouter(cfg routerConfig) *mux.Router {
	router := mux.NewRouter()
	router.Use(
		func(h http.Handler) http.Handler {
			return viewer.WebSocketUpgradeHandler(h, cfg.viewer.authurl)
		},
		func(h http.Handler) http.Handler {
			return viewer.TenancyHandler(h, cfg.viewer.tenancy, cfg.logger)
		},
		func(h http.Handler) http.Handler {
			return viewer.UserHandler(h, cfg.logger)
		},
		func(h http.Handler) http.Handler {
			return authz.Handler(h, cfg.logger)
		},
	)
	handler := importer.NewHandler(importer.Config{
		Logger:          cfg.logger,
		ReceiverFactory: cfg.events.ReceiverFactory,
	})
	router.PathPrefix("/import/").
		Handler(http.StripPrefix("/import", handler)).
		Name("import")

	handler = pkgexporter.NewHandler(cfg.logger)
	router.PathPrefix("/export/").
		Handler(http.StripPrefix("/export", handler)).
		Name("export")

	handler = jobs.NewHandler(jobs.Config{
		Logger:          cfg.logger,
		ReceiverFactory: cfg.events.ReceiverFactory,
	})
	router.PathPrefix("/jobs/").
		Handler(http.StripPrefix("/jobs", handler)).
		Name("jobs")

	handler = graphql.NewHandler(
		graphql.HandlerConfig{
			Logger:          cfg.logger,
			ComplexityLimit: cfg.graphql.complexityLimit,
			ReceiverFactory: cfg.events.ReceiverFactory,
			TriggerFactory:  cfg.flow.triggerFactory,
			ActionFactory:   cfg.flow.actionFactory,
		},
	)
	router.PathPrefix("/").
		Handler(handler).
		Name("root")

	return router
}
