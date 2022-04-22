// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package actions

import (
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

const InputVariableWorkerType = "Worker Template"

type workerAction struct{}

func (workerAction) ID() flowschema.ActionTypeID {
	return flowschema.ActionTypeWorker
}

func (workerAction) Description() string {
	return "This block will initiate a worker based on a template you'll choose"
}

func (workerAction) Variables() []*flowschema.VariableDefinition {
	return []*flowschema.VariableDefinition{
		{
			Key:       InputVariableWorkerType,
			Type:      enum.VariableTypeWorkerType,
			Mandatory: true,
		},
		{
			Key:  InputVariableTypeName,
			Type: enum.VariableTypeString,
		},
	}
}
