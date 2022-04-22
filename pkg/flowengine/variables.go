// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package flowengine

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/facebookincubator/symphony/pkg/ent/checklistitemdefinition"

	"github.com/facebookincubator/symphony/pkg/ent/propertytype"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
)

func parseIntVariable(ctx context.Context, value int, variableType enum.VariableType) (interface{}, error) {
	client := ent.FromContext(ctx)
	switch variableType {
	case enum.VariableTypeInt, enum.VariableTypeDate:
		return value, nil
	case enum.VariableTypeWorkOrder:
		return client.WorkOrder.Get(ctx, value)
	case enum.VariableTypeWorkOrderType:
		return client.WorkOrderType.Get(ctx, value)
	case enum.VariableTypeLocation:
		return client.Location.Get(ctx, value)
	case enum.VariableTypeProject:
		return client.Project.Get(ctx, value)
	case enum.VariableTypeUser:
		return client.User.Get(ctx, value)
	case enum.VariableTypeWorkerType:
		return client.WorkerType.Get(ctx, value)
	default:
		return nil, fmt.Errorf("type not found: %v", variableType)
	}
}

func parseSingleVariable(ctx context.Context, value string, variableType enum.VariableType) (values []interface{}, err error) {
	var (
		intVal    int
		parsedVal interface{}
	)
	byteVal := []byte(value)
	switch variableType {
	case enum.VariableTypeString:
		values = append(values, value)
	case enum.VariableTypeDate,
		enum.VariableTypeInt,
		enum.VariableTypeWorkOrder,
		enum.VariableTypeWorkOrderType,
		enum.VariableTypeLocation,
		enum.VariableTypeProject,
		enum.VariableTypeUser,
		enum.VariableTypeWorkerType:
		if err = json.Unmarshal(byteVal, &intVal); err != nil {
			return
		}
		parsedVal, err = parseIntVariable(ctx, intVal, variableType)
		if err != nil {
			return
		}
		values = append(values, parsedVal)
	default:
		err = fmt.Errorf("type not found: %v", variableType)
	}
	return
}

func parseMultiVariable(ctx context.Context, value string, variableType enum.VariableType) (values []interface{}, err error) {
	var (
		stringVals []string
		intVals    []int
		parsedVal  interface{}
	)
	byteVal := []byte(value)
	switch variableType {
	case enum.VariableTypeString:
		if err = json.Unmarshal(byteVal, &stringVals); err != nil {
			return
		}
		for _, stringVal := range stringVals {
			values = append(values, stringVal)
		}
	case enum.VariableTypeDate,
		enum.VariableTypeInt,
		enum.VariableTypeWorkOrder,
		enum.VariableTypeWorkOrderType,
		enum.VariableTypeLocation,
		enum.VariableTypeProject,
		enum.VariableTypeUser:
		if err = json.Unmarshal(byteVal, &intVals); err != nil {
			return
		}
		for _, intVal := range intVals {
			parsedVal, err = parseIntVariable(ctx, intVal, variableType)
			if err != nil {
				return
			}
			values = append(values, parsedVal)
		}
	default:
		err = fmt.Errorf("type not found: %v", variableType)
	}
	return
}

// ParseVariableValue parses an a value by the definition
func ParseVariableValue(ctx context.Context, v *flowschema.VariableDefinition, value string) ([]interface{}, error) {
	if v.MultipleValues {
		return parseMultiVariable(ctx, value, v.Type)
	}
	return parseSingleVariable(ctx, value, v.Type)
}

func validateVariableValueNotEmpty(ctx context.Context, v *flowschema.VariableDefinition, value string) error {
	vars, err := ParseVariableValue(ctx, v, value)
	if err != nil {
		return err
	}
	if v.MultipleValues && len(vars) == 0 {
		return fmt.Errorf("multiple values value has to have at least one value when mandatory")
	}
	if v.Type == enum.VariableTypeString && vars[0].(string) == "" {
		return fmt.Errorf("string value cannot be empty when mandatory")
	}
	return nil
}

