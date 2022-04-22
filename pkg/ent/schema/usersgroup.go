// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/authz"
)

// UsersGroup defines the users group schema.
type UsersGroup struct {
	schema
}

// Fields returns UsersGroup fields.
func (UsersGroup) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty().
			Unique(),
		field.String("description").
			Optional(),
		field.Enum("status").
			NamedValues(
				"Active", "ACTIVE",
				"Deactivated", "DEACTIVATED",
			).
			Default("ACTIVE"),
	}
}

// Edges returns UsersGroup edges.
func (UsersGroup) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("members", User.Type),
		edge.To("policies", PermissionsPolicy.Type),
		edge.To("features", Feature.Type),
	}
}

// Policy returns UserGroup policies.
func (UsersGroup) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.UsersGroupWritePolicyRule(),
		),
	)
}
