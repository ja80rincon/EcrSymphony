// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks

import (
	"context"
	"errors"
	"fmt"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/hook"
	"github.com/facebookincubator/symphony/pkg/ent/projecttype"
)

func addProjectTemplate(
	ctx context.Context,
	client *ent.Client,
	projectTypeID int,
) (*ent.ProjectTemplate, error) {
	projectType, err := client.ProjectType.Query().
		Where(projecttype.ID(projectTypeID)).
		WithProperties().
		WithWorkOrders().
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying project type: %w", err)
	}
	tem, err := client.ProjectTemplate.
		Create().
		SetName(projectType.Name).
		SetNillableDescription(projectType.Description).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("creating project template: %w", err)
	}
	for _, pt := range projectType.Edges.Properties {
		_, err := createTemplatePropertyType(ctx, client, pt, tem.ID, PropertyTypeParentProject)
		if err != nil {
			return nil, fmt.Errorf("creating property type: %w", err)
		}
	}
	for _, wo := range projectType.Edges.WorkOrders {
		wot, err := wo.QueryType().Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("querying work order type: %w", err)
		}
		_, err = client.WorkOrderDefinition.
			Create().
			SetNillableIndex(pointer.ToInt(wo.Index)).
			SetTypeID(wot.ID).
			SetProjectTemplate(tem).
			Save(ctx)
		if err != nil {
			return nil, fmt.Errorf("updating work orders: %w", err)
		}
	}
	return tem, nil
}

// ProjectAddTemplateHook creates project template and attaches it to the created project.
func ProjectAddTemplateHook() ent.Hook {
	hk := func(next ent.Mutator) ent.Mutator {
		return hook.ProjectFunc(func(ctx context.Context, mutation *ent.ProjectMutation) (ent.Value, error) {
			client := mutation.Client()
			typeID, exists := mutation.TypeID()
			if !exists {
				return nil, errors.New("project must have type")
			}
			projectTemplate, err := addProjectTemplate(ctx, client, typeID)
			if err != nil {
				return nil, fmt.Errorf("failed to create project template: %w", err)
			}
			mutation.SetTemplateID(projectTemplate.ID)
			return next.Mutate(ctx, mutation)
		})
	}
	return hook.On(hk, ent.OpCreate)
}
