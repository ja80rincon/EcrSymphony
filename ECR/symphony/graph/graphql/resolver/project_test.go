// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/AlekSi/pointer"
	"github.com/stretchr/testify/require"
)

func TestNumOfProjects(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, ptr := r.Mutation(), r.ProjectType()

	pType, err := mr.CreateProjectType(ctx, models.AddProjectTypeInput{Name: "example_type"})
	require.NoError(t, err)

	numWO, err := ptr.NumberOfProjects(ctx, pType)
	require.NoError(t, err)
	require.Zero(t, numWO)

	workOrder, err := mr.CreateProject(ctx, models.AddProjectInput{
		Name: "foo", Type: pType.ID,
	})
	require.NoError(t, err)

	numWO, err = ptr.NumberOfProjects(ctx, pType)
	require.NoError(t, err)
	require.Equal(t, 1, numWO)

	_, err = mr.DeleteProject(ctx, workOrder.ID)
	require.NoError(t, err)

	numWO, err = ptr.NumberOfProjects(ctx, pType)
	require.NoError(t, err)
	require.Zero(t, numWO)
}

func TestProjectQuery(t *testing.T) {
	resolver, ctx := resolverctx(t)

	typ, err := resolver.Mutation().CreateProjectType(
		ctx, models.AddProjectTypeInput{Name: "test", Description: pointer.ToString("foobar")},
	)
	require.NoError(t, err)

	node, err := resolver.Query().Node(ctx, typ.ID)
	require.NoError(t, err)
	rtyp, ok := node.(*ent.ProjectType)
	require.True(t, ok)
	require.Equal(t, typ.Name, rtyp.Name)
	require.Equal(t, typ.Description, rtyp.Description)

	proj, err := resolver.Mutation().CreateProject(
		ctx, models.AddProjectInput{
			Name:        "test-project",
			Type:        typ.ID,
			Description: pointer.ToString("baz"),
		},
	)
	require.NoError(t, err)
	node, err = resolver.Query().Node(ctx, proj.ID)
	require.NoError(t, err)
	rproj, ok := node.(*ent.Project)
	require.True(t, ok)
	require.Equal(t, proj.Name, rproj.Name)
	require.Equal(t, proj.Description, rproj.Description)
}

func TestProjectWithWorkOrders(t *testing.T) {
	resolver := newTestResolver(t)
	defer resolver.Close()
	ctx := viewertest.NewContext(context.Background(), resolver.client)
	mutation := resolver.Mutation()

	woType, err := mutation.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{
		Name: "example_type_a",
		CheckListCategories: []*models.CheckListCategoryDefinitionInput{
			{
				Title: "Category",
				CheckList: []*models.CheckListDefinitionInput{
					{
						Title:       "Item 1",
						Type:        enum.CheckListItemTypeString,
						IsMandatory: pointer.ToBool(true),
					},
				},
			},
		},
	})
	require.NoError(t, err)
	woDef := models.WorkOrderDefinitionInput{Type: woType.ID, Index: pointer.ToInt(1)}

	typ, err := resolver.Mutation().CreateProjectType(
		ctx, models.AddProjectTypeInput{
			Name:        "test",
			Description: pointer.ToString("foobar"),
			WorkOrders:  []*models.WorkOrderDefinitionInput{&woDef},
		},
	)
	require.NoError(t, err)
	node, err := resolver.Query().Node(ctx, typ.ID)
	require.NoError(t, err)
	rtyp, ok := node.(*ent.ProjectType)
	require.True(t, ok)
	woDefs, err := rtyp.QueryWorkOrders().All(ctx)
	require.NoError(t, err)
	require.Equal(t, 1, len(woDefs))

	location := createLocation(ctx, t, *resolver)
	input := models.AddProjectInput{Name: "test", Type: typ.ID, Location: &location.ID}
	proj, err := mutation.CreateProject(ctx, input)
	require.NoError(t, err)
	wos, err := proj.QueryWorkOrders().WithCheckListCategories().All(ctx)
	require.NoError(t, err)
	require.Len(t, wos, 1)
	wo := wos[0]
	require.EqualValues(t, wo.Name, woType.Name)
	require.EqualValues(t, wo.Index, *woDef.Index)
	require.EqualValues(t, wo.QueryLocation().FirstIDX(ctx), location.ID)
	require.Len(t, wo.Edges.CheckListCategories, 1)

	clItems, err := wo.QueryCheckListCategories().QueryCheckListItems().All(ctx)
	require.NoError(t, err)
	require.Len(t, clItems, 1)
	clItem := clItems[0]
	require.EqualValues(t, clItem.Title, "Item 1")
	require.EqualValues(t, clItem.IsMandatory, true)
}

