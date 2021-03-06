// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package counterformula

import (
	"time"

	"github.com/facebook/ent"
)

const (
	// Label holds the string label denoting the counterformula type in the database.
	Label = "counter_formula"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreateTime holds the string denoting the create_time field in the database.
	FieldCreateTime = "create_time"
	// FieldUpdateTime holds the string denoting the update_time field in the database.
	FieldUpdateTime = "update_time"
	// FieldMandatory holds the string denoting the mandatory field in the database.
	FieldMandatory = "mandatory"

	// EdgeFormula holds the string denoting the formula edge name in mutations.
	EdgeFormula = "formula"
	// EdgeCounter holds the string denoting the counter edge name in mutations.
	EdgeCounter = "counter"

	// Table holds the table name of the counterformula in the database.
	Table = "counter_formulas"
	// FormulaTable is the table the holds the formula relation/edge.
	FormulaTable = "counter_formulas"
	// FormulaInverseTable is the table name for the Formula entity.
	// It exists in this package in order to avoid circular dependency with the "formula" package.
	FormulaInverseTable = "formulas"
	// FormulaColumn is the table column denoting the formula relation/edge.
	FormulaColumn = "formula_counterformula"
	// CounterTable is the table the holds the counter relation/edge.
	CounterTable = "counter_formulas"
	// CounterInverseTable is the table name for the Counter entity.
	// It exists in this package in order to avoid circular dependency with the "counter" package.
	CounterInverseTable = "counters"
	// CounterColumn is the table column denoting the counter relation/edge.
	CounterColumn = "counter_counter_fk"
)

// Columns holds all SQL columns for counterformula fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldMandatory,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the CounterFormula type.
var ForeignKeys = []string{
	"counter_counter_fk",
	"formula_counterformula",
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
)
