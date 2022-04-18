// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package flowschema

import (
	"io"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
)

// ActionTypeID is the identifier of the action
type ActionTypeID string

const (
	ActionTypeWorkOrder       ActionTypeID = "work_order"
	ActionTypeUpdateInventory ActionTypeID = "update_inventory"
	ActionTypeUpdateWorkforce ActionTypeID = "update_workforce"
	ActionTypeWorker          ActionTypeID = "worker"
)

// Values returns action type id possible values.
func (ActionTypeID) Values() []string {
	return []string{
		ActionTypeWorkOrder.String(),
		ActionTypeUpdateInventory.String(),
		ActionTypeUpdateWorkforce.String(),
		ActionTypeWorker.String(),
	}
}

// String implements Getter interface.
func (a ActionTypeID) String() string {
	return string(a)
}

// Set sets the value stored in action type id.
func (a *ActionTypeID) Set(s string) {
	*a = ActionTypeID(s)
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (a *ActionTypeID) UnmarshalGQL(v interface{}) error {
	return enum.UnmarshalGQL(v, a)
}

// MarshalGQL implements graphql.Marshaler interface.
func (a ActionTypeID) MarshalGQL(w io.Writer) {
	_ = enum.MarshalGQL(w, a)
}
