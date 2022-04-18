// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package flowschema

import (
	"io"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
)

// ExitPointRole is the role of exit point in block
type ExitPointRole string

const (
	ExitPointRoleDefault  ExitPointRole = "DEFAULT"
	ExitPointRoleDecision ExitPointRole = "DECISION"
	ExitPointRoleTrue     ExitPointRole = "TRUE"
	ExitPointRoleFalse    ExitPointRole = "FALSE"
)

// Values returns exit point role possible values.
func (ExitPointRole) Values() []string {
	return []string{
		ExitPointRoleDefault.String(),
		ExitPointRoleDecision.String(),
		ExitPointRoleTrue.String(),
		ExitPointRoleFalse.String(),
	}
}

// String implements Getter interface.
func (epr ExitPointRole) String() string {
	return string(epr)
}

// Set sets the value stored in exit point role.
func (epr *ExitPointRole) Set(s string) {
	*epr = ExitPointRole(s)
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (epr *ExitPointRole) UnmarshalGQL(v interface{}) error {
	return enum.UnmarshalGQL(v, epr)
}

// MarshalGQL implements graphql.Marshaler interface.
func (epr ExitPointRole) MarshalGQL(w io.Writer) {
	_ = enum.MarshalGQL(w, epr)
}

// EntryPointRole is the role of entry point in block
type EntryPointRole string

const (
	EntryPointRoleDefault EntryPointRole = "DEFAULT"
)

// Values returns entry point role possible values.
func (EntryPointRole) Values() []string {
	return []string{
		EntryPointRoleDefault.String(),
	}
}

// String implements Getter interface.
func (epr EntryPointRole) String() string {
	return string(epr)
}

// Set sets the value stored in entry point role.
func (epr *EntryPointRole) Set(s string) {
	*epr = EntryPointRole(s)
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (epr *EntryPointRole) UnmarshalGQL(v interface{}) error {
	return enum.UnmarshalGQL(v, epr)
}

// MarshalGQL implements graphql.Marshaler interface.
func (epr EntryPointRole) MarshalGQL(w io.Writer) {
	_ = enum.MarshalGQL(w, epr)
}