func verifyVariableDefinition(ctx context.Context, v *flowschema.VariableDefinition) error {
	if v.Key == "" {
		return fmt.Errorf("key cannot be empty")
	}
	if v.Name() == "" {
		return fmt.Errorf("name cannot be empty, key=%s", v.Key)
	}
	if err := enum.VariableTypeValidator(v.Type); err != nil {
		return err
	}
	if v.Choices != nil && len(v.Choices) == 0 {
		return fmt.Errorf("multiple choices of variable definition cannot be empty, key=%s", v.Key)
	}
	for _, choice := range v.Choices {
		if _, err := parseSingleVariable(ctx, choice, v.Type); err != nil {
			return fmt.Errorf("failed to parse variable choice by type: %w", err)
		}
	}
	if v.DefaultValue != nil {
		if _, err := ParseVariableValue(ctx, v, *v.DefaultValue); err != nil {
			return fmt.Errorf("failed to parse default variable value by type: %w", err)
		}
	}
	return nil
}

// VerifyVariableDefinitions verifies if variable definitions of block are correct
func VerifyVariableDefinitions(ctx context.Context, variableDefinitions []*flowschema.VariableDefinition) error {
	keys := make(map[string]struct{}, len(variableDefinitions))
	names := make(map[string]struct{}, len(variableDefinitions))
	for _, variableDefinition := range variableDefinitions {
		if err := verifyVariableDefinition(ctx, variableDefinition); err != nil {
			return err
		}
		if _, ok := keys[variableDefinition.Key]; ok {
			return fmt.Errorf("duplicate key name: %s", variableDefinition.Key)
		}
		keys[variableDefinition.Key] = struct{}{}
		if _, ok := names[variableDefinition.Name()]; ok {
			return fmt.Errorf("duplicate name: %s", variableDefinition.Name())
		}
		names[variableDefinition.Name()] = struct{}{}
	}
	return nil
}

func verifyVariableValue(ctx context.Context, definition *flowschema.VariableDefinition, param string) error {
	values, err := ParseVariableValue(ctx, definition, param)
	if err != nil {
		return fmt.Errorf("failed to validate key %s type %s with value %s variable type: %w", definition.Key, definition.Type, param, err)
	}
	if definition.Choices != nil {
		var multipleChoiceValues []interface{}
		for i := range definition.Choices {
			choice := definition.Choices[i]
			if definition.Type == enum.VariableTypeString {
				byteVal := []byte(choice)
				if err = json.Unmarshal(byteVal, &choice); err != nil {
					return err
				}
			}
			choiceValue, err := parseSingleVariable(ctx, choice, definition.Type)
			if err != nil {
				return fmt.Errorf("failed to validate variable type: %w", err)
			}
			multipleChoiceValues = append(multipleChoiceValues, choiceValue...)
		}
		checkInChoices := func(value interface{}) bool {
			for _, choice := range multipleChoiceValues {
				switch definition.Type {
				case enum.VariableTypeString:
					if value.(string) == choice.(string) {
						return true
					}
				case enum.VariableTypeInt,
					enum.VariableTypeDate:
					if value.(int) == choice.(int) {
						return true
					}
				case enum.VariableTypeWorkOrderType:
					if value.(*ent.WorkOrderType).ID == choice.(*ent.WorkOrderType).ID {
						return true
					}
				case enum.VariableTypeWorkOrder:
					if value.(*ent.WorkOrder).ID == choice.(*ent.WorkOrder).ID {
						return true
					}
				case enum.VariableTypeLocation:
					if value.(*ent.Location).ID == choice.(*ent.Location).ID {
						return true
					}
				case enum.VariableTypeProject:
					if value.(*ent.Project).ID == choice.(*ent.Project).ID {
						return true
					}
				case enum.VariableTypeUser:
					if value.(*ent.User).ID == choice.(*ent.User).ID {
						return true
					}
				}
			}
			return false
		}
		for _, value := range values {
			if !checkInChoices(value) {
				return fmt.Errorf("value %s not found in choices, key=%s", value, definition.Key)
			}
		}
	}
	return nil
}

func verifyVariableExpression(ctx context.Context, definition *flowschema.VariableDefinition, param *flowschema.VariableExpression) error {
	if len(param.BlockVariables) != 0 {
		return nil
	}
	return verifyVariableValue(ctx, definition, param.Expression)
}

