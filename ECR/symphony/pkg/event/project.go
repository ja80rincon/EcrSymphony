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
	"github.com/facebookincubator/symphony/pkg/ent/project"
)

// Project events.
const (
	ProjectAdded   = "project:added"
	ProjectChanged = "project:changed"
)

// Hook returns the hook which generates events from mutations.
func (e *Eventer) projectHook() ent.Hook {
	chain := hook.NewChain(
		e.projectAddedHook(),
		e.projectChangedHook(),
		e.projectBlockUpdateStatusOfManyHook(),
	)
	return chain.Hook()
}

func (e *Eventer) projectAddedHook() ent.Hook {
	var chain hook.Chain
	createHook := func(next ent.Mutator) ent.Mutator {
		return hook.ProjectFunc(func(ctx context.Context, pm *ent.ProjectMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, pm)
			if err == nil {
				e.emit(ctx, ProjectAdded, value)
			}
			return value, err
		})
	}
	chain = chain.Append(hook.If(createHook, hook.And(
		hook.HasOp(ent.OpCreate),
		hook.HasFields(project.FieldCreateTime),
	)))

	return chain.Hook()
}

func (e *Eventer) projectChangedHook() ent.Hook {
	var chain hook.Chain
	updateHook := func(next ent.Mutator) ent.Mutator {
		return hook.ProjectFunc(func(ctx context.Context, pm *ent.ProjectMutation) (ent.Value, error) {
			oldUpdateTime, err := pm.OldUpdateTime(ctx)
			if err != nil {
				return nil, fmt.Errorf("getting project old updateTime: %w", err)
			}
			value, err := next.Mutate(ctx, pm)
			if err != nil {
				return value, err
			}
			if project := value.(*ent.Project); project.UpdateTime != oldUpdateTime {
				e.emit(ctx, ProjectChanged, value)
			}
			return value, nil
		})
	}
	chain = chain.Append(hook.If(updateHook, hook.And(
		hook.HasOp(ent.OpUpdateOne),
		hook.HasFields(project.FieldUpdateTime),
	)))

	return chain.Hook()
}

// ErrProjectUpdateStatusOfMany is returned on project update by predicate.
var ErrProjectUpdateStatusOfMany = errors.New("project update by predicate not allowed")

func (Eventer) projectBlockUpdateStatusOfManyHook() ent.Hook {
	return hook.If(
		hook.FixedError(
			ErrProjectUpdateStatusOfMany,
		),
		hook.And(
			hook.HasOp(ent.OpUpdate),
			hook.HasFields(project.FieldUpdateTime),
		),
	)
}
