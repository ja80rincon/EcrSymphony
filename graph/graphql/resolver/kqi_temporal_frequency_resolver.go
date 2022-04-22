// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kqitemporalfrequency"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type kqiTemporalFrequencyResolver struct{}

func (kqiTemporalFrequencyResolver) Kqi(ctx context.Context, kqiTemporalFrequency *ent.KqiTemporalFrequency) ([]*ent.Kqi, error) {
	variable, err := kqiTemporalFrequency.KqiTemporalFrequencyFk(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}
func (r mutationResolver) AddKqiTemporalFrequency(ctx context.Context, input models.AddKqiTemporalFrequencyInput) (*ent.KqiTemporalFrequency, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.KqiTemporalFrequency.Create().
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

func (r mutationResolver) RemoveKqiTemporalFrequency(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.KqiTemporalFrequency.Query().
		Where(
			kqitemporalfrequency.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados

	if err := client.KqiTemporalFrequency.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditKqiTemporalFrequency(ctx context.Context, input models.EditKqiTemporalFrequencyInput) (*ent.KqiTemporalFrequency, error) {
	client := r.ClientFrom(ctx)
	et, err := client.KqiTemporalFrequency.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	if input.Name != et.Name {
		if et, err = client.KqiTemporalFrequency.
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
