// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package kqi

import (
	"time"

	"github.com/facebook/ent"
)

const (
	// Label holds the string label denoting the kqi type in the database.
	Label = "kqi"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreateTime holds the string denoting the create_time field in the database.
	FieldCreateTime = "create_time"
	// FieldUpdateTime holds the string denoting the update_time field in the database.
	FieldUpdateTime = "update_time"
	// FieldName holds the string denoting the name field in the database.
	FieldName = "name"
	// FieldDescription holds the string denoting the description field in the database.
	FieldDescription = "description"
	// FieldStartDateTime holds the string denoting the startdatetime field in the database.
	FieldStartDateTime = "start_date_time"
	// FieldEndDateTime holds the string denoting the enddatetime field in the database.
	FieldEndDateTime = "end_date_time"
	// FieldFormula holds the string denoting the formula field in the database.
	FieldFormula = "formula"

	// EdgeKqiCategoryFk holds the string denoting the kqicategoryfk edge name in mutations.
	EdgeKqiCategoryFk = "kqiCategoryFk"
	// EdgeKqiPerspectiveFk holds the string denoting the kqiperspectivefk edge name in mutations.
	EdgeKqiPerspectiveFk = "kqiPerspectiveFk"
	// EdgeKqiSourceFk holds the string denoting the kqisourcefk edge name in mutations.
	EdgeKqiSourceFk = "kqiSourceFk"
	// EdgeKqiTemporalFrequencyFk holds the string denoting the kqitemporalfrequencyfk edge name in mutations.
	EdgeKqiTemporalFrequencyFk = "kqiTemporalFrequencyFk"
	// EdgeKqiTargetFk holds the string denoting the kqitargetfk edge name in mutations.
	EdgeKqiTargetFk = "kqiTargetFk"

	// Table holds the table name of the kqi in the database.
	Table = "kqis"
	// KqiCategoryFkTable is the table the holds the kqiCategoryFk relation/edge.
	KqiCategoryFkTable = "kqis"
	// KqiCategoryFkInverseTable is the table name for the KqiCategory entity.
	// It exists in this package in order to avoid circular dependency with the "kqicategory" package.
	KqiCategoryFkInverseTable = "kqi_categories"
	// KqiCategoryFkColumn is the table column denoting the kqiCategoryFk relation/edge.
	KqiCategoryFkColumn = "kqi_category_kqi_category_fk"
	// KqiPerspectiveFkTable is the table the holds the kqiPerspectiveFk relation/edge.
	KqiPerspectiveFkTable = "kqis"
	// KqiPerspectiveFkInverseTable is the table name for the KqiPerspective entity.
	// It exists in this package in order to avoid circular dependency with the "kqiperspective" package.
	KqiPerspectiveFkInverseTable = "kqi_perspectives"
	// KqiPerspectiveFkColumn is the table column denoting the kqiPerspectiveFk relation/edge.
	KqiPerspectiveFkColumn = "kqi_perspective_kqi_perspective_fk"
	// KqiSourceFkTable is the table the holds the kqiSourceFk relation/edge.
	KqiSourceFkTable = "kqis"
	// KqiSourceFkInverseTable is the table name for the KqiSource entity.
	// It exists in this package in order to avoid circular dependency with the "kqisource" package.
	KqiSourceFkInverseTable = "kqi_sources"
	// KqiSourceFkColumn is the table column denoting the kqiSourceFk relation/edge.
	KqiSourceFkColumn = "kqi_source_kqi_source_fk"
	// KqiTemporalFrequencyFkTable is the table the holds the kqiTemporalFrequencyFk relation/edge.
	KqiTemporalFrequencyFkTable = "kqis"
	// KqiTemporalFrequencyFkInverseTable is the table name for the KqiTemporalFrequency entity.
	// It exists in this package in order to avoid circular dependency with the "kqitemporalfrequency" package.
	KqiTemporalFrequencyFkInverseTable = "kqi_temporal_frequencies"
	// KqiTemporalFrequencyFkColumn is the table column denoting the kqiTemporalFrequencyFk relation/edge.
	KqiTemporalFrequencyFkColumn = "kqi_temporal_frequency_kqi_temporal_frequency_fk"
	// KqiTargetFkTable is the table the holds the kqiTargetFk relation/edge.
	KqiTargetFkTable = "kqi_targets"
	// KqiTargetFkInverseTable is the table name for the KqiTarget entity.
	// It exists in this package in order to avoid circular dependency with the "kqitarget" package.
	KqiTargetFkInverseTable = "kqi_targets"
	// KqiTargetFkColumn is the table column denoting the kqiTargetFk relation/edge.
	KqiTargetFkColumn = "kqi_kqi_target_fk"
)

// Columns holds all SQL columns for kqi fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldName,
	FieldDescription,
	FieldStartDateTime,
	FieldEndDateTime,
	FieldFormula,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the Kqi type.
var ForeignKeys = []string{
	"kqi_category_kqi_category_fk",
	"kqi_perspective_kqi_perspective_fk",
	"kqi_source_kqi_source_fk",
	"kqi_temporal_frequency_kqi_temporal_frequency_fk",
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
