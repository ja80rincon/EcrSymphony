// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kqicategory"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type kqiCategoryResolver struct{}

func (kqiCategoryResolver) Kqi(ctx context.Context, kqiCategory *ent.KqiCategory) ([]*ent.Kqi, error) {
	variable, err := kqiCategory.KqiCategoryFk(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}
func (r mutationResolver) AddKqiCategory(ctx context.Context, input models.AddKqiCategoryInput) (*ent.KqiCategory, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		KqiCategory.Create().
		SetName(input.Name).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveKqiCategory(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.KqiCategory.Query().
		Where(
			kqicategory.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados

	if err := client.KqiCategory.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditKqiCategory(ctx context.Context, input models.EditKqiCategoryInput) (*ent.KqiCategory, error) {
	client := r.ClientFrom(ctx)
	et, err := client.KqiCategory.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	if input.Name != et.Name {
		if et, err = client.KqiCategory.
			UpdateOne(et).
			SetName(input.Name).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
