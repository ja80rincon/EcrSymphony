// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/counter"
	"github.com/facebookincubator/symphony/pkg/ent/counterfamily"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/vendor"
	"github.com/pkg/errors"
)

func handleCounterFilter(q *ent.CounterQuery, filter *models.CounterFilterInput) (*ent.CounterQuery, error) {
	switch filter.FilterType {
	case models.CounterFilterTypeName:
		return counterNameFilter(q, filter)
	case models.CounterFilterTypeExternalid:
		return counterExternalidFilter(q, filter)
	case models.CounterFilterTypeNetworkmanagersystem:
		return counterNetworkmanagersystemFilter(q, filter)
	case models.CounterFilterTypeCounterfamily:
		return counterCounterFamilyFilter(q, filter)
	case models.CounterFilterTypeVendorfk:
		return counterVendorFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func counterNameFilter(q *ent.CounterQuery, filter *models.CounterFilterInput) (*ent.CounterQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(counter.NameContainsFold(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(counter.NameEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func counterExternalidFilter(q *ent.CounterQuery, filter *models.CounterFilterInput) (*ent.CounterQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(counter.ExternalIdContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(counter.ExternalIdEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func counterNetworkmanagersystemFilter(q *ent.CounterQuery, filter *models.CounterFilterInput) (*ent.CounterQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(counter.NetworkManagerSystemContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(counter.NetworkManagerSystemEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func counterCounterFamilyFilter(q *ent.CounterQuery, filter *models.CounterFilterInput) (*ent.CounterQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(counter.HasCounterfamilyWith(counterfamily.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func counterVendorFilter(q *ent.CounterQuery, filter *models.CounterFilterInput) (*ent.CounterQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(counter.HasVendorWith(vendor.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
