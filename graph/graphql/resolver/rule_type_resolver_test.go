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

func TestAddRemoveRuleType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	id1, id2 := AddRuleTypeTest(ctx, t, mr)
	EditRuleTypeTest(ctx, t, mr, id1, id2)
	RemoveRuleTypeTest(ctx, t, mr, id1, id2)
}
func AddRuleTypeTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int) {
	ruleType1, err := mr.AddRuleType(ctx, models.AddRuleTypeInput{
		Name: "ruleType_test_1",
	})
	require.NoError(t, err)

	ruleType2, err := mr.AddRuleType(ctx, models.AddRuleTypeInput{
		Name: "ruleType_test_2",
	})
	require.NoError(t, err)
	id1, id2 := ruleType1.ID, ruleType2.ID
	_, err = mr.AddRuleType(ctx, models.AddRuleTypeInput{
		Name: "ruleType_test_1",
	})
	require.Error(t, err)
	return id1, id2
}

func EditRuleTypeTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.EditRuleType(ctx, models.EditRuleTypeInput{
		ID:   id1,
		Name: "ruleType_test_1.1",
	})
	require.NoError(t, err)
	_, err = mr.EditRuleType(ctx, models.EditRuleTypeInput{
		ID:   id2,
		Name: "ruleType_test_1.1",
	})
	require.Error(t, err)
}

func RemoveRuleTypeTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveRuleType(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveRuleType(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveRuleType(ctx, id1)
	require.Error(t, err)
}
