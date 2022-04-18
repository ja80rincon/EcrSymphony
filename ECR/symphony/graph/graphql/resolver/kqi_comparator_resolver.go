// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kqicomparator"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type kqiComparatorResolver struct{}

func (kqiComparatorResolver) ComparatorFk(ctx context.Context, entity *ent.KqiComparator) (*ent.Comparator, error) {
	variable, err := entity.Comparatorkqitargetfk(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (kqiComparatorResolver) KqiTargetFk(ctx context.Context, entity *ent.KqiComparator) (*ent.KqiTarget, error) {
	variable, err := entity.Kqitargetcomparatorfk(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddKqiComparator(ctx context.Context, input models.AddKqiComparatorInput) (*ent.KqiComparator, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		KqiComparator.Create().
		SetNumber(input.Number).
		SetComparatorType(input.ComparatorType).
		SetKqitargetcomparatorfkID(input.KqiTargetFk).
		SetComparatorkqitargetfkID(input.ComparatorFk).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveKqiComparator(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.KqiComparator.Query().
		Where(
			kqicomparator.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}

	if err := client.KqiComparator.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditKqiComparator(ctx context.Context, input models.EditKqiComparatorInput) (*ent.KqiComparator, error) {
	client := r.ClientFrom(ctx)
	et, err := client.KqiComparator.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}

	var number, comparatorType = et.Number, et.ComparatorType
	var change = false
	if number != input.Number {
		number = input.Number
		change = true
	}

	if comparatorType != input.ComparatorType {
		comparatorType = input.ComparatorType
		change = true
	}

	if change {
		if et, err = client.KqiComparator.
			UpdateOne(et).
			SetNumber(number).
			SetComparatorType(comparatorType).
			SetKqitargetcomparatorfkID(input.KqiTargetFk).
			SetComparatorkqitargetfkID(input.ComparatorFk).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
