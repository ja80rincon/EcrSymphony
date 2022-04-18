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

// LocationType defines the location type schema.
type LocationType struct {
	schema
}

// Fields returns location type fields.
func (LocationType) Fields() []ent.Field {
	return []ent.Field{
		field.Bool("site").
			Default(false).
			StructTag(`gqlgen:"isSite"`),
		field.String("name").
			Unique(),
		field.String("map_type").
			Optional(),
		field.Int("map_zoom_level").
			Optional().
			Default(7),
		field.Int("index").
			Default(0),
	}
}

// Edges returns location type edges.
func (LocationType) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("locations", Location.Type).
			Ref("type").
			Annotations(entgql.Bind()),
		edge.To("property_types", PropertyType.Type).
			Annotations(entgql.MapsTo("propertyTypes")),
		edge.To("survey_template_categories", SurveyTemplateCategory.Type).
			Annotations(entgql.MapsTo("surveyTemplateCategories")),
		edge.To("document_category", DocumentCategory.Type).
			Annotations(entgql.MapsTo("documentCategories")),
	}
}

// Policy returns location policy.
func (LocationType) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.LocationTypeWritePolicyRule(),
		),
	)
}

// Location defines the location schema.
type Location struct {
	schema
}

// Fields returns location fields.
func (Location) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty().
			Annotations(
				entgql.OrderField("NAME"),
			),
		field.String("external_id").
			Unique().
			Optional(),
		field.Float("latitude").
			Default(0).
			Range(-90, 90),
		field.Float("longitude").
			Default(0).
			Range(-180, 180),
		field.Bool("site_survey_needed").
			StructTag(`gqlgen:"siteSurveyNeeded"`).
			Optional().
			Default(false),
	}
}

// Edges returns location edges.
func (Location) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("type", LocationType.Type).
			Unique().
			Required().
			Annotations(entgql.MapsTo("locationType")),
		edge.To("children", Location.Type).
			Annotations(entgql.Bind()).
			From("parent").
			Unique().
			Annotations(entgql.MapsTo("parentLocation")),
		edge.To("files", File.Type).
			Annotations(entgql.MapsTo("files", "images")),
		edge.To("hyperlinks", Hyperlink.Type).
			Annotations(entgql.Bind()),
		edge.To("equipment", Equipment.Type).
			Annotations(entgql.MapsTo("equipments")),
		edge.To("properties", Property.Type).
			Annotations(entgql.Bind()),
		edge.From("survey", Survey.Type).
			Ref("location").
			Annotations(entgql.MapsTo("surveys")),
		edge.From("wifi_scan", SurveyWiFiScan.Type).
			Ref("location").
			Annotations(entgql.MapsTo("wifiData")),
		edge.From("cell_scan", SurveyCellScan.Type).
			Ref("location").
			Annotations(entgql.MapsTo("cellData")),
		edge.From("work_orders", WorkOrder.Type).
			Ref("location").
			Annotations(entgql.MapsTo("workOrders")),
		edge.From("floor_plans", FloorPlan.Type).
			Ref("location").
			Annotations(entgql.MapsTo("floorPlans")),
	}
}

// Indexes returns location indexes.
func (Location) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("name").
			Edges("type", "parent").
			Unique(),
	}
}

// Policy returns location policy.
func (Location) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.LocationWritePolicyRule(),
		),
	)
}
