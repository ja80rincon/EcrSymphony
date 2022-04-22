// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/graph/resolverutil"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/projecttype"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/workorderdefinition"

	"github.com/AlekSi/pointer"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type (
	projectTypeResolver struct{}
	projectResolver     struct{}
)

func (projectTypeResolver) NumberOfProjects(ctx context.Context, obj *ent.ProjectType) (int, error) {
	projects, err := obj.Edges.ProjectsOrErr()
	if !ent.IsNotLoaded(err) {
		return len(projects), err
	}
	return obj.QueryProjects().Count(ctx)
}

func (r mutationResolver) CreateProjectType(ctx context.Context, input models.AddProjectTypeInput) (*ent.ProjectType, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		ProjectType.
		Create().
		SetName(input.Name).
		SetNillableDescription(input.Description).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("Project type %q already exists", input.Name)
		}
		return nil, fmt.Errorf("creating project type: %w", err)
	}
	if err := r.AddPropertyTypes(ctx, func(ptc *ent.PropertyTypeCreate) {
		ptc.SetProjectTypeID(typ.ID)
	}, input.Properties...); err != nil {
		return nil, fmt.Errorf("creating properties: %w", err)
	}
	builders := make([]*ent.WorkOrderDefinitionCreate, len(input.WorkOrders))
	for i, input := range input.WorkOrders {
		builders[i] = client.WorkOrderDefinition.Create().
			SetNillableIndex(input.Index).
			SetTypeID(input.Type).
			SetProjectType(typ)
	}
	if _, err := client.WorkOrderDefinition.CreateBulk(builders...).Save(ctx); err != nil {
		return nil, fmt.Errorf("creating work order definitions: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) EditProjectType(
	ctx context.Context, input models.EditProjectTypeInput,
) (*ent.ProjectType, error) {
	client := r.ClientFrom(ctx)
	pt, err := client.ProjectType.
		UpdateOneID(input.ID).
		SetName(input.Name).
		SetNillableDescription(input.Description).
		Save(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("Project template with id=%q does not exist", input.ID)
		}
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("A project template with the name %v already exists", input.Name)
		}
		return nil, errors.Wrapf(err, "updating project template: id=%q", pt.ID)
	}
	for _, p := range input.Properties {
		if p.ID == nil {
			if err := r.validateAddedNewPropertyType(p); err != nil {
				return nil, err
			}
			if err := r.AddPropertyTypes(ctx, func(b *ent.PropertyTypeCreate) { b.SetProjectTypeID(pt.ID) }, p); err != nil {
				return nil, err
			}
		} else if err := r.updatePropType(ctx, p); err != nil {
			return nil, err
		}
	}

	var ids []int
	for _, wo := range input.WorkOrders {
		if wo.ID == nil {
			def, err := client.WorkOrderDefinition.Create().
				SetNillableIndex(wo.Index).
				SetTypeID(wo.Type).
				SetProjectType(pt).
				Save(ctx)
			if err != nil {
				return nil, fmt.Errorf("creating work orders: %w", err)
			}
			ids = append(ids, def.ID)
		} else {
			_, err := client.WorkOrderDefinition.UpdateOneID(*wo.ID).
				SetNillableIndex(wo.Index).
				SetTypeID(wo.Type).
				Save(ctx)
			if err != nil {
				return nil, fmt.Errorf("creating work orders: %w", err)
			}
			ids = append(ids, *wo.ID)
		}
	}
	ids, err = pt.QueryWorkOrders().Where(workorderdefinition.Not(workorderdefinition.IDIn(ids...))).IDs(ctx)
	if err != nil {
		return nil, fmt.Errorf("fetching work orders: %w", err)
	}
	for _, id := range ids {
		if err := client.WorkOrderDefinition.DeleteOneID(id).Exec(ctx); err != nil {
			return nil, fmt.Errorf("removing work orders: %w", err)
		}
	}
	return pt, nil
}

func (r mutationResolver) DeleteProjectType(ctx context.Context, id int) (bool, error) {
	client := r.ClientFrom(ctx)
	switch count, err := client.ProjectType.Query().Where(projecttype.ID(id)).QueryProjects().Count(ctx); {
	case err != nil:
		return false, fmt.Errorf("cannot query project count for project type: %w", err)
	case count > 0:
		return false, gqlerror.Errorf("project type contains %d associated project", count)
	}
	pTypes, err := client.PropertyType.Query().Where(propertytype.HasProjectTypeWith(projecttype.ID(id))).All(ctx)
	if err != nil {
		return false, fmt.Errorf("querying project type properties: %w", err)
	}
	for _, pType := range pTypes {
		if err := client.PropertyType.DeleteOne(pType).Exec(ctx); err != nil {
			return false, fmt.Errorf("deleting project type property: %w", err)
		}
	}
	if err := client.ProjectType.DeleteOneID(id).Exec(ctx); err != nil {
		if ent.IsNotFound(err) {
			return false, gqlerror.Errorf("project type doesn't exist")
		}
		return false, fmt.Errorf("deleting project type: %w", err)
	}
	return true, nil
}

