// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks

import (
	"context"

	"github.com/badoux/checkmail"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/ent/user"
)

// SetUserEmailOnCreateHook sets user email value by copying
// its value from AuthID provided it's a valid email address.
func SetUserEmailOnCreateHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.UserFunc(func(ctx context.Context, m *ent.UserMutation) (ent.Value, error) {
			if email, _ := m.AuthID(); checkmail.ValidateFormat(email) == nil {
				m.SetEmail(email)
			}
			return next.Mutate(ctx, m)
		})
	}
	return hook.If(hk,
		hook.And(
			hook.HasOp(ent.OpCreate),
			hook.HasFields(user.FieldAuthID),
			hook.Not(hook.HasFields(user.FieldEmail)),
		),
	)
}
