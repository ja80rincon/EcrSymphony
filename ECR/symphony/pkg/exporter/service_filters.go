// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/customer"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/link"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpoint"
	"github.com/facebookincubator/symphony/pkg/ent/servicetype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/pkg/errors"
)

func handleServiceFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	switch filter.FilterType {
	case enum.ServiceFilterTypeServiceInstName:
		return serviceNameFilter(q, filter)
	case enum.ServiceFilterTypeServiceStatus:
		return serviceStatusFilter(q, filter)
	case enum.ServiceFilterTypeServiceDiscoveryMethod:
		return serviceDiscoveryMethodFilter(q, filter)
	case enum.ServiceFilterTypeServiceType:
		return serviceTypeFilter(q, filter)
	case enum.ServiceFilterTypeServiceInstExternalID:
		return externalIDFilter(q, filter)
	case enum.ServiceFilterTypeServiceInstCustomerName:
		return customerNameFilter(q, filter)
	default:
		return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
	}
}

func serviceNameFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		return q.Where(service.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation %q not supported", filter.Operator)
}

func serviceStatusFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator != enum.FilterOperatorIsOneOf {
		return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
	}
	statuses := make([]service.Status, 0, len(filter.StringSet))
	seen := make(map[service.Status]struct{}, len(filter.StringSet))
	for _, s := range filter.StringSet {
		status := service.Status(s)
		if err := service.StatusValidator(status); err != nil {
			return nil, err
		}
		if _, ok := seen[status]; !ok {
			seen[status] = struct{}{}
			statuses = append(statuses, status)
		}
	}
	return q.Where(service.StatusIn(statuses...)), nil
}

func serviceDiscoveryMethodFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator != enum.FilterOperatorIsOneOf {
		return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
	}
	var (
		methods = make([]servicetype.DiscoveryMethod, 0, len(filter.StringSet))
		seen    = make(map[servicetype.DiscoveryMethod]struct{}, len(filter.StringSet))
	)
	for _, dm := range filter.StringSet {
		method := servicetype.DiscoveryMethod(dm)
		if err := servicetype.DiscoveryMethodValidator(method); err != nil {
			return nil, err
		}
		if _, ok := seen[method]; !ok {
			seen[method] = struct{}{}
			methods = append(methods, method)
		}
	}
	return q.Where(service.HasTypeWith(servicetype.DiscoveryMethodIn(methods...))), nil
}

func serviceTypeFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(service.HasTypeWith(servicetype.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func externalIDFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator == enum.FilterOperatorIs {
		return q.Where(service.ExternalID(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation %q not supported", filter.Operator)
}

func customerNameFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		return q.Where(service.HasCustomerWith(customer.NameContainsFold(*filter.StringValue))), nil
	}
	return nil, errors.Errorf("operation %q not supported", filter.Operator)
}

func handleServicePropertyFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.FilterType == enum.ServiceFilterTypeProperty {
		return servicePropertyFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func servicePropertyFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
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
			service.Or(
				service.HasPropertiesWith(
					property.And(
						property.HasTypeWith(
							propertytype.Name(p.Name),
							propertytype.TypeEQ(p.Type),
						),
						pred,
					),
				),
				service.And(
					service.HasTypeWith(servicetype.HasPropertyTypesWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
						predForType,
					)),
					service.Not(service.HasPropertiesWith(
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

func handleServiceLocationFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	switch filter.FilterType {
	case enum.ServiceFilterTypeLocationInst:
		return serviceLocationFilter(q, filter)
	case enum.ServiceFilterTypeLocationInstExternalID:
		return serviceLocationExternalIDFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func serviceLocationExternalIDFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		return q.Where(service.HasEndpointsWith(serviceendpoint.HasEquipmentWith(
			equipment.HasLocationWith(location.ExternalIDContainsFold(*filter.StringValue))))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func serviceLocationFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		var ps []predicate.Service
		for _, lid := range filter.IDSet {
			eqPred := BuildGeneralEquipmentAncestorFilter(
				equipment.HasLocationWith(BuildLocationAncestorFilter(lid, 1, *filter.MaxDepth)),
				1,
				*filter.MaxDepth)
			ps = append(ps, service.HasEndpointsWith(
				serviceendpoint.HasEquipmentWith(eqPred)),
			)
		}
		return q.Where(service.Or(ps...)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handleEquipmentInServiceFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.FilterType == enum.ServiceFilterTypeEquipmentInService {
		return equipmentInServiceTypeFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func equipmentInServiceTypeFilter(q *ent.ServiceQuery, filter *pkgmodels.ServiceFilterInput) (*ent.ServiceQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		equipmentNameQuery := equipment.NameContainsFold(*filter.StringValue)
		return q.Where(
			service.Or(service.HasLinksWith(
				link.HasPortsWith(equipmentport.HasParentWith(equipmentNameQuery))),
				service.HasEndpointsWith(serviceendpoint.HasPortWith(equipmentport.HasParentWith(equipmentNameQuery))))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
