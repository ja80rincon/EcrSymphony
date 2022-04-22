// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package directive_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/admin/graphql/directive"
	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/stretchr/testify/require"
)

func TestTenantType(t *testing.T) {
	tests := []struct {
		input  func() interface{}
		expect func(interface{})
	}{
		{
			input: func() interface{} {
				return model.NewTenant(t.Name()).ID
			},
			expect: func(res interface{}) {
				id, ok := res.(model.ID)
				require.True(t, ok)
				require.Equal(t, t.Name(), id.Tenant)
				require.Zero(t, id.ID)
			},
		},
		{
			input: func() interface{} {
				id := model.NewTenant(t.Name()).ID
				return &id
			},
			expect: func(res interface{}) {
				id, ok := res.(*model.ID)
				require.True(t, ok)
				require.Equal(t, t.Name(), id.Tenant)
				require.Zero(t, id.ID)
			},
		},
		{
			input: func() interface{} {
				var ids []model.ID
				for _, name := range []string{"foo", "bar", "baz"} {
					ids = append(ids, model.NewTenant(name).ID)
				}
				return ids
			},
			expect: func(res interface{}) {
				ids, ok := res.([]model.ID)
				require.True(t, ok)
				require.Equal(t, "foo", ids[0].Tenant)
				require.Zero(t, ids[0].ID)
				require.Equal(t, "bar", ids[1].Tenant)
				require.Zero(t, ids[1].ID)
				require.Equal(t, "baz", ids[2].Tenant)
				require.Zero(t, ids[2].ID)
			},
		},
		{
			input: func() interface{} {
				var ids []*model.ID
				for _, name := range []string{"foo", "bar", "baz"} {
					ids = append(ids, &model.NewTenant(name).ID)
				}
				return ids
			},
			expect: func(res interface{}) {
				ids, ok := res.([]*model.ID)
				require.True(t, ok)
				require.Equal(t, "foo", ids[0].Tenant)
				require.Zero(t, ids[0].ID)
				require.Equal(t, "bar", ids[1].Tenant)
				require.Zero(t, ids[1].ID)
				require.Equal(t, "baz", ids[2].Tenant)
				require.Zero(t, ids[2].ID)
			},
		},
	}
	d := directive.New()
	ctx := context.Background()
	for _, tc := range tests {
		res, err := d.TenantType(ctx, nil, func(ctx context.Context) (interface{}, error) {
			return tc.input(), nil
		})
		require.NoError(t, err)
		tc.expect(res)
	}
}
