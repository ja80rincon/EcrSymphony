// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package graphql

import (
	"bytes"
	"context"
	"errors"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/NYTimes/gziphandler"
	"github.com/facebookincubator/ent-contrib/entgql"
	"github.com/facebookincubator/symphony/graph/graphql/complexity"
	"github.com/facebookincubator/symphony/graph/graphql/directive"
	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/resolver"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/telemetry/ocgql"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.opencensus.io/plugin/ochttp"
	"go.opencensus.io/trace"
	"go.uber.org/zap"
)

// HandlerConfig configures graphql handler.
type HandlerConfig struct {
	Client          *ent.Client
	Logger          log.Logger
	ComplexityLimit int
	ReceiverFactory ev.ReceiverFactory
	TriggerFactory  triggers.Factory
	ActionFactory   actions.Factory
}

func init() {
	ocgql.DefaultViews = append(ocgql.DefaultViews,
		directive.ServerDeprecatedCountByObjectInputField,
	)
	for _, v := range ocgql.DefaultViews {
		v.TagKeys = append(v.TagKeys, viewer.KeyTenant)
	}
}

// NewHandler creates a graphql http handler.
func NewHandler(cfg HandlerConfig) http.Handler {
	rsv := resolver.New(
		resolver.Config{
			Logger:          cfg.Logger,
			ReceiverFactory: cfg.ReceiverFactory,
			Flow: resolver.FlowConfig{
				TriggerFactory: cfg.TriggerFactory,
				ActionFactory:  cfg.ActionFactory,
			},
		},
	)

	router := mux.NewRouter()
	router.Use(func(next http.Handler) http.Handler {
		handler := http.TimeoutHandler(next, 3*time.Minute, "request timed out")
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			h := handler
			if websocket.IsWebSocketUpgrade(r) {
				h = next
			}
			h.ServeHTTP(w, r)
		})
	})
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			span := trace.FromContext(r.Context())
			if !span.IsRecordingEvents() {
				next.ServeHTTP(w, r)
				return
			}
			body, err := ioutil.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			span.AddAttributes(
				trace.StringAttribute("http.body", string(body)),
			)
			r.Body = ioutil.NopCloser(bytes.NewReader(body))
			next.ServeHTTP(w, r)
		})
	})

	srv := gqlutil.NewServer(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers:  rsv,
				Directives: directive.New(cfg.Logger),
				Complexity: complexity.New(),
			},
		),
	)
	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
	})
	srv.Use(entgql.Transactioner{
		TxOpener: entgql.TxOpenerFunc(ent.OpenTxFromContext),
	})
	srv.SetErrorPresenter(errorPresenter(cfg.Logger))
	srv.SetRecoverFunc(gqlutil.RecoverFunc(cfg.Logger))

	if cfg.ComplexityLimit == 0 {
		cfg.ComplexityLimit = complexity.Infinite
	}
	srv.Use(extension.FixedComplexityLimit(cfg.ComplexityLimit))

	router.Path("/graphiql").
		Handler(
			ochttp.WithRouteTag(
				playground.Handler(
					"GraphQL playground",
					"/graph/query",
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

func errorPresenter(logger log.Logger) graphql.ErrorPresenterFunc {
	return func(ctx context.Context, err error) (gqlerr *gqlerror.Error) {
		defer func() {
			if errors.Is(err, privacy.Deny) {
				gqlerr.Message = "Permission denied"
			}
		}()
		if errors.As(err, &gqlerr) {
			if gqlerr.Path == nil {
				gqlerr.Path = graphql.GetPath(ctx)
			}
			return gqlerr
		}
		logger.For(ctx).
			Error("graphql internal failure",
				zap.Error(err),
			)
		return &gqlerror.Error{
			Message: "Sorry, something went wrong",
			Path:    graphql.GetPath(ctx),
		}
	}
}
