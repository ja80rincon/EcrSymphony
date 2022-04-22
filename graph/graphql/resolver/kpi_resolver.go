// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kpi"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type kpiResolver struct{}

func (r kpiResolver) DomainFk(ctx context.Context, kpi *ent.Kpi) (*ent.Domain, error) {
	variable, err := kpi.Domain(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r kpiResolver) KpiCategoryFk(ctx context.Context, kpi *ent.Kpi) (*ent.KpiCategory, error) {
	variable, err := kpi.KpiCategory(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (kpiResolver) FormulaFk(ctx context.Context, kpi *ent.Kpi) ([]*ent.Formula, error) {
	variable, err := kpi.Formulakpi(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (kpiResolver) Threshold(ctx context.Context, kpi *ent.Kpi) (*ent.Threshold, error) {
	variable, err := kpi.Thresholdkpi(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddKpi(ctx context.Context, input models.AddKpiInput) (*ent.Kpi, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		Kpi.Create().
		SetName(input.Name).
		SetStatus(input.Status).
		SetDescription(input.Description).
		SetDomainID(input.DomainFk).
		SetKpiCategoryID(input.KpiCategoryFk).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveKpi(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.Kpi.Query().
		Where(
			kpi.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados

	if err := client.Kpi.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditKpi(ctx context.Context, input models.EditKpiInput) (*ent.Kpi, error) {
	client := r.ClientFrom(ctx)
	et, err := client.Kpi.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	var domainID int
	var domain, err1 = et.Domain(ctx)
	if err1 != nil {
		return nil, errors.Wrap(err1, "has occurred error on process: %w")
	} else if domain != nil {
		domainID = domain.ID
	}

	var kpiCategoryID int
	var kpicategory, err2 = et.KpiCategory(ctx)
	if err2 != nil {
		return nil, errors.Wrap(err2, "has occurred error on process: %v")
	} else if kpicategory != nil {
		kpiCategoryID = kpicategory.ID
	}

	if input.Name != et.Name || input.DomainFk != domainID || input.Status != et.Status || input.Description != et.Description || input.KpiCategoryFk != kpiCategoryID {
		if et, err = client.Kpi.
			UpdateOne(et).
			SetName(input.Name).
			SetStatus(input.Status).
			SetDescription(input.Description).
			SetDomainID(input.DomainFk).
			SetKpiCategoryID(input.KpiCategoryFk).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
