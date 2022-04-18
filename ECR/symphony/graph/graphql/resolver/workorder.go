// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent/activity"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/graph/resolverutil"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/file"
	"github.com/facebookincubator/symphony/pkg/ent/link"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/ent/workordertype"
	"github.com/facebookincubator/symphony/pkg/viewer"

	"github.com/AlekSi/pointer"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.uber.org/zap"
)

type workOrderTypeResolver struct{}

func (workOrderTypeResolver) NumberOfWorkOrders(ctx context.Context, obj *ent.WorkOrderType) (int, error) {
	workOrders, err := obj.Edges.WorkOrdersOrErr()
	if !ent.IsNotLoaded(err) {
		return len(workOrders), err
	}
	return obj.QueryWorkOrders().Count(ctx)
}

type workOrderResolver struct{}

func (r workOrderResolver) Activities(ctx context.Context, obj *ent.WorkOrder, filter *models.ActivityFilterInput) ([]*ent.Activity, error) {
	if filter != nil {
		query := obj.QueryActivities().
			Where(activity.ActivityTypeEQ(filter.ActivityType))

		if filter.OrderDirection == ent.OrderDirectionAsc {
			query = query.Order(ent.Asc(activity.FieldCreateTime))
		} else {
			query = query.Order(ent.Desc(activity.FieldCreateTime))
		}

		return query.Limit(filter.Limit).All(ctx)
	}

	return obj.QueryActivities().All(ctx)
}
func (workOrderResolver) OrganizationFk(ctx context.Context, workOrder *ent.WorkOrder) (*ent.Organization, error) {
	variable, err := workOrder.Organization(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (workOrderResolver) EquipmentToAdd(ctx context.Context, obj *ent.WorkOrder) ([]*ent.Equipment, error) {
	return obj.QueryEquipment().Where(equipment.FutureStateEQ(enum.FutureStateInstall)).All(ctx)
}

func (workOrderResolver) EquipmentToRemove(ctx context.Context, obj *ent.WorkOrder) ([]*ent.Equipment, error) {
	return obj.QueryEquipment().Where(equipment.FutureStateEQ(enum.FutureStateRemove)).All(ctx)
}

func (workOrderResolver) LinksToAdd(ctx context.Context, obj *ent.WorkOrder) ([]*ent.Link, error) {
	return obj.QueryLinks().Where(link.FutureStateEQ(enum.FutureStateInstall)).All(ctx)
}

func (workOrderResolver) LinksToRemove(ctx context.Context, obj *ent.WorkOrder) ([]*ent.Link, error) {
	return obj.QueryLinks().Where(link.FutureStateEQ(enum.FutureStateRemove)).All(ctx)
}

func (workOrderResolver) fileOfType(ctx context.Context, workOrder *ent.WorkOrder, typ file.Type) ([]*ent.File, error) {
	return workOrder.QueryFiles().Where(file.TypeEQ(typ)).All(ctx)
}

func (r workOrderResolver) Images(ctx context.Context, obj *ent.WorkOrder) ([]*ent.File, error) {
	return r.fileOfType(ctx, obj, file.TypeImage)
}

func (r workOrderResolver) Files(ctx context.Context, obj *ent.WorkOrder) ([]*ent.File, error) {
	return r.fileOfType(ctx, obj, file.TypeFile)
}

func (r mutationResolver) AddWorkOrder(
	ctx context.Context,
	input models.AddWorkOrderInput,
) (*ent.WorkOrder, error) {
	return r.internalAddWorkOrder(ctx, input, false)
}

func (r mutationResolver) convertToTemplatePropertyInputs(
	ctx context.Context,
	template *ent.WorkOrderTemplate,
	properties []*models.PropertyInput,
) ([]*models.PropertyInput, error) {
	client := r.ClientFrom(ctx).PropertyType
	inputs := make([]*models.PropertyInput, 0, len(properties))
	for _, p := range properties {
		name, err := client.Query().
			Where(propertytype.ID(p.PropertyTypeID)).
			Select(propertytype.FieldName).
			String(ctx)
		if err != nil {
			return nil, fmt.Errorf("cannot query property type name from id: %w", err)
		}
		id, err := template.
			QueryPropertyTypes().
			Where(propertytype.Name(name)).
			OnlyID(ctx)
		if err != nil {
			return nil, err
		}
		input := *p
		input.PropertyTypeID = id
		inputs = append(inputs, &input)
	}
	return inputs, nil
}

func (r mutationResolver) internalAddWorkOrder(
	ctx context.Context,
	input models.AddWorkOrderInput,
	skipMandatoryPropertiesCheck bool,
) (*ent.WorkOrder, error) {
	mutation := r.ClientFrom(ctx).
		WorkOrder.Create().
		SetName(input.Name).
		SetTypeID(input.WorkOrderTypeID).
		SetNillableStatus(input.Status).
		SetNillablePriority(input.Priority).
		SetNillableProjectID(input.ProjectID).
		SetNillableLocationID(input.LocationID).
		SetNillableDescription(input.Description).
		SetCreationDate(time.Now()).
		SetNillableIndex(input.Index).
		SetNillableAssigneeID(input.AssigneeID).
		SetNillableOrganizationID(input.OrganizationFk).
		SetNillableDuration(input.Duration).
		SetNillableDueDate(input.DueDate)
	if input.OwnerID != nil {
		mutation = mutation.SetOwnerID(*input.OwnerID)
	} else {
		v, ok := viewer.FromContext(ctx).(*viewer.UserViewer)
		if !ok {
			return nil, gqlerror.Errorf("could not be executed in automation")
		}
		mutation = mutation.SetOwner(v.User())
	}
	wo, err := mutation.Save(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "creating work order")
	}
	tmpl, err := wo.QueryTemplate().Only(ctx)
	if err != nil {
		return nil, err
	}
	tPropInputs, err := r.convertToTemplatePropertyInputs(ctx, tmpl, input.Properties)
	if err != nil {
		return nil, fmt.Errorf("convert to template property inputs: %w", err)
	}
	skipMandatoryPropertiesCheck = skipMandatoryPropertiesCheck || viewer.FromContext(ctx).Features().Enabled(viewer.FeatureMandatoryPropertiesOnWorkOrderClose)
	propInput, err := r.validatedPropertyInputsFromTemplate(ctx, tPropInputs, tmpl.ID, enum.PropertyEntityWorkOrder, skipMandatoryPropertiesCheck)
	if err != nil {
		return nil, fmt.Errorf("validating property for template : %w", err)
	}

	for _, clInput := range input.CheckListCategories {
		_, err := r.createOrUpdateCheckListCategory(ctx, clInput, wo.ID)
		if err != nil {
			return nil, errors.Wrap(err, "creating check list category")
		}
	}
	if _, err := r.AddProperties(propInput,
		resolverutil.AddPropertyArgs{
			Context:    ctx,
			EntSetter:  func(b *ent.PropertyCreate) { b.SetWorkOrderID(wo.ID) },
			IsTemplate: pointer.ToBool(true),
		},
	); err != nil {
		return nil, errors.Wrap(err, "creating work order properties")
	}
	return wo, nil
}

func (r mutationResolver) EditWorkOrder(
	ctx context.Context,
	input models.EditWorkOrderInput,
) (*ent.WorkOrder, error) {
	client := r.ClientFrom(ctx)
	wo, err := client.WorkOrder.Get(ctx, input.ID)
	if err != nil {
		return nil, errors.Wrap(err, "querying work order")
	}
	mutation := client.WorkOrder.
		UpdateOne(wo).
		SetName(input.Name).
		SetNillableDescription(input.Description).
		SetNillableIndex(input.Index).
		SetNillableStatus(input.Status).
		SetNillablePriority(input.Priority).
		SetNillableOrganizationID(input.OrganizationFk).
		SetNillableDuration(input.Duration).
		SetNillableDueDate(input.DueDate)

	if input.AssigneeID != nil {
		mutation.SetAssigneeID(*input.AssigneeID)
	} else {
		mutation.ClearAssignee()
	}
	if input.OwnerID != nil {
		mutation.SetOwnerID(*input.OwnerID)
	}
	if input.InstallDate != nil {
		mutation.SetInstallDate(*input.InstallDate)
	} else {
		mutation.ClearInstallDate()
	}
	if input.ProjectID != nil {
		mutation.SetProjectID(*input.ProjectID)
	} else {
		mutation.ClearProject()
	}
	if input.LocationID != nil {
		mutation.SetLocationID(*input.LocationID)
	} else {
		mutation.ClearLocation()
	}
	tPropInputs := input.Properties
	tmpl, err := wo.QueryTemplate().Only(ctx)
	if err != nil {
		if !ent.IsNotFound(err) {
			return nil, err
		}
	} else {
		tPropInputs, err = r.convertToTemplatePropertyInputs(ctx, tmpl, tPropInputs)
		if err != nil {
			return nil, fmt.Errorf("convert to template property inputs: %w", err)
		}
	}
	for _, pin := range tPropInputs {
		err = r.updateProperty(ctx, wo.QueryProperties(), pin)
		if err != nil {
			return nil, fmt.Errorf("updating work order property value: %w", err)
		}
	}
	ids := make([]int, 0, len(input.CheckListCategories))
	for _, clInput := range input.CheckListCategories {
		cli, err := r.createOrUpdateCheckListCategory(ctx, clInput, wo.ID)
		if err != nil {
			return nil, err
		}
		ids = append(ids, cli.ID)
	}
	currentCL, err := wo.QueryCheckListCategories().IDs(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "querying checklist categories of work order %q", wo.ID)
	}
	addedCLIds, deletedCLIds := resolverutil.GetDifferenceBetweenSlices(currentCL, ids)
	mutation.
		RemoveCheckListCategoryIDs(deletedCLIds...).
		AddCheckListCategoryIDs(addedCLIds...)
	return mutation.Save(ctx)
}

