// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/badoux/checkmail"
	"github.com/facebookincubator/ent-contrib/entgql"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/hooks"
	"github.com/facebookincubator/symphony/pkg/viewer"

	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
)

// User defines the user schema.
type User struct {
	schema
}

// Fields returns user fields.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("auth_id").
			NotEmpty().
			Immutable().
			Unique(),
		field.String("first_name").
			NotEmpty().
			Optional(),
		field.String("last_name").
			NotEmpty().
			Optional(),
		field.String("email").
			Validate(checkmail.ValidateFormat).
			Optional(),
		field.Enum("status").
			NamedValues(
				"Active", "ACTIVE",
				"Deactivated", "DEACTIVATED",
			).
			Default("ACTIVE"),
		field.Enum("role").
			NamedValues(
				"User", "USER",
				"Admin", "ADMIN",
				"Owner", "OWNER",
			).
			Default("USER"),
		field.Enum("distance_unit").
			NamedValues(
				"Kilometer", "KILOMETER",
				"Mile", "MILE",
			).
			Default("KILOMETER"),
	}
}

// Edges returns user edges.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("profile_photo", File.Type).
			Unique(),
		edge.To("User_create", Recommendations.Type).
			Annotations(entgql.MapsTo("UserCreate")),
		edge.To("User_approved", Recommendations.Type).
			Annotations(entgql.MapsTo("UserApprobed")),
		edge.From("groups", UsersGroup.Type).
			Ref("members"),
		edge.From("organization", Organization.Type).
			Ref("user_fk").Unique().Annotations(entgql.OrderField("ORGANIZATION")),
		edge.From("owned_work_orders", WorkOrder.Type).
			Ref("owner"),
		edge.From("assigned_work_orders", WorkOrder.Type).
			Ref("assignee"),
		edge.From("created_projects", Project.Type).
			Ref("creator"),
		edge.To("features", Feature.Type),
		edge.To("appointment", Appointment.Type),
	}
}

// Policy returns user policy.
func (User) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.DenyMutationOperationRule(
				ent.OpDelete|ent.OpDeleteOne,
			),
			authz.UserWritePolicyRule(),
		),
	)
}

// Hooks of the User.
func (User) Hooks() []ent.Hook {
	return []ent.Hook{
		viewer.UpdateCurrentUser(),
		hooks.SetUserEmailOnCreateHook(),
	}
}
