// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"strconv"
	"testing"
	"time"

	"github.com/99designs/gqlgen/client"
	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/activity"
	"github.com/facebookincubator/symphony/pkg/ent/checklistcategory"
	"github.com/facebookincubator/symphony/pkg/ent/checklistitem"
	"github.com/facebookincubator/symphony/pkg/ent/file"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/surveycellscan"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func toWorkOrderStatusPointer(status workorder.Status) *workorder.Status {
	return &status
}

func createPort() models.EquipmentPortInput {
	visibleLabel := "Eth1"
	bandwidth := "10/100/1000BASE-T"
	portInput := models.EquipmentPortInput{
		Name:         "Port 1",
		VisibleLabel: &visibleLabel,
		Bandwidth:    &bandwidth,
	}
	return portInput
}

func createLocation(ctx context.Context, t *testing.T, r TestResolver) *ent.Location {
	return createLocationWithName(ctx, t, r, "location_name_1")
}

func createLocationWithName(ctx context.Context, t *testing.T, r TestResolver, name string) *ent.Location {
	mr := r.Mutation()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: name + "_type",
	})
	require.NoError(t, err)
	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: name,
		Type: locationType.ID,
	})
	require.NoError(t, err)
	return location
}

func createPosition() *models.EquipmentPositionInput {
	label1 := "label1"
	position := models.EquipmentPositionInput{
		Name:         "Position 1",
		VisibleLabel: &label1,
	}
	return &position
}

func createWorkOrder(ctx context.Context, t *testing.T, r TestResolver, name string) *ent.WorkOrder {
	mr := r.Mutation()
	location := createLocationWithName(ctx, t, r, name+"location")
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: name + "type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		Description:     nil,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.NoError(t, err)
	return workOrder
}

func workOrderStatusPtr(status workorder.Status) *workorder.Status {
	return &status
}

func workOrderPriorityPtr(priority workorder.Priority) *workorder.Priority {
	return &priority
}

func executeWorkOrder(ctx context.Context, t *testing.T, mr generated.MutationResolver, workOrder *ent.WorkOrder) (*models.WorkOrderExecutionResult, error) {
	var assigneeID *int
	assignee, _ := workOrder.QueryAssignee().Only(ctx)
	if assignee != nil {
		assigneeID = &assignee.ID
	}
	_, err := mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:          workOrder.ID,
		Name:        workOrder.Name,
		Description: workOrder.Description,
		InstallDate: workOrder.InstallDate,
		Status:      workOrderStatusPtr(workorder.StatusClosed),
		AssigneeID:  assigneeID,
	})
	require.NoError(t, err)
	return mr.ExecuteWorkOrder(ctx, workOrder.ID)
}

const (
	longWorkOrderName     = "long_work_order"
	longWorkOrderDesc     = "long_work_order_description"
	longWorkOrderAssignee = "long_work_order_Assignee"
)

func TestAddWorkOrderWithLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	description := longWorkOrderDesc
	location := createLocation(ctx, t, *r)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            longWorkOrderName,
		Description:     &description,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	fetchedLocation, err := fetchedWorkOrder.Location(ctx)
	require.NoError(t, err)
	require.Equal(t, fetchedLocation.ID, location.ID)
	require.Equal(t, fetchedLocation.Name, location.Name)
}

func TestAddWorkOrderWithType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	name := longWorkOrderName
	description := longWorkOrderDesc
	location := createLocation(ctx, t, *r)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		Description:     &description,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	fetchedWorkOrderType, err := fetchedWorkOrder.Type(ctx)
	require.NoError(t, err)
	require.Equal(t, fetchedWorkOrderType.ID, woType.ID)
	require.Equal(t, fetchedWorkOrderType.Name, woType.Name)
}

func TestAddWorkOrderWithAssignee(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	name := longWorkOrderName
	description := longWorkOrderDesc
	location := createLocation(ctx, t, *r)
	assigneeName := longWorkOrderAssignee
	assignee := viewer.MustGetOrCreateUser(ctx, assigneeName, user.RoleOwner)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		Description:     &description,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.NoError(t, err)
	require.False(t, workOrder.QueryAssignee().ExistX(ctx))

	var ownerID *int
	owner, _ := workOrder.QueryOwner().Only(ctx)
	if owner != nil {
		ownerID = &owner.ID
	}

	workOrder, err = mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:          workOrder.ID,
		Name:        workOrder.Name,
		Description: workOrder.Description,
		OwnerID:     ownerID,
		Status:      workOrderStatusPtr(workorder.StatusInProgress),
		AssigneeID:  &assignee.ID,
	})
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)
	require.Equal(t, workOrder.QueryAssignee().OnlyIDX(ctx), assignee.ID)

	fetchedWorkOrderType, err := fetchedWorkOrder.Type(ctx)
	require.NoError(t, err)
	require.Equal(t, fetchedWorkOrderType.ID, woType.ID)
	require.Equal(t, fetchedWorkOrderType.Name, woType.Name)
}

func TestAddWorkOrderWithDefaultAutomationOwner(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := ent.NewContext(context.Background(), r.client)
	v := viewer.NewAutomation(
		viewertest.DefaultTenant,
		viewertest.DefaultUser,
		viewertest.DefaultRole)
	ctx = viewer.NewContext(ctx, v)
	ctx = authz.NewContext(ctx, authz.FullPermissions())
	mr := r.Mutation()
	name := longWorkOrderName
	description := longWorkOrderDesc
	location := createLocation(ctx, t, *r)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	_, err = mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		Description:     &description,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.Error(t, err)
	require.Contains(t, err.Error(), "could not be executed in automation")
}

func TestAddWorkOrderInvalidType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	name := longWorkOrderName
	description := longWorkOrderDesc
	_, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		Description:     &description,
		WorkOrderTypeID: 123,
		LocationID:      nil,
	})
	require.Error(t, err)
}

func TestEditInvalidWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	_, err := r.Mutation().EditWorkOrderType(ctx, models.EditWorkOrderTypeInput{
		ID:   234,
		Name: "foo",
	})
	require.Error(t, err)
}

func TestAddWorkOrderWithDescription(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	name := longWorkOrderName
	description := longWorkOrderDesc
	location := createLocation(ctx, t, *r)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		Description:     &description,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	require.Equal(t, fetchedWorkOrder.Name, name)
	require.Equal(t, *fetchedWorkOrder.Description, description)
	require.Equal(t, location.ID, workOrder.QueryLocation().OnlyX(ctx).ID)
}

func TestAddWorkOrderWithPriority(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	name := longWorkOrderName
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	priority := workorder.PriorityLow
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		WorkOrderTypeID: woType.ID,
		Priority:        &priority,
	})
	require.NoError(t, err)
	require.False(t, workOrder.QueryAssignee().ExistX(ctx))
	require.Equal(t, priority, workOrder.Priority)

	var ownerID *int
	owner, _ := workOrder.QueryOwner().Only(ctx)
	if owner != nil {
		ownerID = &owner.ID
	}

	input := models.EditWorkOrderInput{
		ID:          workOrder.ID,
		Name:        workOrder.Name,
		Description: workOrder.Description,
		OwnerID:     ownerID,
		Status:      workOrderStatusPtr(workorder.StatusInProgress),
		Priority:    workOrderPriorityPtr(workorder.PriorityHigh),
		Index:       pointer.ToInt(42),
	}

	workOrder, err = mr.EditWorkOrder(ctx, input)
	require.NoError(t, err)
	require.Equal(t, *input.Priority, workOrder.Priority)
	require.Equal(t, *input.Index, workOrder.Index)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	workOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)
	require.Equal(t, *input.Priority, workOrder.Priority)
	require.Equal(t, *input.Index, workOrder.Index)
}

