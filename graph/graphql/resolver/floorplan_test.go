// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent/user"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestAddFloorPlan(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	imageInput := models.AddImageInput{
		EntityType:  "floor_plan",
		ImgKey:      "key1",
		FileName:    "test_file",
		FileSize:    100,
		Modified:    time.Time{},
		ContentType: "image",
		Category:    nil,
	}

	floorPlan, err := mr.AddFloorPlan(ctx, models.AddFloorPlanInput{
		Name:             "new floor plan",
		LocationID:       location.ID,
		Image:            &imageInput,
		ReferenceX:       1,
		ReferenceY:       2,
		Latitude:         3.0,
		Longitude:        4.0,
		ReferencePoint1x: 5,
		ReferencePoint1y: 6,
		ReferencePoint2x: 7,
		ReferencePoint2y: 8,
		ScaleInMeters:    9.0,
	})
	require.NoError(t, err)

	require.Equal(t, floorPlan.Name, "new floor plan")

	floorPlanLocation, err := floorPlan.QueryLocation().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, floorPlanLocation.ID, location.ID)

	image, err := floorPlan.QueryImage().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, image.StoreKey, imageInput.ImgKey)
	require.Equal(t, image.Name, imageInput.FileName)

	referencePoint, err := floorPlan.QueryReferencePoint().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, referencePoint.X, 1)
	require.Equal(t, referencePoint.Y, 2)
	require.Equal(t, referencePoint.Latitude, 3.0)
	require.Equal(t, referencePoint.Longitude, 4.0)

	scale, err := floorPlan.QueryScale().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, scale.ReferencePoint1X, 5)
	require.Equal(t, scale.ReferencePoint1Y, 6)
	require.Equal(t, scale.ReferencePoint2X, 7)
	require.Equal(t, scale.ReferencePoint2Y, 8)
	require.Equal(t, scale.ScaleInMeters, 9.0)
}

func TestRemoveFloorPlan(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	locationType, err := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "location_type_name_1",
	})
	require.NoError(t, err)

	location, err := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "location_name_1",
		Type: locationType.ID,
	})
	require.NoError(t, err)

	imageInput := models.AddImageInput{
		EntityType:  "floor_plan",
		ImgKey:      "key1",
		FileName:    "test_file",
		FileSize:    100,
		Modified:    time.Time{},
		ContentType: "image",
		Category:    nil,
	}

	floorPlan, err := mr.AddFloorPlan(ctx, models.AddFloorPlanInput{
		Name:             "new floor plan",
		LocationID:       location.ID,
		Image:            &imageInput,
		ReferenceX:       1,
		ReferenceY:       2,
		Latitude:         3.0,
		Longitude:        4.0,
		ReferencePoint1x: 5,
		ReferencePoint1y: 6,
		ReferencePoint2x: 7,
		ReferencePoint2y: 8,
		ScaleInMeters:    9.0,
	})
	require.NoError(t, err)

	floorPlanFromLocation, err := location.QueryFloorPlans().Only(ctx)
	require.NoError(t, err)
	require.Equal(t, floorPlanFromLocation.ID, floorPlan.ID)

	res, err := mr.DeleteFloorPlan(ctx, floorPlan.ID)
	require.NoError(t, err)
	require.True(t, res)
	floorPlansFromLocation, err := location.QueryFloorPlans().All(ctx)
	require.NoError(t, err)
	require.Empty(t, floorPlansFromLocation)

	_, err = mr.DeleteFloorPlan(ctx, floorPlan.ID)
	require.Error(t, err)
}
