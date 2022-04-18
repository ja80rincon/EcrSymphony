// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package jobs

import (
	"net/http"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/resolver"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/log"

	"github.com/gorilla/mux"
)

type (
	// Config configures jobs handler.
	Config struct {
		Logger          log.Logger
		ReceiverFactory ev.ReceiverFactory
	}

	jobs struct {
		logger log.Logger
		r      generated.ResolverRoot
	}
)

// NewHandler creates a upload http handler.
func NewHandler(cfg Config) http.Handler {
	r := resolver.New(
		resolver.Config{
			Logger:          cfg.Logger,
			ReceiverFactory: cfg.ReceiverFactory,
		},
	)
	u := &jobs{cfg.Logger, r}
	router := mux.NewRouter()
	router.Use(
		func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				ctx := newServicesContext(r.Context())
				next.ServeHTTP(w, r.WithContext(ctx))
			})
		})
	routes := []struct {
		name    string
		handler http.HandlerFunc
	}{
		{"sync_services", u.syncServices},
		{"gc", u.garbageCollector},
	}
	for _, route := range routes {
		router.Path("/" + route.name).
			Methods(http.MethodPost).
			HandlerFunc(route.handler).
			Name(route.name)
	}
	return router
}
