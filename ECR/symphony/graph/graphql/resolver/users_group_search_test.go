// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestUsersGroupSearchByName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	prepareUserData(ctx)

	gName1 := "group_1"
	inp1 := getAddUsersGroupInput(gName1, "this is group 1")
	_, err := r.Mutation().AddUsersGroup(ctx, inp1)
	require.NoError(t, err)

	gName2 := "group_2"
	inp2 := getAddUsersGroupInput(gName2, "this is group 2")
	_, err = r.Mutation().AddUsersGroup(ctx, inp2)
	require.NoError(t, err)

	f1 := models.UsersGroupFilterInput{
		FilterType:  models.UsersGroupFilterTypeGroupName,
		Operator:    enum.FilterOperatorIs,
		StringValue: &gName1,
	}
	resAll, err := r.Query().UsersGroups(ctx, nil, pointer.ToInt(100), nil, nil, []*models.UsersGroupFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, resAll.Edges, 1)
	require.Equal(t, resAll.TotalCount, 1)
}
