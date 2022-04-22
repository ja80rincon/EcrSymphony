// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/counterfamily"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r mutationResolver) AddCounterFamily(ctx context.Context, input models.AddCounterFamilyInput) (*ent.CounterFamily, error) {
	client := r.ClientFrom(ctx)
	fam, err := client.
		CounterFamily.Create().
		SetName(input.Name).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return fam, nil
}

func (r mutationResolver) RemoveCounterFamily(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.CounterFamily.Query().
		Where(
			counterfamily.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}

	// TODO: Borrar validar formulas relation/edge.

	if err := client.CounterFamily.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditCounterFamily(ctx context.Context, input models.EditCounterFamilyInput) (*ent.CounterFamily, error) {
	client := r.ClientFrom(ctx)
	et, err := client.CounterFamily.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados
	if input.Name != et.Name {
		if et, err = client.CounterFamily.
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