func TestAddWorkOrderWithProject(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, pr := r.Mutation(), r.Project()

	input := models.AddProjectTypeInput{Name: "test", Description: pointer.ToString("test desc")}
	ltyp, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "loc_type",
	})
	require.NoError(t, err)
	loc, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc_name",
		Type: ltyp.ID,
	})
	require.NoError(t, err)
	typ, err := mr.CreateProjectType(ctx, input)
	require.NoError(t, err)
	pinput := models.AddProjectInput{Name: "test", Description: pointer.ToString("desc"), Type: typ.ID, Location: &loc.ID}
	project, err := mr.CreateProject(ctx, pinput)
	require.NoError(t, err)
	woNum, err := pr.NumberOfWorkOrders(ctx, project)
	require.NoError(t, err)
	require.Zero(t, woNum)

	name := longWorkOrderName
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		WorkOrderTypeID: woType.ID,
		ProjectID:       &project.ID,
	})
	require.NoError(t, err)
	require.Equal(t, workOrder.QueryProject().OnlyX(ctx).ID, project.ID)
	woNum, err = pr.NumberOfWorkOrders(ctx, project)
	require.NoError(t, err)
	require.Equal(t, 1, woNum)

	var ownerID *int
	owner, _ := workOrder.QueryOwner().Only(ctx)
	if owner != nil {
		ownerID = &owner.ID
	}

	workOrder, err = mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:      workOrder.ID,
		Name:    workOrder.Name,
		OwnerID: ownerID,
	})
	require.NoError(t, err)
	fetchProject, err := workOrder.QueryProject().Only(ctx)
	require.Error(t, err)
	require.Nil(t, fetchProject)
	woNum, err = pr.NumberOfWorkOrders(ctx, project)
	require.NoError(t, err)
	require.Zero(t, woNum)
}

func TestAddWorkOrderWithComment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	w := createWorkOrder(ctx, t, *r, "Foo")

	node, err := qr.Node(ctx, w.ID)
	require.NoError(t, err)
	w, ok := node.(*ent.WorkOrder)
	require.True(t, ok)
	comments, err := w.QueryComments().All(ctx)
	require.NoError(t, err)
	require.Len(t, comments, 0)

	ctxt := "Bar"
	c, err := mr.AddComment(ctx, models.CommentInput{
		ID:         w.ID,
		EntityType: "WORK_ORDER",
		Text:       ctxt,
	})
	require.NoError(t, err)
	require.Equal(t, ctxt, c.Text)

	node, err = qr.Node(ctx, w.ID)
	require.NoError(t, err)
	w, ok = node.(*ent.WorkOrder)
	require.True(t, ok)
	comments, err = w.QueryComments().All(ctx)
	require.NoError(t, err)
	require.Len(t, comments, 1)
	require.Equal(t, ctxt, comments[0].Text)
}

func TestAddWorkOrderWithActivity(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(
		context.Background(), r.client)
	qr := r.Query()
	w := createWorkOrder(ctx, t, *r, "Foo")

	node, err := qr.Node(ctx, w.ID)
	require.NoError(t, err)
	w = node.(*ent.WorkOrder)
	activities, err := w.QueryActivities().All(ctx)
	require.NoError(t, err)
	require.Len(t, activities, 0)

	v := viewer.FromContext(ctx).(*viewer.UserViewer)
	act, err := r.client.Activity.Create().
		SetWorkOrder(w).
		SetActivityType(activity.ActivityTypePriorityChanged).
		SetOldValue(workorder.PriorityLow.String()).
		SetNewValue(workorder.PriorityHigh.String()).
		SetAuthor(v.User()).
		Save(ctx)

	require.NoError(t, err)
	require.EqualValues(t, workorder.PriorityHigh, act.NewValue)

	node, err = qr.Node(ctx, w.ID)
	require.NoError(t, err)
	w = node.(*ent.WorkOrder)
	activities, err = w.QueryActivities().All(ctx)
	require.NoError(t, err)
	require.Len(t, activities, 1)
	require.EqualValues(t, workorder.PriorityLow, activities[0].OldValue)
}

func TestAddWorkOrderNoDescription(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	name := "short_work_order"
	location := createLocation(ctx, t, *r)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)

	require.Equal(t, fetchedWorkOrder.Name, name)
	require.Empty(t, fetchedWorkOrder.Description)
}

func TestFetchWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr, wor := r.Mutation(), r.Query(), r.WorkOrder()
	name := "example_work_order"
	workOrder := createWorkOrder(ctx, t, *r, name)
	location := workOrder.QueryLocation().FirstX(ctx)

	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "equipment_type_name_1",
	})
	require.NoError(t, err)

	equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:      "equipment_name_1",
		Type:      equipmentType.ID,
		Location:  &location.ID,
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	node, err := qr.Node(ctx, workOrder.ID)
	require.NoError(t, err)
	fetchedWorkOrder, ok := node.(*ent.WorkOrder)
	require.True(t, ok)
	require.Equal(t, fetchedWorkOrder.Name, name)

	installedEquipment, err := wor.EquipmentToAdd(ctx, fetchedWorkOrder)
	require.NoError(t, err)
	require.Len(t, installedEquipment, 1)

	fetchedEquipment := installedEquipment[0]
	require.Equal(t, equipment.ID, fetchedEquipment.ID)
	require.Equal(t, equipment.Name, fetchedEquipment.Name)
}

func TestFetchWorkOrders(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	location := createLocation(ctx, t, *r)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	for i := 0; i < 2; i++ {
		_, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
			Name:            "example_work_order_" + strconv.Itoa(i),
			WorkOrderTypeID: woType.ID,
			LocationID:      &location.ID,
		})
		require.NoError(t, err)
	}

	types, err := qr.WorkOrders(ctx, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, types.Edges, 2)
}

func TestExecuteWorkOrderInstallEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "equipment_type_name_1",
	})
	require.NoError(t, err)

	workOrderEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:      "work_order_equipment",
		Type:      equipmentType.ID,
		Location:  &location.ID,
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	require.Equal(t, enum.FutureStateInstall, *workOrderEquipment.FutureState)
	require.Equal(t, workOrder.ID, workOrderEquipment.QueryWorkOrder().OnlyIDX(ctx))

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	fetchedWorkOrderNode, err := qr.Node(ctx, workOrderEquipment.ID)
	require.NoError(t, err)
	fetchedWorkOrderEquipment, ok := fetchedWorkOrderNode.(*ent.Equipment)
	require.True(t, ok)
	require.Empty(t, fetchedWorkOrderEquipment.FutureState)

	wo, err := fetchedWorkOrderEquipment.QueryWorkOrder().FirstID(ctx)
	require.Error(t, err)
	require.Empty(t, wo)
}

func TestExecuteWorkOrderRemoveEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)
	position1 := createPosition()
	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{position1},
	})
	require.NoError(t, err)

	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "parent_equipment",
		Type:     parentEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	childEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "child_equipment_type",
	})
	require.NoError(t, err)

	posDefID := parentEquipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)

	fetchedParentNode, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	fetchedParentEquipment, ok := fetchedParentNode.(*ent.Equipment)
	require.True(t, ok)
	fetchedPosition := fetchedParentEquipment.QueryPositions().OnlyX(ctx)

	updatedPosition, err := mr.RemoveEquipmentFromPosition(ctx, fetchedPosition.ID, &workOrder.ID)
	require.NoError(t, err)
	require.NotNil(t, updatedPosition.QueryParent().OnlyX(ctx)) // equipment isn't removed yet, only when workOrder is executed

	fetchedWorkOrderNode, err := qr.Node(ctx, childEquipment.ID)
	require.NoError(t, err)
	fetchedWorkOrderEquipment, ok := fetchedWorkOrderNode.(*ent.Equipment)
	require.True(t, ok)
	require.Equal(t, enum.FutureStateRemove, *fetchedWorkOrderEquipment.FutureState)
	require.Equal(t, workOrder.ID, fetchedWorkOrderEquipment.QueryWorkOrder().OnlyIDX(ctx))

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	fetchedRemovedWorkOrderNode, err := qr.Node(ctx, childEquipment.ID)
	require.True(t, ent.IsNotFound(err))
	require.Nil(t, fetchedRemovedWorkOrderNode)

	fetchedParentNodeAfterExecution, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	fetchedParentEquipmentAfterExecution, ok := fetchedParentNodeAfterExecution.(*ent.Equipment)
	require.True(t, ok)

	fetchedPositionAfterExecution := fetchedParentEquipmentAfterExecution.QueryPositions().OnlyX(ctx)
	_, err = mr.RemoveEquipmentFromPosition(ctx, fetchedPositionAfterExecution.ID, &workOrder.ID)
	require.NoError(t, err)
	eq, err := fetchedPositionAfterExecution.QueryAttachment().Only(ctx)
	require.Error(t, err)
	require.Nil(t, eq)
}

