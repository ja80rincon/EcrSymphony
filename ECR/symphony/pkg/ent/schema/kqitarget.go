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

type KqiTarget struct {
	schema
}

func (KqiTarget) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").NotEmpty().Unique().Annotations(entgql.OrderField("NAME")),
		field.Float("period"),
		field.Float("allowedVariation"),
		field.Time("initTime"),
		field.Time("endTime"),
		field.String("impact"),
		field.Bool("status"),
	}
}

func (KqiTarget) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("kqiTargetFk", Kqi.Type).
			Ref("kqiTargetFk").
			Unique(),
		edge.To("kqitargetcomparatorfk", KqiComparator.Type).
			Annotations(entgql.MapsTo("kqicomparator")),
	}
}

func (KqiTarget) Policy() ent.Policy {
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