func (r mutationResolver) updateProperty(
	ctx context.Context,
	query *ent.PropertyQuery,
	input *models.PropertyInput) error {
	propertyQuery := query.
		Where(property.HasTypeWith(propertytype.ID(input.PropertyTypeID)))
	if input.ID != nil {
		propertyQuery = propertyQuery.
			Where(property.ID(*input.ID))
	}
	existingProperty, err := propertyQuery.Only(ctx)
	if err != nil {
		if input.ID == nil {
			return errors.Wrapf(err, "querying property type %q", input.PropertyTypeID)
		}
		return errors.Wrapf(err, "querying property type %q and id %q", input.PropertyTypeID, *input.ID)
	}
	client := r.ClientFrom(ctx)
	typ, err := client.PropertyType.Get(ctx, input.PropertyTypeID)
	if err != nil {
		return errors.Wrapf(err, "querying property type %q", input.PropertyTypeID)
	}
	if typ.Editable && typ.IsInstanceProperty {
		updater := client.Property.UpdateOneID(existingProperty.ID)
		if r.updatePropValues(ctx, input, updater) != nil {
			return errors.Wrap(err, "saving work order property value update")
		}
	}
	return nil
}

func (r mutationResolver) createOrUpdateCheckListCategory(
	ctx context.Context,
	clInput *models.CheckListCategoryInput,
	workOrderID int) (*ent.CheckListCategory, error) {
	client := r.ClientFrom(ctx)
	cl := client.CheckListCategory
	var clc *ent.CheckListCategory
	var err error
	if clInput.ID == nil {
		clc, err = cl.Create().
			SetTitle(clInput.Title).
			SetNillableDescription(clInput.Description).
			SetWorkOrderID(workOrderID).
			Save(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "creating check list category")
		}
	} else {
		clc, err = cl.UpdateOneID(*clInput.ID).
			SetTitle(clInput.Title).
			SetNillableDescription(clInput.Description).
			Save(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "updating check list category")
		}
	}
	mutation := cl.UpdateOneID(clc.ID)
	addedCLIds, deletedCLIds, err := r.createOrUpdateCheckListItems(ctx, clc, clInput.CheckList)
	if err != nil {
		return nil, errors.Wrap(err, "updating check list category items")
	}
	return mutation.
		RemoveCheckListItemIDs(deletedCLIds...).
		AddCheckListItemIDs(addedCLIds...).
		Save(ctx)
}

