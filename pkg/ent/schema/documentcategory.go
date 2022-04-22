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
)

// DocumentCategory defines the property type schema.
type DocumentCategory struct {
	schema
}

// Fields returns property type fields.
func (DocumentCategory) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty(),
		field.Int("index"),
	}
}

// Edges returns property type edges.
func (DocumentCategory) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("location_type", LocationType.Type).
			Ref("document_category").
			Unique(),
		edge.To("files", File.Type).
			Annotations(entgql.Bind()),
		edge.To("hyperlinks", Hyperlink.Type).
			Annotations(entgql.Bind()),
	}
}

// Indexes returns property type indexes.
func (DocumentCategory) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("name").
			Edges("location_type").
			Unique(),
	}
}

// Policy returns location policy.
func (DocumentCategory) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithQueryRules(
			authz.DocumentCategoryReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.DocumentCategoryWritePolicyRule(),
		),
	)
}
