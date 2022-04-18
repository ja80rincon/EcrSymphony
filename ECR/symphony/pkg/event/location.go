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
	"github.com/facebookincubator/symphony/pkg/ent/location"
)

// Project events.
const (
	LocationAdded   = "location:added"
	LocationChanged = "location:changed"
)

// Hook returns the hook which generates events from mutations.
func (e *Eventer) locationHook() ent.Hook {
	chain := hook.NewChain(
		e.locationAddedHook(),
		e.locationChangedHook(),
		e.locationBlockUpdateStatusOfManyHook(),
	)
	return chain.Hook()
}

func (e *Eventer) locationAddedHook() ent.Hook {
	var chain hook.Chain
	createHook := func(next ent.Mutator) ent.Mutator {
		return hook.LocationFunc(func(ctx context.Context, lm *ent.LocationMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, lm)
			if err == nil {
				e.emit(ctx, LocationAdded, value)
			}
			return value, err
		})
	}
	chain = chain.Append(hook.If(createHook, hook.And(
		hook.HasOp(ent.OpCreate),
		hook.HasFields(location.FieldCreateTime),
	)))
	return chain.Hook()
}

func (e *Eventer) locationChangedHook() ent.Hook {
	var chain hook.Chain
	updateHook := func(next ent.Mutator) ent.Mutator {
		return hook.LocationFunc(func(ctx context.Context, lm *ent.LocationMutation) (ent.Value, error) {
			oldUpdateTime, err := lm.OldUpdateTime(ctx)
			if err != nil {
				return nil, fmt.Errorf("getting location old updateTime: %w", err)
			}
			value, err := next.Mutate(ctx, lm)
			if err != nil {
				return value, err
			}
			if location := value.(*ent.Location); location.UpdateTime != oldUpdateTime {
				e.emit(ctx, LocationChanged, value)
			}
			return value, nil
		})
	}
	chain = chain.Append(hook.If(updateHook, hook.And(
		hook.HasOp(ent.OpUpdateOne),
		hook.HasFields(location.FieldUpdateTime),
	)))
	return chain.Hook()
}

// ErrLocationUpdateStatusOfMany is returned on location update by predicate.
var ErrLocationUpdateStatusOfMany = errors.New("location update by predicate not allowed")

func (Eventer) locationBlockUpdateStatusOfManyHook() ent.Hook {
	return hook.If(
		hook.FixedError(
			ErrLocationUpdateStatusOfMany,
		),
		hook.And(
			hook.HasOp(ent.OpUpdate),
			hook.HasFields(location.FieldUpdateTime),
		),
	)
}
