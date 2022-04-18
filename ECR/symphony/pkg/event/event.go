// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"go.uber.org/zap"
)

// Eventer generates events from mutations.
type Eventer struct {
	Logger  log.Logger
	Emitter ev.Emitter
}

// HookTo hooks eventer to ent client.
func (e *Eventer) HookTo(client *ent.Client) {
	client.Use(e.logHook())
	client.WorkOrder.Use(e.workOrderHook())
	client.FlowInstance.Use(e.flowInstanceHook())
	client.Project.Use(e.projectHook())
	client.Location.Use(e.locationHook())
	client.File.Use(e.imageHook())
}

func (e *Eventer) emit(ctx context.Context, name string, obj interface{}) {
	current := viewer.FromContext(ctx)
	event := &ev.Event{
		Tenant: current.Tenant(),
		Name:   name,
		Object: obj,
	}

	logger := e.Logger.For(ctx).With(
		zap.Object("viewer", current),
		zap.Object("data", event),
	)
	emit := func() {
		if err := e.Emitter.Emit(ctx, event); err != nil {
			logger.Error("cannot emit event", zap.Error(err))
		} else {
			logger.Debug("emitted event")
		}
	}

	if tx := ent.TxFromContext(ctx); tx != nil {
		tx.OnCommit(func(next ent.Committer) ent.Committer {
			return ent.CommitFunc(func(ctx context.Context, tx *ent.Tx) error {
				err := next.Commit(ctx, tx)
				if err == nil {
					emit()
				}
				return err
			})
		})
	} else {
		emit()
	}
}
