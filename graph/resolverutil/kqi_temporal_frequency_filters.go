// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/kqitemporalfrequency"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/pkg/errors"
)

func handleKqiTemporalFrequencyFilter(q *ent.KqiTemporalFrequencyQuery, filter *models.KqiTemporalFrequencyFilterInput) (*ent.KqiTemporalFrequencyQuery, error) {
	if filter.FilterType == models.KqiTemporalFrequencyFilterTypeName {
		return kqiTemporalFrequencyNameFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func kqiTemporalFrequencyNameFilter(q *ent.KqiTemporalFrequencyQuery, filter *models.KqiTemporalFrequencyFilterInput) (*ent.KqiTemporalFrequencyQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(kqitemporalfrequency.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
