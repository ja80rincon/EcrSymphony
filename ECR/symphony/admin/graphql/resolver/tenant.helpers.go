// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"

	"github.com/facebookincubator/symphony/admin/graphql/model"
)

// tenantIDs returns a list tenant ids.
func (r *resolver) tenantIDs(ctx context.Context) ([]*model.ID, error) {
	tenants, err := r.Query().Tenants(ctx, nil)
	if err != nil {
		return nil, err
	}
	ids := make([]*model.ID, len(tenants))
	for i := range tenants {
		ids[i] = &tenants[i].ID
	}
	return ids, nil
}
