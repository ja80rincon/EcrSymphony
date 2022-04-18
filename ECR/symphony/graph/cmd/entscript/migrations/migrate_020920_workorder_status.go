// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package migrations

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"

	"go.uber.org/zap"
)

// MigrateWorkOrderStatus change all work order statuses: (DONE->CLOSED, PENDING->PLANNED)
func MigrateWorkOrderStatus(ctx context.Context, logger *zap.Logger) error {
	client := ent.FromContext(ctx)

	// PENDING -> PLANNED
	changed, err := client.WorkOrder.Update().
		Where(workorder.StatusEQ(workorder.StatusPending)).
		SetStatus(workorder.StatusPlanned).
		Save(privacy.DecisionContext(
			ctx, privacy.Allow,
		))

	if err != nil {
		return fmt.Errorf("failed to update status from pending to planned: %w", err)
	}
	logger.Info("workorders with pending status updated", zap.Int("count", changed))

	// DONE -> CLOSED
	changed, err = client.WorkOrder.Update().
		Where(workorder.StatusEQ(workorder.StatusDone)).
		SetStatus(workorder.StatusClosed).
		Save(privacy.DecisionContext(
			ctx, privacy.Allow,
		))

	if err != nil {
		return fmt.Errorf("failed to update status from done to closed: %w", err)
	}
	logger.Info("workorders with done status updated", zap.Int("count", changed))

	return nil
}
