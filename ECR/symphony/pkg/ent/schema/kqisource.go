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

// Alarm defines the property type schema.
type KqiSource struct {
	schema
}

// Alarm returns property type alarm.
func (KqiSource) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").NotEmpty().Unique().Annotations(entgql.OrderField("NAME")),
	}
}

// Edges returns property type edges.
func (KqiSource) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("kqiSourceFk", Kqi.Type).
			Annotations(entgql.MapsTo("kqi")),
	}
}

// Policy returns entity policy.
func (KqiSource) Policy() ent.Policy {
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
