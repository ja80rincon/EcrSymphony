// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package directive

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/facebookincubator/ent-contrib/entgql"
	"github.com/facebookincubator/symphony/admin/graphql/exec"
	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// New creates a graphql directive root.
func New() exec.DirectiveRoot {
	return exec.DirectiveRoot{
		TenantType: tenantType,
	}
}

func tenantType(ctx context.Context, _ interface{}, next graphql.Resolver) (interface{}, error) {
	res, err := next(ctx)
	if err != nil {
		return res, err
	}
	switch res := res.(type) {
	case model.ID:
		if res.ID != 0 {
			return nil, entgql.ErrNodeNotFound(res)
		}
	case *model.ID:
		if res.ID != 0 {
			return nil, entgql.ErrNodeNotFound(res)
		}
	case []model.ID:
		for _, id := range res {
			if id.ID != 0 {
				return nil, entgql.ErrNodeNotFound(id)
			}
		}
	case []*model.ID:
		for _, id := range res {
			if id.ID != 0 {
				return nil, entgql.ErrNodeNotFound(id)
			}
		}
	default:
		return nil, gqlerror.Errorf("@tenantType directive on %T", res)
	}
	return res, nil
}
