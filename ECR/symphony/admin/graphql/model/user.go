// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package model

import (
	"github.com/facebookincubator/symphony/pkg/ent"
)

// User wraps an ent.User adding multi-tenant id.
type User struct {
	ID ID
	*ent.User
}

// IsNode implements graphql Node interface.
func (User) IsNode() {}

// NewUser creates a user given a tenant name and user entity.
func NewUser(tenant string, user *ent.User) *User {
	return &User{
		ID:   ID{Tenant: tenant, ID: user.ID},
		User: user,
	}
}
