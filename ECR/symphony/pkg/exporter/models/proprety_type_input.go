// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package models

import (
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
)

type PropertyTypeInput struct {
	ID                 *int              `json:"id"`
	ExternalID         *string           `json:"externalId"`
	Name               string            `json:"name"`
	Type               propertytype.Type `json:"type"`
	NodeType           *string           `json:"nodeType"`
	Index              *int              `json:"index"`
	Category           *string           `json:"category"`
	StringValue        *string           `json:"stringValue"`
	IntValue           *int              `json:"intValue"`
	BooleanValue       *bool             `json:"booleanValue"`
	FloatValue         *float64          `json:"floatValue"`
	LatitudeValue      *float64          `json:"latitudeValue"`
	LongitudeValue     *float64          `json:"longitudeValue"`
	RangeFromValue     *float64          `json:"rangeFromValue"`
	RangeToValue       *float64          `json:"rangeToValue"`
	IsEditable         *bool             `json:"isEditable"`
	IsInstanceProperty *bool             `json:"isInstanceProperty"`
	IsMandatory        *bool             `json:"isMandatory"`
	IsDeleted          *bool             `json:"isDeleted"`
	PropertyCategoryID *int              `json:"propertyCategoryID"`
	IsListable         *bool             `json:"isListable"`
}
