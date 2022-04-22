// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/rulelimit"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r mutationResolver) AddRuleLimit(ctx context.Context, input models.AddRuleLimitInput) (*ent.RuleLimit, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		RuleLimit.Create().
		SetNumber(input.Number).
		SetLimitType(input.LimitType).
		SetComparatorID(input.Comparator).
		SetRuleID(input.Rule).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveRuleLimit(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.RuleLimit.Query().
		Where(
			rulelimit.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados

	if err := client.RuleLimit.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditRuleLimit(ctx context.Context, input models.EditRuleLimitInput) (*ent.RuleLimit, error) {
	client := r.ClientFrom(ctx)
	et, err := client.RuleLimit.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}

	var number, limit = et.Number, et.LimitType
	var comparator2, erro = et.Comparator(ctx)
	var comparator int
	if erro == nil && comparator2 != nil {
		comparator = comparator2.ID
	} else {
		return nil, errors.Wrap(erro, "has occurred error on process: %v")
	}

	var rule2, erro2 = et.Rule(ctx)
	var rule int
	if erro2 == nil {
		if rule2 != nil {
			rule = rule2.ID
		}
	} else {
		return nil, errors.Wrap(erro2, "has occurred error on process: %v")
	}

	var change = false
	if number != input.Number {
		number = input.Number
		change = true
	}
	if limit != input.LimitType {
		limit = input.LimitType
		change = true
	}
	if (comparator2 != nil && comparator2.ID != input.Comparator) || comparator2 == nil {
		comparator = input.Comparator
		change = true
	}
	if (rule2 != nil && rule2.ID != input.Comparator) || rule2 == nil {
		rule = input.Rule
		change = true
	}

	if change {
		if et, err = client.RuleLimit.
			UpdateOne(et).
			SetNumber(number).
			SetLimitType(limit).
			SetComparatorID(comparator).
			SetRuleID(rule).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