func (r mutationResolver) createOrUpdateCheckListItems(
	ctx context.Context,
	clc *ent.CheckListCategory,
	inputs []*models.CheckListItemInput) ([]int, []int, error) {
	ids := make([]int, 0, len(inputs))
	for _, input := range inputs {
		cli, err := r.createOrUpdateCheckListItem(ctx, input, clc.ID)
		if err != nil {
			return nil, nil, err
		}
		if cli != nil {
			ids = append(ids, cli.ID)
		}
	}
	currentCLIds := clc.QueryCheckListItems().IDsX(ctx)
	addedCLIds, deletedCLIds := resolverutil.GetDifferenceBetweenSlices(currentCLIds, ids)
	return addedCLIds, deletedCLIds, nil
}

func (r mutationResolver) createOrUpdateCheckListItem(
	ctx context.Context,
	input *models.CheckListItemInput,
	checklistCategoryID int) (*ent.CheckListItem, error) {
	client := r.ClientFrom(ctx)
	cl := client.CheckListItem
	var cli *ent.CheckListItem
	var err error
	if input.ID == nil {
		cli, err = cl.Create().
			SetTitle(input.Title).
			SetType(input.Type).
			SetNillableIndex(input.Index).
			SetNillableIsMandatory(input.IsMandatory).
			SetNillableEnumValues(input.EnumValues).
			SetNillableHelpText(input.HelpText).
			SetNillableChecked(input.Checked).
			SetNillableStringVal(input.StringValue).
			SetNillableEnumSelectionModeValue(input.EnumSelectionMode).
			SetNillableSelectedEnumValues(input.SelectedEnumValues).
			SetNillableYesNoVal(input.YesNoResponse).
			SetCheckListCategoryID(checklistCategoryID).
			Save(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "creating check list item")
		}
	} else {
		cli, err = cl.UpdateOneID(*input.ID).
			SetTitle(input.Title).
			SetType(input.Type).
			SetNillableIndex(input.Index).
			SetNillableIsMandatory(input.IsMandatory).
			SetNillableEnumValues(input.EnumValues).
			SetNillableHelpText(input.HelpText).
			SetNillableChecked(input.Checked).
			SetNillableStringVal(input.StringValue).
			SetNillableEnumSelectionModeValue(input.EnumSelectionMode).
			SetNillableSelectedEnumValues(input.SelectedEnumValues).
			SetNillableYesNoVal(input.YesNoResponse).
			Save(ctx)
	}
	if err != nil {
		return nil, errors.Wrap(err, "updating check list item")
	}

	err = r.createCheckListItemScans(ctx, cli, input.WifiData, input.CellData)
	if err != nil {
		return nil, fmt.Errorf("creating scans, item %q: err %w", cli.ID, err)
	}

	return r.createOrUpdateCheckListItemFiles(ctx, cli, input.Files)
}