func TestExecuteWorkOrderInstallLink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)
	portInput := createPort()

	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "equipment_type_name_1",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)

	equipmentA, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	equipmentB, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment2",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)
	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	require.Equal(t, enum.FutureStateInstall, *createdLink.FutureState)
	require.Equal(t, workOrder.ID, createdLink.QueryWorkOrder().OnlyIDX(ctx))

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	fetchedNode, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
	require.True(t, ok)
	fetchedPort := fetchedEquipment.QueryPorts().OnlyX(ctx)
	fetchedLink, _ := fetchedPort.Link(ctx)
	require.Equal(t, createdLink.ID, fetchedLink.ID)
	require.Empty(t, fetchedLink.FutureState)
}

func TestExecuteWorkOrderRemoveLink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)
	portInput := createPort()

	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "equipment_type_name_1",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)

	equipmentA, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	equipmentB, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment2",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)
	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
	})
	require.NoError(t, err)

	_, err = mr.RemoveLink(ctx, createdLink.ID, &workOrder.ID)
	require.Nil(t, err)

	fetchedNode, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
	require.True(t, ok)
	fetchedPort := fetchedEquipment.QueryPorts().OnlyX(ctx)
	fetchedLink, err := fetchedPort.Link(ctx)
	require.NoError(t, err)

	require.Equal(t, enum.FutureStateRemove, *fetchedLink.FutureState)
	require.Equal(t, workOrder.ID, fetchedLink.QueryWorkOrder().OnlyIDX(ctx))

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	fetchedNodeAfterExecution, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipmentAfterExecution, ok := fetchedNodeAfterExecution.(*ent.Equipment)
	require.True(t, ok)
	fetchedPortAfterExecution, err := fetchedEquipmentAfterExecution.QueryPorts().Only(ctx)
	require.NoError(t, err)
	fetchedLinkAfterExecution, err := fetchedPortAfterExecution.Link(ctx)
	require.Nil(t, fetchedLinkAfterExecution)
	require.NoError(t, err)
}

func TestExecuteWorkOrderInstallDependantEquipmentAndLink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)
	portInput := createPort()
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "equipment_type_name_1",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	equipmentA, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment1",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)
	equipmentB, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "equipment2",
		Type:     equipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	portDef := equipmentType.QueryPortDefinitions().OnlyX(ctx)
	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDef.ID},
			{Equipment: equipmentB.ID, Port: portDef.ID},
		},
		WorkOrder: &workOrder.ID,
	})
	require.Nil(t, err)

	require.Equal(t, enum.FutureStateInstall, *createdLink.FutureState)
	require.Equal(t, workOrder.ID, createdLink.QueryWorkOrder().OnlyIDX(ctx))

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	fetchedNode, err := qr.Node(ctx, equipmentA.ID)
	require.NoError(t, err)
	fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
	require.True(t, ok)

	fetchedPort := fetchedEquipment.QueryPorts().OnlyX(ctx)
	fetchedLink, _ := fetchedPort.Link(ctx)
	require.Equal(t, createdLink.ID, fetchedLink.ID)
	require.Empty(t, fetchedLink.FutureState)
}

func TestExecuteWorkOrderInstallEquipmentMultilayer(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)

	position1 := createPosition()
	rootEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "root_equipment_type",
		Positions: []*models.EquipmentPositionInput{position1},
	})
	require.NoError(t, err)
	rootEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "root_equipment",
		Type:     rootEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	var equipments []ent.Equipment
	equipments = append(equipments, *rootEquipment)
	for i := 0; i < 10; i++ {
		prevEquipmentPosition, err := equipments[i].QueryPositions().Only(ctx)
		require.NoError(t, err)
		defID := prevEquipmentPosition.QueryDefinition().OnlyIDX(ctx)
		parentID := prevEquipmentPosition.QueryParent().OnlyIDX(ctx)
		require.NoError(t, err)
		equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
			Name:               strconv.Itoa(i),
			Type:               rootEquipmentType.ID,
			Parent:             &parentID,
			PositionDefinition: &defID,
			WorkOrder:          &workOrder.ID,
		})
		require.NoError(t, err)
		equipments = append(equipments, *equipment)
	}

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	for _, equipment := range equipments {
		fetchedNode, err := qr.Node(ctx, equipment.ID)
		require.NoError(t, err)
		fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
		require.True(t, ok)
		require.Empty(t, fetchedEquipment.FutureState)
		require.Nil(t, fetchedEquipment.QueryWorkOrder().FirstX(ctx))
	}
}

func TestExecuteWorkOrderRemoveEquipmentMultilayer(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)
	position1 := createPosition()

	rootEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "root_equipment_type",
		Positions: []*models.EquipmentPositionInput{position1},
	})
	require.NoError(t, err)
	rootEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "root_equipment",
		Type:     rootEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	var equipments []ent.Equipment
	equipments = append(equipments, *rootEquipment)
	for i := 0; i < 10; i++ {
		position, err := equipments[i].QueryPositions().Only(ctx)
		require.NoError(t, err)
		defID := position.QueryDefinition().OnlyIDX(ctx)
		parentID := position.QueryParent().OnlyIDX(ctx)
		equipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
			Name:               strconv.Itoa(i),
			Type:               rootEquipmentType.ID,
			Parent:             &parentID,
			PositionDefinition: &defID,
		})
		require.NoError(t, err)
		equipments = append(equipments, *equipment)
	}

	for i := 8; i >= 0; i-- {
		position, err := equipments[i].QueryPositions().Only(ctx)
		require.NoError(t, err)
		_, err = mr.RemoveEquipmentFromPosition(ctx, position.ID, &workOrder.ID)
		require.NoError(t, err)
	}

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	for i, equipment := range equipments {
		fetchedNode, err := qr.Node(ctx, equipment.ID)
		if i == 0 {
			require.NoError(t, err)
			fetchedEquipment, ok := fetchedNode.(*ent.Equipment)
			require.True(t, ok)
			require.Empty(t, fetchedEquipment.FutureState)

			fetchedEquipmentWorkOrder, _ := fetchedEquipment.QueryWorkOrder().Only(ctx)
			require.Nil(t, fetchedEquipmentWorkOrder)
		} else {
			require.Nil(t, fetchedNode)
		}
	}
}

func TestExecuteWorkOrderInstallChildOnUninstalledParent(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	futureWorkOrder := createWorkOrder(ctx, t, *r, "example_work_order_2")
	location := workOrder.QueryLocation().FirstX(ctx)

	position1 := createPosition()
	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{position1},
	})
	require.NoError(t, err)
	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:      "parent_equipment",
		Type:      parentEquipmentType.ID,
		Location:  &location.ID,
		WorkOrder: &futureWorkOrder.ID,
	})
	require.NoError(t, err)

	childEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "child_equipment_type",
	})
	require.NoError(t, err)

	posDefID := parentEquipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	require.NoError(t, err)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
		WorkOrder:          &workOrder.ID,
	})
	require.NoError(t, err)

	fetchedWorkOrderNode, err := qr.Node(ctx, childEquipment.ID)
	require.NoError(t, err)
	fetchedWorkOrderEquipment, ok := fetchedWorkOrderNode.(*ent.Equipment)
	require.True(t, ok)
	require.Equal(t, enum.FutureStateInstall, *fetchedWorkOrderEquipment.FutureState)
	equipmentWorkOrder, err := fetchedWorkOrderEquipment.QueryWorkOrder().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, equipmentWorkOrder.ID)

	returnedWorkOrder, _ := executeWorkOrder(ctx, t, mr, workOrder)
	require.Nil(t, returnedWorkOrder)

	fetchedChildNode, err := qr.Node(ctx, childEquipment.ID)
	require.NoError(t, err)
	fetchedChildEquipment, ok := fetchedChildNode.(*ent.Equipment)
	require.True(t, ok)
	equipmentWorkOrder, err = fetchedChildEquipment.QueryWorkOrder().Only(ctx)
	require.NoError(t, err)

	// the child wasn't installed because the parent isn't installed yet
	require.Equal(t, enum.FutureStateInstall, *fetchedChildEquipment.FutureState)
	require.Equal(t, workOrder.ID, equipmentWorkOrder.ID)
}

