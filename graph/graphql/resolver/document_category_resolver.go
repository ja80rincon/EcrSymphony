// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/file"
	"github.com/facebookincubator/symphony/pkg/ent/hyperlink"
	"github.com/facebookincubator/symphony/pkg/ent/location"
)

type documentCategoryResolver struct{}

func (d documentCategoryResolver) NumberOfDocuments(ctx context.Context, obj *ent.DocumentCategory) (int, error) {
	filesCount, err := obj.QueryFiles().Count(ctx)
	if err != nil {
		return -1, err
	}
	hyperlinksCount, err := obj.QueryHyperlinks().Count(ctx)
	if err != nil {
		return -1, err
	}
	return filesCount + hyperlinksCount, nil
}

func (d documentCategoryResolver) FilesByEntity(ctx context.Context, obj *ent.DocumentCategory, entity models.ImageEntity, entityID *int) ([]*ent.File, error) {
	switch entity {
	case models.ImageEntityLocation:
		return obj.QueryFiles().Where(file.HasLocationWith(location.ID(*entityID))).All(ctx)
	case models.ImageEntityEquipment:
		return obj.QueryFiles().Where(file.HasEquipmentWith(equipment.ID(*entityID))).All(ctx)
	default:
		return nil, fmt.Errorf("not support entity type: %s", entity)
	}
}

func (d documentCategoryResolver) HyperlinksByEntity(ctx context.Context, obj *ent.DocumentCategory, entity models.ImageEntity, entityID *int) ([]*ent.Hyperlink, error) {
	switch entity {
	case models.ImageEntityLocation:
		return obj.QueryHyperlinks().Where(hyperlink.HasLocationWith(location.ID(*entityID))).All(ctx)
	case models.ImageEntityEquipment:
		return obj.QueryHyperlinks().Where(hyperlink.HasEquipmentWith(equipment.ID(*entityID))).All(ctx)
	default:
		return nil, fmt.Errorf("not support entity type: %s", entity)
	}
}