// VerifyVariableExpressions verifies if variable expressions of block are according to their definition
func VerifyVariableExpressions(ctx context.Context, params []*flowschema.VariableExpression, definitions []*flowschema.VariableDefinition) error {
	keys := make(map[string]struct{}, len(params))
	ids := make(map[int]struct{}, len(params))
	var templateParam *flowschema.VariableExpression
	var templateType flowschema.ActionTypeID
	for _, param := range params {
		if param.Type == enum.VariableDefinition {
			definition, ok := findDefinition(definitions, param.VariableDefinitionKey)
			if !ok {
				return fmt.Errorf("key is not valid: %s", param.VariableDefinitionKey)
			}
			if _, ok := keys[param.VariableDefinitionKey]; ok {
				return fmt.Errorf("duplicate variable for same key: %s", param.VariableDefinitionKey)
			}
			keys[param.VariableDefinitionKey] = struct{}{}
			if err := verifyVariableExpression(ctx, definition, param); err != nil {
				return err
			}
			if param.VariableDefinitionKey == actions.InputVariableType {
				templateParam = param
				templateType = flowschema.ActionTypeWorkOrder
			} else if param.VariableDefinitionKey == actions.InputVariableWorkerType {
				templateParam = param
				templateType = flowschema.ActionTypeWorker
			}
		}
	}
	for _, param := range params {
		if param.Type == enum.PropertyTypeDefinition {
			if templateParam == nil {
				return fmt.Errorf("there are properties but there isn't a Template assigned to block: %q", param.BlockID)
			}
			if templateType == flowschema.ActionTypeWorkOrder {
				woTypeID, err := strconv.Atoi(templateParam.Expression)
				if err != nil {
					return fmt.Errorf("there is a misktake in the Work Order Type Id: %s", templateParam.Expression)
				}
				_, ok := FindPropertyWorkOrder(ctx, param.PropertyTypeID, woTypeID)
				if !ok {
					return fmt.Errorf("PropertyTypeID %q is not valid for WorkOrderType: %q ", param.PropertyTypeID, woTypeID)
				}
			} else if templateType == flowschema.ActionTypeWorker {
				wkTypeID, err := strconv.Atoi(templateParam.Expression)
				if err != nil {
					return fmt.Errorf("there is a misktake in the Worker Type Id: %s", templateParam.Expression)
				}
				_, ok := FindPropertyWorker(ctx, param.PropertyTypeID, wkTypeID)
				if !ok {
					return fmt.Errorf("PropertyTypeID %q is not valid for WorkerType: %q ", param.PropertyTypeID, wkTypeID)
				}
			}
			if _, ok := ids[param.PropertyTypeID]; ok {
				return fmt.Errorf("duplicate propertyType for same id: %q", param.PropertyTypeID)
			}
			ids[param.PropertyTypeID] = struct{}{}
		}
	}
	return nil
}

func verifyMandatoryVariables(ctx context.Context, findValue func(*flowschema.VariableDefinition) (*string, bool), definitions []*flowschema.VariableDefinition) error {
	for _, definition := range definitions {
		if !definition.Mandatory {
			continue
		}
		variable, ok := findValue(definition)
		if !ok {
			return fmt.Errorf("mandatory variable %s not found", definition.Key)
		}
		if variable != nil {
			if err := validateVariableValueNotEmpty(ctx, definition, *variable); err != nil {
				return err
			}
		}
	}
	return nil
}

// VerifyMandatoryVariableExpressions verifies if variable expressions of block exist if there are defined as mandatory
func VerifyMandatoryVariableExpressions(ctx context.Context, params []*flowschema.VariableExpression, definitions []*flowschema.VariableDefinition) error {
	return verifyMandatoryVariables(ctx, func(definition *flowschema.VariableDefinition) (*string, bool) {
		for _, param := range params {
			if definition.Key == param.VariableDefinitionKey {
				if len(param.BlockVariables) == 0 {
					return &param.Expression, true
				}
				return nil, true
			}
		}
		return nil, false
	}, definitions)
}

