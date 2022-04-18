// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker

import (
	"context"
	"fmt"
	"time"

	"github.com/facebookincubator/symphony/pkg/log"
	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"
	"go.uber.org/cadence/.gen/go/shared"
	"go.uber.org/zap"
)

// HealthChecker checks if cadence is reachable and all its domains registered as expected
type HealthChecker struct {
	cancel  context.CancelFunc
	stopped <-chan struct{}
	healthy bool
}

// NewHealthChecker starts go routine to check until cadence is reachable and returns HealthChecker
func NewHealthChecker(c workflowserviceclient.Interface, factories []DomainFactory, logger log.Logger) (*HealthChecker, func()) {
	ctx, cancel := context.WithCancel(context.Background())
	stopped := make(chan struct{})
	hc := &HealthChecker{
		cancel:  cancel,
		stopped: stopped,
	}
	go func() {
		ticker := time.NewTicker(250 * time.Millisecond)
		defer func() {
			ticker.Stop()
			close(stopped)
		}()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				if ok := checkHealthy(ctx, c, factories, logger); ok {
					hc.healthy = true
					return
				}
			}
		}
	}()
	return hc, cancel
}

// CheckHealth implements health.Checker
func (c HealthChecker) CheckHealth() error {
	select {
	case <-c.stopped:
		if !c.healthy {
			return fmt.Errorf("cadence was unreachable before checker has stopped")
		}
		return nil
	default:
		return fmt.Errorf("still checking if cadence is reachable")
	}
}

func checkHealthy(ctx context.Context, c workflowserviceclient.Interface, factories []DomainFactory, logger log.Logger) bool {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	response, err := c.ListDomains(ctx, &shared.ListDomainsRequest{})
	if err != nil {
		logger.For(ctx).Error("failed to list domains", zap.Error(err))
		return false
	}
	foundDomains := make(map[string]struct{})
	for _, domain := range response.Domains {
		domainName := *domain.DomainInfo.Name
		logger.For(ctx).Info("domain name found", zap.String("domain", domainName))
		foundDomains[domainName] = struct{}{}
	}
	for _, factory := range factories {
		if _, ok := foundDomains[factory.GetDomain().String()]; !ok {
			return false
		}
	}
	return true
}
