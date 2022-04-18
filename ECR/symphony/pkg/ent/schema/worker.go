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
)

// EquipmentType defines the equipment type schema.
type WorkerType struct {
	schema
}

// Fields returns equipment type fields.
func (WorkerType) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Unique(),
		field.Text("description").
			Optional().
			Nillable(),
	}
}

// Edges returns equipment type edges.
func (WorkerType) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("property_types", PropertyType.Type).
			Annotations(entgql.MapsTo("propertyTypes")),
	}
}

// Policy returns block policy.
func (WorkerType) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.AutomationTemplatesWritePolicyRule(),
		),
	)
}