func toIDSet(ids []int) map[int]bool {
	idSet := make(map[int]bool, len(ids))
	for _, id := range ids {
		idSet[id] = true
	}
	return idSet
}

func (r mutationResolver) deleteRemovedCheckListItemFiles(ctx context.Context, item *ent.CheckListItem, currentFileIDs []int, inputFileIDs []int) (*ent.CheckListItem, map[int]bool, error) {
	client := r.ClientFrom(ctx)
	_, deletedFileIDs := resolverutil.GetDifferenceBetweenSlices(currentFileIDs, inputFileIDs)
	deletedIDSet := toIDSet(deletedFileIDs)
	for _, fileID := range deletedFileIDs {
		err := client.File.DeleteOneID(fileID).Exec(ctx)
		if err != nil {
			return nil, nil, fmt.Errorf("deleting checklist file: file=%q: %w", fileID, err)
		}
	}
	item, err := client.CheckListItem.UpdateOne(item).RemoveFileIDs(deletedFileIDs...).Save(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("removing checklist files, item: %q: %w", item, err)
	}
	return item, deletedIDSet, nil
}

func (r mutationResolver) createAddedCheckListItemFiles(ctx context.Context, item *ent.CheckListItem, fileInputs []*models.FileInput) (*ent.CheckListItem, error) {
	for _, input := range fileInputs {
		if input.ID != nil {
			continue
		}
		_, err := r.createImage(
			ctx,
			&models.AddImageInput{
				ImgKey:   input.StoreKey,
				FileName: input.FileName,
				FileSize: func() int {
					if input.SizeInBytes != nil {
						return *input.SizeInBytes
					}
					return 0
				}(),
				Modified: time.Now(),
				ContentType: func() string {
					if input.MimeType != nil {
						return *input.MimeType
					}
					return "image/jpeg"
				}(),
				Annotation: input.Annotation,
			},
			func(create *ent.FileCreate) error {
				create.SetChecklistItem(item)
				return nil
			},
		)
		if err != nil {
			return nil, err
		}
	}
	return item, nil
}

