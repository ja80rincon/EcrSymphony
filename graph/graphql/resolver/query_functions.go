// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"fmt"
	"net/url"
	"strings"
)

type PropFlags struct {
	DatabaseURL *url.URL
}

var GlobalPropFlags PropFlags = PropFlags{}

func CoalesceColumn(columnName, defaultValue interface{}, alias ...string) string {
	var aliasName string
	if len(alias) > 0 {
		aliasName = alias[0]
	} else {
		aliasName = ""
	}
	return coalesce(columnName, defaultValue, true, aliasName)
}

func CoalesceValue(value, defaultValue interface{}, alias ...string) string {
	var aliasName string
	if len(alias) > 0 {
		aliasName = alias[0]
	} else {
		aliasName = ""
	}
	return coalesce(value, defaultValue, false, aliasName)
}

func coalesce(value, defaultValue interface{}, column bool, alias string) string {
	dv := valueFromType(defaultValue)
	var v interface{}
	if column {
		v = value
	} else {
		v = valueFromType(value)
	}

	if len(alias) > 0 {
		return fmt.Sprintf("COALESCE(%v, %v) %s", v, dv, alias)
	}
	return fmt.Sprintf("COALESCE(%v, %v)", v, dv)
}

func valueFromType(value interface{}) interface{} {
	switch value.(type) {
	case string:
		return fmt.Sprintf("'%v'", value)
	case int:
		return value
	}
	return value
}

func Case(column string, options []interface{}, values []interface{}, alias ...string) string {
	var b strings.Builder
	fmt.Fprintf(&b, "CASE %s ", column)
	for index, option := range options {
		fmt.Fprintf(&b, " WHEN '%s' THEN %s ", option, values[index])
	}
	fmt.Fprintf(&b, " ELSE %s END ", values[len(values)-1])
	sqlCase := b.String()

	if len(alias) > 0 {
		return fmt.Sprintf("(%s) %s", sqlCase, alias[0])
	}
	return sqlCase
}

func ToDate(column string) string {
	return castToDate(column, "%Y-%m-%d")
}

func ToDateTime(column string) string {
	return castToDate(column, "%Y-%m-%dT%H:%i")
}

func castToDate(column, format string) string {
	return fmt.Sprintf("STR_TO_DATE(%s, '%s')", column, format)
}
