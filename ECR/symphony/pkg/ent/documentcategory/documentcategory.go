// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package documentcategory

import (
	"time"

	"github.com/facebook/ent"
)

const (
	// Label holds the string label denoting the documentcategory type in the database.
	Label = "document_category"
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

	// EdgeLocationType holds the string denoting the location_type edge name in mutations.
	EdgeLocationType = "location_type"
	// EdgeFiles holds the string denoting the files edge name in mutations.
	EdgeFiles = "files"
	// EdgeHyperlinks holds the string denoting the hyperlinks edge name in mutations.
	EdgeHyperlinks = "hyperlinks"

	// Table holds the table name of the documentcategory in the database.
	Table = "document_categories"
	// LocationTypeTable is the table the holds the location_type relation/edge.
	LocationTypeTable = "document_categories"
	// LocationTypeInverseTable is the table name for the LocationType entity.
	// It exists in this package in order to avoid circular dependency with the "locationtype" package.
	LocationTypeInverseTable = "location_types"
	// LocationTypeColumn is the table column denoting the location_type relation/edge.
	LocationTypeColumn = "location_type_document_category"
	// FilesTable is the table the holds the files relation/edge.
	FilesTable = "files"
	// FilesInverseTable is the table name for the File entity.
	// It exists in this package in order to avoid circular dependency with the "file" package.
	FilesInverseTable = "files"
	// FilesColumn is the table column denoting the files relation/edge.
	FilesColumn = "document_category_files"
	// HyperlinksTable is the table the holds the hyperlinks relation/edge.
	HyperlinksTable = "hyperlinks"
	// HyperlinksInverseTable is the table name for the Hyperlink entity.
	// It exists in this package in order to avoid circular dependency with the "hyperlink" package.
	HyperlinksInverseTable = "hyperlinks"
	// HyperlinksColumn is the table column denoting the hyperlinks relation/edge.
	HyperlinksColumn = "document_category_hyperlinks"
)

// Columns holds all SQL columns for documentcategory fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldName,
	FieldIndex,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the DocumentCategory type.
var ForeignKeys = []string{
	"location_type_document_category",
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
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
	// NameValidator is a validator for the "name" field. It is called by the builders before save.
	NameValidator func(string) error
)
