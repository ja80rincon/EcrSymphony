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

// ProjectTemplateMixin defines the project template mixin schema.
type ProjectTemplateMixin struct {
	mixin.Schema
}

// Fields returns project template mixin fields.
func (ProjectTemplateMixin) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty(),
		field.Text("description").
			Optional().
			Nillable(),
	}
}

// Edges returns project template mixin edges.
func (ProjectTemplateMixin) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("properties", PropertyType.Type).
			Annotations(entgql.Bind()),
		edge.To("work_orders", WorkOrderDefinition.Type).
			Annotations(entgql.MapsTo("workOrders")),
	}
}

// ProjectTemplate defines the project template schema.
type ProjectTemplate struct {
	schema
}

// Mixin returns project template mixins.
func (p ProjectTemplate) Mixin() []ent.Mixin {
	return append(p.schema.Mixin(), ProjectTemplateMixin{})
}

// Edges returns project template edges.
func (ProjectTemplate) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("type", ProjectType.Type).
			Unique(),
	}
}

// Policy returns work order template policy.
func (ProjectTemplate) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.AlwaysAllowRule(),
		),
	)
}

// ProjectType defines the project type schema.
type ProjectType struct {
	schema
}

// Mixin returns work project type mixins.
func (p ProjectType) Mixin() []ent.Mixin {
	return append(p.schema.Mixin(), ProjectTemplateMixin{})
}

// Edges return project type edges.
func (ProjectType) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("projects", Project.Type).
			Annotations(entgql.Bind()),
	}
}

// Indexes returns work project type indexes.
func (ProjectType) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("name").Unique(),
	}
}

// Policy returns project type policy.
func (ProjectType) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.ProjectTypeWritePolicyRule(),
		),
	)
}

// Project defines the project schema.
type Project struct {
	schema
}

// Fields returns project fields.
func (Project) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty().
			Unique().
			Annotations(
				entgql.OrderField("NAME"),
			),
		field.Text("description").
			Optional().
			Nillable(),
		field.Enum("priority").
			NamedValues(
				"Urgent", "URGENT",
				"High", "HIGH",
				"Medium", "MEDIUM",
				"Low", "LOW",
				"None", "NONE",
			).
			Annotations(
				entgql.OrderField("PRIORITY"),
			).
			Default("NONE"),
	}
}

// Edges returns project edges.
func (Project) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("type", ProjectType.Type).
			Ref("projects").
			Unique().
			Required().
			Annotations(entgql.Bind()),
		edge.To("template", ProjectTemplate.Type).
			Unique().
			Annotations(entgql.Bind()),
		edge.To("location", Location.Type).
			Unique().
			Annotations(entgql.Bind()),
		edge.To("comments", Comment.Type).
			Annotations(entgql.Bind()),
		edge.To("work_orders", WorkOrder.Type).
			Annotations(entgql.MapsTo("workOrders")),
		edge.To("properties", Property.Type).
			Annotations(entgql.Bind()),
		edge.To("creator", User.Type).
			Comment("Being used as Owner in the UI").
			Unique().
			Annotations(entgql.MapsTo("createdBy")),
	}
}

// Indexes return project indexes.
func (Project) Indexes() []ent.Index {
	indexes := []ent.Index{
		index.Fields("name").
			Edges("type").
			Unique(),
	}
	for _, f := range (mixin.Time{}).Fields() {
		indexes = append(indexes,
			index.Fields(f.Descriptor().Name),
		)
	}
	return indexes
}

// Mixin returns project mixins.
func (Project) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.AnnotateFields(
			mixin.CreateTime{},
			entgql.OrderField("CREATED_AT"),
		),
		mixin.AnnotateFields(
			mixin.UpdateTime{},
			entgql.OrderField("UPDATED_AT"),
		),
	}
}

// Hooks returns project hooks.
func (Project) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.ProjectAddTemplateHook(),
	}
}

// Policy returns project policy.
func (Project) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithQueryRules(
			authz.ProjectReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.ProjectWritePolicyRule(),
			authz.AllowProjectCreatorWrite(),
		),
	)
}

// WorkOrderDefinition defines the work order definition schema.
type WorkOrderDefinition struct {
	schema
}

// Fields returns work order definition fields.
func (WorkOrderDefinition) Fields() []ent.Field {
	return []ent.Field{
		field.Int("index").
			Optional(),
	}
}

// Edges returns work order definition edges.
func (WorkOrderDefinition) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("type", WorkOrderType.Type).
			Unique().
			Annotations(entgql.Bind()),
		edge.From("project_type", ProjectType.Type).
			Ref("work_orders").
			Unique(),
		edge.From("project_template", ProjectTemplate.Type).
			Ref("work_orders").
			Unique(),
	}
}

// Policy returns work order definition policy.
func (WorkOrderDefinition) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.WorkOrderDefinitionWritePolicyRule(),
		),
	)
}
