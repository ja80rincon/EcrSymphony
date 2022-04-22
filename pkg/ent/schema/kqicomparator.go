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

// Alarm defines the property type schema.
type KqiComparator struct {
	schema
}

// Alarm returns property type alarm.
func (KqiComparator) Fields() []ent.Field {
	return []ent.Field{
		field.Float("number"),
		field.String("comparatorType").NotEmpty(),
	}
}

// Edges returns property type edges.
func (KqiComparator) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("comparatorkqitargetfk", Comparator.Type).
			Ref("comparatorkqitargetfk").Unique(),
		edge.From("kqitargetcomparatorfk", KqiTarget.Type).
			Ref("kqitargetcomparatorfk").Unique(),
	}
}

// Policy returns entity policy.
func (KqiComparator) Policy() ent.Policy {
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