func (r mutationResolver) createCheckListItemScans(ctx context.Context, item *ent.CheckListItem, wifiData []*models.SurveyWiFiScanData, cellData []*models.SurveyCellScanData) error {
	if len(wifiData) > 0 {
		_, err := r.CreateWiFiScans(ctx, wifiData, ScanParentIDs{checklistItemID: &item.ID})
		if err != nil {
			return fmt.Errorf("creating wifi scans, item %q: err %w", item.ID, err)
		}
	}
	if len(cellData) > 0 {
		_, err := r.CreateCellScans(ctx, cellData, ScanParentIDs{checklistItemID: &item.ID})
		if err != nil {
			return fmt.Errorf("creating cell scans, item %q: err %w", item.ID, err)
		}
	}

	return nil
}

func (r mutationResolver) createOrUpdateCheckListItemFiles(ctx context.Context, item *ent.CheckListItem, fileInputs []*models.FileInput) (*ent.CheckListItem, error) {
	client := r.ClientFrom(ctx)
	currentFileIDs, err := client.CheckListItem.QueryFiles(item).IDs(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying checklist files, item=%q: %w", item.ID, err)
	}
	inputFileIDs := make([]int, 0, len(fileInputs))
	for _, fileInput := range fileInputs {
		if fileInput.ID == nil {
			continue
		}
		inputFileIDs = append(inputFileIDs, *fileInput.ID)
	}
	item, deletedIDSet, err := r.deleteRemovedCheckListItemFiles(ctx, item, currentFileIDs, inputFileIDs)
	if err != nil {
		return nil, err
	}
	item, err = r.createAddedCheckListItemFiles(ctx, item, fileInputs)
	if err != nil {
		return nil, err
	}
	for _, input := range fileInputs {
		if input.ID == nil {
			continue
		}
		if _, ok := deletedIDSet[*input.ID]; ok {
			continue
		}
		existingFile, err := client.File.Get(ctx, *input.ID)
		if err != nil {
			return nil, fmt.Errorf("querying file: file=%q: %w", *input.ID, err)
		}
		if existingFile.Name == input.FileName {
			continue
		}
		_, err = client.File.UpdateOne(existingFile).SetName(input.FileName).SetModifiedAt(time.Now()).Save(ctx)
		if err != nil {
			return nil, fmt.Errorf("updating file name: file=%q: %w", existingFile.ID, err)
		}
	}
	return item, nil
}

func (r mutationResolver) addWorkOrderTypeCategoryDefinitions(ctx context.Context, input models.AddWorkOrderTypeInput, workOrderTypeID int) error {
	client := r.ClientFrom(ctx)
	for _, categoryInput := range input.CheckListCategories {
		checkListCategoryDefinition, err := client.CheckListCategoryDefinition.Create().
			SetTitle(categoryInput.Title).
			SetNillableDescription(categoryInput.Description).
			SetWorkOrderTypeID(workOrderTypeID).
			Save(ctx)
		if err != nil {
			return errors.Wrap(err, "creating check list category definition")
		}
		for _, clInput := range categoryInput.CheckList {
			if _, err = client.CheckListItemDefinition.Create().
				SetTitle(clInput.Title).
				SetType(clInput.Type).
				SetNillableIndex(clInput.Index).
				SetNillableIsMandatory(clInput.IsMandatory).
				SetNillableHelpText(clInput.HelpText).
				SetNillableEnumValues(clInput.EnumValues).
				SetNillableEnumSelectionModeValue(clInput.EnumSelectionMode).
				SetCheckListCategoryDefinitionID(checkListCategoryDefinition.ID).
				Save(ctx); err != nil {
				return errors.Wrap(err, "creating check list item definition")
			}
		}
	}
	return nil
}

