// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentportdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentporttype"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentposition"
	"github.com/facebookincubator/symphony/pkg/ent/equipmenttype"
	"github.com/facebookincubator/symphony/pkg/ent/link"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/pkg/errors"
)

func handleLinkFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.FilterType == enum.LinkFilterTypeLinkFutureStatus {
		return stateFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func stateFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.Operator != enum.FilterOperatorIsOneOf {
		return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
	}
	states := make([]enum.FutureState, 0, len(filter.StringSet))
	seen := make(map[enum.FutureState]struct{}, len(filter.StringSet))
	for _, s := range filter.StringSet {
		var state enum.FutureState
		if err := state.UnmarshalGQL(s); err != nil {
			return nil, err
		}
		if _, ok := seen[state]; !ok {
			seen[state] = struct{}{}
			states = append(states, state)
		}
	}
	pred := link.FutureStateIn(states...)
	if _, ok := seen[enum.FutureStateInstall]; ok {
		pred = link.Or(pred, link.FutureStateIsNil())
	}
	return q.Where(pred), nil
}

func handleLinkLocationFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	switch filter.FilterType {
	case enum.LinkFilterTypeLocationInst:
		return linkLocationFilter(q, filter)
	case enum.LinkFilterTypeLocationInstExternalID:
		return linkLocationExternalIDFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func linkLocationExternalIDFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		return q.Where(link.HasPortsWith(equipmentport.HasParentWith(
			equipment.HasLocationWith(location.ExternalIDContainsFold(*filter.StringValue))))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func linkLocationFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		var ps []predicate.Link
		for _, lid := range filter.IDSet {
			ps = append(ps, link.HasPortsWith(GetPortLocationPredicate(lid, filter.MaxDepth)))
		}
		return q.Where(link.Or(ps...)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handleLinkEquipmentFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.FilterType == enum.LinkFilterTypeEquipmentType {
		return linkEquipmentTypeFilter(q, filter)
	} else if filter.FilterType == enum.LinkFilterTypeEquipmentInst {
		return linkEquipmentFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func linkEquipmentTypeFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(link.HasPortsWith(equipmentport.HasParentWith(equipment.HasTypeWith(equipmenttype.IDIn(filter.IDSet...))))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func BuildGeneralEquipmentAncestorFilter(pred predicate.Equipment, depth, maxDepth int) predicate.Equipment {
	if depth >= maxDepth {
		return pred
	}

	return equipment.Or(pred,
		equipment.HasParentPositionWith(
			equipmentposition.HasParentWith(
				BuildGeneralEquipmentAncestorFilter(pred, depth+1, maxDepth),
			),
		),
	)
}

// BuildEquipmentAncestorFilter returns a joined predicate for equipment ancestors
func BuildEquipmentAncestorFilter(equipmentIDs []int, depth, maxDepth int) predicate.Equipment {
	return BuildGeneralEquipmentAncestorFilter(equipment.IDIn(equipmentIDs...), depth, maxDepth)
}

func linkEquipmentFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(link.HasPortsWith(
			equipmentport.HasParentWith(BuildEquipmentAncestorFilter(filter.IDSet, 1, *filter.MaxDepth)))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handleLinkServiceFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	if filter.FilterType == enum.LinkFilterTypeServiceInst {
		return linkServiceFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func linkServiceFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	switch filter.Operator {
	case enum.FilterOperatorIsOneOf:
		return q.Where(
			link.HasServiceWith(
				service.IDIn(filter.IDSet...),
			),
		), nil
	case enum.FilterOperatorIsNotOneOf:
		return q.Where(
			link.Not(
				link.HasServiceWith(
					service.IDIn(filter.IDSet...),
				),
			),
		), nil
	case enum.FilterOperatorContains:
		return q.Where(
			link.HasServiceWith(
				service.NameContainsFold(*filter.StringValue),
			),
		), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handleLinkPropertyFilter(q *ent.LinkQuery, filter *models.LinkFilterInput) (*ent.LinkQuery, error) {
	p := filter.PropertyValue
	switch filter.Operator {
	case enum.FilterOperatorIs:
		propPred, err := GetPropertyPredicate(*p)
		if err != nil {
			return nil, err
		}

		propTypePred, err := GetPropertyTypePredicate(*p)
		if err != nil {
			return nil, err
		}
		return q.Where(link.Or(
			link.HasPropertiesWith(
				property.And(
					property.HasTypeWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
					),
					propPred,
				),
			),
			link.And(
				link.HasPortsWith(
					equipmentport.HasDefinitionWith(
						equipmentportdefinition.HasEquipmentPortTypeWith(
							equipmentporttype.HasLinkPropertyTypesWith(
								propertytype.Name(p.Name),
								propertytype.TypeEQ(p.Type),
								propTypePred,
							),
						),
					),
				),
				link.Not(
					link.HasPropertiesWith(
						property.HasTypeWith(
							propertytype.Name(p.Name),
							propertytype.TypeEQ(p.Type),
						),
					),
				),
			),
		)), nil
	case enum.FilterOperatorDateLessThan, enum.FilterOperatorDateGreaterThan:
		propPred, propTypePred, err := GetDatePropertyPred(*p, filter.Operator)
		if err != nil {
			return nil, err
		}
		return q.Where(link.Or(
			link.HasPropertiesWith(
				property.And(
					property.HasTypeWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
					),
					propPred,
				),
			),
			link.And(
				link.HasPortsWith(
					equipmentport.HasDefinitionWith(
						equipmentportdefinition.HasEquipmentPortTypeWith(
							equipmentporttype.HasLinkPropertyTypesWith(
								propertytype.Name(p.Name),
								propertytype.TypeEQ(p.Type),
								propTypePred,
							),
						),
					),
				),
				link.Not(
					link.HasPortsWith(
						equipmentport.HasPropertiesWith(
							property.HasTypeWith(
								propertytype.Name(p.Name),
								propertytype.TypeEQ(p.Type),
							),
						),
					),
				),
			),
		)), nil
	default:
		return nil, errors.Errorf("operator %q not supported", filter.Operator)
	}
}
