// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
)

// Counter defines the property type schema.
type CounterFormula struct {
	schema
}

// Counter returns property type counter.
func (CounterFormula) Fields() []ent.Field {
	return []ent.Field{
		field.Bool("mandatory"),
	}
}

// Edges returns expression type edges.
func (CounterFormula) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("formula", Formula.Type).
			Ref("counterformula").
			Unique(),
		edge.From("counter", Counter.Type).
			Ref("counter_fk").
			Unique(),
	}
}

// Policy returns entity policy.
func (CounterFormula) Policy() ent.Policy {
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