func (r mutationResolver) AddWorkOrderType(
	ctx context.Context, input models.AddWorkOrderTypeInput) (*ent.WorkOrderType, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.WorkOrderType.
		Create().
		SetName(input.Name).
		SetNillableDescription(input.Description).
		SetNillableAssigneeCanCompleteWorkOrder(input.AssigneeCanCompleteWorkOrder).
		SetNillableDuration(input.Duration).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("A work order type with the name %v already exists", input.Name)
		}
		return nil, errors.Wrap(err, "creating work order type")
	}
	if err := r.AddPropertyTypes(ctx, func(ptc *ent.PropertyTypeCreate) {
		ptc.SetWorkOrderTypeID(typ.ID)
	}, input.Properties...); err != nil {
		return nil, err
	}
	err = r.addWorkOrderTypeCategoryDefinitions(ctx, input, typ.ID)
	if err != nil {
		return nil, errors.Wrap(err, "creating checklist category definitions")
	}
	return typ, nil
}

func (r mutationResolver) EditWorkOrderType(
	ctx context.Context, input models.EditWorkOrderTypeInput,
) (*ent.WorkOrderType, error) {
	client := r.ClientFrom(ctx)
	wot, err := client.WorkOrderType.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("A work order template with id=%q does not exist", input.ID)
		}
		return nil, errors.Wrapf(err, "updating work order template: id=%q", input.ID)
	}
	for _, p := range input.Properties {
		if p.ID == nil {
			if err := r.AddPropertyTypes(ctx, func(b *ent.PropertyTypeCreate) { b.SetWorkOrderTypeID(input.ID) }, p); err != nil {
				return nil, err
			}
		} else if err := r.updatePropType(ctx, p); err != nil {
			return nil, err
		}
	}
	mutation := client.WorkOrderType.
		UpdateOneID(input.ID).
		SetName(input.Name).
		SetNillableDescription(input.Description).
		SetNillableAssigneeCanCompleteWorkOrder(input.AssigneeCanCompleteWorkOrder).
		SetNillableDuration(input.Duration)
	currentCategories, err := wot.QueryCheckListCategoryDefinitions().IDs(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "querying checklist category definitions: id=%q", wot.ID)
	}
	ids := make([]int, 0, len(input.CheckListCategories))
	for _, categoryInput := range input.CheckListCategories {
		category, err := r.createOrUpdateCheckListCategoryDefinition(ctx, categoryInput, wot.ID)
		if err != nil {
			return nil, err
		}
		ids = append(ids, category.ID)
	}
	_, deletedCategoryIds := resolverutil.GetDifferenceBetweenSlices(currentCategories, ids)
	mutation = mutation.RemoveCheckListCategoryDefinitionIDs(deletedCategoryIds...)
	wot, err = mutation.Save(ctx)
	if ent.IsConstraintError(err) {
		return nil, gqlerror.Errorf("A work order type with the name %v already exists", input.Name)
	}
	return wot, err
}

func (r mutationResolver) createOrUpdateCheckListCategoryDefinition(
	ctx context.Context,
	categoryInput *models.CheckListCategoryDefinitionInput,
	wotID int) (*ent.CheckListCategoryDefinition, error) {
	client := r.ClientFrom(ctx)
	cl := client.CheckListCategoryDefinition
	var category *ent.CheckListCategoryDefinition
	var err error
	if categoryInput.ID == nil {
		category, err = cl.Create().
			SetTitle(categoryInput.Title).
			SetNillableDescription(categoryInput.Description).
			SetWorkOrderTypeID(wotID).
			Save(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "creating check list category definition")
		}
	} else {
		category, err = cl.UpdateOneID(*categoryInput.ID).
			SetTitle(categoryInput.Title).
			SetNillableDescription(categoryInput.Description).
			SetWorkOrderTypeID(wotID).
			Save(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "updating check list category definition")
		}
	}
	currentCL, err := category.QueryCheckListItemDefinitions().IDs(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "querying checklist item definitions: id=%q", category.ID)
	}
	ids := make([]int, 0, len(categoryInput.CheckList))
	for _, clInput := range categoryInput.CheckList {
		cli, err := r.createOrUpdateCheckListDefinition(ctx, clInput, category.ID)
		if err != nil {
			return nil, err
		}
		ids = append(ids, cli.ID)
	}
	_, deletedCLIds := resolverutil.GetDifferenceBetweenSlices(currentCL, ids)
	return category.Update().
		RemoveCheckListItemDefinitionIDs(deletedCLIds...).
		Save(ctx)
}

