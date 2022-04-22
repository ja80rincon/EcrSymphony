// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package actions

import (
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

type updateWorkforceAction struct{}

func (updateWorkforceAction) ID() flowschema.ActionTypeID {
	return flowschema.ActionTypeUpdateWorkforce
}

func (updateWorkforceAction) Description() string {
	return "This block will update the workforce"
}

func (updateWorkforceAction) Variables() []*flowschema.VariableDefinition {
	return []*flowschema.VariableDefinition{}
}
