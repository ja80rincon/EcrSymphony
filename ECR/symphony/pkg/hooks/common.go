// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent"
)

type PropertyTypeParent string

const (
	PropertyTypeParentWorkOrder PropertyTypeParent = "WORK_ORDER"
	PropertyTypeParentProject   PropertyTypeParent = "PROJECT"
)

func createTemplatePropertyType(
	ctx context.Context,
	client *ent.Client,
	pt *ent.PropertyType,
	id int,
	entity PropertyTypeParent,
) (*ent.PropertyType, error) {
	mutation := client.PropertyType.Create().
		SetName(pt.Name).
		SetType(pt.Type).
		SetNodeType(pt.NodeType).
		SetIndex(pt.Index).
		SetCategory(pt.Category).
		SetNillableStringVal(pt.StringVal).
		SetNillableIntVal(pt.IntVal).
		SetNillableBoolVal(pt.BoolVal).
		SetNillableFloatVal(pt.FloatVal).
		SetNillableLatitudeVal(pt.LatitudeVal).
		SetNillableLongitudeVal(pt.LongitudeVal).
		SetIsInstanceProperty(pt.IsInstanceProperty).
		SetNillableRangeFromVal(pt.RangeFromVal).
		SetNillableRangeToVal(pt.RangeToVal).
		SetEditable(pt.Editable).
		SetMandatory(pt.Mandatory).
		SetDeleted(pt.Deleted)
	switch entity {
	case PropertyTypeParentWorkOrder:
		mutation = mutation.SetWorkOrderTemplateID(id)
	case PropertyTypeParentProject:
		mutation = mutation.SetProjectTemplateID(id)
	}
	result, err := mutation.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("creating property type: %w", err)
	}
	return result, nil
}
