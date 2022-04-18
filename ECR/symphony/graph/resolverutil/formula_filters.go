// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/formula"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/pkg/errors"
)

func handleFormulaFilter(q *ent.FormulaQuery, filter *models.FormulaFilterInput) (*ent.FormulaQuery, error) {
	switch filter.FilterType {
	case models.FormulaFilterTypeTextformula:
		return formulaTextformulaFilter(q, filter)
	case models.FormulaFilterTypeStatus:
		return formulaStatusFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func formulaTextformulaFilter(q *ent.FormulaQuery, filter *models.FormulaFilterInput) (*ent.FormulaQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(formula.TextFormulaContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func formulaStatusFilter(q *ent.FormulaQuery, filter *models.FormulaFilterInput) (*ent.FormulaQuery, error) {
	if filter.Operator == enum.FilterOperatorIs && filter.BoolValue != nil {
		return q.Where(formula.StatusEQ(*filter.BoolValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
