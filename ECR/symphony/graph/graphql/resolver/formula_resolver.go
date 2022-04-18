// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/formula"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type formulaResolver struct{}

func (formulaResolver) TechFk(ctx context.Context, formula *ent.Formula) (*ent.Tech, error) {
	variable, err := formula.Tech(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (formulaResolver) NetworkTypeFk(ctx context.Context, formula *ent.Formula) (*ent.NetworkType, error) {
	variable, err := formula.NetworkType(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (formulaResolver) KpiFk(ctx context.Context, formula *ent.Formula) (*ent.Kpi, error) {
	variable, err := formula.Kpi(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (formulaResolver) CounterformulaFk(ctx context.Context, formula *ent.Formula) ([]*ent.CounterFormula, error) {
	variable, err := formula.Counterformula(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddFormula(ctx context.Context, input models.AddFormulaInput) (*ent.Formula, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		Formula.Create().
		SetTextFormula(input.TextFormula).
		SetStatus(input.Status).
		SetKpiID(input.KpiFk).
		SetTechID(input.TechFk).
		SetNetworkTypeID(input.NetworkTypeFk).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveFormula(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.Formula.Query().
		Where(
			formula.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	if err := client.Formula.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}
func ChangeValidation(ctx context.Context, et *ent.Formula, input models.EditFormulaInput) (bool, error) {
	var change = false
	var kpi, err1 = et.Kpi(ctx)
	if err1 != nil {
		return false, errors.Wrap(err1, "has occurred error on process: %w")
	}
	var tech, err2 = et.Tech(ctx)
	if err2 != nil {
		return false, errors.Wrap(err2, "has occurred error on process: %w")
	}
	var networkType, err3 = et.NetworkType(ctx)
	if err3 != nil {
		return false, errors.Wrap(err3, "has occurred error on process: %w")
	}
	if et.TextFormula != input.TextFormula {
		change = true
	}
	if et.Status != input.Status {
		change = true
	}
	if (kpi != nil && kpi.ID != input.KpiFk) || kpi == nil {
		change = true
	}
	if (tech != nil && tech.ID != input.TechFk) || tech == nil {
		change = true
	}
	if (networkType != nil && networkType.ID != input.NetworkTypeFk) || networkType == nil {
		change = true
	}
	return change, nil
}

func (r mutationResolver) EditFormula(ctx context.Context, input models.EditFormulaInput) (*ent.Formula, error) {
	client := r.ClientFrom(ctx)
	et, err := client.Formula.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}

	var change, err1 = ChangeValidation(ctx, et, input)
	if err != nil {
		return nil, errors.Wrap(err1, "has occurred error on process: %w")
	}

	if change {
		if et, err = client.Formula.
			UpdateOne(et).
			SetTextFormula(input.TextFormula).
			SetStatus(input.Status).
			SetKpiID(input.KpiFk).
			SetTechID(input.TechFk).
			SetNetworkTypeID(input.NetworkTypeFk).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
