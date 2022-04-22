// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/recommendations"
	"github.com/facebookincubator/symphony/pkg/ent/recommendationscategory"
	"github.com/facebookincubator/symphony/pkg/ent/recommendationssources"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/ent/vendor"
	"github.com/pkg/errors"
)

func handleRecommendationsFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	switch filter.FilterType {
	case models.RecommendationsFilterTypeAlarmtype:
		return recommendationsAlarmtypeFilter(q, filter)
	case models.RecommendationsFilterTypeCommand:
		return recommendationsCommandFilter(q, filter)
	case models.RecommendationsFilterTypeExternalid:
		return recommendationsExternalidFilter(q, filter)
	case models.RecommendationsFilterTypePriority:
		return recommendationsPriorityFilter(q, filter)
	case models.RecommendationsFilterTypeResource:
		return recommendationsResourceFilter(q, filter)
	case models.RecommendationsFilterTypeRunbook:
		return recommendationsRunbookFilter(q, filter)
	case models.RecommendationsFilterTypeStatus:
		return recommendationsStatusFilter(q, filter)
	case models.RecommendationsFilterTypeLongdescription:
		return recommendationsLongdescriptionFilter(q, filter)
	case models.RecommendationsFilterTypeShortdescription:
		return recommendationsShortdescriptionFilter(q, filter)
	case models.RecommendationsFilterTypeUsed:
		return recommendationsUsedFilter(q, filter)
	case models.RecommendationsFilterTypeRecommendationssource:
		return recommendationsRecommendationsSourcesFilter(q, filter)
	case models.RecommendationsFilterTypeRecommendationscategory:
		return recommendationsRecommendationsCategoryFilter(q, filter)
	case models.RecommendationsFilterTypeUsercreate:
		return recommendationsUserCreateFilter(q, filter)
	case models.RecommendationsFilterTypeUserapprove:
		return recommendationsUserApproveFilter(q, filter)
	case models.RecommendationsFilterTypeVendorrecommendations:
		return recommendationsVendorRecommendationsFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func recommendationsAlarmtypeFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(recommendations.AlarmTypeContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(recommendations.AlarmTypeEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsCommandFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(recommendations.CommandContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(recommendations.CommandEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsExternalidFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(recommendations.ExternalIdContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(recommendations.ExternalIdEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsPriorityFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIs && filter.IntValue != nil {
		return q.Where(recommendations.PriorityEQ(*filter.IntValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsResourceFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(recommendations.ResourceContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(recommendations.ResourceEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsRunbookFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(recommendations.RunbookContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(recommendations.RunbookEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func recommendationsStatusFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIs && filter.BoolValue != nil {
		return q.Where(recommendations.StatusEQ(*filter.BoolValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsLongdescriptionFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(recommendations.LongDescriptionContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(recommendations.LongDescriptionEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsShortdescriptionFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(recommendations.ShortDescriptionContains(*filter.StringValue)), nil
	} else if filter.Operator == enum.FilterOperatorIs && filter.StringValue != nil {
		return q.Where(recommendations.ShortDescriptionEQ(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsUsedFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIs && filter.IntValue != nil {
		return q.Where(recommendations.UsedEQ(*filter.IntValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func recommendationsRecommendationsSourcesFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(recommendations.HasRecomendationSourcesWith(recommendationssources.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsRecommendationsCategoryFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(recommendations.HasRecomendationCategoryWith(recommendationscategory.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
func recommendationsUserCreateFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(recommendations.HasUserCreateWith(user.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsUserApproveFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(recommendations.HasUserApprobedWith(user.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func recommendationsVendorRecommendationsFilter(q *ent.RecommendationsQuery, filter *models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(recommendations.HasVendorsRecomendationsWith(vendor.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
