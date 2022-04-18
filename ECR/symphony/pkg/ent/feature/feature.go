// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package feature

import (
	"time"

	"github.com/facebook/ent"
)

const (
	// Label holds the string label denoting the feature type in the database.
	Label = "feature"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreateTime holds the string denoting the create_time field in the database.
	FieldCreateTime = "create_time"
	// FieldUpdateTime holds the string denoting the update_time field in the database.
	FieldUpdateTime = "update_time"
	// FieldName holds the string denoting the name field in the database.
	FieldName = "name"
	// FieldGlobal holds the string denoting the global field in the database.
	FieldGlobal = "global"
	// FieldEnabled holds the string denoting the enabled field in the database.
	FieldEnabled = "enabled"
	// FieldDescription holds the string denoting the description field in the database.
	FieldDescription = "description"

	// EdgeUsers holds the string denoting the users edge name in mutations.
	EdgeUsers = "users"
	// EdgeGroups holds the string denoting the groups edge name in mutations.
	EdgeGroups = "groups"

	// Table holds the table name of the feature in the database.
	Table = "features"
	// UsersTable is the table the holds the users relation/edge. The primary key declared below.
	UsersTable = "user_features"
	// UsersInverseTable is the table name for the User entity.
	// It exists in this package in order to avoid circular dependency with the "user" package.
	UsersInverseTable = "users"
	// GroupsTable is the table the holds the groups relation/edge. The primary key declared below.
	GroupsTable = "users_group_features"
	// GroupsInverseTable is the table name for the UsersGroup entity.
	// It exists in this package in order to avoid circular dependency with the "usersgroup" package.
	GroupsInverseTable = "users_groups"
)

// Columns holds all SQL columns for feature fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldName,
	FieldGlobal,
	FieldEnabled,
	FieldDescription,
}

var (
	// UsersPrimaryKey and UsersColumn2 are the table columns denoting the
	// primary key for the users relation (M2M).
	UsersPrimaryKey = []string{"user_id", "feature_id"}
	// GroupsPrimaryKey and GroupsColumn2 are the table columns denoting the
	// primary key for the groups relation (M2M).
	GroupsPrimaryKey = []string{"users_group_id", "feature_id"}
)

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
	// NameValidator is a validator for the "name" field. It is called by the builders before save.
	NameValidator func(string) error
	// DefaultGlobal holds the default value on creation for the global field.
	DefaultGlobal bool
	// DefaultEnabled holds the default value on creation for the enabled field.
	DefaultEnabled bool
)
