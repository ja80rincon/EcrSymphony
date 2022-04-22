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
type Recommendations struct {
	schema
}

// Counter returns property type counter.
func (Recommendations) Fields() []ent.Field {
	return []ent.Field{
		field.String("externalId").
			Annotations(entgql.OrderField("EXTERNALID")),
		field.String("resource").
			Annotations(entgql.OrderField("RESOURCE")),
		field.String("alarmType").
			Annotations(entgql.OrderField("ALARMTYPE")),
		field.String("shortDescription").
			Annotations(entgql.OrderField("SHORTDESCRIPTION")),
		field.String("longDescription").
			Annotations(entgql.OrderField("LONGDESCRIPTION")),
		field.String("command").Optional().Nillable().
			Annotations(entgql.OrderField("COMMAND")),
		field.Int("priority").
			Annotations(entgql.OrderField("PRIORITY")),
		field.Bool("status").
			Annotations(entgql.OrderField("STATUS")),
		field.Int("used").Optional().Nillable().
			Annotations(entgql.OrderField("USED")),
		field.String("runbook").Optional().Nillable().
			Annotations(entgql.OrderField("RUNBOOK")),
	}
}

// Edges returns property type edge.
func (Recommendations) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("recomendation_sources", RecommendationsSources.Type).
			Ref("recommendations").
			Unique().Annotations(entgql.OrderField("RECOMMENDATIONSSOURCE")),
		edge.From("recomendation_category", RecommendationsCategory.Type).
			Ref("recommendations").
			Unique().Annotations(entgql.OrderField("RECOMMENDATIONSCATEGORY")),
		edge.From("UserCreate", User.Type).
			Ref("User_create").
			Unique().Annotations(entgql.OrderField("USERCREATE")),
		edge.From("UserApprobed", User.Type).
			Ref("User_approved").
			Unique().Annotations(entgql.OrderField("USERAPPROVE")),
		edge.From("vendors_recomendations", Vendor.Type).
			Ref("vendors_recomendations").
			Unique().Annotations(entgql.OrderField("VENDORRECOMMENDATIONS")),
	}
}

// Policy returns entity policy.
func (Recommendations) Policy() ent.Policy {
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
