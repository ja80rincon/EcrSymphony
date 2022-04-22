// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"errors"
	"strings"

	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebook/ent/schema/index"
	"github.com/facebookincubator/ent-contrib/entgql"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
)

// EquipmentPortType defines the equipment port definition schema.
type EquipmentPortType struct {
	schema
}

// Fields returns equipment type fields.
func (EquipmentPortType) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Unique(),
	}
}

// Edges returns equipment type edges.
func (EquipmentPortType) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("property_types", PropertyType.Type).
			Annotations(entgql.MapsTo("propertyTypes")),
		edge.To("link_property_types", PropertyType.Type).
			Annotations(entgql.MapsTo("linkPropertyTypes")),
		edge.From("port_definitions", EquipmentPortDefinition.Type).
			Ref("equipment_port_type").
			Annotations(entgql.MapsTo("numberOfPortDefinitions")),
	}
}

// Policy returns equipment port type policy.
func (EquipmentPortType) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentPortTypeWritePolicyRule(),
		),
	)
}

// EquipmentPortDefinition defines the equipment port definition schema.
type EquipmentPortDefinition struct {
	schema
}

// Fields returns equipment port definition fields.
func (EquipmentPortDefinition) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.Int("index").
			Optional(),
		field.String("bandwidth").
			Optional(),
		field.String("visibility_label").
			StructTag(`gqlgen:"visibleLabel"`).
			Optional(),
	}
}

// Edges returns equipment port definition edges.
func (EquipmentPortDefinition) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("equipment_port_type", EquipmentPortType.Type).
			Unique().
			Annotations(entgql.MapsTo("portType")),
		edge.From("ports", EquipmentPort.Type).
			Ref("definition"),
		edge.From("equipment_type", EquipmentType.Type).
			Ref("port_definitions").
			Unique(),
		edge.To("connected_ports", EquipmentPortDefinition.Type),
	}
}

// Policy returns equipment port definition policy.
func (EquipmentPortDefinition) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentPortDefinitionWritePolicyRule(),
		),
	)
}

// EquipmentPort defines the equipment port schema.
type EquipmentPort struct {
	schema
}

// Edges returns equipment port Edges.
func (EquipmentPort) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("definition", EquipmentPortDefinition.Type).
			Required().
			Unique().
			Annotations(entgql.Bind()),
		edge.From("parent", Equipment.Type).
			Ref("ports").
			Unique().
			Annotations(entgql.MapsTo("parentEquipment")),
		edge.To("link", Link.Type).
			Unique().
			Annotations(entgql.Bind()),
		edge.To("properties", Property.Type).
			Annotations(entgql.Bind()),
		edge.From("endpoints", ServiceEndpoint.Type).
			Ref("port").
			Annotations(entgql.MapsTo("serviceEndpoints")),
		edge.From("service", Service.Type).
			Ref("ports"),
	}
}

// Indexes returns equipment port indexes.
func (EquipmentPort) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("definition", "parent").
			Unique(),
	}
}

// Policy returns equipment port policy.
func (EquipmentPort) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentPortWritePolicyRule(),
		),
	)
}

// EquipmentPositionDefinition defines the equipment position definition schema.
type EquipmentPositionDefinition struct {
	schema
}

// Fields returns equipment position definition fields.
func (EquipmentPositionDefinition) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.Int("index").
			Optional(),
		field.String("visibility_label").
			StructTag(`gqlgen:"visibleLabel"`).
			Optional(),
	}
}

// Edges returns equipment position definition edges.
func (EquipmentPositionDefinition) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("positions", EquipmentPosition.Type).
			Ref("definition"),
		edge.From("equipment_type", EquipmentType.Type).
			Ref("position_definitions").
			Unique(),
	}
}

// Policy returns equipment position definition policy.
func (EquipmentPositionDefinition) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentPositionDefinitionWritePolicyRule(),
		),
	)
}

// EquipmentPosition defines the equipment position schema.
type EquipmentPosition struct {
	schema
}

