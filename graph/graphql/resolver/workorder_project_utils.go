// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/vektah/gqlparser/v2/gqlerror"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"go.uber.org/zap"
)

func (r mutationResolver) deleteTemplatePropertyTypes(
	ctx context.Context,
	id int,
	entity enum.PropertyEntity,
) (int, error) {
	client, logger := r.ClientFrom(ctx), r.logger.For(ctx).With(zap.Int("id", id))
	var (
		pTypes []*ent.PropertyType
		err    error
	)
	switch entity {
	case enum.PropertyEntityWorkOrder:
		var template *ent.WorkOrderTemplate
		if template, err = r.ClientFrom(ctx).WorkOrderTemplate.Get(ctx, id); err != nil {
			return id, fmt.Errorf("can't read work order template: %w", err)
		}
		if pTypes, err = template.QueryPropertyTypes().All(ctx); err != nil {
			logger.Error("cannot query property types of work order template", zap.Error(err))
			return id, fmt.Errorf("querying work order template property types: %w", err)
		}
	case enum.PropertyEntityProject:
		var template *ent.ProjectTemplate
		if template, err = r.ClientFrom(ctx).ProjectTemplate.Get(ctx, id); err != nil {
			return id, fmt.Errorf("can't read project template: %w", err)
		}
		if pTypes, err = template.QueryProperties().All(ctx); err != nil {
			logger.Error("cannot query property types of project template", zap.Error(err))
			return id, fmt.Errorf("querying project template property types: %w", err)
		}
	default:
		logger.Error("cannot query property types of template", zap.Error(err))
		return id, fmt.Errorf("querying template property types: %w", err)
	}

	for _, pType := range pTypes {
		if err := client.PropertyType.DeleteOne(pType).
			Exec(ctx); err != nil {
			logger.Error("cannot delete property type of template", zap.Error(err))
			return id, fmt.Errorf("deleting template property type: %w", err)
		}
	}
	return id, nil
}

func (r mutationResolver) deleteTemplate(
	ctx context.Context,
	id int,
	entity enum.PropertyEntity,
) (int, error) {
	client, logger := r.ClientFrom(ctx), r.logger.For(ctx).With(zap.Int("id", id))
	var (
		err error
	)
	_, err = r.deleteTemplatePropertyTypes(ctx, id, entity)
	if err != nil {
		return id, err
	}

	switch entity {
	case enum.PropertyEntityWorkOrder:
		err = client.WorkOrderTemplate.DeleteOneID(id).Exec(ctx)
	case enum.PropertyEntityProject:
		err = client.ProjectTemplate.DeleteOneID(id).Exec(ctx)
	default:
		logger.Error("cannot delete template", zap.Error(err))
		return id, fmt.Errorf("deleting template: %w", err)
	}
	switch err.(type) {
	case nil:
		logger.Info("deleted template")
		return id, nil
	case *ent.NotFoundError:
		err := gqlerror.Errorf("template not found")
		logger.Error(err.Message)
		return id, err
	default:
		logger.Error("cannot delete template", zap.Error(err))
		return id, fmt.Errorf("deleting template: %w", err)
	}
}

func (r mutationResolver) validatedPropertyInputsFromTemplate(
	ctx context.Context,
	input []*models.PropertyInput,
	tmplID int,
	entity enum.PropertyEntity,
	skipMandatoryPropertiesCheck bool,
) ([]*models.PropertyInput, error) {
	var (
		types []*ent.PropertyType
		err   error
	)
	typeIDToInput := make(map[int]*models.PropertyInput)
	switch entity {
	case enum.PropertyEntityWorkOrder:
		var template *ent.WorkOrderTemplate
		if template, err = r.ClientFrom(ctx).WorkOrderTemplate.Get(ctx, tmplID); err != nil {
			return nil, fmt.Errorf("can't read work order template: %w", err)
		}
		types, err = template.QueryPropertyTypes().
			Where(propertytype.Deleted(false)).
			All(ctx)
	case enum.PropertyEntityProject:
		var template *ent.ProjectTemplate
		if template, err = r.ClientFrom(ctx).ProjectTemplate.Get(ctx, tmplID); err != nil {
			return nil, fmt.Errorf("can't read project template: %w", err)
		}
		types, err = template.QueryProperties().
			Where(propertytype.Deleted(false)).
			All(ctx)
	default:
		return nil, fmt.Errorf("can't query property types for %v", entity.String())
	}
	if err != nil {
		return nil, err
	}

	var validInput []*models.PropertyInput
	for _, pInput := range input {
		// verify it's in types slice &&  not deleted
		candidate := findPropType(types, pInput.PropertyTypeID)
		if candidate != nil {
			validInput = append(validInput, pInput)
			typeIDToInput[pInput.PropertyTypeID] = pInput
		} else {
			return nil, fmt.Errorf("invalid property type (id=%v), either deleted or belongs to other template", pInput.PropertyTypeID)
		}
	}
	for _, propTyp := range types {
		if _, ok := typeIDToInput[propTyp.ID]; !ok {
			// propTyp not in inputs
			if !skipMandatoryPropertiesCheck && propTyp.Mandatory {
				return nil, fmt.Errorf("property type %v is mandatory and must be specified", propTyp.Name)
			}
			stringValue := propTyp.StringVal
			if propTyp.Type == propertytype.TypeEnum {
				stringValue = nil
			}
			validInput = append(validInput, &models.PropertyInput{
				PropertyTypeID:     propTyp.ID,
				StringValue:        stringValue,
				IntValue:           propTyp.IntVal,
				BooleanValue:       propTyp.BoolVal,
				FloatValue:         propTyp.FloatVal,
				LatitudeValue:      propTyp.LatitudeVal,
				LongitudeValue:     propTyp.LongitudeVal,
				RangeFromValue:     propTyp.RangeFromVal,
				RangeToValue:       propTyp.RangeToVal,
				IsInstanceProperty: pointer.ToBool(propTyp.IsInstanceProperty),
				IsEditable:         pointer.ToBool(propTyp.Editable),
			})
		}
	}
	return validInput, nil
}

func findPropType(allTypes []*ent.PropertyType, id int) *ent.PropertyType {
	for _, typ := range allTypes {
		if typ.ID == id {
			return typ
		}
	}
	return nil
}
