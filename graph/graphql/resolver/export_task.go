// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"encoding/json"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
)

type exportTaskResolver struct{}

func (r exportTaskResolver) Filters(_ context.Context, et *ent.ExportTask) ([]*models.GeneralFilter, error) {
	var filters []*models.GeneralFilter
	err := json.Unmarshal([]byte(et.Filters), &filters)
	return filters, err
}
