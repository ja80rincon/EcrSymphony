// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func prepareUserData(ctx context.Context) {
	client := ent.FromContext(ctx).User
	client.Create().
		SetAuthID("user1").
		SetEmail("sam@workspace.com").
		SetFirstName("Samuel").
		SetLastName("Willis").
		SetRole(user.RoleUser).
		SaveX(ctx)
	client.Create().
		SetAuthID("user2").
		SetEmail("the-monster@workspace.com").
		SetFirstName("Eli").
		SetLastName("Cohen").
		SetRole(user.RoleUser).
		SaveX(ctx)

	client.Create().
		SetAuthID("user3").
		SetEmail("funny@workspace.com").
		SetFirstName("Willis").
		SetLastName("Rheed").
		SetRole(user.RoleUser).
		SaveX(ctx)

	client.Create().
		SetAuthID("user4").
		SetEmail("danit@workspace.com").
		SetFirstName("Dana").
		SetLastName("Cohen").
		SetRole(user.RoleUser).
		SaveX(ctx)

	client.Create().
		SetAuthID("user5").
		SetEmail("user5@test.ing").
		SetFirstName("Raul").
		SetLastName("Himemes").
		SetRole(user.RoleUser).
		SetStatus(user.StatusDeactivated).
		SaveX(ctx)
}

func searchByStatus(
	ctx context.Context,
	t *testing.T,
	qr generated.QueryResolver,
	status user.Status) *ent.UserConnection {
	limit := 100
	f1 := models.UserFilterInput{
		FilterType:  models.UserFilterTypeUserStatus,
		Operator:    enum.FilterOperatorIs,
		StatusValue: &status,
	}
	res, err := qr.Users(ctx, nil, &limit, nil, nil, []*models.UserFilterInput{&f1})
	require.NoError(t, err)
	return res
}

func searchByName(
	ctx context.Context,
	t *testing.T,
	qr generated.QueryResolver,
	searchTerm string) *ent.UserConnection {
	limit := 100
	f1 := models.UserFilterInput{
		FilterType:  models.UserFilterTypeUserName,
		Operator:    enum.FilterOperatorContains,
		StringValue: &searchTerm,
	}
	res, err := qr.Users(ctx, nil, &limit, nil, nil, []*models.UserFilterInput{&f1})
	require.NoError(t, err)
	return res
}

func TestSearchUsersByName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr := r.Query()
	ctx := viewertest.NewContext(context.Background(), r.client)
	prepareUserData(ctx)

	search1 := searchByName(ctx, t, qr, "Cohen")
	require.Len(t, search1.Edges, 2)

	search2 := searchByName(ctx, t, qr, "monster")
	require.Len(t, search2.Edges, 1)

	search3 := searchByName(ctx, t, qr, "willis")
	require.Len(t, search3.Edges, 2)

	search4 := searchByName(ctx, t, qr, "sam")
	require.Len(t, search4.Edges, 1)

	search5 := searchByName(ctx, t, qr, "li")
	require.Len(t, search5.Edges, 3)

	search6 := searchByName(ctx, t, qr, "ra hi")
	require.Len(t, search6.Edges, 1)

	search7 := searchByName(ctx, t, qr, "li he")
	require.Len(t, search7.Edges, 2)

	search8 := searchByStatus(ctx, t, qr, user.StatusActive)
	require.Len(t, search8.Edges, 5) // including 'tester@example.com'

	search9 := searchByStatus(ctx, t, qr, user.StatusDeactivated)
	require.Len(t, search9.Edges, 1)
}