func (r queryResolver) ProjectTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.ProjectTypeConnection, error) {
	return r.ClientFrom(ctx).ProjectType.Query().
		Paginate(ctx, after, first, before, last)
}

func (projectResolver) NumberOfWorkOrders(ctx context.Context, obj *ent.Project) (int, error) {
	workOrders, err := obj.Edges.WorkOrdersOrErr()
	if !ent.IsNotLoaded(err) {
		return len(workOrders), err
	}
	return obj.QueryWorkOrders().Count(ctx)
}

func (r mutationResolver) convertToProjectTemplatePropertyInputs(
	ctx context.Context,
	projectTemplate *ent.ProjectTemplate,
	properties []*models.PropertyInput,
) ([]*models.PropertyInput, error) {
	client := r.ClientFrom(ctx)
	var pInputs []*models.PropertyInput
	for _, p := range properties {
		pt, err := client.PropertyType.Get(ctx, p.PropertyTypeID)
		if err != nil {
			return nil, errors.Wrap(err, "querying property type")
		}
		tID, err := projectTemplate.QueryProperties().
			Where(propertytype.Name(pt.Name)).
			OnlyID(ctx)
		if err != nil {
			return nil, err
		}
		pInput := *p
		pInput.PropertyTypeID = tID
		pInputs = append(pInputs, &pInput)
	}
	return pInputs, nil
}

func (r mutationResolver) CreateProject(ctx context.Context, input models.AddProjectInput) (*ent.Project, error) {
	client := r.ClientFrom(ctx)
	proj, err := client.
		Project.Create().
		SetName(input.Name).
		SetNillablePriority(input.Priority).
		SetNillableDescription(input.Description).
		SetTypeID(input.Type).
		SetNillableLocationID(input.Location).
		SetNillableCreatorID(input.CreatorID).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("Project %q already exists", input.Name)
		}
		return nil, fmt.Errorf("creating project: %w", err)
	}
	pTemplate, err := proj.QueryTemplate().Only(ctx)
	if err != nil {
		return nil, err
	}
	tPropInputs, err := r.convertToProjectTemplatePropertyInputs(ctx, pTemplate, input.Properties)
	if err != nil {
		return nil, fmt.Errorf("convert to template property inputs: %w", err)
	}
	propInput, err := r.validatedPropertyInputsFromTemplate(ctx, tPropInputs, pTemplate.ID, enum.PropertyEntityProject, false)
	if err != nil {
		return nil, fmt.Errorf("validating property for template : %w", err)
	}
	if _, err := r.AddProperties(propInput, resolverutil.AddPropertyArgs{
		Context:    ctx,
		IsTemplate: pointer.ToBool(true),
		EntSetter: func(create *ent.PropertyCreate) {
			create.SetProject(proj)
		}}); err != nil {
		return nil, fmt.Errorf("creating properties: %w", err)
	}
	pt, err := client.ProjectType.Get(ctx, input.Type)
	if err != nil {
		return nil, fmt.Errorf("fetching template: %w", err)
	}
	wos, err := pt.QueryWorkOrders().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("fetching work orders templates: %w", err)
	}
	for _, wo := range wos {
		wot, err := wo.QueryType().Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("query work order definition type: %w", err)
		}

		clCategoryDefs, err := wot.QueryCheckListCategoryDefinitions().WithCheckListItemDefinitions().All(ctx)
		if err != nil {
			return nil, fmt.Errorf("query work order checklist definitions: %w", err)
		}

		var categoryInputs []*models.CheckListCategoryInput
		for _, categoryDef := range clCategoryDefs {
			var clInputs []*models.CheckListItemInput
			for _, cliDef := range categoryDef.Edges.CheckListItemDefinitions {
				clInputs = append(clInputs, &models.CheckListItemInput{
					Title:             cliDef.Title,
					Type:              cliDef.Type,
					Index:             pointer.ToInt(cliDef.Index),
					IsMandatory:       pointer.ToBool(cliDef.IsMandatory),
					HelpText:          cliDef.HelpText,
					EnumValues:        cliDef.EnumValues,
					EnumSelectionMode: cliDef.EnumSelectionModeValue,
				})
			}

			categoryInputs = append(categoryInputs, &models.CheckListCategoryInput{
				Title:       categoryDef.Title,
				Description: pointer.ToString(categoryDef.Description),
				CheckList:   clInputs,
			})
		}

		_, err = r.internalAddWorkOrder(ctx, models.AddWorkOrderInput{
			Name:                wot.Name,
			Description:         wot.Description,
			WorkOrderTypeID:     wot.ID,
			ProjectID:           &proj.ID,
			LocationID:          input.Location,
			Index:               &wo.Index,
			CheckListCategories: categoryInputs,
		}, true)
		if err != nil {
			return nil, fmt.Errorf("creating work order: %w", err)
		}
	}
	return proj, nil
}

