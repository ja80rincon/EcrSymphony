// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/ent-contrib/entgql"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
)

// Organization defines the property type schema.
type Organization struct {
	schema
}

// Organization returns property type organization.
func (Organization) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").NotEmpty().Unique().
			Annotations(entgql.OrderField("NAME")),
		field.String("description"),
	}
}

// Edges returns property type edges.
func (Organization) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user_fk", User.Type).
			Annotations(entgql.MapsTo("user")),
		edge.To("work_order_fk", WorkOrder.Type).
			Annotations(entgql.MapsTo("workorder")),
		edge.To("policies", PermissionsPolicy.Type),
	}
}

// Policy returns entity policy.
func (Organization) Policy() ent.Policy {
	/*return authz.NewPolicy(
		authz.WithMutationRules(
			authz.AssuranceTemplatesWritePolicyRule(),
		),
	)*/
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.AlwaysAllowRule(),
		),
	)
}
