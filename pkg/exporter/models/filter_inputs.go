// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package models

import (
	"time"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
)

type LocationFilterInput struct {
	FilterType    enum.LocationFilterType `json:"filterType"`
	Operator      enum.FilterOperator     `json:"operator"`
	BoolValue     *bool                   `json:"boolValue"`
	StringValue   *string                 `json:"stringValue"`
	PropertyValue *PropertyTypeInput      `json:"propertyValue"`
	IDSet         []int                   `json:"idSet"`
	StringSet     []string                `json:"stringSet"`
	MaxDepth      *int                    `json:"maxDepth"`
}

type EquipmentFilterInput struct {
	FilterType    enum.EquipmentFilterType `json:"filterType"`
	Operator      enum.FilterOperator      `json:"operator"`
	StringValue   *string                  `json:"stringValue"`
	PropertyValue *PropertyTypeInput       `json:"propertyValue"`
	IDSet         []int                    `json:"idSet"`
	StringSet     []string                 `json:"stringSet"`
	MaxDepth      *int                     `json:"maxDepth"`
}

type PortFilterInput struct {
	FilterType    enum.PortFilterType `json:"filterType"`
	Operator      enum.FilterOperator `json:"operator"`
	BoolValue     *bool               `json:"boolValue"`
	StringValue   *string             `json:"stringValue"`
	PropertyValue *PropertyTypeInput  `json:"propertyValue"`
	IDSet         []int               `json:"idSet"`
	StringSet     []string            `json:"stringSet"`
	MaxDepth      *int                `json:"maxDepth"`
}

type LinkFilterInput struct {
	FilterType    enum.LinkFilterType `json:"filterType"`
	Operator      enum.FilterOperator `json:"operator"`
	StringValue   *string             `json:"stringValue"`
	PropertyValue *PropertyTypeInput  `json:"propertyValue"`
	IDSet         []int               `json:"idSet"`
	StringSet     []string            `json:"stringSet"`
	MaxDepth      *int                `json:"maxDepth"`
}

type ServiceFilterInput struct {
	FilterType    enum.ServiceFilterType `json:"filterType"`
	Operator      enum.FilterOperator    `json:"operator"`
	StringValue   *string                `json:"stringValue"`
	PropertyValue *PropertyTypeInput     `json:"propertyValue"`
	IDSet         []int                  `json:"idSet"`
	StringSet     []string               `json:"stringSet"`
	MaxDepth      *int                   `json:"maxDepth"`
}

type WorkOrderFilterInput struct {
	FilterType    enum.WorkOrderFilterType `json:"filterType"`
	Operator      enum.FilterOperator      `json:"operator"`
	StringValue   *string                  `json:"stringValue"`
	IDSet         []int                    `json:"idSet"`
	StringSet     []string                 `json:"stringSet"`
	PropertyValue *PropertyTypeInput       `json:"propertyValue"`
	TimeValue     *time.Time               `json:"timeValue"`
	MaxDepth      *int                     `json:"maxDepth"`
}

type ProjectFilterInput struct {
	FilterType    enum.ProjectFilterType `json:"filterType"`
	Operator      enum.FilterOperator    `json:"operator"`
	StringValue   *string                `json:"stringValue"`
	IDSet         []int                  `json:"idSet"`
	StringSet     []string               `json:"stringSet"`
	PropertyValue *PropertyTypeInput     `json:"propertyValue"`
	TimeValue     *time.Time             `json:"timeValue"`
	MaxDepth      *int                   `json:"maxDepth"`
}

type PropertiesByCategoryFilterInput struct {
	FilterType  enum.PropertiesByCategoryFilterType `json:"filterType"`
	Operator    enum.FilterOperator                 `json:"operator"`
	StringValue *string                             `json:"stringValue"`
	IntValue    *int                                `json:"intValue"`
	IDSet       []int                               `json:"idSet"`
	StringSet   []string                            `json:"stringSet"`
}
