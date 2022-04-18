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

// PropertyType defines the property type schema.
type PropertyType struct {
	schema
}

// Fields returns property type fields.
func (PropertyType) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("type").
			Values(
				"string",
				"int",
				"bool",
				"float",
				"date",
				"enum",
				"range",
				"email",
				"gps_location",
				"datetime_local",
				"node",
			),
		field.String("name"),
		field.String("external_id").
			Unique().
			Optional(),
		field.Int("index").
			Optional(),
		field.String("category").
			Optional(),
		field.Int("int_val").
			StructTag(`json:"intValue" gqlgen:"intValue"`).
			Optional().
			Nillable(),
		field.Bool("bool_val").
			StructTag(`json:"booleanValue" gqlgen:"booleanValue"`).
			Optional().
			Nillable(),
		field.Float("float_val").
			StructTag(`json:"floatValue" gqlgen:"floatValue"`).
			Optional().
			Nillable(),
		field.Float("latitude_val").
			StructTag(`json:"latitudeValue" gqlgen:"latitudeValue"`).
			Optional().
			Nillable(),
		field.Float("longitude_val").
			StructTag(`json:"longitudeValue" gqlgen:"longitudeValue"`).
			Optional().
			Nillable(),
		field.Text("string_val").
			StructTag(`json:"stringValue" gqlgen:"stringValue"`).
			Optional().
			Nillable(),
		field.Float("range_from_val").
			StructTag(`json:"rangeFromValue" gqlgen:"rangeFromValue"`).
			Optional().
			Nillable(),
		field.Float("range_to_val").
			StructTag(`json:"rangeToValue" gqlgen:"rangeToValue"`).
			Optional().
			Nillable(),
		field.Bool("is_instance_property").
			StructTag(`gqlgen:"isInstanceProperty"`).
			Default(true),
		field.Bool("editable").
			StructTag(`gqlgen:"isEditable"`).
			Default(true),
		field.Bool("mandatory").
			StructTag(`gqlgen:"isMandatory"`).
			Default(false),
		field.Bool("deleted").
			StructTag(`gqlgen:"isDeleted"`).
			Default(false),
		field.Bool("listable").
			StructTag(`gqlgen:"isListable"`).
			Default(false),
		field.String("nodeType").Optional(),
	}
}

// Edges returns property type edges.
func (PropertyType) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("properties", Property.Type).
			Ref("type"),
		edge.From("location_type", LocationType.Type).
			Ref("property_types").
			Unique(),
		edge.From("equipment_port_type", EquipmentPortType.Type).
			Ref("property_types").
			Unique(),
		edge.From("link_equipment_port_type", EquipmentPortType.Type).
			Ref("link_property_types").
			Unique(),
		edge.From("equipment_type", EquipmentType.Type).
			Ref("property_types").
			Unique(),
		edge.From("service_type", ServiceType.Type).
			Ref("property_types").
			Unique(),
		edge.From("work_order_type", WorkOrderType.Type).
			Ref("property_types").
			Unique(),
		edge.From("work_order_template", WorkOrderTemplate.Type).
			Ref("property_types").
			Unique(),
		edge.From("project_type", ProjectType.Type).
			Ref("properties").
			Unique(),
		edge.From("project_template", ProjectTemplate.Type).
			Ref("properties").
			Unique(),
		edge.From("worker_type", WorkerType.Type).
			Ref("property_types").
			Unique(),
		edge.From("property_category", PropertyCategory.Type).
			Ref("properties_type").
			Unique().
			Annotations(entgql.MapsTo("propertyCategory")),
	}
}

// Indexes returns property type indexes.
func (PropertyType) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("name").
			Edges("location_type").
			Unique(),
		index.Fields("name").
			Edges("equipment_port_type").
			Unique(),
		index.Fields("name").
			Edges("equipment_type").
			Unique(),
		index.Fields("name").
			Edges("link_equipment_port_type").
			Unique(),
		index.Fields("name").
			Edges("work_order_type").
			Unique(),
		index.Fields("name").
			Edges("worker_type").
			Unique(),
		index.Fields("name").
			Edges("property_category"),
	}
}

// Policy returns property type policy.
func (PropertyType) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithQueryRules(
			authz.PropertyTypeReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.PropertyTypeWritePolicyRule(),
			authz.PropertyTypeCreatePolicyRule(),
		),
	)
}

// Property defines the property schema.
type Property struct {
	schema
}

// Fields returns property fields.
func (Property) Fields() []ent.Field {
	return []ent.Field{
		field.Int("int_val").
			StructTag(`json:"intValue" gqlgen:"intValue"`).
			Optional().
			Nillable(),
		field.Bool("bool_val").
			StructTag(`json:"booleanValue" gqlgen:"booleanValue"`).
			Optional().
			Nillable(),
		field.Float("float_val").
			StructTag(`json:"floatValue" gqlgen:"floatValue"`).
			Optional().
			Nillable(),
		field.Float("latitude_val").
			StructTag(`json:"latitudeValue" gqlgen:"latitudeValue"`).
			Optional().
			Nillable(),
		field.Float("longitude_val").
			StructTag(`json:"longitudeValue" gqlgen:"longitudeValue"`).
			Optional().
			Nillable(),
		field.Float("range_from_val").
			StructTag(`json:"rangeFromValue" gqlgen:"rangeFromValue"`).
			Optional().
			Nillable(),
		field.Float("range_to_val").
			StructTag(`json:"rangeToValue" gqlgen:"rangeToValue"`).
			Optional().
			Nillable(),
		field.String("string_val").
			StructTag(`json:"stringValue" gqlgen:"stringValue"`).
			Optional().
			Nillable(),
	}
}

// Edges returns property edges.
func (Property) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("type", PropertyType.Type).
			Unique().
			Required().
			Annotations(entgql.MapsTo("propertyType")),
		edge.From("location", Location.Type).
			Unique().
			Ref("properties").
			Annotations(entgql.MapsTo("locationValue")),
		edge.From("equipment", Equipment.Type).
			Unique().
			Ref("properties").
			Annotations(entgql.MapsTo("equipmentValue")),
		edge.From("service", Service.Type).
			Unique().
			Ref("properties").
			Annotations(entgql.MapsTo("serviceValue")),
		edge.From("equipment_port", EquipmentPort.Type).
			Unique().
			Ref("properties"),
		edge.From("link", Link.Type).
			Unique().
			Ref("properties"),
		edge.From("work_order", WorkOrder.Type).
			Unique().
			Ref("properties"),
		edge.From("project", Project.Type).
			Ref("properties").
			Unique(),
		edge.To("equipment_value", Equipment.Type).
			Unique(),
		edge.To("location_value", Location.Type).
			Unique(),
		edge.To("service_value", Service.Type).
			Unique(),
		edge.To("work_order_value", WorkOrder.Type).
			Unique(),
		edge.To("user_value", User.Type).
			Unique(),
		edge.To("project_value", Project.Type).
			Unique(),
	}
}

// Indexes returns property indexes.
func (Property) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("type", "location").
			Unique(),
		index.Edges("type", "equipment").
			Unique(),
		index.Edges("type", "service").
			Unique(),
		index.Edges("type", "equipment_port").
			Unique(),
		index.Edges("type", "link").
			Unique(),
		index.Edges("type", "work_order").
			Unique(),
		index.Edges("type", "project").
			Unique(),
	}
}

// Policy returns property policy.
func (Property) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithQueryRules(
			authz.PropertyReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.PropertyWritePolicyRule(),
			authz.PropertyCreatePolicyRule(),
		),
	)
}
