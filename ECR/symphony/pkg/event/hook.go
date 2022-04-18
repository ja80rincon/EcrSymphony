// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event

import (
	"context"
	"fmt"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"

	"go.uber.org/zap"
)

func LogHook(handler func(context.Context, log.Logger, ev.EventObject) error, logger log.Logger) ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
			v := viewer.FromContext(ctx)
			if v == nil {
				return next.Mutate(ctx, m)
			}
			entry := LogEntry{
				UserName:  v.Name(),
				Operation: m.Op(),
				Time:      time.Now(),
				Type:      m.Type(),
			}
			if v, ok := v.(*viewer.UserViewer); ok {
				entry.UserID = &v.User().ID
			}
			if m.Op().Is(ent.OpUpdateOne | ent.OpDeleteOne) {
				mutation := m.(interface {
					ID() (int, bool)
					Client() *ent.Client
				})
				if id, exists := mutation.ID(); exists {
					node, err := mutation.Client().Node(ctx, id)
					if err != nil && !ent.IsNotFound(err) {
						logger.For(ctx).
							Error("cannot get pre mutation node",
								zap.Stringer("op", m.Op()),
								zap.Int("id", id),
								zap.Error(err),
							)
						return nil, err
					}
					entry.PrevState = node
				}
			}
			value, err := next.Mutate(ctx, m)
			if err != nil {
				return value, err
			}
			if m.Op().Is(ent.OpCreate | ent.OpUpdateOne) {
				node, err := value.(ent.Noder).Node(ctx)
				if err != nil {
					logger.For(ctx).
						Error("cannot get post mutation node",
							zap.Stringer("op", m.Op()),
							zap.Error(err),
						)
					return nil, fmt.Errorf("cannot get post mutation node: %w", err)
				}
				entry.CurrState = node
			}
			if err := handler(ctx, logger, entry); err != nil {
				logger.For(ctx).
					Error("event handler failed",
						zap.Error(err),
					)
				return nil, err
			}
			return value, nil
		})
	}
	return hook.Unless(hk, ent.OpUpdate|ent.OpDelete)
}