func TestEditProjectTypeWorkOrders(t *testing.T) {
	resolver, ctx := resolverctx(t)
	mutation := resolver.Mutation()

	woType, err := mutation.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{Name: "example_type_a"})
	require.NoError(t, err)
	woDef := models.WorkOrderDefinitionInput{Type: woType.ID, Index: pointer.ToInt(1)}

	typ, err := resolver.Mutation().CreateProjectType(
		ctx, models.AddProjectTypeInput{
			Name:        "test",
			Description: pointer.ToString("foobar"),
			WorkOrders:  []*models.WorkOrderDefinitionInput{&woDef},
		},
	)
	require.NoError(t, err)
	node, err := resolver.Query().Node(ctx, typ.ID)
	require.NoError(t, err)
	rtyp, ok := node.(*ent.ProjectType)
	require.True(t, ok)
	woDefs, err := rtyp.QueryWorkOrders().All(ctx)
	require.NoError(t, err)
	require.Equal(t, 1, len(woDefs))

	woDef = models.WorkOrderDefinitionInput{ID: &woDefs[0].ID, Type: woType.ID, Index: pointer.ToInt(2)}
	typ, err = resolver.Mutation().EditProjectType(
		ctx, models.EditProjectTypeInput{
			ID:          typ.ID,
			Name:        "test",
			Description: pointer.ToString("foobar"),
			WorkOrders:  []*models.WorkOrderDefinitionInput{&woDef},
		},
	)
	require.NoError(t, err)
	node, err = resolver.Query().Node(ctx, typ.ID)
	require.NoError(t, err)
	rtyp, ok = node.(*ent.ProjectType)
	require.True(t, ok)
	woDefs, err = rtyp.QueryWorkOrders().All(ctx)
	require.NoError(t, err)
	require.Equal(t, 1, len(woDefs))
	require.Equal(t, *woDef.ID, woDefs[0].ID)

	woDef2 := models.WorkOrderDefinitionInput{Type: woType.ID, Index: pointer.ToInt(3)}
	typ, err = resolver.Mutation().EditProjectType(
		ctx, models.EditProjectTypeInput{
			ID:          typ.ID,
			Name:        "test",
			Description: pointer.ToString("foobar"),
			WorkOrders:  []*models.WorkOrderDefinitionInput{&woDef2},
		},
	)
	require.NoError(t, err)
	node, err = resolver.Query().Node(ctx, typ.ID)
	require.NoError(t, err)
	rtyp, ok = node.(*ent.ProjectType)
	require.True(t, ok)
	woDefs, err = rtyp.QueryWorkOrders().All(ctx)
	require.NoError(t, err)
	require.Equal(t, 1, len(woDefs))
	require.NotEqual(t, *woDef.ID, woDefs[0].ID)
}

