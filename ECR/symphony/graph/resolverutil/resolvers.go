// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"context"
	"strings"
	"time"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/appointment"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func UserFilter(query *ent.UserQuery, filters []*models.UserFilterInput) (*ent.UserQuery, error) {
	var err error
	for _, f := range filters {
		if strings.HasPrefix(f.FilterType.String(), "USER_") {
			if query, err = handleUserFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func UserSearch(ctx context.Context, client *ent.Client, filters []*models.UserFilterInput, limit *int) (*models.UserSearchResult, error) {
	var (
		query = client.User.Query()
		err   error
	)
	query, err = UserFilter(query, filters)
	if err != nil {
		return nil, err
	}
	count, err := query.Clone().Count(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Count query failed")
	}
	if limit != nil {
		query.Limit(*limit)
	}
	users, err := query.All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying users failed")
	}
	return &models.UserSearchResult{
		Users: users,
		Count: count,
	}, nil
}

func PermissionsPolicyFilter(query *ent.PermissionsPolicyQuery, filters []*models.PermissionsPolicyFilterInput) (*ent.PermissionsPolicyQuery, error) {
	var err error
	for _, f := range filters {
		if strings.HasPrefix(f.FilterType.String(), "PERMISSIONS_POLICY_NAME") {
			if query, err = handlePermissionsPolicyFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func PermissionsPolicySearch(
	ctx context.Context,
	client *ent.Client,
	filters []*models.PermissionsPolicyFilterInput,
	limit *int,
) (*models.PermissionsPolicySearchResult, error) {
	var (
		query = client.PermissionsPolicy.Query()
		err   error
	)
	query, err = PermissionsPolicyFilter(query, filters)
	if err != nil {
		return nil, err
	}
	count, err := query.Clone().Count(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Count query failed")
	}
	if limit != nil {
		query.Limit(*limit)
	}
	permissionsPolicies, err := query.All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying permissionsPolicy failed")
	}
	return &models.PermissionsPolicySearchResult{
		PermissionsPolicies: permissionsPolicies,
		Count:               count,
	}, nil
}

func UsersGroupFilter(query *ent.UsersGroupQuery, filters []*models.UsersGroupFilterInput) (*ent.UsersGroupQuery, error) {
	var err error
	for _, f := range filters {
		if strings.HasPrefix(f.FilterType.String(), "GROUP_NAME") {
			if query, err = handleUsersGroupFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func UsersGroupSearch(
	ctx context.Context,
	client *ent.Client,
	filters []*models.UsersGroupFilterInput,
	limit *int,
) (*models.UsersGroupSearchResult, error) {
	var (
		query = client.UsersGroup.Query()
		err   error
	)
	query, err = UsersGroupFilter(query, filters)
	if err != nil {
		return nil, err
	}
	count, err := query.Clone().Count(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Count query failed")
	}
	if limit != nil {
		query.Limit(*limit)
	}
	usersGroups, err := query.All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying usersGroups failed")
	}
	return &models.UsersGroupSearchResult{
		UsersGroups: usersGroups,
		Count:       count,
	}, nil
}

func ProjectFilter(query *ent.ProjectQuery, filters []*models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	var err error
	for _, f := range filters {
		switch {
		case strings.HasPrefix(f.FilterType.String(), "PROJECT_"):
			if query, err = handleProjectFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "LOCATION_INST"):
			if query, err = handleProjectLocationFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "PROPERTY"):
			if query, err = handleProjectPropertyFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func CounterFilter(query *ent.CounterQuery, filters []*models.CounterFilterInput) (*ent.CounterQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleCounterFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func KpiFilter(query *ent.KpiQuery, filters []*models.KpiFilterInput) (*ent.KpiQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKpiFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func KpiCategoryFilter(query *ent.KpiCategoryQuery, filters []*models.KpiCategoryFilterInput) (*ent.KpiCategoryQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKpiCategoryFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}
func ThresholdFilter(query *ent.ThresholdQuery, filters []*models.ThresholdFilterInput) (*ent.ThresholdQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleThresholdFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func AlarmFilterFilter(query *ent.AlarmFilterQuery, filters []*models.AlarmFilterFilterInput) (*ent.AlarmFilterQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleAlarmFilterFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func DomainFilter(query *ent.DomainQuery, filters []*models.DomainFilterInput) (*ent.DomainQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleDomainFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func VendorFilter(query *ent.VendorQuery, filters []*models.VendorFilterInput) (*ent.VendorQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleVendorFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func CounterFamilyFilter(query *ent.CounterFamilyQuery, filters []*models.CounterFamilyFilterInput) (*ent.CounterFamilyQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleCounterFamilyFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func RuleTypeFilter(query *ent.RuleTypeQuery, filters []*models.RuleTypeFilterInput) (*ent.RuleTypeQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleRuleTypeFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}
func EventSeverityFilter(query *ent.EventSeverityQuery, filters []*models.EventSeverityFilterInput) (*ent.EventSeverityQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleEventSeverityFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}
func ComparatorFilter(query *ent.ComparatorQuery, filters []*models.ComparatorFilterInput) (*ent.ComparatorQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleComparatorFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}
func AlarmStatusFilter(query *ent.AlarmStatusQuery, filters []*models.AlarmStatusFilterInput) (*ent.AlarmStatusQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleAlarmStatusFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func FlowInstanceFilter(query *ent.FlowInstanceQuery, filters []*models.FlowInstanceFilterInput) (*ent.FlowInstanceQuery, error) {
	var err error
	for _, f := range filters {
		if strings.HasPrefix(f.FilterType.String(), "FLOW_INSTANCE_") {
			if query, err = handleFlowInstanceFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func KqiFilter(query *ent.KqiQuery, filters []*models.KqiFilterInput) (*ent.KqiQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKqiFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func OrganizationFilter(query *ent.OrganizationQuery, filters []*models.OrganizationFilterInput) (*ent.OrganizationQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleOrganizationFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func RecommendationsSourcesFilter(query *ent.RecommendationsSourcesQuery, filters []*models.RecommendationsSourcesFilterInput) (*ent.RecommendationsSourcesQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleRecommendationsSourcesFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func RecommendationsFilter(query *ent.RecommendationsQuery, filters []*models.RecommendationsFilterInput) (*ent.RecommendationsQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleRecommendationsFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func RecommendationsCategoryFilter(query *ent.RecommendationsCategoryQuery, filters []*models.RecommendationsCategoryFilterInput) (*ent.RecommendationsCategoryQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleRecommendationsCategoryFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func KqiCategoryFilter(query *ent.KqiCategoryQuery, filters []*models.KqiCategoryFilterInput) (*ent.KqiCategoryQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKqiCategoryFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func KqiPerspectiveFilter(query *ent.KqiPerspectiveQuery, filters []*models.KqiPerspectiveFilterInput) (*ent.KqiPerspectiveQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKqiPerspectiveFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func KqiTemporalFrequencyFilter(query *ent.KqiTemporalFrequencyQuery, filters []*models.KqiTemporalFrequencyFilterInput) (*ent.KqiTemporalFrequencyQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKqiTemporalFrequencyFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func KqiSourceFilter(query *ent.KqiSourceQuery, filters []*models.KqiSourceFilterInput) (*ent.KqiSourceQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKqiSourceFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func KqiTargetFilter(query *ent.KqiTargetQuery, filters []*models.KqiTargetFilterInput) (*ent.KqiTargetQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleKqiTargetFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}
func FormulaFilter(query *ent.FormulaQuery, filters []*models.FormulaFilterInput) (*ent.FormulaQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleFormulaFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}
func TechFilter(query *ent.TechQuery, filters []*models.TechFilterInput) (*ent.TechQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleTechFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func NetworkTypeFilter(query *ent.NetworkTypeQuery, filters []*models.NetworkTypeFilterInput) (*ent.NetworkTypeQuery, error) {
	var err error
	for _, f := range filters {
		if query, err = handleNetworkTypeFilter(query, f); err != nil {
			return nil, err
		}
	}
	return query, nil
}

func validateSlot(startDate time.Time, endDate time.Time) (err error) {
	/*switch {
	case startDate == nil || endDate == nil:
		err = &gqlerror.Error{
			Message: "Passing both `first` and `last` to paginate a connection is not supported.",
		}
	case startDate.After(endDate):*/
	if startDate.After(endDate) {
		err = &gqlerror.Error{
			Message: "Slot `endDate` must be after `startDate`",
		}
	}
	return err
}

func SlotFilter(query *ent.AppointmentQuery, filter *models.SlotFilterInput) (*ent.AppointmentQuery, error) {
	if err := validateSlot(filter.SlotStartDate, filter.SlotEndDate); err != nil {
		return nil, err
	}

	return query.Where(appointment.Or(
		appointment.And(
			appointment.StartLTE(filter.SlotStartDate),
			appointment.EndGT(filter.SlotStartDate)),
		appointment.And(
			appointment.StartGTE(filter.SlotStartDate),
			appointment.StartLTE(filter.SlotEndDate)))).Order(ent.Asc(appointment.FieldStart)), nil
}