func TestExecuteWorkOrderInstallLinkOnUninstalledEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr := r.Mutation()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	futureWorkOrder := createWorkOrder(ctx, t, *r, "example_work_order_2")
	location := workOrder.QueryLocation().FirstX(ctx)

	portInput := createPort()
	equipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:  "equipment_type_name_1",
		Ports: []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)

	equipmentA, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:      "equipment1",
		Type:      equipmentType.ID,
		Location:  &location.ID,
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	equipmentB, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:      "equipment2",
		Type:      equipmentType.ID,
		Location:  &location.ID,
		WorkOrder: &futureWorkOrder.ID,
	})
	require.NoError(t, err)

	portDefID := equipmentType.QueryPortDefinitions().OnlyIDX(ctx)
	createdLink, err := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: equipmentA.ID, Port: portDefID},
			{Equipment: equipmentB.ID, Port: portDefID},
		},
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	createLinkWorkOrder, err := createdLink.QueryWorkOrder().Only(ctx)
	require.NoError(t, err)

	require.Equal(t, enum.FutureStateInstall, *createdLink.FutureState)
	require.Equal(t, workOrder.ID, createLinkWorkOrder.ID)

	c := r.GraphClient()
	err = c.Post(`mutation($id: ID!) {
		executeWorkOrder(id: $id) {
			id
		}
	}`,
		&struct{ ExecuteWorkOrder struct{ ID string } }{},
		client.Var("id", workOrder.ID),
	)
	require.Error(t, err)

	var rsp struct {
		Equipment struct {
			WorkOrder struct {
				ID string
			}
			Ports []struct {
				Link struct {
					ID          string
					FutureState enum.FutureState
					WorkOrder   struct {
						ID string
					}
				}
			}
		}
	}
	err = c.Post(`query($id: ID!) {
		equipment: node(id: $id) {
			... on Equipment {
				workOrder {
					id
				}
				ports {
					link {
						id
						futureState
						workOrder {
							id
						}
					}
				}
			}
		}
	}`, &rsp, client.Var("id", equipmentA.ID))
	require.NoError(t, err)

	require.Equal(t, strconv.Itoa(workOrder.ID), rsp.Equipment.WorkOrder.ID)
	require.Len(t, rsp.Equipment.Ports, 1)
	link := &rsp.Equipment.Ports[0].Link
	require.Equal(t, strconv.Itoa(createdLink.ID), link.ID)
	// the link wasn't installed because equipmentB is not installed
	require.Equal(t, enum.FutureStateInstall, link.FutureState)
	require.Equal(t, strconv.Itoa(workOrder.ID), link.WorkOrder.ID)
}

func TestExecuteWorkOrderRemoveParentEquipment(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)

	position1 := createPosition()
	rootEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "root_equipment_type",
		Positions: []*models.EquipmentPositionInput{position1},
	})
	require.NoError(t, err)
	rootEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "root_equipment",
		Type:     rootEquipmentType.ID,
		Location: &location.ID,
	})
	require.NoError(t, err)

	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{position1},
	})
	require.NoError(t, err)

	require.NoError(t, err)
	posDefID := rootEquipmentType.QueryPositionDefinitions().FirstIDX(ctx)

	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "parent_equipment",
		Type:               parentEquipmentType.ID,
		Parent:             &rootEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)

	childEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "child_equipment_type",
	})
	require.NoError(t, err)
	posDefID = parentEquipmentType.QueryPositionDefinitions().FirstIDX(ctx)
	require.NoError(t, err)
	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               childEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
	})
	require.NoError(t, err)
	require.NotNil(t, childEquipment)

	fetchedRootNode, err := qr.Node(ctx, rootEquipment.ID)
	require.NoError(t, err)
	fetchedRootEquipment, ok := fetchedRootNode.(*ent.Equipment)
	require.True(t, ok)
	fetchedPosition, err := fetchedRootEquipment.QueryPositions().Only(ctx)
	require.NoError(t, err)

	updatedPosition, err := mr.RemoveEquipmentFromPosition(ctx, fetchedPosition.ID, &workOrder.ID)
	require.NoError(t, err)

	attachedEquipment, err := updatedPosition.QueryAttachment().Only(ctx)
	require.NoError(t, err)

	require.NotNil(t, attachedEquipment)

	fetchedWorkOrderNode, err := qr.Node(ctx, parentEquipment.ID)
	require.NoError(t, err)
	fetchedWorkOrderEquipment, ok := fetchedWorkOrderNode.(*ent.Equipment)
	require.True(t, ok)

	require.Equal(t, enum.FutureStateRemove, *fetchedWorkOrderEquipment.FutureState)
	fetchedWorkOrderEquipmentWorkOrder, err := fetchedWorkOrderEquipment.QueryWorkOrder().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, fetchedWorkOrderEquipmentWorkOrder.ID)

	returnedWorkOrder, err := executeWorkOrder(ctx, t, mr, workOrder)
	require.NoError(t, err)
	require.Equal(t, workOrder.ID, returnedWorkOrder.ID)

	for _, e := range []*ent.Equipment{parentEquipment, childEquipment} {
		node, err := qr.Node(ctx, e.ID)
		require.True(t, ent.IsNotFound(err))
		require.Nil(t, node)
	}
}

func TestAddAndDeleteWorkOrderHyperlink(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	workOrderType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{
		Name: "work_order_type_name_1",
	})
	require.NoError(t, err)
	require.Equal(t, "work_order_type_name_1", workOrderType.Name)

	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            "work_order_name_1",
		WorkOrderTypeID: workOrderType.ID,
	})
	require.NoError(t, err)
	require.Equal(t, workOrderType.ID, workOrder.QueryType().OnlyIDX(ctx))

	category := "TSS"
	url := "http://some.url"
	displayName := "link to some url"
	hyperlink, err := mr.AddHyperlink(ctx, models.AddHyperlinkInput{
		EntityType:  models.ImageEntityWorkOrder,
		EntityID:    workOrder.ID,
		URL:         url,
		DisplayName: &displayName,
		Category:    &category,
	})
	require.NoError(t, err)
	require.Equal(t, url, hyperlink.URL, "verifying hyperlink url")
	require.Equal(t, displayName, hyperlink.Name, "verifying hyperlink display name")
	require.Equal(t, category, hyperlink.Category, "verifying 1st hyperlink category")

	hyperlinks, err := workOrder.Hyperlinks(ctx)
	require.NoError(t, err)
	require.Len(t, hyperlinks, 1, "verifying has 1 hyperlink")

	deletedHyperlink, err := mr.DeleteHyperlink(ctx, hyperlink.ID)
	require.NoError(t, err)
	require.Equal(t, hyperlink.ID, deletedHyperlink.ID, "verifying return id of deleted hyperlink")

	hyperlinks, err = workOrder.Hyperlinks(ctx)
	require.NoError(t, err)
	require.Len(t, hyperlinks, 0, "verifying no hyperlinks remained")
}

func TestDeleteWorkOrderWithAttachmentAndLinksAdded(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	workOrder := createWorkOrder(ctx, t, *r, "example_work_order")
	location := workOrder.QueryLocation().FirstX(ctx)

	position1 := createPosition()
	portInput := createPort()

	parentEquipmentType, err := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name:      "parent_equipment_type",
		Positions: []*models.EquipmentPositionInput{position1},
		Ports:     []*models.EquipmentPortInput{&portInput},
	})
	require.NoError(t, err)
	parentEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:      "parent_equipment",
		Type:      parentEquipmentType.ID,
		Location:  &location.ID,
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	posDefID := parentEquipmentType.QueryPositionDefinitions().FirstIDX(ctx)

	childEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:               "child_equipment",
		Type:               parentEquipmentType.ID,
		Parent:             &parentEquipment.ID,
		PositionDefinition: &posDefID,
		WorkOrder:          &workOrder.ID,
	})
	require.NoError(t, err)

	connectedEquipment, err := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:      "connected_equipment",
		Type:      parentEquipmentType.ID,
		Location:  &location.ID,
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	portDef := parentEquipmentType.QueryPortDefinitions().OnlyX(ctx)

	_, err = mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: parentEquipment.ID, Port: portDef.ID},
			{Equipment: connectedEquipment.ID, Port: portDef.ID},
		},
		WorkOrder: &workOrder.ID,
	})
	require.NoError(t, err)

	wot, err := workOrder.QueryTemplate().Only(ctx)
	require.NoError(t, err)

	_, err = mr.RemoveWorkOrder(ctx, workOrder.ID)
	require.NoError(t, err)

	fetchedWorkOrderTemplateNode, _ := qr.Node(ctx, wot.ID)
	require.Nil(t, fetchedWorkOrderTemplateNode)

	fetchedParentWorkOrderNode, _ := qr.Node(ctx, parentEquipment.ID)
	require.Nil(t, fetchedParentWorkOrderNode)

	fetchedChildWorkOrderNode, _ := qr.Node(ctx, childEquipment.ID)
	require.Nil(t, fetchedChildWorkOrderNode)

	fetchedConnectedWorkOrderNode, _ := qr.Node(ctx, connectedEquipment.ID)
	require.Nil(t, fetchedConnectedWorkOrderNode)
}

func TestAddWorkOrderWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	mr, qr := r.Mutation(), r.Query()
	strPropType := pkgmodels.PropertyTypeInput{
		Name: "str_prop",
		Type: "string",
	}
	strFixedValue := "FixedFoo"
	strFixedPropType := pkgmodels.PropertyTypeInput{
		Name:               "str_fixed_prop",
		Type:               "string",
		IsInstanceProperty: pointer.ToBool(false),
		StringValue:        &strFixedValue,
	}
	intPropType := pkgmodels.PropertyTypeInput{
		Name: "int_prop",
		Type: "int",
	}
	rangePropType := pkgmodels.PropertyTypeInput{
		Name: "rng_prop",
		Type: "range",
	}
	propTypeInputs := []*pkgmodels.PropertyTypeInput{&strPropType, &strFixedPropType, &intPropType, &rangePropType}
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type", Properties: propTypeInputs})
	require.NoError(t, err, "Adding location type")

	strValue := "Foo"
	strProp := models.PropertyInput{
		PropertyTypeID: woType.QueryPropertyTypes().Where(propertytype.Name("str_prop")).OnlyIDX(ctx),
		StringValue:    &strValue,
	}

	strFixedProp := models.PropertyInput{
		PropertyTypeID: woType.QueryPropertyTypes().Where(propertytype.Name("str_fixed_prop")).OnlyIDX(ctx),
		StringValue:    &strFixedValue,
	}

	intValue := 5
	intProp := models.PropertyInput{
		PropertyTypeID: woType.QueryPropertyTypes().Where(propertytype.Name("int_prop")).OnlyIDX(ctx),
		StringValue:    nil,
		IntValue:       &intValue,
	}
	fl1, fl2 := 5.5, 7.8
	rngProp := models.PropertyInput{
		PropertyTypeID: woType.QueryPropertyTypes().Where(propertytype.Name("rng_prop")).OnlyIDX(ctx),
		RangeFromValue: &fl1,
		RangeToValue:   &fl2,
	}
	propInputs := []*models.PropertyInput{&strProp, &strFixedProp, &intProp, &rngProp}
	wo, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            "location_name_1",
		WorkOrderTypeID: woType.ID,
		Properties:      propInputs,
	})
	require.NoError(t, err)

	node, err := qr.Node(ctx, wo.ID)
	require.NoError(t, err)
	fetchedWo, ok := node.(*ent.WorkOrder)
	require.True(t, ok)
	fetchedWorkOrderTemplate, err := fetchedWo.QueryTemplate().Only(ctx)
	require.NoError(t, err)

	intFetchProp := fetchedWo.QueryProperties().Where(property.HasTypeWith(propertytype.Name("int_prop"))).OnlyX(ctx)
	tIntFetchProp := fetchedWorkOrderTemplate.QueryPropertyTypes().Where(propertytype.Name("int_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetInt(intFetchProp.IntVal), pointer.GetInt(intProp.IntValue), "Comparing properties: int value")
	require.NotEqual(t, intFetchProp.QueryType().OnlyIDX(ctx), intProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, intFetchProp.QueryType().OnlyIDX(ctx), tIntFetchProp.ID, "Comparing properties: PropertyType value")

	strFetchProp := fetchedWo.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_prop"))).OnlyX(ctx)
	tStrFetchProp := fetchedWorkOrderTemplate.QueryPropertyTypes().Where(propertytype.Name("str_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetString(strFetchProp.StringVal), pointer.GetString(strProp.StringValue), "Comparing properties: string value")
	require.NotEqual(t, strFetchProp.QueryType().OnlyIDX(ctx), strProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, strFetchProp.QueryType().OnlyIDX(ctx), tStrFetchProp.ID, "Comparing properties: PropertyType value")

	fixedStrFetchProp := fetchedWo.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_fixed_prop"))).OnlyX(ctx)
	tFixedStrFetchProp := fetchedWorkOrderTemplate.QueryPropertyTypes().Where(propertytype.Name("str_fixed_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetString(fixedStrFetchProp.StringVal), pointer.GetString(strFixedProp.StringValue), "Comparing properties: fixed string value")
	require.NotEqual(t, fixedStrFetchProp.QueryType().OnlyIDX(ctx), strFixedProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, fixedStrFetchProp.QueryType().OnlyIDX(ctx), tFixedStrFetchProp.ID, "Comparing properties: PropertyType value")

	rngFetchProp := fetchedWo.QueryProperties().Where(property.HasTypeWith(propertytype.Name("rng_prop"))).OnlyX(ctx)
	tRngFetchProp := fetchedWorkOrderTemplate.QueryPropertyTypes().Where(propertytype.Name("rng_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetFloat64(rngFetchProp.RangeFromVal), pointer.GetFloat64(rngProp.RangeFromValue), "Comparing properties: range value")
	require.Equal(t, pointer.GetFloat64(rngFetchProp.RangeToVal), pointer.GetFloat64(rngProp.RangeToValue), "Comparing properties: range value")
	require.NotEqual(t, rngFetchProp.QueryType().OnlyIDX(ctx), rngProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, rngFetchProp.QueryType().OnlyIDX(ctx), tRngFetchProp.ID, "Comparing properties: PropertyType value")

	fetchedProps, err := fetchedWo.Properties(ctx)
	require.NoError(t, err)
	require.Equal(t, len(propInputs), len(fetchedProps))

	failProp := models.PropertyInput{PropertyTypeID: -1}
	failEditInput := models.EditWorkOrderInput{
		ID:         wo.ID,
		Name:       "test",
		Properties: []*models.PropertyInput{&failProp},
	}
	_, err = mr.EditWorkOrder(ctx, failEditInput)
	require.Error(t, err, "editing Work Order instance property with wrong property type id")

	failProp2 := models.PropertyInput{
		ID:             &strFetchProp.ID,
		PropertyTypeID: intProp.PropertyTypeID,
	}
	failEditInput2 := models.EditWorkOrderInput{
		ID:         wo.ID,
		Name:       "test",
		Properties: []*models.PropertyInput{&failProp2},
	}
	_, err = mr.EditWorkOrder(ctx, failEditInput2)
	require.Error(t, err, "editing Work Order instance property when id and property type id mismach")

	newStrValue := "Foo"
	prop := models.PropertyInput{
		PropertyTypeID: strProp.PropertyTypeID,
		StringValue:    &newStrValue,
	}
	newWorkOrderName := "updated test"
	editInput := models.EditWorkOrderInput{
		ID:         wo.ID,
		Name:       newWorkOrderName,
		Properties: []*models.PropertyInput{&prop},
	}
	_, err = mr.EditWorkOrder(ctx, editInput)
	require.NoError(t, err)

	newStrFixedValue := "updated FixedFoo"
	newStrFixedProp := models.PropertyInput{
		PropertyTypeID: strFixedProp.PropertyTypeID,
		StringValue:    &newStrFixedValue,
	}
	editFixedPropInput := models.EditWorkOrderInput{
		ID:         wo.ID,
		Name:       newWorkOrderName,
		Properties: []*models.PropertyInput{&newStrFixedProp},
	}
	updatedP, err := mr.EditWorkOrder(ctx, editFixedPropInput)
	require.NoError(t, err)

	updatedNode, err := qr.Node(ctx, updatedP.ID)
	require.NoError(t, err, "querying updated Work Order node")
	updatedWO, ok := updatedNode.(*ent.WorkOrder)
	require.True(t, ok, "casting updated Work Order instance")

	require.Equal(t, updatedWO.Name, newWorkOrderName, "Comparing updated Work Order name")

	fetchedProps, _ = updatedWO.Properties(ctx)
	require.Len(t, fetchedProps, len(propInputs), "number of properties should remain he same")

	fetchedUWorkOrderTemplate := updatedWO.QueryTemplate().OnlyX(ctx)
	updatedProp := updatedWO.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_prop"))).OnlyX(ctx)
	tUpdatedProp := fetchedUWorkOrderTemplate.QueryPropertyTypes().Where(propertytype.Name("str_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetString(updatedProp.StringVal), pointer.GetString(prop.StringValue), "Comparing updated properties: string value")
	require.NotEqual(t, updatedProp.QueryType().OnlyIDX(ctx), prop.PropertyTypeID, "Comparing updated properties: PropertyType value")
	require.Equal(t, updatedProp.QueryType().OnlyIDX(ctx), tUpdatedProp.ID, "Comparing updated properties: PropertyType value")

	notUpdatedFixedProp := updatedWO.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_fixed_prop"))).OnlyX(ctx)
	tNotUpdatedFixedProp := fetchedUWorkOrderTemplate.QueryPropertyTypes().Where(propertytype.Name("str_fixed_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetString(notUpdatedFixedProp.StringVal), pointer.GetString(strFixedProp.StringValue), "Comparing not changed fixed property: string value")
	require.NotEqual(t, notUpdatedFixedProp.QueryType().OnlyIDX(ctx), strFixedProp.PropertyTypeID, "Comparing updated properties: PropertyType value")
	require.Equal(t, notUpdatedFixedProp.QueryType().OnlyIDX(ctx), tNotUpdatedFixedProp.ID, "Comparing updated properties: PropertyType value")
}

func TestAddWorkOrderWithInvalidProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	c := r.GraphClient()

	var wot struct {
		AddWorkOrderType struct {
			ID, Name      string
			PropertyTypes []struct {
				ID string
			}
		}
	}
	err := c.Post(`mutation {
		addWorkOrderType(input: {
			name: "example_type"
			properties: [{
				name: "lat_long_prop"
				type: gps_location
				isMandatory: true
				isInstanceProperty: true
			}]
		}) {
			id
			name
			propertyTypes {
				id
			}
		}
	}`, &wot)
	require.NoError(t, err)
	require.Len(t, wot.AddWorkOrderType.PropertyTypes, 1)

	err = c.Post(`mutation($type: ID!) {
		addWorkOrder(input: {
			name: "should_fail"
			workOrderTypeId: $type
			status: CLOSED
		}) {
			id
		}
	}`, &struct{ AddWorkOrder struct{ ID string } }{})
	require.Error(t, err, "Adding work order with missing mandatory properties")

	var ewot struct {
		EditWorkOrderType struct{ PropertyTypes []struct{ ID, Name string } }
	}
	err = c.Post(`mutation($id: ID!, $name: String!) {
		editWorkOrderType(input: {
			id: $id
			name: $name
			properties: [{
				name: "textMandatory"
				type: string
				isMandatory: true
				isInstanceProperty: true
			}]
		}) {
			propertyTypes {
				id
				name
			}
		}
	}`,
		&ewot,
		client.Var("id", wot.AddWorkOrderType.ID),
		client.Var("name", wot.AddWorkOrderType.Name),
	)
	require.NoError(t, err)
	require.Len(t, ewot.EditWorkOrderType.PropertyTypes, 2)
	if ewot.EditWorkOrderType.PropertyTypes[0].Name != "lat_long_prop" {
		ewot.EditWorkOrderType.PropertyTypes[0], ewot.EditWorkOrderType.PropertyTypes[1] =
			ewot.EditWorkOrderType.PropertyTypes[1], ewot.EditWorkOrderType.PropertyTypes[0]
	}

	err = c.Post(`mutation($type: ID!, $ptype: ID!) {
		addWorkOrder(input: {
			name: "location_name_3"
			workOrderTypeId: $type
			status: CLOSED
			properties: [{
				propertyTypeID: $ptype
				latitudeValue: 32.6
				longitudeValue: 34.7
			}]
		}) {
			id
		}
	}`,
		&struct{ AddWorkOrder struct{ ID string } }{},
		client.Var("type", wot.AddWorkOrderType.ID),
		client.Var("ptype", wot.AddWorkOrderType.PropertyTypes[0].ID),
	)
	require.Error(t, err, "Adding work order with missing mandatory properties")

	err = c.Post(`mutation($type: ID!, $ptype1: ID!, $ptype2: ID!) {
		addWorkOrder(input: {
			name: "location_name_3"
			workOrderTypeId: $type
			status: CLOSED
			properties: [
				{
					propertyTypeID: $ptype1
					latitudeValue: 32.6
					longitudeValue: 34.7
				},
				{
					propertyTypeID: $ptype2
					stringValue: "foobar"
				}
			]
		}) {
			id
		}
	}`,
		&struct{ AddWorkOrder struct{ ID string } }{},
		client.Var("type", wot.AddWorkOrderType.ID),
		client.Var("ptype1", ewot.EditWorkOrderType.PropertyTypes[0].ID),
		client.Var("ptype2", ewot.EditWorkOrderType.PropertyTypes[1].ID),
	)
	require.NoError(t, err)
}

func TestAddWorkOrderWithCheckListCategory(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{
		Name: "example_type_a",
	})
	require.NoError(t, err)

	indexValue := 1
	fooCL := models.CheckListItemInput{
		Title:       "Foo",
		Type:        "simple",
		Index:       &indexValue,
		IsMandatory: pointer.ToBool(true),
	}
	clInputs := []*models.CheckListItemInput{&fooCL}

	barCLC := models.CheckListCategoryInput{
		Title:     "Bar",
		CheckList: clInputs,
	}

	clcInputs := []*models.CheckListCategoryInput{&barCLC}
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:                longWorkOrderName,
		WorkOrderTypeID:     woType.ID,
		CheckListCategories: clcInputs,
	})
	require.NoError(t, err)
	cls := workOrder.QueryCheckListCategories().AllX(ctx)
	require.Len(t, cls, 1)

	barCLCFetched := workOrder.QueryCheckListCategories().Where(checklistcategory.Title("Bar")).OnlyX(ctx)
	fooCLFetched := barCLCFetched.QueryCheckListItems().Where(checklistitem.TypeEQ(enum.CheckListItemTypeSimple)).OnlyX(ctx)
	require.Equal(t, "Foo", fooCLFetched.Title, "verifying checklist name")
	require.EqualValues(t, true, fooCLFetched.IsMandatory)

	clcs, err := workOrder.CheckListCategories(ctx)
	require.NoError(t, err)
	require.Len(t, clcs, 1)

	cl, err := barCLCFetched.CheckListItems(ctx)
	require.NoError(t, err)
	require.Len(t, cl, 1)
}

func TestEditWorkOrderWithCheckListCategory(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{
		Name: "example_type_a",
	})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            longWorkOrderName,
		WorkOrderTypeID: woType.ID,
	})
	require.NoError(t, err)
	indexValue := 1
	fooCL := models.CheckListItemInput{
		Title:       "Foo",
		Type:        enum.CheckListItemTypeSimple,
		Index:       &indexValue,
		IsMandatory: pointer.ToBool(true),
	}
	clInputs := []*models.CheckListItemInput{&fooCL}

	barCLC := models.CheckListCategoryInput{
		Title:     "Bar",
		CheckList: clInputs,
	}

	clcInputs := []*models.CheckListCategoryInput{&barCLC}
	workOrder, err = mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:                  workOrder.ID,
		Name:                longWorkOrderName,
		CheckListCategories: clcInputs,
	})
	require.NoError(t, err)
	cls := workOrder.QueryCheckListCategories().AllX(ctx)
	require.Len(t, cls, 1)

	barCLCFetched := workOrder.QueryCheckListCategories().Where(checklistcategory.Title("Bar")).OnlyX(ctx)
	fooCLFetched := barCLCFetched.QueryCheckListItems().Where(checklistitem.TypeEQ(enum.CheckListItemTypeSimple)).OnlyX(ctx)
	require.Equal(t, "Foo", fooCLFetched.Title, "verifying checklist name")
	require.Equal(t, true, fooCLFetched.IsMandatory, "verifying isMandatory")

	clcs, err := workOrder.CheckListCategories(ctx)
	require.NoError(t, err)
	require.Len(t, clcs, 1)

	cl, err := barCLCFetched.CheckListItems(ctx)
	require.NoError(t, err)
	require.Len(t, cl, 1)
}

func TestEditCheckListItemFiles(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{
		Name: "example_type",
	})
	require.NoError(t, err)
	indexValue := 0
	annotation := "File Annotation"

	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            longWorkOrderName,
		WorkOrderTypeID: woType.ID,
		CheckListCategories: []*models.CheckListCategoryInput{{
			Title: "Category1",
			CheckList: []*models.CheckListItemInput{{
				Title: "Files",
				Type:  "files",
				Index: &indexValue,
				Files: []*models.FileInput{
					{
						FileName:   "File1",
						StoreKey:   "File1StoreKey",
						Annotation: &annotation,
					},
					{
						FileName: "File2",
						StoreKey: "File2StoreKey",
					},
				},
			}},
		}},
	})
	require.NoError(t, err)

	queriedFiles, err := workOrder.QueryCheckListCategories().QueryCheckListItems().QueryFiles().All(ctx)
	require.NoError(t, err)
	require.Len(t, queriedFiles, 2)
	file1, err := workOrder.QueryCheckListCategories().QueryCheckListItems().QueryFiles().Where(file.Name("File1")).Only(ctx)
	require.NoError(t, err)
	require.NotNil(t, file1)

	annotationFile := workOrder.QueryCheckListCategories().QueryCheckListItems().QueryFiles().Where(file.Name("File1")).OnlyX(ctx)
	require.Equal(t, annotation, annotationFile.Annotation, "verifying annotation is stored")

	checklistCategoryID, err := workOrder.QueryCheckListCategories().OnlyID(ctx)
	require.NoError(t, err)
	filesItemID, err := workOrder.QueryCheckListCategories().QueryCheckListItems().OnlyID(ctx)
	require.NoError(t, err)
	updatedWorkOrder, err := mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:   workOrder.ID,
		Name: longWorkOrderName,
		CheckListCategories: []*models.CheckListCategoryInput{{
			ID: &checklistCategoryID,
			CheckList: []*models.CheckListItemInput{{
				ID:    &filesItemID,
				Title: "Files",
				Type:  "files",
				Index: &indexValue,
				Files: []*models.FileInput{
					{
						ID:         &file1.ID,
						FileName:   "File1 Renamed",
						StoreKey:   "File1StoreKey",
						Annotation: &annotation,
					},
					{
						FileName: "File3",
						StoreKey: "File3StoreKey",
					},
				},
			}},
		}},
	})
	require.NoError(t, err)

	queriedUpdatedFiles, err := updatedWorkOrder.QueryCheckListCategories().QueryCheckListItems().QueryFiles().All(ctx)
	require.NoError(t, err)
	require.Len(t, queriedUpdatedFiles, 2)

	file2Exists, err := workOrder.QueryCheckListCategories().QueryCheckListItems().QueryFiles().Where(file.Name("File2")).Exist(ctx)
	require.NoError(t, err)
	require.False(t, file2Exists)

	updatedFile1Exists, err := workOrder.QueryCheckListCategories().QueryCheckListItems().QueryFiles().Where(file.Name("File1 Renamed")).Exist(ctx)
	require.NoError(t, err)
	require.True(t, updatedFile1Exists)

	file3Exists, err := workOrder.QueryCheckListCategories().QueryCheckListItems().QueryFiles().Where(file.Name("File3")).Exist(ctx)
	require.NoError(t, err)
	require.True(t, file3Exists)
}

func TestEditWorkOrderLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	name := longWorkOrderName
	location := createLocation(ctx, t, *r)
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type"})
	require.NoError(t, err)
	workOrder, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            name,
		WorkOrderTypeID: woType.ID,
		LocationID:      &location.ID,
	})
	require.NoError(t, err)
	require.Equal(t, workOrder.QueryLocation().FirstIDX(ctx), location.ID)

	location = createLocationWithName(ctx, t, *r, "location2")
	workOrder, err = mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:         workOrder.ID,
		Name:       workOrder.Name,
		LocationID: &location.ID,
	})
	require.NoError(t, err)
	require.Equal(t, workOrder.QueryLocation().FirstIDX(ctx), location.ID)

	workOrder, err = mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:   workOrder.ID,
		Name: workOrder.Name,
	})
	require.NoError(t, err)
	locEx, err := workOrder.QueryLocation().Exist(ctx)
	require.NoError(t, err)
	require.False(t, locEx)
}

func TestTechnicianCheckinToWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	w := createWorkOrder(ctx, t, *r, "Foo")
	w, err := mr.TechnicianWorkOrderCheckIn(
		ctx,
		w.ID,
		&models.TechnicianWorkOrderCheckInInput{DistanceMeters: pointer.ToFloat64(50)},
	)
	require.NoError(t, err)

	require.Equal(t, w.Status, workorder.StatusInProgress)

	activities, err := w.QueryActivities().Where(activity.ActivityTypeEQ(activity.ActivityTypeClockIn)).All(ctx)
	require.NoError(t, err)
	require.Len(t, activities, 1)
}

