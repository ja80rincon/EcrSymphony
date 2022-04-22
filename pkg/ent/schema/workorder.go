// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebook/ent/schema/index"
	"github.com/facebook/ent/schema/mixin"
	"github.com/facebookincubator/ent-contrib/entgql"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/hooks"
)

// WorkOrderTemplateMixin defines the work order template mixin schema.
type WorkOrderTemplateMixin struct {
	mixin.Schema
}

// Fields returns work order template mixin fields.
func (WorkOrderTemplateMixin) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.Text("description").
			Optional().
			Nillable(),
		field.Bool("assignee_can_complete_work_order").
			Optional().
			Default(true),
		field.Float("duration").
			Optional().
			Nillable(),
	}
}

// Edges returns work order template mixin edges.
func (WorkOrderTemplateMixin) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("property_types", PropertyType.Type).
			Annotations(entgql.MapsTo("propertyTypes")),
		edge.To("check_list_category_definitions", CheckListCategoryDefinition.Type).
			Annotations(entgql.MapsTo("checkListCategoryDefinitions")),
	}
}

// WorkOrderType defines the work order type schema.
type WorkOrderType struct {
	schema
}

// Mixin returns work order type mixins.
func (w WorkOrderType) Mixin() []ent.Mixin {
	return append(w.schema.Mixin(), WorkOrderTemplateMixin{})
}

// Indexes returns work order type indexes.
func (WorkOrderType) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("name").Unique(),
	}
}

// Edges returns work order type edges.
func (WorkOrderType) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("work_orders", WorkOrder.Type).
			Ref("type"),
		edge.From("definitions", WorkOrderDefinition.Type).
			Ref("type"),
	}
}

// Policy returns work order type policy.
func (WorkOrderType) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.WorkOrderTypeWritePolicyRule(),
		),
	)
}

// WorkOrderTemplate defines the work order template schema.
type WorkOrderTemplate struct {
	schema
}

// Mixin returns work order template mixins.
func (w WorkOrderTemplate) Mixin() []ent.Mixin {
	return append(w.schema.Mixin(), WorkOrderTemplateMixin{})
}

// Edges returns work order template edges.
func (WorkOrderTemplate) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("type", WorkOrderType.Type).
			Unique(),
	}
}

// Policy returns work order template policy.
func (WorkOrderTemplate) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.AlwaysAllowRule(),
		),
	)
}

// WorkOrder defines the work order schema.
type WorkOrder struct {
	schema
}

// Fields returns work order fields.
func (WorkOrder) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty().
			Annotations(entgql.Annotation{
				OrderField: "NAME",
			}),
		field.Enum("status").
			NamedValues(
				"Planned", "PLANNED",
				"InProgress", "IN_PROGRESS",
				"Pending", "PENDING",
				"Submitted", "SUBMITTED",
				"Closed", "CLOSED",
				"Done", "DONE",
				"Blocked", "BLOCKED",
				"Canceled", "CANCELED",
				"Suspended", "SUSPENDED",
			).
			Default("PLANNED"),
		field.Enum("priority").
			NamedValues(
				"Urgent", "URGENT",
				"High", "HIGH",
				"Medium", "MEDIUM",
				"Low", "LOW",
				"None", "NONE",
			).
			Default("NONE"),
		field.Text("description").
			Optional().
			Nillable(),
		field.Time("install_date").
			Optional().
			Nillable(),
		field.Time("creation_date").
			Annotations(
				entgql.OrderField("CREATED_AT"),
			),
		field.Int("index").
			Optional(),
		field.Time("close_date").
			Optional().
			Nillable().
			Annotations(
				entgql.OrderField("CLOSED_AT"),
			),
		field.Float("duration").
			Optional().
			Nillable(),
		field.Time("schedulled_at").
			Optional().
			Nillable(),
		field.Time("due_date").
			Optional().
			Nillable(),
	}
}

// Edges returns work order edges.
func (WorkOrder) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("type", WorkOrderType.Type).
			Unique().
			Annotations(entgql.MapsTo("workOrderType")),
		edge.To("template", WorkOrderTemplate.Type).
			Unique().
			Annotations(entgql.MapsTo("workOrderTemplate")),
		edge.From("equipment", Equipment.Type).
			Ref("work_order"),
		edge.From("links", Link.Type).
			Ref("work_order"),
		edge.From("organization", Organization.Type).
			Ref("work_order_fk").Unique().Annotations(entgql.OrderField("ORGANIZATION")),
		edge.To("files", File.Type),
		edge.To("hyperlinks", Hyperlink.Type).
			Annotations(entgql.Bind()),
		edge.To("location", Location.Type).
			Unique().
			Annotations(entgql.Bind()),
		edge.To("comments", Comment.Type).
			Annotations(entgql.Bind()),
		edge.To("activities", Activity.Type).
			Annotations(entgql.Bind()),
		edge.To("properties", Property.Type).
			Annotations(entgql.Bind()),
		edge.To("check_list_categories", CheckListCategory.Type).
			Annotations(entgql.MapsTo("checkListCategories")),
		edge.From("project", Project.Type).
			Ref("work_orders").
			Unique().
			Annotations(entgql.Bind()),
		edge.To("owner", User.Type).
			Required().
			Unique().
			Annotations(entgql.Bind()),
		edge.To("assignee", User.Type).
			Annotations(entgql.MapsTo("assignedTo")).
			Unique(),
		edge.To("appointment", Appointment.Type),
	}
}

// Indexes returns work order indexes.
func (WorkOrder) Indexes() []ent.Index {
	indexes := []ent.Index{
		index.Fields("creation_date"),
		index.Fields("close_date"),
	}
	for _, f := range (mixin.Time{}).Fields() {
		indexes = append(indexes,
			index.Fields(f.Descriptor().Name),
		)
	}
	return indexes
}

// Mixin returns work order mixins.
func (WorkOrder) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.CreateTime{},
		mixin.AnnotateFields(
			mixin.UpdateTime{},
			entgql.OrderField("UPDATED_AT"),
		),
	}
}

// Hooks returns work order hooks.
func (WorkOrder) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.WorkOrderCloseDateHook(),
		hooks.WorkOrderAddTemplateHook(),
		hooks.WorkOrderMandatoryPropertyOnClose(),
		hooks.WorkOrderUpdateStatusHook(),
	}
}

// Policy returns work order policy.
func (WorkOrder) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithQueryRules(
			authz.WorkOrderReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.WorkOrderWritePolicyRule(),
			authz.AllowWorkOrderOwnerWrite(),
			authz.AllowWorkOrderAssigneeWrite(),
		),
	)
}
