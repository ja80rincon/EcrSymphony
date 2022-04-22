// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/ent/workordertype"
)

// WorkOrderCloseDateHook modifies work order close date from status.
func WorkOrderCloseDateHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, mutation *ent.WorkOrderMutation) (ent.Value, error) {
			status, exists := mutation.Status()
			if !exists {
				return next.Mutate(ctx, mutation)
			}
			if _, exists := mutation.CloseDate(); exists {
				return next.Mutate(ctx, mutation)
			}
			if mutation.Op().Is(ent.OpUpdateOne) {
				switch oldStatus, err := mutation.OldStatus(ctx); {
				case err != nil:
					return nil, err
				case status == oldStatus:
					return next.Mutate(ctx, mutation)
				}
			}
			switch status {
			case workorder.StatusDone, workorder.StatusClosed:
				mutation.SetCloseDate(time.Now())
			default:
				mutation.ClearCloseDate()
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate|ent.OpUpdateOne|ent.OpUpdate)
}

func addWorkOrderTemplate(
	ctx context.Context,
	client *ent.Client,
	workOrderTypeID int,
) (*ent.WorkOrderTemplate, error) {
	workOrderType, err := client.WorkOrderType.Query().
		Where(workordertype.ID(workOrderTypeID)).
		WithPropertyTypes().
		WithCheckListCategoryDefinitions().
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying work order type: %w", err)
	}
	workOrderTemplate, err := client.WorkOrderTemplate.
		Create().
		SetName(workOrderType.Name).
		SetNillableDescription(workOrderType.Description).
		SetAssigneeCanCompleteWorkOrder(workOrderType.AssigneeCanCompleteWorkOrder).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("creating work order template: %w", err)
	}
	for _, pt := range workOrderType.Edges.PropertyTypes {
		_, err := createTemplatePropertyType(ctx, client, pt, workOrderTemplate.ID, PropertyTypeParentWorkOrder)
		if err != nil {
			return nil, fmt.Errorf("creating property type: %w", err)
		}
	}
	for _, categoryInput := range workOrderType.Edges.CheckListCategoryDefinitions {
		cd, err := client.CheckListCategoryDefinition.Create().
			SetTitle(categoryInput.Title).
			SetDescription(categoryInput.Description).
			SetWorkOrderTemplateID(workOrderTemplate.ID).
			Save(ctx)
		if err != nil {
			return nil, fmt.Errorf("creating check list category definition: %w", err)
		}
		checkLists, err := categoryInput.QueryCheckListItemDefinitions().All(ctx)
		if err != nil {
			return nil, err
		}
		for _, checkList := range checkLists {
			_, err := client.CheckListItemDefinition.Create().
				SetTitle(checkList.Title).
				SetType(checkList.Type).
				SetIndex(checkList.Index).
				SetIsMandatory(checkList.IsMandatory).
				SetNillableHelpText(checkList.HelpText).
				SetNillableEnumValues(checkList.EnumValues).
				SetNillableEnumSelectionModeValue(checkList.EnumSelectionModeValue).
				SetCheckListCategoryDefinitionID(cd.ID).
				Save(ctx)
			if err != nil {
				return nil, fmt.Errorf("creating check list item definition: %w", err)
			}
		}
	}
	return workOrderTemplate, nil
}

// WorkOrderAddTemplateHook creates work order template and attaches it to the created work order.
func WorkOrderAddTemplateHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, mutation *ent.WorkOrderMutation) (ent.Value, error) {
			client := mutation.Client()
			typeID, exists := mutation.TypeID()
			if !exists {
				return nil, errors.New("work order must have type")
			}
			workOrderTemplate, err := addWorkOrderTemplate(ctx, client, typeID)
			if err != nil {
				return nil, fmt.Errorf("failed to create work order template: %w", err)
			}
			mutation.SetTemplateID(workOrderTemplate.ID)
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate)
}

// WorkOrderUpdateStateHook sync the state field according to the status field
func WorkOrderUpdateStatusHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.WorkOrderFunc(func(ctx context.Context, mutation *ent.WorkOrderMutation) (ent.Value, error) {
			status, _ := mutation.Status()
			switch status {
			case workorder.StatusDone:
				mutation.SetStatus(workorder.StatusClosed)
			case workorder.StatusPending:
				mutation.SetStatus(workorder.StatusPlanned)
			}
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.If(hk, hook.And(hook.HasOp(ent.OpCreate|ent.OpUpdateOne|ent.OpUpdate), hook.HasFields(workorder.FieldStatus)))
}
