// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kqi"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type kqiResolver struct{}

func (kqiResolver) KqiCategory(ctx context.Context, kqi *ent.Kqi) (*ent.KqiCategory, error) {
	variable, err := kqi.KqiCategoryFk(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (kqiResolver) KqiPerspective(ctx context.Context, kqi *ent.Kqi) (*ent.KqiPerspective, error) {
	variable, err := kqi.KqiPerspectiveFk(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (kqiResolver) KqiSource(ctx context.Context, kqi *ent.Kqi) (*ent.KqiSource, error) {
	variable, err := kqi.KqiSourceFk(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (kqiResolver) KqiTemporalFrequency(ctx context.Context, kqi *ent.Kqi) (*ent.KqiTemporalFrequency, error) {
	variable, err := kqi.KqiTemporalFrequencyFk(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (kqiResolver) KqiTarget(ctx context.Context, kqi *ent.Kqi) ([]*ent.KqiTarget, error) {
	variable, err := kqi.KqiTargetFk(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddKqi(ctx context.Context, input models.AddKqiInput) (*ent.Kqi, error) {
	client := r.ClientFrom(ctx)

	typ, err := client.
		Kqi.Create().
		SetName(input.Name).
		SetDescription(input.Description).
		SetFormula(input.Formula).
		SetStartDateTime(input.StartDateTime).
		SetEndDateTime(input.EndDateTime).
		SetKqiCategoryFkID(input.KqiCategory).
		SetKqiPerspectiveFkID(input.KqiPerspective).
		SetKqiSourceFkID(input.KqiSource).
		SetKqiTemporalFrequencyFkID(input.KqiTemporalFrequency).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveKqi(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.Kqi.Query().
		Where(
			kqi.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	var kqiTargets, err1 = t.KqiTargetFk(ctx)
	if err1 != nil {
		return 0, errors.Wrap(err1, "has occurred error on process: %v")
	}
	for _, kqitarget := range kqiTargets {
		kqicomparators, _ := kqitarget.Kqitargetcomparatorfk(ctx)

		for _, kqicomparator := range kqicomparators {
			if err := client.KqiComparator.DeleteOne(kqicomparator).Exec(ctx); err != nil {
				return id, errors.Wrap(err, "has occurred error on process: %v")
			}
		}

		if err := client.KqiTarget.DeleteOne(kqitarget).Exec(ctx); err != nil {
			return id, errors.Wrap(err, "has occurred error on process: %v")
		}
	}

	if err := client.Kqi.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditKqi(ctx context.Context, input models.EditKqiInput) (*ent.Kqi, error) {
	client := r.ClientFrom(ctx)
	et, err := client.Kqi.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	var categoryid, perspectiveid, temporalFrequencyid, kqiSourceID int
	var name, start, end, formula, description = et.Name, et.StartDateTime, et.EndDateTime, et.Formula, et.Description

	var category, err1 = et.KqiCategoryFk(ctx)
	var perspective, err2 = et.KqiPerspectiveFk(ctx)
	var temporal, err3 = et.KqiTemporalFrequencyFk(ctx)
	var source, err4 = et.KqiSourceFk(ctx)

	switch {
	case err1 != nil || err2 != nil || err3 != nil || err4 != nil:
		er := errors.New(err1.Error() + err2.Error() + err3.Error() + err4.Error())
		return nil, errors.Wrap(er, "has occurred error on process: %v")
	case category != nil:
		categoryid = category.ID
	case perspective != nil:
		perspectiveid = perspective.ID
	case temporal != nil:
		temporalFrequencyid = temporal.ID
	case source != nil:
		kqiSourceID = source.ID
	}

	var change = false
	if name != input.Name {
		name = input.Name
		change = true
	}
	if start != input.StartDateTime {
		start = input.StartDateTime
		change = true
	}
	if end != input.EndDateTime {
		end = input.EndDateTime
		change = true
	}
	if formula != input.Formula {
		formula = input.Formula
		change = true
	}
	if description != input.Description {
		description = input.Description
		change = true
	}
	if (category != nil && category.ID != input.KqiCategory) || category == nil {
		categoryid = input.KqiCategory
		change = true
	}
	if (perspective != nil && perspective.ID != input.KqiPerspective) || perspective == nil {
		perspectiveid = input.KqiPerspective
		change = true
	}
	if (temporal != nil && temporal.ID != input.KqiTemporalFrequency) || temporal == nil {
		temporalFrequencyid = input.KqiTemporalFrequency
		change = true
	}
	if (source != nil && source.ID != input.KqiSource) || source == nil {
		kqiSourceID = input.KqiSource
		change = true
	}

	if change {
		if et, err = client.Kqi.
			UpdateOne(et).
			SetName(name).
			SetFormula(formula).
			SetDescription(description).
			SetStartDateTime(start).
			SetEndDateTime(end).
			SetKqiCategoryFkID(categoryid).
			SetKqiPerspectiveFkID(perspectiveid).
			SetKqiSourceFkID(kqiSourceID).
			SetKqiTemporalFrequencyFkID(temporalFrequencyid).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
