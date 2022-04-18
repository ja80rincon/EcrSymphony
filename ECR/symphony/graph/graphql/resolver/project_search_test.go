// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

type projectSearchDataModels struct {
	project1 *ent.Project
	typ      *ent.ProjectType
	location *ent.Location
	creator  *ent.User
}

func prepareProjectData(ctx context.Context, r *TestResolver, name string) projectSearchDataModels {
	mr := r.Mutation()
	locationType, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: name + "location_type",
	})

	location, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name: name,
		Type: locationType.ID,
	})

	typ, _ := mr.CreateProjectType(
		ctx, models.AddProjectTypeInput{Name: "type_1_" + name, Description: pointer.ToString("foobar")},
	)
	typ2, _ := mr.CreateProjectType(
		ctx, models.AddProjectTypeInput{Name: "type_2_" + name, Description: pointer.ToString("foobar")},
	)

	creatorName := "user1@fb.com"
	creator := viewer.MustGetOrCreateUser(ctx, creatorName, user.RoleOwner)

	project1, _ := mr.CreateProject(ctx, models.AddProjectInput{
		Name:        name + "-1",
		Type:        typ.ID,
		Location:    &location.ID,
		Description: pointer.ToString("description-1"),
		CreatorID:   &creator.ID,
	})
	_, _ = mr.CreateProject(ctx, models.AddProjectInput{
		Name:        name + "-2",
		Type:        typ2.ID,
		Location:    &location.ID,
		Description: pointer.ToString("description-2"),
	})

	return projectSearchDataModels{
		project1,
		typ,
		location,
		creator,
	}
}

func TestFetchProjects(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	_ = prepareProjectData(ctx, r, "project")

	qr := r.Query()
	res, err := qr.Projects(ctx, nil, nil, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Len(t, res.Edges, 2)
	require.Equal(t, res.TotalCount, 2)
}

func TestSearchProjectsByName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	_ = prepareProjectData(ctx, r, "project")

	qr := r.Query()

	filter1 := models.ProjectFilterInput{
		FilterType:  models.ProjectFilterTypeProjectName,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("project"),
	}

	filter2 := models.ProjectFilterInput{
		FilterType:  models.ProjectFilterTypeProjectName,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("zzzz"),
	}

	res1, err := qr.Projects(ctx, nil, nil, nil, nil, nil, []*models.ProjectFilterInput{&filter1}, nil, nil)
	require.NoError(t, err)
	require.Len(t, res1.Edges, 2)
	require.Equal(t, res1.TotalCount, 2)

	res2, err := qr.Projects(ctx, nil, nil, nil, nil, nil, []*models.ProjectFilterInput{&filter2}, nil, nil)
	require.NoError(t, err)
	require.Len(t, res2.Edges, 0)
}

func TestSearchProjectsByType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	projectData := prepareProjectData(ctx, r, "A")
	qr := r.Query()

	filter := models.ProjectFilterInput{
		FilterType: models.ProjectFilterTypeProjectType,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{projectData.typ.ID},
	}

	res, err := qr.Projects(ctx, nil, nil, nil, nil, nil, []*models.ProjectFilterInput{&filter}, nil, nil)
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
}

func TestSearchProjectsByLocation(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	projectData := prepareProjectData(ctx, r, "A")
	qr := r.Query()

	filter := models.ProjectFilterInput{
		FilterType: models.ProjectFilterTypeLocationInst,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{projectData.location.ID},
		MaxDepth:   pointer.ToInt(1),
	}

	res, err := qr.Projects(ctx, nil, nil, nil, nil, nil, []*models.ProjectFilterInput{&filter}, nil, nil)
	require.NoError(t, err)
	require.Len(t, res.Edges, 2)
}

func TestSearchProjectsByOwner(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	projectData := prepareProjectData(ctx, r, "A")
	qr := r.Query()

	filter := models.ProjectFilterInput{
		FilterType: models.ProjectFilterTypeProjectOwnedBy,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{projectData.creator.ID},
		MaxDepth:   pointer.ToInt(1),
	}

	res, err := qr.Projects(ctx, nil, nil, nil, nil, nil, []*models.ProjectFilterInput{&filter}, nil, nil)
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
}
