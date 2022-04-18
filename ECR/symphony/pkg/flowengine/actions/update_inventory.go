// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package actions

import (
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

type updateInventoryAction struct{}

func (updateInventoryAction) ID() flowschema.ActionTypeID {
	return flowschema.ActionTypeUpdateInventory
}

func (updateInventoryAction) Description() string {
	return "This block will update the inventory"
}

func (updateInventoryAction) Variables() []*flowschema.VariableDefinition {
	return []*flowschema.VariableDefinition{}
}
