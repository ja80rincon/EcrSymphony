// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	pgkerrors "github.com/pkg/errors"
)

func GetPropTypesIds(prop []*ent.Property) []int {
	var idsPropTypes []int
	for _, p := range prop {
		if pt, err := p.Edges.TypeOrErr(); err == nil {
			idsPropTypes = append(idsPropTypes, pt.ID)
		}
	}
	return idsPropTypes
}

func HandlePropertyByCategoriesFilter(filterBy []*pkgmodels.PropertiesByCategoryFilterInput) ([]int, *int, *string, error) {
	var (
		propCategoryID []int
		locationID     *int
		nonCategory    string
	)
	for _, filter := range filterBy {
		switch {
		case filter.FilterType == enum.PropertiesByCategoryFilterTypePropCategoryID:
			if filter.Operator == enum.FilterOperatorIsOneOf && len(filter.IDSet) > 0 {
				propCategoryID = filter.IDSet
			} else {
				return nil, nil, nil, pgkerrors.Errorf("operation is not supported: %s or IDSet is missing", filter.Operator)
			}
		case filter.FilterType == enum.PropertiesByCategoryFilterTypeLocationID:
			if filter.Operator == enum.FilterOperatorIs && filter.IntValue != nil {
				locationID = filter.IntValue
			} else {
				return nil, nil, nil, pgkerrors.Errorf("operation is not supported: %s or IntValue is missing", filter.Operator)
			}
		case filter.FilterType == enum.PropertiesByCategoryFilterTypePropCategoryIsNil:
			if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
				nonCategory = *filter.StringValue
			} else {
				return nil, nil, nil, pgkerrors.Errorf("operation is not supported: %s or StringValue is missing", filter.Operator)
			}
		default:
			return nil, nil, nil, pgkerrors.Errorf("filter not supported %s", filter.FilterType)
		}
	}
	return propCategoryID, locationID, &nonCategory, nil
}

func NewPropertiesByCategories() models.PropertiesByCategories {
	return models.PropertiesByCategories{
		ID:           nil,
		Name:         nil,
		Properties:   nil,
		PropertyType: nil,
	}
}
