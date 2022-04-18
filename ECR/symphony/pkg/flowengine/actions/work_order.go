// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package actions

import (
	"strconv"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

const (
	InputVariableType             = "Work Order Template"
	InputVariableTypeName         = "Template Name"
	InputVariableOperation        = "Operation"
	InputVariableflagNextActivity = "Flag Next Activity"
	InputVariableBaseType         = "Base Type"
	InputVariableEndStatuses      = "Work Order Statuses for completing block"
	InputVariableName             = "Name"
	InputVariableDescription      = "Description"
	InputVariableLocation         = "Location"
	InputVariableProject          = "Project"
	InputVariableOwner            = "Owner"
	InputVariableAssignee         = "Assignee"
	InputVariableStatus           = "Status"
	InputVariablePriority         = "Priority"
	OutputVariableWorkOrder       = "Created Work Order"
)

type workOrderAction struct{}

func (workOrderAction) ID() flowschema.ActionTypeID {
	return flowschema.ActionTypeWorkOrder
}

func (workOrderAction) Description() string {
	return "This block will initiate a work order based on a template you'll choose"
}

func (workOrderAction) Variables() []*flowschema.VariableDefinition {
	return []*flowschema.VariableDefinition{
		{
			Key:       InputVariableType,
			Type:      enum.VariableTypeWorkOrderType,
			Mandatory: true,
		},
		{
			Key:  InputVariableTypeName,
			Type: enum.VariableTypeString,
		},
		{
			Key:       InputVariableOperation,
			Type:      enum.VariableTypeString,
			Mandatory: true,
			Choices: []string{
				strconv.Quote(enum.OperationWOCreate.String()),
				strconv.Quote(enum.OperationWOUpdate.String()),
			},
		},
		{
			Key:       InputVariableBaseType,
			Type:      enum.VariableTypeString,
			Mandatory: true,
			Choices: []string{
				strconv.Quote(enum.BaseTypeWOProject.String()),
				strconv.Quote(enum.BaseTypeWOWorkOrder.String()),
			},
		},
		{
			Key:  InputVariableflagNextActivity,
			Type: enum.VariableTypeString,
		},
		{
			Key:            InputVariableEndStatuses,
			Type:           enum.VariableTypeString,
			MultipleValues: true,
			Choices: []string{
				strconv.Quote(workorder.StatusDone.String()),
			},
		},
		{
			Key:  InputVariableName,
			Type: enum.VariableTypeString,
		},
		{
			Key:  InputVariableDescription,
			Type: enum.VariableTypeString,
		},
		{
			Key:  InputVariableLocation,
			Type: enum.VariableTypeLocation,
		},
		{
			Key:  InputVariableProject,
			Type: enum.VariableTypeProject,
		},
		{
			Key:  InputVariableOwner,
			Type: enum.VariableTypeUser,
		},
		{
			Key:  InputVariableAssignee,
			Type: enum.VariableTypeUser,
		},
		{
			Key:  InputVariableStatus,
			Type: enum.VariableTypeString,
			Choices: []string{
				strconv.Quote(workorder.StatusPending.String()),
				strconv.Quote(workorder.StatusPlanned.String()),
			},
		},
		{
			Key:  InputVariablePriority,
			Type: enum.VariableTypeString,
			Choices: []string{
				strconv.Quote(workorder.PriorityNone.String()),
				strconv.Quote(workorder.PriorityLow.String()),
				strconv.Quote(workorder.PriorityMedium.String()),
				strconv.Quote(workorder.PriorityHigh.String()),
				strconv.Quote(workorder.PriorityUrgent.String()),
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
