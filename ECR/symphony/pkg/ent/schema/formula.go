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
type Formula struct {
	schema
}

// Counter returns formula.
func (Formula) Fields() []ent.Field {
	return []ent.Field{
		field.String("textFormula").NotEmpty().Unique().
			Annotations(entgql.OrderField("TEXTFORMULA")),
		field.Bool("status").
			Annotations(entgql.OrderField("STATUS")),
	}
}

// Edges returns formula type edges.
func (Formula) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("networkType", NetworkType.Type).
			Ref("formulaNetworkType_FK").
			Unique(),
		edge.From("tech", Tech.Type).
			Ref("formulatech").
			Unique(),
		edge.From("kpi", Kpi.Type).
			Ref("formulakpi").
			Unique(),
		edge.To("counterformula", CounterFormula.Type).
			Annotations(entgql.MapsTo("counter_formula")),
	}
}

// Policy returns entity policy.
func (Formula) Policy() ent.Policy {
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
