// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/equipmenttype"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/exporter/models"

	"github.com/pkg/errors"
)

func handleEquipmentFilter(q *ent.EquipmentQuery, filter *models.EquipmentFilterInput) (*ent.EquipmentQuery, error) {
	switch filter.FilterType {
	case enum.EquipmentFilterTypeEquipInstExternalID:
		return equipmentExternalID(q, filter)
	case enum.EquipmentFilterTypeEquipInstName:
		return equipmentNameFilter(q, filter)
	case enum.EquipmentFilterTypeProperty:
		return equipmentPropertyFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func equipmentExternalID(q *ent.EquipmentQuery, filter *models.EquipmentFilterInput) (*ent.EquipmentQuery, error) {
	if filter.Operator == enum.FilterOperatorIs {
		return q.Where(equipment.ExternalID(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation %q not supported", filter.Operator)
}

func equipmentNameFilter(q *ent.EquipmentQuery, filter *models.EquipmentFilterInput) (*ent.EquipmentQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		return q.Where(equipment.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation %q not supported", filter.Operator)
}

//nolint: dupl
func equipmentPropertyFilter(q *ent.EquipmentQuery, filter *models.EquipmentFilterInput) (*ent.EquipmentQuery, error) {
	p := filter.PropertyValue
	switch filter.Operator {
	case enum.FilterOperatorIs:
		pred, err := GetPropertyPredicate(*p)
		if err != nil {
			return nil, err
		}
		predType, err := GetPropertyTypePredicate(*p)
		if err != nil {
			return nil, err
		}
		q = q.Where(equipment.Or(
			equipment.HasPropertiesWith(
				property.And(
					property.HasTypeWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
					),
					pred,
				),
			),
			equipment.And(
				equipment.HasTypeWith(equipmenttype.HasPropertyTypesWith(
					propertytype.Name(p.Name),
					propertytype.TypeEQ(p.Type),
					predType,
				)),
				equipment.Not(equipment.HasPropertiesWith(
					property.HasTypeWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
					)),
				))))
		return q, nil
	case enum.FilterOperatorDateLessThan, enum.FilterOperatorDateGreaterThan:
		propPred, propTypePred, err := GetDatePropertyPred(*p, filter.Operator)
		if err != nil {
			return nil, err
		}
		q = q.Where(equipment.Or(
			equipment.HasPropertiesWith(
				property.And(
					property.HasTypeWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
					),
					propPred,
				),
			),
			equipment.And(
				equipment.HasTypeWith(equipmenttype.HasPropertyTypesWith(
					propertytype.Name(p.Name),
					propertytype.TypeEQ(p.Type),
					propTypePred,
				)),
				equipment.Not(equipment.HasPropertiesWith(
					property.HasTypeWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
					)),
				))))
		return q, nil
	default:
		return nil, errors.Errorf("operator %q not supported", filter.Operator)
	}
}
