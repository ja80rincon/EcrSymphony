// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"github.com/facebookincubator/symphony/pkg/ent/equipmentporttype"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpoint"
	"github.com/facebookincubator/symphony/pkg/exporter/models"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentportdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/pkg/errors"
)

func handlePortFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	if filter.FilterType == enum.PortFilterTypePortInstEquipment {
		return portEquipmentFilter(q, filter)
	}
	if filter.FilterType == enum.PortFilterTypePortInstHasLink {
		return portHasLinkFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func portEquipmentFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	switch filter.Operator {
	case enum.FilterOperatorContains:
		return q.Where(equipmentport.HasParentWith(equipment.NameContainsFold(*filter.StringValue))), nil
	case enum.FilterOperatorIsOneOf:
		return q.Where(equipmentport.HasParentWith(equipment.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func portHasLinkFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	if filter.Operator == enum.FilterOperatorIs {
		var pp predicate.EquipmentPort
		if *filter.BoolValue {
			pp = equipmentport.HasLink()
		} else {
			pp = equipmentport.Not(equipmentport.HasLink())
		}
		return q.Where(pp), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handlePortLocationFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	switch filter.FilterType {
	case enum.PortFilterTypeLocationInst:
		return portLocationFilter(q, filter)
	case enum.PortFilterTypeLocationInstExternalID:
		return portLocationExternalIDFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func portLocationFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		var pp []predicate.EquipmentPort

		for _, lid := range filter.IDSet {
			pp = append(pp, GetPortLocationPredicate(lid, filter.MaxDepth))
		}
		return q.Where(equipmentport.Or(pp...)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func portLocationExternalIDFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		return q.Where(equipmentport.HasParentWith(equipment.HasLocationWith(location.ExternalIDContainsFold(*filter.StringValue)))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handlePortDefinitionFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	if filter.FilterType == enum.PortFilterTypePortDef {
		return portDefFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func portDefFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(equipmentport.HasDefinitionWith(equipmentportdefinition.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handlePortPropertyFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	p := filter.PropertyValue
	switch filter.Operator {
	case enum.FilterOperatorIs:
		pred, err := GetPropertyPredicate(*p)
		if err != nil {
			return nil, err
		}
		predForType, err := GetPropertyTypePredicate(*p)
		if err != nil {
			return nil, err
		}

		q = q.Where(
			equipmentport.Or(
				equipmentport.HasPropertiesWith(
					property.And(
						property.HasTypeWith(
							propertytype.Name(p.Name),
							propertytype.TypeEQ(p.Type),
						),
						pred,
					),
				),
				equipmentport.And(
					equipmentport.HasDefinitionWith(equipmentportdefinition.HasEquipmentPortTypeWith(
						equipmentporttype.HasPropertyTypesWith(
							propertytype.Name(p.Name),
							propertytype.TypeEQ(p.Type),
							predForType,
						))),
					equipmentport.Not(equipmentport.HasPropertiesWith(
						property.HasTypeWith(
							propertytype.Name(p.Name),
							propertytype.TypeEQ(p.Type),
						)),
					),
				),
			),
		)
		return q, nil
	case enum.FilterOperatorDateLessThan, enum.FilterOperatorDateGreaterThan:
		propPred, propTypePred, err := GetDatePropertyPred(*p, filter.Operator)
		if err != nil {
			return nil, err
		}
		q = q.Where(equipmentport.Or(
			equipmentport.HasPropertiesWith(
				property.And(
					property.HasTypeWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
					),
					propPred,
				),
			),
			equipmentport.And(
				equipmentport.HasDefinitionWith(equipmentportdefinition.HasEquipmentPortTypeWith(equipmentporttype.HasPropertyTypesWith(
					propertytype.Name(p.Name),
					propertytype.TypeEQ(p.Type),
					propTypePred,
				))),
				equipmentport.Not(equipmentport.HasPropertiesWith(
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

func handlePortServiceFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	if filter.FilterType == enum.PortFilterTypeServiceInst {
		return portServiceFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func portServiceFilter(q *ent.EquipmentPortQuery, filter *models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	queryEndPointPorts := equipmentport.HasEndpointsWith(serviceendpoint.HasServiceWith(service.IDIn(filter.IDSet...)))
	queryPorts := equipmentport.HasServiceWith(service.IDIn(filter.IDSet...))
	switch filter.Operator {
	case enum.FilterOperatorIsOneOf:
		return q.Where(equipmentport.Or(queryEndPointPorts, queryPorts)), nil
	case enum.FilterOperatorIsNotOneOf:
		return q.Where(equipmentport.Not(equipmentport.Or(queryEndPointPorts, queryPorts))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
