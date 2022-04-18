// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package flowschema

import (
	"io"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
)

// TriggerTypeID is the identifier of the trigger
type TriggerTypeID string

const (
	TriggerTypeWorkOrder TriggerTypeID = "work_order"
)

// Values returns trigger type id possible values.
func (TriggerTypeID) Values() []string {
	return []string{
		TriggerTypeWorkOrder.String(),
	}
}

// String implements Getter interface.
func (t TriggerTypeID) String() string {
	return string(t)
}

// Set sets the value stored in trigger type id.
func (t *TriggerTypeID) Set(s string) {
	*t = TriggerTypeID(s)
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (t *TriggerTypeID) UnmarshalGQL(v interface{}) error {
	return enum.UnmarshalGQL(v, t)
}

// MarshalGQL implements graphql.Marshaler interface.
func (t TriggerTypeID) MarshalGQL(w io.Writer) {
	_ = enum.MarshalGQL(w, t)
}
