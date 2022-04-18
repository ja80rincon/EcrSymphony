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
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/hooks"
)

// Block defines the block schema.
type Block struct {
	schema
}

// Fields returns block fields.
func (Block) Fields() []ent.Field {
	return []ent.Field{
		field.String("cid").
			NotEmpty(),
		field.Enum("type").
			NamedValues(
				"Start", "START",
				"End", "END",
				"Decision", "DECISION",
				"SubFlow", "SUB_FLOW",
				"GoTo", "GO_TO",
				"Trigger", "TRIGGER",
				"Action", "ACTION",
				"TrueFalse", "TRUE_FALSE",
			),
		field.Enum("action_type").
			GoType(flowschema.ActionTypeID("")).
			Optional().
			Nillable(),
		field.Enum("trigger_type").
			GoType(flowschema.TriggerTypeID("")).
			Optional().
			Nillable(),
		field.JSON("start_param_definitions", []*flowschema.VariableDefinition{}).
			Optional(),
		field.JSON("input_params", []*flowschema.VariableExpression{}).
			Optional(),
		field.JSON("ui_representation", &flowschema.BlockUIRepresentation{}).
			Optional(),
	}
}

// Edges returns block edges.
func (Block) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("flow", Flow.Type).
			Ref("blocks").
			Unique(),
		edge.From("flow_template", FlowExecutionTemplate.Type).
			Ref("blocks").
			Unique(),
		edge.From("flow_draft", FlowDraft.Type).
			Ref("blocks").
			Unique(),
		edge.To("sub_flow", Flow.Type).
			Unique(),
		edge.To("goto_block", Block.Type).
			Unique().
			From("source_block"),
		edge.From("instances", BlockInstance.Type).
			Ref("block"),
		edge.To("entry_point", EntryPoint.Type).
			Unique(),
		edge.To("exit_points", ExitPoint.Type),
	}
}

// Indexes returns block indexes.
func (Block) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("cid").
			Edges("flow_draft").
			Unique(),
		index.Fields("cid").
			Edges("flow").
			Unique(),
		index.Fields("cid").
			Edges("flow_template").
			Unique(),
	}
}

// Hooks returns block hooks.
func (Block) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.VerifyStartParamDefinitionsHook(),
		hooks.AddDefaultEntryAndExitPointsHook(),
		hooks.DeleteEntryAndExitPointsHook(),
		hooks.UpdateDraftChangedHook(),
	}
}

// Policy returns block policy.
func (Block) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.AutomationTemplatesWritePolicyRule(),
		),
	)
}

// BlockInstance defines the block instance schema.
type BlockInstance struct {
	schema
}

// Fields returns block instance fields.
func (BlockInstance) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("status").
			NamedValues(
				"Pending", "PENDING",
				"InProgress", "IN_PROGRESS",
				"Failed", "FAILED",
				"Completed", "COMPLETED",
				"Waiting", "WAITING",
			).Default("PENDING"),
		field.JSON("inputs", []*flowschema.VariableValue{}).
			Optional(),
		field.JSON("outputs", []*flowschema.VariableValue{}).
			Optional(),
		field.String("failure_reason").
			Optional(),
		field.Int("block_instance_counter").
			Optional(),
		field.Time("start_date").
			Annotations(
				entgql.OrderField("START_AT"),
			),
		field.Time("end_date").
			Optional().
			Nillable().
			Annotations(
				entgql.OrderField("END_AT"),
			),
	}
}

// Mixin returns flow instance mixins.
func (BlockInstance) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.CreateTime{},
		mixin.AnnotateFields(
			mixin.UpdateTime{},
			entgql.OrderField("UPDATED_AT"),
		),
	}
}

// Edges returns block instance edges.
func (BlockInstance) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("flow_instance", FlowInstance.Type).
			Ref("blocks").
			Unique().
			Required(),
		edge.To("block", Block.Type).
			Unique().
			Required(),
		edge.To("subflow_instance", FlowInstance.Type).
			Unique(),
	}
}

// Policy returns block instance policy.
func (BlockInstance) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.AlwaysAllowRule(),
		),
	)
}

func (BlockInstance) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.UpdateFlowInstanceStatus(),
	}
}
