// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event

import (
	"context"
	"errors"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/file"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
)

// Image events.
const (
	AddImage     = "file:added"
	ImageChanged = "file:changed"
)

// Hook returns the hook which generates events from mutations.
func (e *Eventer) imageHook() ent.Hook {
	chain := hook.NewChain(
		e.imageAddedHook(),
		e.imageChangedHook(),
		e.imageBlockUpdateStatusOfManyHook(),
	)
	return chain.Hook()
}

func (e *Eventer) imageAddedHook() ent.Hook {
	var chain hook.Chain
	createHook := func(next ent.Mutator) ent.Mutator {
		return hook.FileFunc(func(ctx context.Context, pm *ent.FileMutation) (ent.Value, error) {
			value, err := next.Mutate(ctx, pm)
			if err == nil {
				e.emit(ctx, AddImage, value)
			}
			return value, err
		})
	}
	chain = chain.Append(hook.If(createHook, hook.And(
		hook.HasOp(ent.OpCreate),
		hook.HasFields(file.FieldCreateTime),
	)))

	return chain.Hook()
}

func (e *Eventer) imageChangedHook() ent.Hook {
	var chain hook.Chain
	updateHook := func(next ent.Mutator) ent.Mutator {
		return hook.FileFunc(func(ctx context.Context, pm *ent.FileMutation) (ent.Value, error) {
			oldUpdateTime, err := pm.OldUpdateTime(ctx)
			if err != nil {
				return nil, fmt.Errorf("getting image old updateTime: %w", err)
			}
			value, err := next.Mutate(ctx, pm)
			if err != nil {
				return value, err
			}
			if image := value.(*ent.File); image.UpdateTime != oldUpdateTime {
				e.emit(ctx, ImageChanged, value)
			}
			return value, nil
		})
	}
	chain = chain.Append(hook.If(updateHook, hook.And(
		hook.HasOp(ent.OpUpdateOne),
		hook.HasFields(file.FieldUpdateTime),
	)))

	return chain.Hook()
}

// ErrImageUpdateStatusOfMany is returned on image update by predicate.
var ErrImageUpdateStatusOfMany = errors.New("image update by predicate not allowed")

func (Eventer) imageBlockUpdateStatusOfManyHook() ent.Hook {
	return hook.If(
		hook.FixedError(
			ErrImageUpdateStatusOfMany,
		),
		hook.And(
			hook.HasOp(ent.OpUpdate),
			hook.HasFields(file.FieldUpdateTime),
		),
	)
}
