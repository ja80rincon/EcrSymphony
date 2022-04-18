// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent/activity"
)

// Activity defines the location type schema.
type Activity struct {
	schema
}

// Fields returns Activity fields.
func (Activity) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("activity_type").
			NamedValues(
				"StatusChanged", "STATUS",
				"PriorityChanged", "PRIORITY",
				"AssigneeChanged", "ASSIGNEE",
				"CreationDateChanged", "CREATION_DATE",
				"OwnerChanged", "OWNER",
				"NameChanged", "NAME",
				"DescriptionChanged", "DESCRIPTION",
				"ClockIn", "CLOCK_IN",
				"ClockOut", "CLOCK_OUT",
			).
			StorageKey("changed_field"),
		field.Bool("is_create").
			Default(false),
		field.String("old_value").
			Optional().
			Comment("raw value of the previous state (enum, entID ..)"),
		field.String("new_value").
			Optional().
			Comment("raw value of the next state (enum, entID ..)"),
		field.JSON("clock_details", activity.ClockDetails{}).
			Optional(),
	}
}

// Edges returns Activity edges.
func (Activity) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("author", User.Type).
			Unique(),
		edge.From("work_order", WorkOrder.Type).
			Ref("activities").
			Unique(),
	}
}

// Policy returns Activity policy.
func (Activity) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithQueryRules(
			authz.ActivityReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.ActivityWritePolicyRule(),
			authz.ActivityCreatePolicyRule(),
		),
	)
}
