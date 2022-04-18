// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/workertype"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r mutationResolver) AddWorkerType(ctx context.Context, input models.AddWorkerTypeInput) (*ent.WorkerType, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		WorkerType.Create().
		SetName(input.Name).
		SetNillableDescription(input.Description).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("A worker type with the name %v already exists", input.Name)
		}
		return nil, fmt.Errorf("creating worker type: %w", err)
	}
	if err := r.AddPropertyTypes(ctx, func(ptc *ent.PropertyTypeCreate) {
		ptc.SetWorkerTypeID(typ.ID)
	}, input.PropertyTypes...); err != nil {
		return nil, err
	}
	return typ, nil
}

func (r mutationResolver) EditWorkerType(ctx context.Context, input models.EditWorkerTypeInput) (*ent.WorkerType, error) {
	client := r.ClientFrom(ctx)
	et, err := client.WorkerType.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("A worker template with id=%q does not exist", input.ID)
		}
		return nil, errors.Wrapf(err, "updating worker template: id=%q", input.ID)
	}
	if input.Name != et.Name || input.Description != et.Description {
		if et, err = client.WorkerType.
			UpdateOne(et).
			SetName(input.Name).
			SetNillableDescription(input.Description).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("A worker type with the name %v already exists", input.Name)
			}
			return nil, errors.Wrap(err, "updating worker type name")
		}
	}

	for _, input := range input.PropertyTypes {
		if input.ID == nil {
			if err := r.validateAddedNewPropertyType(input); err != nil {
				return nil, err
			}
			if err := r.AddPropertyTypes(ctx,
				func(b *ent.PropertyTypeCreate) {
					b.SetWorkerTypeID(et.ID)
				}, input); err != nil {
				return nil, err
			}
		} else if err := r.updatePropType(ctx, input); err != nil {
			return nil, err
		}
	}
	return et, nil
}

func (r mutationResolver) RemoveWorkerType(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.WorkerType.Query().
		Where(
			workertype.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "querying worker type: id=%q", id)
	}
	pTypes, err := client.PropertyType.Query().
		Where(propertytype.HasWorkerTypeWith(workertype.ID(id))).
		All(ctx)
	if err != nil {
		return id, errors.Wrap(err, "querying property types")
	}
	for _, pType := range pTypes {
		if err := client.PropertyType.DeleteOne(pType).
			Exec(ctx); err != nil {
			return id, errors.Wrapf(err, "deleting property type id=%q", pType.ID)
		}
	}
	if err := client.WorkerType.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "deleting worker type")
	}
	return id, nil
}