func (r mutationResolver) DeleteProject(ctx context.Context, id int) (bool, error) {
	client := r.ClientFrom(ctx)
	proj, err := client.Project.Query().
		Where(project.ID(id)).
		WithProperties().
		WithTemplate().
		Only(ctx)
	if err != nil {
		return false, errors.Wrapf(err, "querying project: id=%q", id)
	}

	for _, prop := range proj.Edges.Properties {
		if err := client.Property.DeleteOne(prop).Exec(ctx); err != nil {
			return false, fmt.Errorf("deleting project properties: %w", err)
		}
	}
	if proj.Edges.Template != nil {
		if _, err := r.deleteTemplate(ctx, proj.Edges.Template.ID, enum.PropertyEntityProject); err != nil {
			return false, errors.Wrapf(err, "deleting project template id=%q", proj.Edges.Template.ID)
		}
	}
	if err := client.Project.DeleteOneID(id).Exec(ctx); err != nil {
		if ent.IsNotFound(err) {
			return false, gqlerror.Errorf("project doesn't exist")
		}
		return false, fmt.Errorf("deleting project: %w", err)
	}
	return true, nil
}

func (r mutationResolver) EditProject(ctx context.Context, input models.EditProjectInput) (*ent.Project, error) {
	client := r.ClientFrom(ctx)
	proj, err := client.Project.Get(ctx, input.ID)
	if err != nil {
		return nil, errors.Wrapf(err, "querying project: id=%q", input.ID)
	}

	mutation := client.Project.
		UpdateOne(proj).
		SetName(input.Name).
		SetNillablePriority(input.Priority).
		SetNillableDescription(input.Description)

	if input.CreatorID != nil {
		mutation.SetCreatorID(*input.CreatorID)
	} else {
		mutation.ClearCreator()
	}
	if input.Location != nil {
		mutation.SetLocationID(*input.Location)
	} else {
		mutation.ClearLocation()
	}
	tPropInputs := input.Properties
	tmpl, err := proj.QueryTemplate().Only(ctx)
	if err != nil {
		if !ent.IsNotFound(err) {
			return nil, err
		}
	} else {
		tPropInputs, err = r.convertToProjectTemplatePropertyInputs(ctx, tmpl, tPropInputs)
		if err != nil {
			return nil, fmt.Errorf("convert to template property inputs: %w", err)
		}
	}
	for _, pInput := range tPropInputs {
		propertyQuery := proj.QueryProperties().
			Where(property.HasTypeWith(propertytype.ID(pInput.PropertyTypeID)))
		if pInput.ID != nil {
			propertyQuery = propertyQuery.
				Where(property.ID(*pInput.ID))
		}
		existingProperty, err := propertyQuery.Only(ctx)
		if err != nil {
			if pInput.ID == nil {
				return nil, errors.Wrapf(err, "querying project property type %q", pInput.PropertyTypeID)
			}
			return nil, errors.Wrapf(err, "querying project property type %q and id %q", pInput.PropertyTypeID, *pInput.ID)
		}
		typ, err := client.PropertyType.Get(ctx, pInput.PropertyTypeID)
		if err != nil {
			return nil, errors.Wrapf(err, "querying property type %q", pInput.PropertyTypeID)
		}
		if typ.Editable && typ.IsInstanceProperty {
			updater := client.Property.UpdateOneID(existingProperty.ID)
			if r.updatePropValues(ctx, pInput, updater) != nil {
				return nil, errors.Wrap(err, "updating property values")
			}
		}
	}
	return mutation.Save(ctx)
}