func verifyMandatoryVariableValues(ctx context.Context, params []*flowschema.VariableValue, definitions []*flowschema.VariableDefinition) error {
	return verifyMandatoryVariables(ctx, func(definition *flowschema.VariableDefinition) (*string, bool) {
		for _, param := range params {
			if definition.Key == param.VariableDefinitionKey {
				if definition.Key == param.VariableDefinitionKey {
					return &param.Value, true
				}
			}
		}
		return nil, false
	}, definitions)
}

// VerifyVariableValues verifies if variable value of block instance are according to their definition
func VerifyVariableValues(ctx context.Context, params []*flowschema.VariableValue, definitions []*flowschema.VariableDefinition) error {
	keys := make(map[string]struct{}, len(params))
	for _, param := range params {
		definition, ok := findDefinition(definitions, param.VariableDefinitionKey)
		if !ok {
			return fmt.Errorf("key is not valid: %s", param.VariableDefinitionKey)
		}
		if _, ok := keys[param.VariableDefinitionKey]; ok {
			return fmt.Errorf("duplicate variable for same key: %s", param.VariableDefinitionKey)
		}
		keys[param.VariableDefinitionKey] = struct{}{}
		if err := verifyVariableValue(ctx, definition, param.Value); err != nil {
			return err
		}
	}
	return verifyMandatoryVariableValues(ctx, params, definitions)
}

func findDefinition(definitions []*flowschema.VariableDefinition, key string) (*flowschema.VariableDefinition, bool) {
	for _, definition := range definitions {
		if definition.Key == key {
			return definition, true
		}
	}
	return nil, false
}

func FindPropertyWorkOrder(ctx context.Context, propertyTypeID int, workOrderTypeID int) (*ent.PropertyType, bool) {
	client := ent.FromContext(ctx)
	workOrderType, err := client.WorkOrderType.Get(ctx, workOrderTypeID)
	if err != nil {
		return nil, false
	}
	propertyType, err := workOrderType.QueryPropertyTypes().Where(propertytype.ID(propertyTypeID)).Only(ctx)
	if err != nil {
		return nil, false
	}
	return propertyType, true
}

func FindCheckListItemWorkOrder(ctx context.Context, checkListItemID int, workOrderTypeID int) (*ent.CheckListItemDefinition, bool) {
	client := ent.FromContext(ctx)
	workOrderType, err := client.WorkOrderType.Get(ctx, workOrderTypeID)
	if err != nil {
		return nil, false
	}
	checkListItem, err := workOrderType.QueryCheckListCategoryDefinitions().QueryCheckListItemDefinitions().Where(checklistitemdefinition.ID(checkListItemID)).Only(ctx)
	if err != nil {
		return nil, false
	}
	return checkListItem, true
}

func FindPropertyWorker(ctx context.Context, propertyTypeID int, workerTypeID int) (*ent.PropertyType, bool) {
	client := ent.FromContext(ctx)
	workerType, err := client.WorkerType.Get(ctx, workerTypeID)
	if err != nil {
		return nil, false
	}
	propertyType, err := workerType.QueryPropertyTypes().Where(propertytype.ID(propertyTypeID)).Only(ctx)
	if err != nil {
		return nil, false
	}
	return propertyType, true
}

// FindAllNestedVariables uses variable expressions to check nested definitions and returns the full list of available definitions
func FindAllNestedVariables(
	ctx context.Context,
	definitions []*flowschema.VariableDefinition,
	params []*flowschema.VariableExpression,
	usages []enum.VariableUsage) ([]*flowschema.VariableDefinition, error) {
	var allDefinitions []*flowschema.VariableDefinition
	for _, definition := range definitions {
		if definition.Usage.In(usages...) {
			allDefinitions = append(allDefinitions, definition)
		}
		if definition.NestedVariables == nil {
			continue
		}
		for _, param := range params {
			if param.VariableDefinitionKey == definition.Key && len(param.BlockVariables) == 0 {
				values, err := ParseVariableValue(ctx, definition, param.Expression)
				if err != nil {
					return nil, err
				}
				nestedDefinitions, err := definition.NestedVariables(ctx, values)
				if err != nil {
					return nil, err
				}
				allNestedDefinitions, err := FindAllNestedVariables(ctx, nestedDefinitions, params, usages)
				if err != nil {
					return nil, err
				}
				allDefinitions = append(allDefinitions, allNestedDefinitions...)
			}
		}
	}
	return allDefinitions, nil
}

