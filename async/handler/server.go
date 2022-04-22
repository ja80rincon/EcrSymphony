// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package handler

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/health"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"go.uber.org/zap"
	"gocloud.dev/runtimevar"
)

// ServiceName is the current service name.
const ServiceName = "async"

// NewServer is the events server.
type Server struct {
	service      *ev.Service
	logger       log.Logger
	tenancy      viewer.Tenancy
	features     *runtimevar.Variable
	handlers     []Handler
	healthPoller health.Poller
}

// Config defines the async server config.
type Config struct {
	Tenancy      viewer.Tenancy
	Features     *runtimevar.Variable
	Receiver     ev.Receiver
	Logger       log.Logger
	Handlers     []Handler
	HealthPoller health.Poller
}

func NewServer(cfg Config) *Server {
	srv := &Server{
		tenancy:      cfg.Tenancy,
		features:     cfg.Features,
		logger:       cfg.Logger,
		handlers:     cfg.Handlers,
		healthPoller: cfg.HealthPoller,
	}
	srv.service, _ = ev.NewService(
		ev.Config{
			Receiver: cfg.Receiver,
			Handler:  srv,
			OnError: func(ctx context.Context, err error) {
				cfg.Logger.For(ctx).Error("cannot handle event", zap.Error(err))
			},
		},
		ev.WithEvent(event.EntMutation),
	)
	return srv
}

// Serve starts the server.
func (s *Server) Serve(ctx context.Context) error {
	if err := s.healthPoller.Wait(ctx); err != nil {
		return fmt.Errorf("failed to wait for health checks: %w", err)
	}
	s.logger.For(ctx).Info("starting to serve events")
	return s.service.Run(ctx)
}

// Shutdown terminates the server.
func (s *Server) Shutdown(ctx context.Context) error {
	return s.service.Stop(ctx)
}

// HandleEvent implement ev.EventHandler interface.
func (s *Server) HandleEvent(ctx context.Context, evt *ev.Event) error {
	if evt.Name == event.EntMutation {
		if _, ok := evt.Object.(event.LogEntry); !ok {
			return fmt.Errorf("event object %T must be a log entry", evt.Object)
		}
	}

	if err := s.handleEvent(ctx, evt); err != nil {
		s.logger.For(ctx).Error("failed to handle event", zap.Error(err))
	}
	return nil
}

func (s *Server) handleEvent(ctx context.Context, evt *ev.Event) error {
	client, err := s.tenancy.ClientFor(ctx, evt.Tenant)
	if err != nil {
		const msg = "cannot get tenancy client"
		s.logger.For(ctx).Error(msg, zap.Error(err))
		return fmt.Errorf("%s. tenant: %s", msg, evt.Tenant)
	}
	ctx = ent.NewContext(ctx, client)

	var featureList []string
	snapshot, err := s.features.Latest(ctx)
	if err != nil {
		return err
	}
	if tenantFeatures, ok := snapshot.Value.(viewer.TenantFeatures); ok {
		if features, ok := tenantFeatures[evt.Tenant]; ok {
			featureList = features
		}
	}
	v := viewer.NewAutomation(evt.Tenant, ServiceName, user.RoleOwner,
		viewer.WithFeatures(featureList...),
	)
	ctx = log.NewFieldsContext(ctx, zap.Object("viewer", v))
	ctx = viewer.NewContext(ctx, v)
	permissions, err := authz.Permissions(ctx)
	if err != nil {
		const msg = "cannot get permissions"
		s.logger.For(ctx).Error(msg,
			zap.Error(err),
		)
		return fmt.Errorf("%s. tenant: %s, name: %s", msg, evt.Tenant, ServiceName)
	}
	ctx = authz.NewContext(ctx, permissions)

	for _, h := range s.handlers {
		if err := h.Handle(ctx, s.logger, evt.Object); err != nil {
			s.logger.For(ctx).Error("running handler", zap.Error(err))
		}
	}
	return nil
}
