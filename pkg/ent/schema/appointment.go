// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebook/ent/schema/index"
	"github.com/facebookincubator/ent-contrib/entgql"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
)

// Appointment defines de appointment schema
type Appointment struct {
	schema
}

// Fields returns Appointment fields.
func (Appointment) Fields() []ent.Field {
	return []ent.Field{
		field.Time("start"),
		field.Time("end"),
		field.Float("duration"),
		field.Enum("status").
			NamedValues(
				"Active", "ACTIVE",
				"Cancelled", "CANCELLED",
			).
			Default("ACTIVE"),
		field.Time("creation_date").
			Annotations(
				entgql.OrderField("CREATED_AT"),
			),
	}
}

func (Appointment) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("workorder", WorkOrder.Type).
			Ref("appointment").
			Unique(),
		edge.From("assignee", User.Type).
			Ref("appointment").
			Unique(),
	}
}

func (Appointment) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("start"),
		index.Fields("end"),
		index.Edges("workorder"),
	}
}

func (Appointment) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.AlwaysAllowRule(),
		),
	)
	/*return authz.NewPolicy(
		authz.WithQueryRules(
			authz.WorkOrderReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.WorkOrderWritePolicyRule(),
			authz.AllowWorkOrderOwnerWrite(),
			authz.AllowWorkOrderAssigneeWrite(),
		),
	)*/
}
