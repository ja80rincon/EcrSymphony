// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/counterformula"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type counterFormulaResolver struct{}

func (counterFormulaResolver) CounterFk(ctx context.Context, counterFormula *ent.CounterFormula) (*ent.Counter, error) {
	variable, err := counterFormula.Counter(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (counterFormulaResolver) FormulaFk(ctx context.Context, counterFormula *ent.CounterFormula) (*ent.Formula, error) {
	variable, err := counterFormula.Formula(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddCounterFormulaList(ctx context.Context, input models.AddCounterFormulaListInput) ([]*ent.CounterFormula, error) {
	var countersFormula []*ent.CounterFormula
	for _, counters := range input.CounterList {
		client := r.ClientFrom(ctx)
		typ, err := client.CounterFormula.Create().
			SetCounterID(counters.CounterFk).
			SetMandatory(counters.Mandatory).
			SetFormulaID(input.FormulaFk).
			Save(ctx)
		if err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, fmt.Errorf("has occurred error on process: %w", err)
		}
		countersFormula = append(countersFormula, typ)
	}

	return countersFormula, nil
}

func (r mutationResolver) AddCounterFormula(ctx context.Context, input models.AddCounterFormulaInput) (*ent.CounterFormula, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.CounterFormula.Create().
		SetCounterID(input.CounterFk).
		SetFormulaID(input.FormulaFk).
		SetMandatory(input.Mandatory).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) EditCounterFormula(ctx context.Context, input models.EditCounterFormulaInput) (*ent.CounterFormula, error) {
	client := r.ClientFrom(ctx)
	et, err := client.CounterFormula.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "updating counter: id=%q", input.ID)
	}

	var formulaid, counterid int
	var formula, err1 = et.Formula(ctx)
	if err1 != nil {
		return nil, errors.Wrap(err1, "has occurred error on process: %v")
	} else if formula != nil {
		formulaid = formula.ID
	}
	var counter, err2 = et.Counter(ctx)
	if err1 != nil {
		return nil, errors.Wrap(err2, "has occurred error on process: %v")
	} else if counter != nil {
		counterid = counter.ID
	}

	if input.FormulaFk != formulaid ||
		input.CounterFk != counterid ||
		input.Mandatory != et.Mandatory {
		if et, err = client.CounterFormula.
			UpdateOne(et).
			SetCounterID(input.CounterFk).
			SetFormulaID(input.FormulaFk).
			SetMandatory(input.Mandatory).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}

func (r mutationResolver) RemoveCounterFormula(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.CounterFormula.Query().
		Where(
			counterformula.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}

	if err := client.CounterFormula.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}
