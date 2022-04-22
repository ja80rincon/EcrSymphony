// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package health

import (
	"context"
	"fmt"
	"time"

	"go.uber.org/zap"
	"gocloud.dev/server/health"
)

// poller allows applications that use health checks to wait for the entire service to be ready
type Poller interface {
	Wait(ctx context.Context) error
}

// The PollerFunc type is an adapter to allow the use of
// ordinary functions as pollers.
type PollerFunc func(context.Context) error

// Wait returns f(ctx).
func (f PollerFunc) Wait(ctx context.Context) error {
	return f(ctx)
}

type poller struct {
	logger   *zap.Logger
	checkers []health.Checker
}

func NewPoller(logger *zap.Logger, checkers []health.Checker) Poller {
	return poller{logger, checkers}
}

func (p poller) checkHealthy() error {
	for _, checker := range p.checkers {
		if err := checker.CheckHealth(); err != nil {
			return fmt.Errorf("check health failed: %w", err)
		}
	}
	return nil
}

func (p poller) Wait(ctx context.Context) error {
	ticker := time.NewTicker(250 * time.Millisecond)
	defer func() {
		ticker.Stop()
	}()
	p.logger.Info("waiting for health checks")
	for {
		select {
		case <-ctx.Done():
			return fmt.Errorf("waiting for health check interrupted: %w", ctx.Err())
		case <-ticker.C:
			err := p.checkHealthy()
			if err == nil {
				return nil
			}
			p.logger.Warn("health check failed: %w", zap.Error(err))
		}
	}
}
