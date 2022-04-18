// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/ent"
)

type floorPlanResolver struct{}

func (floorPlanResolver) LocationID(ctx context.Context, obj *ent.FloorPlan) (int, error) {
	return obj.QueryLocation().FirstID(ctx)
}
