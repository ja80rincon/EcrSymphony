// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package triggers

import (
	"context"
	"strconv"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

const (
	InputVariableType          = "Event to wait for"
	InputVariableWorkOrderType = "Work Order Template"
	OutputVariableWorkOrder    = "Updated Work Order"
)

const (
	TypeWorkOrderInitiated = "Work Order Initiated"
)

type workforceTrigger struct{}

func (workforceTrigger) ID() flowschema.TriggerTypeID {
	return flowschema.TriggerTypeWorkOrder
}

func (workforceTrigger) Description() string {
	return "This block will trigger a flow based on a change in the workforce module"
}

func (workforceTrigger) Variables() []*flowschema.VariableDefinition {
	return []*flowschema.VariableDefinition{
		{
			Key:       InputVariableType,
			Type:      enum.VariableTypeString,
			Mandatory: true,
			Choices: []string{
				strconv.Quote(TypeWorkOrderInitiated),
			},
			NestedVariables: func(ctx context.Context, value []interface{}) ([]*flowschema.VariableDefinition, error) {
				if value[0].(string) == TypeWorkOrderInitiated {
					return []*flowschema.VariableDefinition{
						{
							Key:       InputVariableWorkOrderType,
							Type:      enum.VariableTypeWorkOrderType,
							Mandatory: true,
						},
					}, nil
				}
				return nil, nil
			},
		},
		{
			Key:       OutputVariableWorkOrder,
			Type:      enum.VariableTypeWorkOrder,
			Mandatory: true,
			Usage:     enum.VariableUsageOutput,
		},
	}
}