func TestProjectMutation(t *testing.T) {
	mutation, ctx := mutationctx(t)
	input := models.AddProjectTypeInput{Name: "test", Description: pointer.ToString("test desc")}
	ltyp, err := mutation.AddLocationType(ctx, models.AddLocationTypeInput{Name: "loc_type"})
	require.NoError(t, err)
	loc, err := mutation.AddLocation(ctx, models.AddLocationInput{
		Name: "loc_name",
		Type: ltyp.ID,
	})
	require.NoError(t, err)
	typ, err := mutation.CreateProjectType(ctx, input)
	require.NoError(t, err)
	require.Equal(t, input.Name, typ.Name)
	require.EqualValues(t, input.Description, typ.Description)
	_, err = mutation.CreateProjectType(ctx, models.AddProjectTypeInput{})
	require.Error(t, err, "project type name cannot be empty")
	_, err = mutation.CreateProjectType(ctx, input)
	require.Error(t, err, "project type name must be unique")

	var project *ent.Project
	{
		input := models.AddProjectInput{
			Name:        "test",
			Description: pointer.ToString("desc"),
			Type:        typ.ID,
			Location:    &loc.ID,
		}
		project, err = mutation.CreateProject(ctx, input)
		require.NoError(t, err)
		require.Equal(t, input.Name, project.Name)
		require.Equal(t, *input.Location, project.QueryLocation().OnlyX(ctx).ID)

		_, err = mutation.CreateProject(ctx, input)
		require.Error(t, err, "project name must be unique under type")
		_, err = mutation.CreateProject(ctx, models.AddProjectInput{Type: input.Type})
		require.Error(t, err, "project name cannot be empty")
		_, err = mutation.CreateProject(ctx, models.AddProjectInput{Name: "another", Type: 42424242})
		require.Error(t, err, "project type id must be valid")
	}

	deleted, err := mutation.DeleteProjectType(ctx, typ.ID)
	require.Error(t, err, "project type cannot be deleted with associated projects")
	require.False(t, deleted)
	deleted, err = mutation.DeleteProject(ctx, project.ID)
	require.NoError(t, err)
	require.True(t, deleted)
	deleted, err = mutation.DeleteProject(ctx, project.ID)
	require.Error(t, err)
	require.False(t, deleted)

	deleted, err = mutation.DeleteProjectType(ctx, typ.ID)
	require.NoError(t, err)
	require.True(t, deleted)
	deleted, err = mutation.DeleteProjectType(ctx, typ.ID)
	require.EqualError(t, err, "input: project type doesn't exist")
	require.False(t, deleted)
}

func TestEditProject(t *testing.T) {
	mutation, ctx := mutationctx(t)
	input := models.AddProjectTypeInput{Name: "test", Description: pointer.ToString("test desc")}
	ltyp, err := mutation.AddLocationType(ctx, models.AddLocationTypeInput{Name: "loc_type"})
	require.NoError(t, err)
	loc, err := mutation.AddLocation(ctx, models.AddLocationInput{
		Name: "loc_name",
		Type: ltyp.ID,
	})
	require.NoError(t, err)
	typ, err := mutation.CreateProjectType(ctx, input)
	require.NoError(t, err)

	var project *ent.Project
	{
		u := viewer.FromContext(ctx).(*viewer.UserViewer).User()
		input := models.AddProjectInput{
			Name:        "test",
			Description: pointer.ToString("desc"),
			Type:        typ.ID,
			Location:    &loc.ID,
			CreatorID:   &u.ID,
		}
		project, err = mutation.CreateProject(ctx, input)
		require.NoError(t, err)
		require.Equal(t, input.Name, project.Name)
		require.Equal(t, *input.Location, project.QueryLocation().OnlyX(ctx).ID)
		require.Equal(t, *input.CreatorID, project.QueryCreator().OnlyIDX(ctx))

		updateInput := models.EditProjectInput{
			ID:          project.ID,
			Name:        "new-test",
			Description: pointer.ToString("new-desc"),
			Type:        typ.ID,
		}
		project, err = mutation.EditProject(ctx, updateInput)
		require.NoError(t, err)
		require.Equal(t, updateInput.Name, project.Name)
		require.Equal(t, *updateInput.Description, *project.Description)
		require.False(t, project.QueryCreator().ExistX(ctx))
	}
}

func TestEditProjectLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr := r.Mutation()
	location := createLocation(ctx, t, *r)
	typ, err := mr.CreateProjectType(ctx, models.AddProjectTypeInput{Name: "example_type"})
	require.NoError(t, err)
	input := models.AddProjectInput{Name: "test", Type: typ.ID, Location: &location.ID}
	proj, err := mr.CreateProject(ctx, input)

	require.NoError(t, err)
	require.Equal(t, proj.QueryLocation().FirstIDX(ctx), location.ID)

	location = createLocationWithName(ctx, t, *r, "location2")
	ei := models.EditProjectInput{ID: proj.ID, Name: "test", Type: typ.ID, Location: &location.ID}
	proj, err = mr.EditProject(ctx, ei)
	require.NoError(t, err)
	require.Equal(t, proj.QueryLocation().FirstIDX(ctx), location.ID)

	ei = models.EditProjectInput{ID: proj.ID, Name: "test", Type: typ.ID}
	proj, err = mr.EditProject(ctx, ei)
	require.NoError(t, err)
	locEx, err := proj.QueryLocation().Exist(ctx)
	require.NoError(t, err)
	require.False(t, locEx)
}

