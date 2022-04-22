// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
)

// Feature defines the feature schema.
type Feature struct {
	schema
}

// Fields returns feature fields.
func (Feature) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty().
			Immutable().
			Unique(),
		field.Bool("global").
			Default(true),
		field.Bool("enabled").
			Default(false),
		field.String("description").
			Nillable().
			Optional(),
	}
}

// Edges returns feature edges.
func (Feature) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("users", User.Type).
			Ref("features"),
		edge.From("groups", UsersGroup.Type).
			Ref("features"),
	}
}