// GetInputVariableDefinitions returns all input variable definitions of specific block
func GetInputVariableDefinitions(ctx context.Context, b *ent.Block, triggerFactory triggers.Factory, actionFactory actions.Factory) ([]*flowschema.VariableDefinition, error) {
	var variableDefinitions []*flowschema.VariableDefinition
	switch b.Type {
	case block.TypeStart:
		variableDefinitions = append(variableDefinitions, b.StartParamDefinitions...)
	case block.TypeEnd:
		flowDraft, err := b.QueryFlowDraft().
			Only(ctx)
		switch {
		case err != nil && !ent.IsNotFound(err):
			return nil, err
		case err != nil && ent.IsNotFound(err):
			flow, err := b.QueryFlow().Only(ctx)
			if err != nil {
				return nil, err
			}
			variableDefinitions = append(variableDefinitions, flow.EndParamDefinitions...)
		case err == nil:
			variableDefinitions = append(variableDefinitions, flowDraft.EndParamDefinitions...)
		}
	case block.TypeTrigger:
		triggerType, err := triggerFactory.GetType(*b.TriggerType)
		if err != nil {
			return nil, err
		}
		allDefinitions, err := FindAllNestedVariables(ctx,
			triggerType.Variables(),
			b.InputParams,
			[]enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput})
		if err != nil {
			return nil, err
		}
		variableDefinitions = append(variableDefinitions, allDefinitions...)
	case block.TypeAction:
		actionType, err := actionFactory.GetType(*b.ActionType)
		if err != nil {
			return nil, err
		}
		allDefinitions, err := FindAllNestedVariables(ctx,
			actionType.Variables(),
			b.InputParams,
			[]enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput})
		if err != nil {
			return nil, err
		}
		variableDefinitions = append(variableDefinitions, allDefinitions...)
	case block.TypeSubFlow:
		subFlowStart, err := b.QuerySubFlow().
			QueryBlocks().
			Where(block.TypeEQ(block.TypeStart)).
			Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to find single start for subflow: %w", err)
		}
		variableDefinitions = append(variableDefinitions, subFlowStart.StartParamDefinitions...)
	}
	return variableDefinitions, nil
}

// GetOutputVariableDefinitions returns all output variable definitions of specific block
func GetOutputVariableDefinitions(ctx context.Context, b *ent.Block, triggerFactory triggers.Factory, actionFactory actions.Factory) ([]*flowschema.VariableDefinition, error) {
	var variableDefinitions []*flowschema.VariableDefinition
	switch b.Type {
	case block.TypeStart:
		variableDefinitions = append(variableDefinitions, b.StartParamDefinitions...)
	case block.TypeTrigger:
		triggerType, err := triggerFactory.GetType(*b.TriggerType)
		if err != nil {
			return nil, err
		}
		allDefinitions, err := FindAllNestedVariables(ctx,
			triggerType.Variables(),
			b.InputParams,
			[]enum.VariableUsage{enum.VariableUsageOutput, enum.VariableUsageInputAndOutput})
		if err != nil {
			return nil, err
		}
		variableDefinitions = append(variableDefinitions, allDefinitions...)
	case block.TypeAction:
		actionType, err := actionFactory.GetType(*b.ActionType)
		if err != nil {
			return nil, err
		}
		allDefinitions, err := FindAllNestedVariables(ctx,
			actionType.Variables(),
			b.InputParams,
			[]enum.VariableUsage{enum.VariableUsageOutput, enum.VariableUsageInputAndOutput})
		if err != nil {
			return nil, err
		}
		variableDefinitions = append(variableDefinitions, allDefinitions...)
	case block.TypeSubFlow:
		subFlow, err := b.QuerySubFlow().
			Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query subflow: %w", err)
		}
		variableDefinitions = append(variableDefinitions, subFlow.EndParamDefinitions...)
	}
	return variableDefinitions, nil
}
