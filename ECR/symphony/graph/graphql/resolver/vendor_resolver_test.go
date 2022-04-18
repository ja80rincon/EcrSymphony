// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent/user"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

func TestAddRemoveVendor(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddVendorTest(ctx, t, mr)
	EditVendorTest(ctx, t, mr, id1, id2)
	RemoveVendorTest(ctx, t, mr, id1, id2)
}
func AddVendorTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	vendor1, err := mr.AddVendor(ctx, models.AddVendorInput{
		Name: "vendor_test_1",
	})
	require.NoError(t, err)

	vendor2, err := mr.AddVendor(ctx, models.AddVendorInput{
		Name: "vendor_test_2",
	})
	require.NoError(t, err)
	id1, id2 := vendor1.ID, vendor2.ID
	_, err = mr.AddVendor(ctx, models.AddVendorInput{
		Name: "vendor_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditVendorTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditVendor(ctx, models.EditVendorInput{
		ID:   id1,
		Name: "vendor_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditVendor(ctx, models.EditVendorInput{
		ID:   id2,
		Name: "vendor_test_1.1",
	})
	require.Error(t, err)
}

func RemoveVendorTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveVendor(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveVendor(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveVendor(ctx, id1)
	require.Error(t, err)
}
