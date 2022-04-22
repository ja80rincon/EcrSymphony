// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/organization"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/ent/workordertype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"

	"github.com/pkg/errors"
)

func handleWorkOrderFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderName {
		return nameFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderStatus {
		return statusFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderOwnedBy {
		return ownedByFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderType {
		return typeFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderAssignedTo {
		return assignedToFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderCreationDate {
		return creationDateFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderCloseDate {
		return closeDateFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderLocationInst {
		return locationInstFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderPriority {
		return priorityFilter(q, filter)
	}
	if filter.FilterType == enum.WorkOrderFilterTypeWorkOrderOrganization {
		return organitationFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func nameFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(workorder.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func statusFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator != enum.FilterOperatorIsOneOf {
		return nil, errors.Errorf("operation %q is not supported", filter.Operator)
	}
	statuses := make([]workorder.Status, 0, len(filter.StringSet))
	for _, str := range filter.StringSet {
		status := workorder.Status(str)
		if err := workorder.StatusValidator(status); err != nil {
			return nil, fmt.Errorf("%s is not a valid work order status", str)
		}
		statuses = append(statuses, status)
	}
	return q.Where(workorder.StatusIn(statuses...)), nil
}

func ownedByFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(workorder.HasOwnerWith(user.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func typeFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(workorder.HasTypeWith(workordertype.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func assignedToFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(workorder.HasAssigneeWith(user.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func creationDateFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	switch filter.Operator {
	case enum.FilterOperatorDateLessThan:
		return q.Where(workorder.CreationDateLT(*filter.TimeValue)), nil
	case enum.FilterOperatorDateLessOrEqualThan:
		return q.Where(workorder.CreationDateLTE(*filter.TimeValue)), nil
	case enum.FilterOperatorDateGreaterThan:
		return q.Where(workorder.CreationDateGT(*filter.TimeValue)), nil
	case enum.FilterOperatorDateGreaterOrEqualThan:
		return q.Where(workorder.CreationDateGTE(*filter.TimeValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func closeDateFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	switch filter.Operator {
	case enum.FilterOperatorDateLessThan:
		return q.Where(workorder.CloseDateLT(*filter.TimeValue)), nil
	case enum.FilterOperatorDateLessOrEqualThan:
		return q.Where(workorder.CloseDateLTE(*filter.TimeValue)), nil
	case enum.FilterOperatorDateGreaterThan:
		return q.Where(workorder.CloseDateGT(*filter.TimeValue)), nil
	case enum.FilterOperatorDateGreaterOrEqualThan:
		return q.Where(workorder.CloseDateGTE(*filter.TimeValue)), nil
	case enum.FilterOperatorIsNil:
		return q.Where(workorder.CloseDateIsNil()), nil
	case enum.FilterOperatorIsNilOrDateGreaterThan:
		return q.Where(workorder.Or(workorder.CloseDateIsNil(), workorder.CloseDateGTE(*filter.TimeValue))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func locationInstFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(workorder.HasLocationWith(location.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func priorityFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator != enum.FilterOperatorIsOneOf {
		return nil, fmt.Errorf("operation %q is not supported", filter.Operator)
	}
	priorities := make([]workorder.Priority, 0, len(filter.StringSet))
	for _, str := range filter.StringSet {
		priority := workorder.Priority(str)
		if err := workorder.PriorityValidator(priority); err != nil {
			return nil, fmt.Errorf("%s is not a valid work order priority", str)
		}
		priorities = append(priorities, priority)
	}
	return q.Where(workorder.PriorityIn(priorities...)), nil
}

func handleWOLocationFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	switch filter.FilterType {
	case enum.WorkOrderFilterTypeLocationInst:
		return woLocationFilter(q, filter)
	case enum.WorkOrderFilterTypeLocationInstExternalID:
		return woLocationExternalIDFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func woLocationExternalIDFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorContains {
		return q.Where(workorder.HasLocationWith(location.ExternalIDContainsFold(*filter.StringValue))), nil
	}
	return nil, errors.Errorf("operation %s is not supported", filter.Operator)
}

func woLocationFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		if filter.MaxDepth == nil {
			return nil, errors.New("max depth not supplied to location filter")
		}
		var ps []predicate.WorkOrder
		for _, lid := range filter.IDSet {
			ps = append(ps, workorder.HasLocationWith(BuildLocationAncestorFilter(lid, 1, *filter.MaxDepth)))
		}
		return q.Where(workorder.Or(ps...)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func organitationFilter(q *ent.WorkOrderQuery, filter *pkgmodels.WorkOrderFilterInput) (*ent.WorkOrderQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf && filter.IDSet != nil {
		return q.Where(workorder.HasOrganizationWith(organization.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