func (r mutationResolver) createOrUpdateCheckListDefinition(
	ctx context.Context,
	clInput *models.CheckListDefinitionInput,
	categoryID int) (*ent.CheckListItemDefinition, error) {
	client := r.ClientFrom(ctx)
	cl := client.CheckListItemDefinition
	if clInput.ID == nil {
		cli, err := cl.Create().
			SetTitle(clInput.Title).
			SetType(clInput.Type).
			SetNillableIndex(clInput.Index).
			SetNillableIsMandatory(clInput.IsMandatory).
			SetNillableEnumValues(clInput.EnumValues).
			SetNillableEnumSelectionModeValue(clInput.EnumSelectionMode).
			SetNillableHelpText(clInput.HelpText).
			SetCheckListCategoryDefinitionID(categoryID).
			Save(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "creating check list definition")
		}
		return cli, nil
	}

	cli, err := cl.UpdateOneID(*clInput.ID).
		SetTitle(clInput.Title).
		SetType(clInput.Type).
		SetNillableIndex(clInput.Index).
		SetNillableIsMandatory(clInput.IsMandatory).
		SetNillableEnumValues(clInput.EnumValues).
		SetNillableEnumSelectionModeValue(clInput.EnumSelectionMode).
		SetNillableHelpText(clInput.HelpText).
		Save(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "updating check list definition")
	}
	return cli, nil
}

func (r mutationResolver) RemoveWorkOrderType(ctx context.Context, id int) (int, error) {
	client, logger := r.ClientFrom(ctx), r.logger.For(ctx).With(zap.Int("id", id))
	switch count, err := client.WorkOrderType.Query().
		Where(workordertype.ID(id)).
		QueryWorkOrders().
		Count(ctx); {
	case err != nil:
		logger.Error("cannot query work order count of type", zap.Error(err))
		return id, fmt.Errorf("querying work orders for type: %w", err)
	case count > 0:
		logger.Warn("work order type has existing work orders", zap.Int("count", count))
		return id, gqlerror.Errorf("cannot delete work order type with %d existing work orders", count)
	}
	pTypes, err := client.PropertyType.Query().
		Where(propertytype.HasWorkOrderTypeWith(workordertype.ID(id))).
		All(ctx)
	if err != nil {
		logger.Error("cannot query properties of work order type", zap.Error(err))
		return id, fmt.Errorf("querying work order property types: %w", err)
	}
	for _, pType := range pTypes {
		if err := client.PropertyType.DeleteOne(pType).
			Exec(ctx); err != nil {
			logger.Error("cannot delete property of work order type", zap.Error(err))
			return id, fmt.Errorf("deleting work order property type: %w", err)
		}
	}
	switch err := client.WorkOrderType.DeleteOneID(id).Exec(ctx); err.(type) {
	case nil:
		logger.Info("deleted work order type")
		return id, nil
	case *ent.NotFoundError:
		err := gqlerror.Errorf("work order type not found")
		logger.Error(err.Message)
		return id, err
	default:
		logger.Error("cannot delete work order type", zap.Error(err))
		return id, fmt.Errorf("deleting work order type: %w", err)
	}
}

