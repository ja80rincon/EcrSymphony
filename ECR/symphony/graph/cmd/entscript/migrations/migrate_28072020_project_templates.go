// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package migrations

import (
	"context"
	"fmt"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/projecttype"
	"go.uber.org/zap"
)

func createTemplatePropertyType(
	ctx context.Context,
	client *ent.Client,
	pt *ent.PropertyType,
	id int,
) (*ent.PropertyType, error) {
	result, err := client.PropertyType.Create().
		SetName(pt.Name).
		SetType(pt.Type).
		SetNodeType(pt.NodeType).
		SetIndex(pt.Index).
		SetCategory(pt.Category).
		SetNillableStringVal(pt.StringVal).
		SetNillableIntVal(pt.IntVal).
		SetNillableBoolVal(pt.BoolVal).
		SetNillableFloatVal(pt.FloatVal).
		SetNillableLatitudeVal(pt.LatitudeVal).
		SetNillableLongitudeVal(pt.LongitudeVal).
		SetIsInstanceProperty(pt.IsInstanceProperty).
		SetNillableRangeFromVal(pt.RangeFromVal).
		SetNillableRangeToVal(pt.RangeToVal).
		SetEditable(pt.Editable).
		SetMandatory(pt.Mandatory).
		SetDeleted(pt.Deleted).
		SetProjectTemplateID(id).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("creating property type: %w", err)
	}
	return result, nil
}

// AddProjectTemplate adds project template to existing project
func addProjectTemplate(
	ctx context.Context,
	client *ent.Client,
	projectTypeID int,
) (*ent.ProjectTemplate, map[int]int, error) {
	projectType, err := client.ProjectType.Query().
		Where(projecttype.ID(projectTypeID)).
		WithProperties().
		WithWorkOrders().
		Only(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("querying project type: %w", err)
	}
	typeToType := make(map[int]int, len(projectType.Edges.Properties))
	tem, err := client.ProjectTemplate.
		Create().
		SetName(projectType.Name).
		SetNillableDescription(projectType.Description).
		Save(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("creating project template: %w", err)
	}
	for _, pt := range projectType.Edges.Properties {
		npt, err := createTemplatePropertyType(ctx, client, pt, tem.ID)
		if err != nil {
			return nil, nil, fmt.Errorf("creating property type: %w", err)
		}
		typeToType[pt.ID] = npt.ID
	}
	for _, wo := range projectType.Edges.WorkOrders {
		wot, err := wo.QueryType().Only(ctx)
		if err != nil {
			return nil, nil, fmt.Errorf("querying work order type: %w", err)
		}
		_, err = client.WorkOrderDefinition.
			Create().
			SetNillableIndex(pointer.ToInt(wo.Index)).
			SetTypeID(wot.ID).
			SetProjectTemplate(tem).
			Save(ctx)
		if err != nil {
			return nil, nil, fmt.Errorf("updating work orders: %w", err)
		}
	}
	return tem, typeToType, nil
}

// Migrate Project Template
func MigrateProjectTemplates(ctx context.Context, logger *zap.Logger) error {
	client := ent.FromContext(ctx)
	projectIds, err := client.Project.Query().
		Where(project.Not(project.HasTemplate())).
		IDs(ctx)
	if err != nil {
		return fmt.Errorf("failed to query project ids: %w", err)
	}
	logger.Info("projects with no templates", zap.Int("count", len(projectIds)))
	for _, projectID := range projectIds {
		projectTypeID, err := client.ProjectType.Query().
			Where(projecttype.HasProjectsWith(project.ID(projectID))).
			OnlyID(ctx)
		if err != nil {
			return fmt.Errorf("failed to query project type: %w", err)
		}
		projectTemplate, typeToType, err := addProjectTemplate(ctx, client, projectTypeID)
		if err != nil {
			return fmt.Errorf("failed to create project template: %w", err)
		}
		err = client.Project.UpdateOneID(projectID).
			SetTemplate(projectTemplate).
			Exec(ctx)
		if err != nil {
			return fmt.Errorf("failed to attach template to project: %w", err)
		}
		properties, err := client.Project.Query().
			Where(project.ID(projectID)).
			QueryProperties().
			WithType().
			All(ctx)
		if err != nil {
			return fmt.Errorf("failed to query properties: %w", err)
		}
		for _, p := range properties {
			pTypeID := p.Edges.Type.ID
			newTypeID, ok := typeToType[pTypeID]
			if !ok {
				return fmt.Errorf("failed to get new property type id")
			}
			err = client.Property.UpdateOne(p).
				SetTypeID(newTypeID).
				Exec(ctx)
			if err != nil {
				return fmt.Errorf("failed to set new type of property: %w", err)
			}
		}
	}
	return nil
}
