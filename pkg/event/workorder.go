// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event

import (
	"context"
	"errors"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
)

// Work order events.
const (
	WorkOrderAdded         = "work_order:added"
	WorkOrderDone          = "work_order:done"
	WorkOrderStatusChanged = "work_order:status_changed"
)

// WorkOrderStatusChangedPayload is the payload of WorkOrderStatusChanged event.
type WorkOrderStatusChangedPayload struct {
	From      *workorder.Status `json:"from"`
	To        workorder.Status  `json:"to"`
	WorkOrder *ent.WorkOrder    `json:"workOrder"`
}

// Hook returns the hook which generates events from mutations.
func (e *Eventer) workOrderHook() ent.Hook {
	chain := hook.NewChain(
		e.workOrderBlockUpdateStatusOfManyHook(),
		e.workOrderDoneHook(),
		e.workOrderAddedHook(),
		e.workOrderStatusChangedHook(),
	)
	return chain.Hook()
}

func (e *Eventer) workOrderDoneHook() ent.Hook {
	isStatusDoneOrClosed := func(status workorder.Status) bool {
		return status == workorder.StatusDone || status == workorder.StatusClosed
	}

	var chain hook.Chain
	createHook := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, m *ent.WorkOrderMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, m)
			if err != nil {
				return value, err
			}
			if isStatusDoneOrClosed(value.(*ent.WorkOrder).Status) {
				e.emit(ctx, WorkOrderDone, value)
			}
			return value, nil
		})
	}
	chain = chain.Append(hook.On(createHook, ent.OpCreate))

	updateHook := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, m *ent.WorkOrderMutation) (ent.Value, error) {
			status, _ := m.Status()
			if !isStatusDoneOrClosed(status) {
				return next.Mutate(ctx, m)
			}
			oldStatus, err := m.OldStatus(ctx)
			if err != nil {
				return nil, fmt.Errorf("getting work order old status: %w", err)
			}
			if isStatusDoneOrClosed(oldStatus) {
				return next.Mutate(ctx, m)
			}
			value, err := next.Mutate(ctx, m)
			if err == nil {
				e.emit(ctx, WorkOrderDone, value)
			}
			return value, err
		})
	}
	chain = chain.Append(hook.If(updateHook, hook.And(
		hook.HasOp(ent.OpUpdateOne),
		hook.HasFields(workorder.FieldStatus),
	)))

	return chain.Hook()
}

func (e *Eventer) workOrderAddedHook() ent.Hook {
	var chain hook.Chain
	createHook := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, m *ent.WorkOrderMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, m)
			if err == nil {
				e.emit(ctx, WorkOrderAdded, value)
			}
			return value, err
		})
	}
	chain = chain.Append(hook.If(createHook, hook.And(
		hook.HasOp(ent.OpCreate),
		hook.HasFields(workorder.FieldCreationDate),
	)))
	return chain.Hook()
}

func (e *Eventer) workOrderStatusChangedHook() ent.Hook {
	var chain hook.Chain
	createHook := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, m *ent.WorkOrderMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, m)
			if err != nil {
				return value, err
			}
			workOrder := value.(*ent.WorkOrder)
			e.emit(ctx, WorkOrderStatusChanged, &WorkOrderStatusChangedPayload{
				To:        workOrder.Status,
				WorkOrder: workOrder,
			})
			return value, nil
		})
	}
	chain = chain.Append(hook.On(createHook, ent.OpCreate))

	updateHook := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, m *ent.WorkOrderMutation) (ent.Value, error) {
			oldStatus, err := m.OldStatus(ctx)
			if err != nil {
				return nil, fmt.Errorf("getting work order old status: %w", err)
			}
			value, err := next.Mutate(ctx, m)
			if err != nil {
				return value, err
			}
			if workOrder := value.(*ent.WorkOrder); workOrder.Status != oldStatus {
				e.emit(ctx, WorkOrderStatusChanged, &WorkOrderStatusChangedPayload{
					From:      &oldStatus,
					To:        workOrder.Status,
					WorkOrder: workOrder,
				})
			}
			return value, nil
		})
	}
	chain = chain.Append(hook.If(updateHook, hook.And(
		hook.HasOp(ent.OpUpdateOne),
		hook.HasFields(workorder.FieldStatus),
	)))

	return chain.Hook()
}

// ErrWorkOrderUpdateStatusOfMany is returned on work order status update by predicate.
var ErrWorkOrderUpdateStatusOfMany = errors.New("work order status update by predicate not allowed")

func (Eventer) workOrderBlockUpdateStatusOfManyHook() ent.Hook {
	return hook.If(
		hook.FixedError(
			ErrWorkOrderUpdateStatusOfMany,
		),
		hook.And(
			hook.HasOp(ent.OpUpdate),
			hook.HasFields(workorder.FieldStatus),
		),
	)
}