// Edges returns equipment position Edges.
func (EquipmentPosition) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("definition", EquipmentPositionDefinition.Type).
			Required().
			Unique().
			Annotations(entgql.Bind()),
		edge.From("parent", Equipment.Type).
			Ref("positions").
			Unique().
			Annotations(
				entgql.MapsTo("parentEquipment"),
			),
		edge.To("attachment", Equipment.Type).
			Unique().
			Annotations(
				entgql.MapsTo("attachedEquipment"),
			),
	}
}

// Indexes returns equipment position indexes.
func (EquipmentPosition) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("definition", "parent").
			Unique(),
	}
}

// Policy returns equipment position policy.
func (EquipmentPosition) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentPositionWritePolicyRule(),
		),
	)
}

// EquipmentCategory defines the equipment category schema.
type EquipmentCategory struct {
	schema
}

// Fields returns equipment category fields.
func (EquipmentCategory) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Unique(),
	}
}

// Edges returns equipment category edges.
func (EquipmentCategory) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("types", EquipmentType.Type).
			Ref("category"),
	}
}

// Policy returns equipment category policy.
func (EquipmentCategory) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentCategoryWritePolicyRule(),
		),
	)
}

// EquipmentType defines the equipment type schema.
type EquipmentType struct {
	schema
}

// Fields returns equipment type fields.
func (EquipmentType) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Unique(),
	}
}

// Edges returns equipment type edges.
func (EquipmentType) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("port_definitions", EquipmentPortDefinition.Type).
			Annotations(entgql.MapsTo("portDefinitions")),
		edge.To("position_definitions", EquipmentPositionDefinition.Type).
			Annotations(entgql.MapsTo("positionDefinitions")),
		edge.To("property_types", PropertyType.Type).
			Annotations(entgql.MapsTo("propertyTypes")),
		edge.From("equipment", Equipment.Type).
			Ref("type").
			Annotations(entgql.MapsTo("equipments")),
		edge.To("category", EquipmentCategory.Type).
			Unique().
			Annotations(entgql.Bind()),
		edge.To("service_endpoint_definitions", ServiceEndpointDefinition.Type).
			Annotations(entgql.MapsTo("serviceEndpointDefinitions")),
	}
}

// Policy returns equipment type policy.
func (EquipmentType) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentTypeWritePolicyRule(),
		),
	)
}

// Equipment defines the equipment schema.
type Equipment struct {
	schema
}

// Fields returns equipment fields.
func (Equipment) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty().
			Annotations(
				entgql.OrderField("NAME"),
			),
		field.Enum("future_state").
			GoType(enum.FutureState("")).
			Optional().
			Nillable().
			Annotations(
				entgql.OrderField("FUTURE_STATE"),
			),
		field.String("device_id").
			Optional().
			Validate(func(s string) error {
				if !strings.ContainsRune(s, '.') {
					return errors.New("invalid device id")
				}
				return nil
			}),
		field.String("external_id").
			Unique().
			Optional(),
	}
}

// Edges returns equipment edges.
func (Equipment) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("type", EquipmentType.Type).
			Unique().
			Required().
			Annotations(entgql.MapsTo("equipmentType")),
		edge.From("location", Location.Type).
			Ref("equipment").
			Unique().
			Annotations(entgql.MapsTo("parentLocation")),
		edge.From("parent_position", EquipmentPosition.Type).
			Ref("attachment").
			Unique().
			Annotations(entgql.MapsTo("parentPosition")),
		edge.To("positions", EquipmentPosition.Type).
			Annotations(entgql.Bind()),
		edge.To("ports", EquipmentPort.Type).
			Annotations(entgql.Bind()),
		edge.To("work_order", WorkOrder.Type).
			Unique().
			Annotations(entgql.MapsTo("workOrder")),
		edge.To("properties", Property.Type).
			Annotations(entgql.Bind()),
		edge.To("files", File.Type).
			Annotations(entgql.Bind()),
		edge.To("hyperlinks", Hyperlink.Type).
			Annotations(entgql.Bind()),
		edge.From("endpoints", ServiceEndpoint.Type).
			Ref("equipment"),
	}
}

// Policy returns equipment policy.
func (Equipment) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithMutationRules(
			authz.EquipmentWritePolicyRule(),
		),
	)
}
