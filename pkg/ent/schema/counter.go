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

// Counter defines the property type schema.
type Counter struct {
	schema
}

// Counter returns property type counter.
func (Counter) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").NotEmpty().Unique().
			Annotations(entgql.OrderField("NAME")),
		field.String("externalId").
			Annotations(entgql.OrderField("EXTERNALID")),
		field.String("networkManagerSystem").
			Annotations(entgql.OrderField("NETWORKMANAGERSYSTEM")),
	}
}

// Edges returns property type edges.
func (Counter) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("counterfamily", CounterFamily.Type).
			Ref("counterfamily").
			Unique().Annotations(entgql.OrderField("COUNTERFAMILY")),
		edge.From("vendor", Vendor.Type).
			Ref("vendor_fk").
			Unique().Annotations(entgql.OrderField("VENDORFK")),
		edge.To("counter_fk", CounterFormula.Type).
			Annotations(entgql.MapsTo("counter")),
	}
}

// Policy returns entity policy.
func (Counter) Policy() ent.Policy {
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