func TestTechnicianCheckinAtSpecificTimeToWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()

	timePtr := pointer.ToTime(time.Date(2014, 6, 25, 12, 24, 40, 0, time.UTC))
	w := createWorkOrder(ctx, t, *r, "Foo")
	w, err := mr.TechnicianWorkOrderCheckIn(
		ctx,
		w.ID,
		&models.TechnicianWorkOrderCheckInInput{DistanceMeters: pointer.ToFloat64(50), CheckInTime: timePtr},
	)
	require.NoError(t, err)

	require.Equal(t, w.Status, workorder.StatusInProgress)

	activities, err := w.QueryActivities().Where(activity.ActivityTypeEQ(activity.ActivityTypeClockIn)).All(ctx)
	require.NoError(t, err)
	require.Len(t, activities, 1)
	require.Equal(t, activities[0].CreateTime, *timePtr)
}

func TestTechnicianUploadDataToWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	c := r.GraphClient()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	wo := createWorkOrder(ctx, t, *r, "Foo")
	u := viewer.FromContext(ctx).(*viewer.UserViewer).User()
	mimeType := "image/jpeg"
	sizeInBytes := 120
	wo, err := mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:         wo.ID,
		Name:       longWorkOrderName,
		AssigneeID: &u.ID,
		CheckListCategories: []*models.CheckListCategoryInput{{
			Title: "Bar",
			CheckList: []*models.CheckListItemInput{
				{
					Title:   "Foo",
					Type:    enum.CheckListItemTypeSimple,
					Index:   pointer.ToInt(0),
					Checked: pointer.ToBool(false),
				},
				{
					Title: "CellScan",
					Type:  enum.CheckListItemTypeCellScan,
					Index: pointer.ToInt(1),
				}, {
					Title: "Files",
					Type:  enum.CheckListItemTypeFiles,
					Index: pointer.ToInt(2),
					Files: []*models.FileInput{
						{
							StoreKey:    "StoreKeyAlreadyIn",
							FileName:    "FileAlreadyInWorkOrder",
							SizeInBytes: &sizeInBytes,
							MimeType:    &mimeType,
						},
						{
							StoreKey:    "StoreKeyToBeDeleted",
							FileName:    "FileToBeDeleted",
							SizeInBytes: &sizeInBytes,
							MimeType:    &mimeType,
						},
					},
				}},
		}},
	})
	require.NoError(t, err)

	category, err := wo.QueryCheckListCategories().Only(ctx)
	require.NoError(t, err)
	fooID, err := wo.QueryCheckListCategories().QueryCheckListItems().Where(checklistitem.TypeEQ(enum.CheckListItemTypeSimple)).OnlyID(ctx)
	require.NoError(t, err)
	cellScanID, err := wo.QueryCheckListCategories().QueryCheckListItems().Where(checklistitem.TypeEQ(enum.CheckListItemTypeCellScan)).OnlyID(ctx)
	require.NoError(t, err)
	filesID, err := wo.QueryCheckListCategories().QueryCheckListItems().Where(checklistitem.TypeEQ(enum.CheckListItemTypeFiles)).OnlyID(ctx)
	require.NoError(t, err)
	fileToKeepID, err := wo.QueryCheckListCategories().QueryCheckListItems().Where(checklistitem.TypeEQ(enum.CheckListItemTypeFiles)).QueryFiles().Where(file.StoreKey("StoreKeyAlreadyIn")).OnlyID(ctx)
	require.NoError(t, err)
	techInput := models.TechnicianWorkOrderUploadInput{
		WorkOrderID: wo.ID,
		CheckListCategories: []*models.CheckListCategoryInput{{
			ID:          pointer.ToInt(category.ID),
			Title:       category.Title,
			Description: pointer.ToString("Desc"),
			CheckList: []*models.CheckListItemInput{
				{
					ID:      pointer.ToInt(fooID),
					Type:    enum.CheckListItemTypeSimple,
					Checked: pointer.ToBool(true),
				},
				{
					ID:   pointer.ToInt(cellScanID),
					Type: enum.CheckListItemTypeCellScan,
					CellData: []*models.SurveyCellScanData{{
						NetworkType:    surveycellscan.NetworkTypeLTE,
						SignalStrength: -93,
					}},
				},
				{
					ID:   pointer.ToInt(filesID),
					Type: enum.CheckListItemTypeFiles,
					Files: []*models.FileInput{ // Adding one new file, updating an existing file, deleting a file
						{
							StoreKey:    "StoreKeyToAdd",
							FileName:    "FileNameToAdd",
							SizeInBytes: &sizeInBytes,
							MimeType:    &mimeType,
						},
						{
							ID:          &fileToKeepID,
							StoreKey:    "StoreKeyAlreadyIn",
							FileName:    "FileAlreadyInWorkOrder",
							SizeInBytes: &sizeInBytes,
							MimeType:    &mimeType,
						},
					},
				},
			},
		}},
	}

	var rsp struct {
		TechnicianWorkOrderUploadData struct {
			ID                  string
			CheckListCategories []struct {
				Title       string
				Description *string
				CheckList   []struct {
					ID       string
					Type     enum.CheckListItemType
					Checked  *bool
					CellData []struct {
						NetworkType    string
						SignalStrength int
					}
					Files []struct {
						StoreKey    string
						FileName    string
						SizeInBytes int
						MimeType    string
						FileType    file.Type
					}
				}
			}
		}
	}
	c.MustPost(
		`mutation($input: TechnicianWorkOrderUploadInput!) {
			technicianWorkOrderUploadData(input: $input) {
				id
				checkListCategories {
					title
					description
					checkList {
						id
						type
						checked
						cellData {
							networkType
							signalStrength
						}
						files {
							storeKey
							fileName
							sizeInBytes
							mimeType
							fileType
						}
					}
				}
			}
		}`,
		&rsp,
		client.Var("input", techInput),
	)

	require.Len(t, rsp.TechnicianWorkOrderUploadData.CheckListCategories, 1)
	require.Equal(t, rsp.TechnicianWorkOrderUploadData.CheckListCategories[0].Title, "Bar")
	require.Equal(t, *rsp.TechnicianWorkOrderUploadData.CheckListCategories[0].Description, "Desc")
	require.Len(t, rsp.TechnicianWorkOrderUploadData.CheckListCategories[0].CheckList, 3)

	for _, item := range rsp.TechnicianWorkOrderUploadData.CheckListCategories[0].CheckList {
		switch item.Type {
		case enum.CheckListItemTypeSimple:
			require.True(t, *item.Checked)
		case enum.CheckListItemTypeCellScan:
			require.EqualValues(t, surveycellscan.NetworkTypeLTE, item.CellData[0].NetworkType)
			require.Equal(t, -93, item.CellData[0].SignalStrength)
		case enum.CheckListItemTypeFiles:
			require.Equal(t, 2, len(item.Files))

			require.Equal(t, "StoreKeyAlreadyIn", item.Files[0].StoreKey)
			require.Equal(t, 120, item.Files[0].SizeInBytes)
			require.Equal(t, file.TypeImage, item.Files[0].FileType)

			require.Equal(t, "StoreKeyToAdd", item.Files[1].StoreKey)
		}
	}
}

