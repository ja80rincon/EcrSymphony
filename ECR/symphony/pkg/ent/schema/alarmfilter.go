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
type AlarmFilter struct {
	schema
}

// Alarm returns property type alarm.
func (AlarmFilter) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").NotEmpty().Unique().Annotations(entgql.OrderField("NAME")),
		field.String("networkResource"),
		field.Time("beginTime"),
		field.Time("endTime"),
		field.String("reason"),
		field.String("user"),
		field.Time("creationTime"),
		field.Bool("enable"),
	}
}

// Edges returns property type edges.
func (AlarmFilter) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("alarmStatusFk", AlarmStatus.Type).
			Ref("alarmStatusFk").
			Unique(),
	}
}

// Policy returns entity policy.
func (AlarmFilter) Policy() ent.Policy {
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
