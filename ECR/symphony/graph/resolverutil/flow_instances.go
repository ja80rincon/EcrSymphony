// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/flow"
	"github.com/facebookincubator/symphony/pkg/ent/flowinstance"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/pkg/errors"
)

func handleFlowInstanceFilter(q *ent.FlowInstanceQuery, filter *models.FlowInstanceFilterInput) (*ent.FlowInstanceQuery, error) {
	if filter.FilterType == models.FlowInstanceFilterTypeFlowInstanceStatus {
		return flowInstanceStatusFilter(q, filter)
	}
	if filter.FilterType == models.FlowInstanceFilterTypeFlowInstanceType {
		return flowInstanceTemplateFlowFilter(q, filter)
	}
	if filter.FilterType == models.FlowInstanceFilterTypeFlowInstanceBssCode {
		return flowInstanceBssCodeFilter(q, filter)
	}
	if filter.FilterType == models.FlowInstanceFilterTypeFlowInstanceServiceInstanceCode {
		return flowInstanceServiceInstanceCodeFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func flowInstanceStatusFilter(q *ent.FlowInstanceQuery, filter *models.FlowInstanceFilterInput) (*ent.FlowInstanceQuery, error) {
	if filter.Operator != enum.FilterOperatorIsOneOf {
		return nil, errors.Errorf("operation %q is not supported", filter.Operator)
	}
	statuses := make([]flowinstance.Status, 0, len(filter.StringSet))
	for _, str := range filter.StringSet {
		status := flowinstance.Status(str)
		if err := flowinstance.StatusValidator(status); err != nil {
			return nil, fmt.Errorf("%s is not a valid flow instance status", str)
		}
		statuses = append(statuses, status)
	}
	return q.Where(flowinstance.StatusIn(statuses...)), nil
}

func flowInstanceTemplateFlowFilter(q *ent.FlowInstanceQuery, filter *models.FlowInstanceFilterInput) (*ent.FlowInstanceQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(flowinstance.HasFlowWith(flow.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func flowInstanceBssCodeFilter(q *ent.FlowInstanceQuery, filter *models.FlowInstanceFilterInput) (*ent.FlowInstanceQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(flowinstance.BssCodeContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func flowInstanceServiceInstanceCodeFilter(q *ent.FlowInstanceQuery, filter *models.FlowInstanceFilterInput) (*ent.FlowInstanceQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(flowinstance.BssCodeContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