func TestTechnicianWorkOrderCheckOut(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	c := r.GraphClient()
	ctx := viewertest.NewContext(context.Background(), r.client)
	u := viewer.FromContext(ctx).(*viewer.UserViewer).User()
	wo := createWorkOrder(ctx, t, *r, "Foo")
	mr := r.Mutation()
	wo, err := mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:         wo.ID,
		Name:       longWorkOrderName,
		AssigneeID: &u.ID,
	})
	require.NoError(t, err)

	submitInput := models.TechnicianWorkOrderCheckOutInput{
		WorkOrderID:    wo.ID,
		Reason:         activity.ClockOutReasonSubmit,
		DistanceMeters: pointer.ToFloat64(50),
	}

	var rsp struct {
		TechnicianWorkOrderCheckOut struct {
			ID         string
			Status     workorder.Status
			Activities []struct {
				Author struct {
					ID string
				}
				ClockDetails struct {
					ClockOutReason *activity.ClockOutReason
					DistanceMeters *float64
					Comment        *string
				}
			}
		}
	}

	query := `mutation($input: TechnicianWorkOrderCheckOutInput!) {
			technicianWorkOrderCheckOut(input: $input) {
				id
				status
				activities {
					author {
						id
					}
					clockDetails {
						clockOutReason
						distanceMeters
						comment
					}
				}
			}
		}`

	c.MustPost(
		query,
		&rsp,
		client.Var("input", submitInput),
	)

	require.Equal(t, rsp.TechnicianWorkOrderCheckOut.Status, workorder.StatusSubmitted)
	require.Len(t, rsp.TechnicianWorkOrderCheckOut.Activities, 1)
	require.Equal(t, rsp.TechnicianWorkOrderCheckOut.Activities[0].Author.ID, strconv.Itoa(u.ID))
	require.Equal(t, *rsp.TechnicianWorkOrderCheckOut.Activities[0].ClockDetails.ClockOutReason, activity.ClockOutReasonSubmit)
	require.Nil(t, rsp.TechnicianWorkOrderCheckOut.Activities[0].ClockDetails.Comment)
	require.Equal(t, *rsp.TechnicianWorkOrderCheckOut.Activities[0].ClockDetails.DistanceMeters, 50.0)

	blockedInput := models.TechnicianWorkOrderCheckOutInput{
		WorkOrderID:    wo.ID,
		Reason:         activity.ClockOutReasonBlocked,
		DistanceMeters: pointer.ToFloat64(50),
		Comment:        pointer.ToString("Cannot complete"),
	}
	c.MustPost(
		query,
		&rsp,
		client.Var("input", blockedInput),
	)

	require.Equal(t, rsp.TechnicianWorkOrderCheckOut.Status, workorder.StatusBlocked)
	require.Len(t, rsp.TechnicianWorkOrderCheckOut.Activities, 2)

	incompleteInput := models.TechnicianWorkOrderCheckOutInput{
		WorkOrderID:    wo.ID,
		Reason:         activity.ClockOutReasonSubmitIncomplete,
		DistanceMeters: pointer.ToFloat64(50),
		Comment:        pointer.ToString("Cannot complete fully"),
	}
	c.MustPost(
		query,
		&rsp,
		client.Var("input", incompleteInput),
	)
	require.Equal(t, rsp.TechnicianWorkOrderCheckOut.Status, workorder.StatusSubmitted)
	require.Len(t, rsp.TechnicianWorkOrderCheckOut.Activities, 3)

	pauseInput := models.TechnicianWorkOrderCheckOutInput{
		WorkOrderID:    wo.ID,
		Reason:         activity.ClockOutReasonPause,
		DistanceMeters: pointer.ToFloat64(50),
	}
	c.MustPost(
		query,
		&rsp,
		client.Var("input", pauseInput),
	)
	require.Equal(t, rsp.TechnicianWorkOrderCheckOut.Status, workorder.StatusInProgress)
	require.Len(t, rsp.TechnicianWorkOrderCheckOut.Activities, 4)
}

func TestAssigneeCannotCompleteWorkOrder(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	woType, err := mr.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{
		Name:                         "TypeName",
		AssigneeCanCompleteWorkOrder: pointer.ToBool(false),
	})
	require.NoError(t, err)
	assignee := viewer.MustGetOrCreateUser(ctx, "Assignee", user.RoleUser)
	wo, err := mr.AddWorkOrder(ctx, models.AddWorkOrderInput{
		Name:            "WoName",
		WorkOrderTypeID: woType.ID,
		AssigneeID:      pointer.ToInt(assignee.ID),
	})
	require.NoError(t, err)
	ctx = viewertest.NewContext(
		context.Background(),
		r.client,
		viewertest.WithUser("Assignee"),
		viewertest.WithRole(user.RoleUser),
		viewertest.WithPermissions(authz.EmptyPermissions()))
	_, err = mr.EditWorkOrder(ctx, models.EditWorkOrderInput{
		ID:         wo.ID,
		Name:       "NewName",
		AssigneeID: pointer.ToInt(assignee.ID),
		Status:     toWorkOrderStatusPointer(workorder.StatusClosed),
	})
	require.Error(t, err)
}