func (r mutationResolver) verifyAssigneeOrErr(ctx context.Context, workOrderID int) error {
	client := r.ClientFrom(ctx)
	wo, err := client.WorkOrder.Query().
		Where(workorder.ID(workOrderID)).
		WithAssignee().
		Only(ctx)
	if err != nil {
		return fmt.Errorf("querying work order %q: err %w", workOrderID, err)
	}
	assignee, err := wo.Edges.AssigneeOrErr()
	if err != nil {
		return fmt.Errorf(
			"work order %q is not assigned to a technician: err %w",
			workOrderID,
			err,
		)
	}
	v, ok := viewer.FromContext(ctx).(*viewer.UserViewer)
	if !ok {
		return gqlerror.Errorf("could not be executed in automation")
	}
	if assignee.Email != v.User().Email {
		return fmt.Errorf(
			"mismatch between work order %q assginee %q and technician %q: err %w",
			workOrderID,
			wo.Edges.Assignee.Email,
			v.User().Email,
			err,
		)
	}

	return nil
}

func (r mutationResolver) TechnicianWorkOrderUploadData(ctx context.Context, input models.TechnicianWorkOrderUploadInput) (*ent.WorkOrder, error) {
	client := r.ClientFrom(ctx)
	wo, err := client.WorkOrder.Query().
		Where(workorder.ID(input.WorkOrderID)).
		WithAssignee().
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying work order %q: err %w", input.WorkOrderID, err)
	}
	if err := r.verifyAssigneeOrErr(ctx, input.WorkOrderID); err != nil {
		return nil, err
	}

	for _, clInput := range input.CheckListCategories {
		_, err := r.createOrUpdateCheckListCategory(ctx, clInput, wo.ID)
		if err != nil {
			return nil, errors.Wrap(err, "updating check list category")
		}
	}

	return client.WorkOrder.
		Query().
		Where(workorder.ID(input.WorkOrderID)).
		WithCheckListCategories().
		Only(ctx)
}

func (r mutationResolver) TechnicianWorkOrderCheckOut(ctx context.Context, input models.TechnicianWorkOrderCheckOutInput) (*ent.WorkOrder, error) {
	client := r.ClientFrom(ctx)

	v, ok := viewer.FromContext(ctx).(*viewer.UserViewer)
	if !ok {
		return nil, gqlerror.Errorf("could not be executed in automation")
	}

	if err := r.verifyAssigneeOrErr(ctx, input.WorkOrderID); err != nil {
		return nil, err
	}

	var newStatus workorder.Status
	switch input.Reason {
	case activity.ClockOutReasonPause:
		newStatus = workorder.StatusInProgress
	case activity.ClockOutReasonBlocked:
		newStatus = workorder.StatusBlocked
	case activity.ClockOutReasonSubmit, activity.ClockOutReasonSubmitIncomplete:
		newStatus = workorder.StatusSubmitted
	}

	if _, err := client.WorkOrder.UpdateOneID(input.WorkOrderID).
		SetStatus(newStatus).
		Save(ctx); err != nil {
		return nil, fmt.Errorf("updating work order status %q: err %w", input.WorkOrderID, err)
	}

	activityMutator := client.Activity.Create().
		SetActivityType(activity.ActivityTypeClockOut).
		SetIsCreate(false).
		SetAuthorID(v.User().ID).
		SetWorkOrderID(input.WorkOrderID).
		SetClockDetails(activity.ClockDetails{
			DistanceMeters: input.DistanceMeters,
			Comment:        input.Comment,
			ClockOutReason: &input.Reason,
		})
	if input.CheckOutTime != nil {
		activityMutator = activityMutator.SetCreateTime(*input.CheckOutTime)
	}
	_, err := activityMutator.Save(ctx)

	if err != nil {
		return nil, fmt.Errorf("creating clock out activity %q: err %w", input.WorkOrderID, err)
	}

	if input.CheckListCategories != nil && len(input.CheckListCategories) > 0 {
		for _, clInput := range input.CheckListCategories {
			if _, err := r.createOrUpdateCheckListCategory(ctx, clInput, input.WorkOrderID); err != nil {
				return nil, errors.Wrap(err, "updating check list category")
			}
		}
	}

	return client.WorkOrder.
		Query().
		Where(workorder.ID(input.WorkOrderID)).
		WithCheckListCategories().
		Only(ctx)
}
