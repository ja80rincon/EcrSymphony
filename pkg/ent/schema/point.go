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
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/hooks"
)

// EntryPoint defines the entry point schema.
type EntryPoint struct {
	schema
}

// Fields returns entry point fields.
func (EntryPoint) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("role").
			GoType(flowschema.EntryPointRole("")),
		field.String("cid").
			Optional().
			Nillable(),
	}
}

// Edges returns entry point edges.
func (EntryPoint) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("prev_exit_points", ExitPoint.Type).
			Annotations(entgql.MapsTo("prevExitPoints")).
			Ref("next_entry_points"),
		edge.From("parent_block", Block.Type).
			Annotations(entgql.MapsTo("parentBlock")).
			Ref("entry_point").
			Unique().
			Required(),
	}
}

// Indexes returns entry point indexes.
func (EntryPoint) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("cid").
			Edges("parent_block").
			Unique(),
	}
}

// Hooks returns entry point hooks.
func (EntryPoint) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.VerifyEntryPointTypeHook(),
		hooks.UpdateDraftChangedForEntryHook(),
	}
}

// EntryPoint returns entry point policy.
func (EntryPoint) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.AlwaysAllowRule(),
		),
	)
}

// ExitPoint defines the exit point schema.
type ExitPoint struct {
	schema
}

// ExitPoint returns exit point fields.
func (ExitPoint) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("role").
			GoType(flowschema.ExitPointRole("")),
		field.String("cid").
			Optional().
			Nillable(),
		field.JSON("condition", &flowschema.VariableExpression{}).
			Optional(),
	}
}

// ExitPoint returns exit point edges.
func (ExitPoint) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("next_entry_points", EntryPoint.Type).
			Annotations(entgql.MapsTo("nextEntryPoints")),
		edge.From("parent_block", Block.Type).
			Annotations(entgql.MapsTo("parentBlock")).
			Ref("exit_points").
			Unique().
			Required(),
	}
}

// Indexes returns exit point indexes.
func (ExitPoint) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("cid").
			Edges("parent_block").
			Unique(),
	}
}

// Hooks returns exit point hooks.
func (ExitPoint) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.VerifyExitPointTypeHook(),
		hooks.UpdateDraftChangedForExitHook(),
	}
}

// ExitPoint returns exit point policy.
func (ExitPoint) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			privacy.AlwaysAllowRule(),
		),
	)
}
