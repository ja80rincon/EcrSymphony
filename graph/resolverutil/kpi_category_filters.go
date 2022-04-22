// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kpicategory"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/pkg/errors"
)

func handleKpiCategoryFilter(q *ent.KpiCategoryQuery, filter *models.KpiCategoryFilterInput) (*ent.KpiCategoryQuery, error) {
	if filter.FilterType == models.KpiCategoryFilterTypeName {
		return kpiCategoryNameFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func kpiCategoryNameFilter(q *ent.KpiCategoryQuery, filter *models.KpiCategoryFilterInput) (*ent.KpiCategoryQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(kpicategory.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
