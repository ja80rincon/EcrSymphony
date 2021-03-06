// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package parametercatalog

import (
	"time"

	"github.com/facebook/ent"
)

const (
	// Label holds the string label denoting the parametercatalog type in the database.
	Label = "parameter_catalog"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreateTime holds the string denoting the create_time field in the database.
	FieldCreateTime = "create_time"
	// FieldUpdateTime holds the string denoting the update_time field in the database.
	FieldUpdateTime = "update_time"
	// FieldName holds the string denoting the name field in the database.
	FieldName = "name"
	// FieldIndex holds the string denoting the index field in the database.
	FieldIndex = "index"
	// FieldDisabled holds the string denoting the disabled field in the database.
	FieldDisabled = "disabled"

	// EdgePropertyCategories holds the string denoting the property_categories edge name in mutations.
	EdgePropertyCategories = "property_categories"

	// Table holds the table name of the parametercatalog in the database.
	Table = "parameter_catalogs"
	// PropertyCategoriesTable is the table the holds the property_categories relation/edge.
	PropertyCategoriesTable = "property_categories"
	// PropertyCategoriesInverseTable is the table name for the PropertyCategory entity.
	// It exists in this package in order to avoid circular dependency with the "propertycategory" package.
	PropertyCategoriesInverseTable = "property_categories"
	// PropertyCategoriesColumn is the table column denoting the property_categories relation/edge.
	PropertyCategoriesColumn = "parameter_catalog_property_categories"
)

// Columns holds all SQL columns for parametercatalog fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldName,
	FieldIndex,
	FieldDisabled,
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	return false
}

// Note that the variables below are initialized by the runtime
// package on the initialization of the application. Therefore,
// it should be imported in the main as follows:
//
//	import _ "github.com/facebookincubator/symphony/pkg/ent/runtime"
//
var (
	Hooks  [1]ent.Hook
	Policy ent.Policy
	// DefaultCreateTime holds the default value on creation for the create_time field.
	DefaultCreateTime func() time.Time
	// DefaultUpdateTime holds the default value on creation for the update_time field.
	DefaultUpdateTime func() time.Time
	// UpdateDefaultUpdateTime holds the default value on update for the update_time field.
	UpdateDefaultUpdateTime func() time.Time
	// DefaultIndex holds the default value on creation for the index field.
	DefaultIndex int
	// DefaultDisabled holds the default value on creation for the disabled field.
	DefaultDisabled bool
)
