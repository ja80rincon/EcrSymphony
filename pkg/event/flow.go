// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event

import (
	"context"
	"errors"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/flowinstance"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
)

// Flow events.
const (
	FlowInstanceDone = "flow_instance:done"
)

// Hook returns the hook which generates events from mutations.
func (e *Eventer) flowInstanceHook() ent.Hook {
	chain := hook.NewChain(
		e.flowInstanceCreateHook(),
		e.flowInstanceUpdateHook(),
		e.flowInstanceUpdateOneHook(),
	)
	return chain.Hook()
}

func (e *Eventer) flowInstanceCreateHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.FlowInstanceFunc(func(ctx context.Context, m *ent.FlowInstanceMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, m)
			if err != nil {
				return value, err
			}
			status := value.(*ent.FlowInstance).Status
			if status == flowinstance.StatusCompleted ||
				status == flowinstance.StatusFailed ||
				status == flowinstance.StatusCancelled {
				e.emit(ctx, FlowInstanceDone, value)
			}
			return value, nil
		})
	}
	return hook.On(hk, ent.OpCreate)
}

// ErrFlowInstanceUpdateStatusOfMany is returned on flow instance status update by predicate.
var ErrFlowInstanceUpdateStatusOfMany = errors.New("flow instance status update to done by predicate not allowed")

func (e *Eventer) statusSetToDone(m *ent.FlowInstanceMutation) bool {
	if status, exists := m.Status(); exists &&
		(status == flowinstance.StatusCompleted ||
			status == flowinstance.StatusFailed ||
			status == flowinstance.StatusCancelled) {
		return true
	}
	return false
}

func (e *Eventer) flowInstanceUpdateHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.FlowInstanceFunc(func(ctx context.Context, m *ent.FlowInstanceMutation) (ent.Value, error) {
			if e.statusSetToDone(m) {
				return nil, ErrFlowInstanceUpdateStatusOfMany
			}
			return next.Mutate(ctx, m)
		})
	}
	return hook.If(hk, hook.And(hook.HasOp(ent.OpUpdate), hook.HasFields(flowinstance.FieldStatus)))
}

func (e *Eventer) flowInstanceUpdateOneHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.FlowInstanceFunc(func(ctx context.Context, m *ent.FlowInstanceMutation) (ent.Value, error) {
			if !e.statusSetToDone(m) {
				return next.Mutate(ctx, m)
			}
			status, _ := m.Status()
			oldStatus, err := m.OldStatus(ctx)
			if err != nil {
				return nil, fmt.Errorf("fetching flow instance old status: %w", err)
			}
			value, err := next.Mutate(ctx, m)
			if err == nil && oldStatus != status {
				e.emit(ctx, FlowInstanceDone, value)
			}
			return value, err
		})
	}
	return hook.If(hk, hook.And(hook.HasOp(ent.OpUpdateOne), hook.HasFields(flowinstance.FieldStatus)))
}
