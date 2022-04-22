// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kqisource"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/pkg/errors"
)

func handleKqiSourceFilter(q *ent.KqiSourceQuery, filter *models.KqiSourceFilterInput) (*ent.KqiSourceQuery, error) {
	if filter.FilterType == models.KqiSourceFilterTypeName {
		return kqiSourceNameFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func kqiSourceNameFilter(q *ent.KqiSourceQuery, filter *models.KqiSourceFilterInput) (*ent.KqiSourceQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(kqisource.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
