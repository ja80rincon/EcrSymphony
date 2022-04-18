// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/organization"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/pkg/errors"
)

func handleOrganizationFilter(q *ent.OrganizationQuery, filter *models.OrganizationFilterInput) (*ent.OrganizationQuery, error) {
	switch filter.FilterType {
	case models.OrganizationFilterTypeName:
		return organizationNameFilter(q, filter)
	case models.OrganizationFilterTypeDescription:
		return organizationDescriptionFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}
func organizationDescriptionFilter(q *ent.OrganizationQuery, filter *models.OrganizationFilterInput) (*ent.OrganizationQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(organization.DescriptionContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(organization.DescriptionEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func organizationNameFilter(q *ent.OrganizationQuery, filter *models.OrganizationFilterInput) (*ent.OrganizationQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(organization.NameContainsFold(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(organization.NameEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
