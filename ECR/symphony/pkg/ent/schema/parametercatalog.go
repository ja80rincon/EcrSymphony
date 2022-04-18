// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/ent-contrib/entgql"
)

// ParameterCatalog defines the location type schema.
type ParameterCatalog struct {
	schema
}

// Fields returns parameter catalog fields.
func (ParameterCatalog) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Unique(),
		field.Int("index").
			Default(0),
		field.Bool("disabled").
			Default(false).
			StructTag(`gqlgen:"isDisabled"`),
	}
}

// Edges returns parameter catalog edges.
func (ParameterCatalog) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("property_categories", PropertyCategory.Type).
			Annotations(entgql.MapsTo("propertyCategories")),
	}
}