func TestAddProjectWithProperties(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	mutation, ctx := mutationctx(t)

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
	typ, err := mr.CreateProjectType(ctx, models.AddProjectTypeInput{Name: "example_type", Properties: propTypeInputs})
	require.NoError(t, err, "Adding project type")

	strValue := "Foo"
	strProp := models.PropertyInput{
		PropertyTypeID: typ.QueryProperties().Where(propertytype.Name("str_prop")).OnlyIDX(ctx),
		StringValue:    &strValue,
	}
	strFixedProp := models.PropertyInput{
		PropertyTypeID: typ.QueryProperties().Where(propertytype.Name("str_fixed_prop")).OnlyIDX(ctx),
		StringValue:    &strFixedValue,
	}
	intValue := 5
	intProp := models.PropertyInput{
		PropertyTypeID: typ.QueryProperties().Where(propertytype.Name("int_prop")).OnlyIDX(ctx),
		StringValue:    nil,
		IntValue:       &intValue,
	}
	fl1, fl2 := 5.5, 7.8
	rngProp := models.PropertyInput{
		PropertyTypeID: typ.QueryProperties().Where(propertytype.Name("rng_prop")).OnlyIDX(ctx),
		RangeFromValue: &fl1,
		RangeToValue:   &fl2,
	}
	propInputs := []*models.PropertyInput{&strProp, &strFixedProp, &intProp, &rngProp}
	u := viewer.FromContext(ctx).(*viewer.UserViewer).User()
	input := models.AddProjectInput{
		Name:        "test",
		Description: pointer.ToString("desc"),
		Type:        typ.ID,
		CreatorID:   &u.ID,
		Properties:  propInputs,
	}
	p, err := mutation.CreateProject(ctx, input)
	require.NoError(t, err, "adding project instance")

	node, err := qr.Node(ctx, p.ID)
	require.NoError(t, err, "querying project node")
	fetchedProj, ok := node.(*ent.Project)
	require.True(t, ok, "casting project instance")
	fetchedProjectTemplate, err := fetchedProj.QueryTemplate().Only(ctx)
	require.NoError(t, err)

	intFetchProp := fetchedProj.QueryProperties().Where(property.HasTypeWith(propertytype.Name("int_prop"))).OnlyX(ctx)
	tIntFetchProp := fetchedProjectTemplate.QueryProperties().Where(propertytype.Name("int_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetInt(intFetchProp.IntVal), pointer.GetInt(intProp.IntValue), "Comparing properties: int value")
	require.NotEqual(t, intFetchProp.QueryType().OnlyIDX(ctx), intProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, intFetchProp.QueryType().OnlyIDX(ctx), tIntFetchProp.ID, "Comparing properties: PropertyType value")

	strFetchProp := fetchedProj.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_prop"))).OnlyX(ctx)
	tStrFetchProp := fetchedProjectTemplate.QueryProperties().Where(propertytype.Name("str_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetString(strFetchProp.StringVal), pointer.GetString(strProp.StringValue), "Comparing properties: string value")
	require.NotEqual(t, strFetchProp.QueryType().OnlyIDX(ctx), strProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, strFetchProp.QueryType().OnlyIDX(ctx), tStrFetchProp.ID, "Comparing properties: PropertyType value")

	fixedStrFetchProp := fetchedProj.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_fixed_prop"))).OnlyX(ctx)
	tFixedStrFetchProp := fetchedProjectTemplate.QueryProperties().Where(propertytype.Name("str_fixed_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetString(fixedStrFetchProp.StringVal), pointer.GetString(strFixedProp.StringValue), "Comparing properties: fixed string value")
	require.NotEqual(t, fixedStrFetchProp.QueryType().OnlyIDX(ctx), strFixedProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, fixedStrFetchProp.QueryType().OnlyIDX(ctx), tFixedStrFetchProp.ID, "Comparing properties: PropertyType value")

	rngFetchProp := fetchedProj.QueryProperties().Where(property.HasTypeWith(propertytype.Name("rng_prop"))).OnlyX(ctx)
	tRngFetchProp := fetchedProjectTemplate.QueryProperties().Where(propertytype.Name("rng_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetFloat64(rngFetchProp.RangeFromVal), pointer.GetFloat64(rngProp.RangeFromValue), "Comparing properties: range value")
	require.Equal(t, pointer.GetFloat64(rngFetchProp.RangeToVal), pointer.GetFloat64(rngProp.RangeToValue), "Comparing properties: range value")
	require.NotEqual(t, rngFetchProp.QueryType().OnlyIDX(ctx), rngProp.PropertyTypeID, "Comparing properties: PropertyType value")
	require.Equal(t, rngFetchProp.QueryType().OnlyIDX(ctx), tRngFetchProp.ID, "Comparing properties: PropertyType value")

	fetchedProps, err := fetchedProj.QueryProperties().All(ctx)
	require.NoError(t, err)
	require.Equal(t, len(propInputs), len(fetchedProps))

	failProp := models.PropertyInput{PropertyTypeID: -1}
	failEditInput := models.EditProjectInput{
		ID:         p.ID,
		Name:       "test",
		Properties: []*models.PropertyInput{&failProp},
	}
	_, err = mutation.EditProject(ctx, failEditInput)
	require.Error(t, err, "editing project instance property with wrong property type id")

	failProp2 := models.PropertyInput{
		ID:             &strFetchProp.ID,
		PropertyTypeID: intProp.PropertyTypeID,
	}
	failEditInput2 := models.EditProjectInput{
		ID:         p.ID,
		Name:       "test",
		Properties: []*models.PropertyInput{&failProp2},
	}
	_, err = mutation.EditProject(ctx, failEditInput2)
	require.Error(t, err, "editing project instance property when id and property type id mismach")

	newStrValue := "Foo"
	prop := models.PropertyInput{
		PropertyTypeID: strProp.PropertyTypeID,
		StringValue:    &newStrValue,
	}
	newProjectName := "updated test"
	editInput := models.EditProjectInput{
		ID:         p.ID,
		Name:       newProjectName,
		Properties: []*models.PropertyInput{&prop},
	}
	updatedP, err := mutation.EditProject(ctx, editInput)
	require.NoError(t, err)

	updatedNode, err := qr.Node(ctx, updatedP.ID)
	require.NoError(t, err, "querying updated project node")
	updatedProj, ok := updatedNode.(*ent.Project)
	require.True(t, ok, "casting updated project instance")
	require.Equal(t, updatedProj.Name, newProjectName, "Comparing updated project name")
	fetchedProjectTemplate, err = updatedProj.QueryTemplate().Only(ctx)
	require.NoError(t, err)
	fetchedProps = updatedProj.QueryProperties().AllX(ctx)
	require.Equal(t, len(propInputs), len(fetchedProps), "number of properties should remain he same")

	updatedProp := updatedProj.QueryProperties().Where(property.HasTypeWith(propertytype.Name("str_prop"))).OnlyX(ctx)
	tRngFetchProp = fetchedProjectTemplate.QueryProperties().Where(propertytype.Name("str_prop")).OnlyX(ctx)
	require.Equal(t, pointer.GetString(updatedProp.StringVal), pointer.GetString(prop.StringValue), "Comparing updated properties: string value")
	require.NotEqual(t, updatedProp.QueryType().OnlyIDX(ctx), prop.PropertyTypeID, "Comparing updated properties: PropertyType value")
	require.Equal(t, updatedProp.QueryType().OnlyIDX(ctx), tRngFetchProp.ID, "Comparing updated properties: PropertyType value")
}

func TestEditProjectType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()

	pType, err := mr.CreateProjectType(ctx, models.AddProjectTypeInput{Name: "example_type_name"})
	require.NoError(t, err)
	newType, err := mr.EditProjectType(ctx, models.EditProjectTypeInput{
		ID:          pType.ID,
		Name:        "example_type_name_edited",
		Description: pointer.ToString("example_type_desc_edited"),
	})
	require.NoError(t, err)
	require.Equal(t, "example_type_name_edited", newType.Name, "successfully edited project name")
	require.Equal(t, "example_type_desc_edited", *newType.Description, "successfully edited project description")
	pType2, err := mr.CreateProjectType(ctx, models.AddProjectTypeInput{Name: "example_type_name_2"})
	require.NoError(t, err)
	_, err = mr.EditProjectType(ctx, models.EditProjectTypeInput{
		ID:   pType2.ID,
		Name: "example_type_name_edited",
	})
	require.Error(t, err, "duplicate names")

	types, err := qr.ProjectTypes(ctx, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, types.Edges, 2)

	node, err := qr.Node(ctx, pType.ID)
	require.NoError(t, err)
	typ, ok := node.(*ent.ProjectType)
	require.True(t, ok)
	require.Equal(t, "example_type_name_edited", typ.Name)
}

func TestProjectWithWorkOrdersAndProperties(t *testing.T) {
	resolver := newTestResolver(t)
	defer resolver.Close()
	ctx := viewertest.NewContext(context.Background(), resolver.client)
	mutation := resolver.Mutation()

	strPropType := pkgmodels.PropertyTypeInput{
		Name: "str_prop",
		Type: "string",
	}
	intPropType := pkgmodels.PropertyTypeInput{
		Name:        "int_prop",
		Type:        "int",
		IsMandatory: pointer.ToBool(true),
	}
	woType, err := mutation.AddWorkOrderType(ctx, models.AddWorkOrderTypeInput{
		Name:       "example_type_a",
		Properties: []*pkgmodels.PropertyTypeInput{&strPropType, &intPropType},
	})
	require.NoError(t, err)
	woDef := models.WorkOrderDefinitionInput{Type: woType.ID, Index: pointer.ToInt(1)}

	typ, err := resolver.Mutation().CreateProjectType(
		ctx, models.AddProjectTypeInput{
			Name:        "test",
			Description: pointer.ToString("foobar"),
			WorkOrders:  []*models.WorkOrderDefinitionInput{&woDef},
		},
	)
	require.NoError(t, err)
	node, err := resolver.Query().Node(ctx, typ.ID)
	require.NoError(t, err)
	rtyp, ok := node.(*ent.ProjectType)
	require.True(t, ok)
	woDefs, err := rtyp.QueryWorkOrders().All(ctx)
	require.NoError(t, err)
	require.Equal(t, 1, len(woDefs))

	location := createLocation(ctx, t, *resolver)
	input := models.AddProjectInput{Name: "test", Type: typ.ID, Location: &location.ID}
	proj, err := mutation.CreateProject(ctx, input)
	require.NoError(t, err)
	wos, err := proj.QueryWorkOrders().All(ctx)
	require.NoError(t, err)
	require.Len(t, wos, 1)
	props := wos[0].QueryProperties().Where().AllX(ctx)
	require.Len(t, props, 2)
}

func TestAddProjectWithPriority(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	mr, qr := r.Mutation(), r.Query()
	name := "Project Name"
	typ, err := mr.CreateProjectType(
		ctx, models.AddProjectTypeInput{Name: "type_1_" + name, Description: pointer.ToString("foobar")},
	)
	require.NoError(t, err)
	priorityLow := project.PriorityLow
	priorityHigh := project.PriorityHigh

	project, err := mr.CreateProject(ctx, models.AddProjectInput{
		Name:     name,
		Type:     typ.ID,
		Priority: &priorityLow,
	})
	require.NoError(t, err)
	require.Equal(t, priorityLow, project.Priority)

	creator := viewer.MustGetOrCreateUser(ctx, "John", user.RoleOwner)

	input := models.EditProjectInput{
		ID:          project.ID,
		Name:        project.Name,
		Description: project.Description,
		CreatorID:   &creator.ID,
		Priority:    &priorityHigh,
	}

	project, err = mr.EditProject(ctx, input)
	require.NoError(t, err)
	require.Equal(t, priorityHigh, project.Priority)

	node, err := qr.Node(ctx, project.ID)
	require.NoError(t, err)
	project, ok := node.(*ent.Project)
	require.True(t, ok)
	require.Equal(t, priorityHigh, project.Priority)
}
