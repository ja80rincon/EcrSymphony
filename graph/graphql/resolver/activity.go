// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"strconv"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/activity"
)

type activityResolver struct{}

func getNode(ctx context.Context, field activity.ActivityType, val string) (ent.Noder, error) {
	if val == "" {
		return nil, nil
	}
	switch field {
	case activity.ActivityTypeAssigneeChanged:
		fallthrough
	case activity.ActivityTypeOwnerChanged:
		client := ent.FromContext(ctx)
		intID, err := strconv.Atoi(val)
		if err != nil {
			return nil, err
		}
		return client.Noder(ctx, intID)
	}
	return nil, nil
}

func (a activityResolver) NewRelatedNode(ctx context.Context, obj *ent.Activity) (ent.Noder, error) {
	return getNode(ctx, obj.ActivityType, obj.NewValue)
}

func (a activityResolver) OldRelatedNode(ctx context.Context, obj *ent.Activity) (ent.Noder, error) {
	return getNode(ctx, obj.ActivityType, obj.OldValue)
}
