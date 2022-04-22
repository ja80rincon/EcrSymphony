// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/threshold"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type thresholdResolver struct{}

func (thresholdResolver) Rule(ctx context.Context, threshold *ent.Threshold) ([]*ent.Rule, error) {
	variable, err := threshold.Rulethreshold(ctx)

	if err != nil {
		return nil, fmt.Errorf("no return a rule valid to id, %w", err)
	}
	return variable, nil
}

func (thresholdResolver) Kpi(ctx context.Context, threshold *ent.Threshold) (*ent.Kpi, error) {
	variable, err := threshold.Kpi(ctx)

	if err != nil {
		return nil, fmt.Errorf("no return a kpi valid to id, %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddThreshold(ctx context.Context, input models.AddThresholdInput) (*ent.Threshold, error) {
	client := r.ClientFrom(ctx)

	typ, err := client.
		Threshold.Create().
		SetName(input.Name).
		SetStatus(input.Status).
		SetDescription(input.Description).
		SetKpiID(input.Kpi).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveThreshold(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.Threshold.Query().
		Where(
			threshold.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados

	if err := client.Threshold.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditThreshold(ctx context.Context, input models.EditThresholdInput) (*ent.Threshold, error) {
	client := r.ClientFrom(ctx)
	et, err := client.Threshold.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	if input.Name != et.Name || input.Description != et.Description || input.Status != et.Status {
		if et, err = client.Threshold.
			UpdateOne(et).
			SetName(input.Name).
			SetDescription(input.Description).
			SetStatus(input.Status).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
