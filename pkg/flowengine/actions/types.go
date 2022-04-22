// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package actions

import (
	"fmt"

	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

var actions = []ActionType{
	workOrderAction{},
	updateInventoryAction{},
	updateWorkforceAction{},
	workerAction{},
}

// ActionType is an interface for the configuration and execution of action block in flow
type ActionType interface {
	ID() flowschema.ActionTypeID
	Description() string
	Variables() []*flowschema.VariableDefinition
}

// Factory returns action type based on name requested
type Factory interface {
	GetType(id flowschema.ActionTypeID) (ActionType, error)
}

// FactoryFunc is an adapter to allow the use of
// ordinary functions as factories.
type FactoryFunc func(id flowschema.ActionTypeID) (ActionType, error)

// GetType returns f(name).
func (f FactoryFunc) GetType(id flowschema.ActionTypeID) (ActionType, error) {
	return f(id)
}

// NewFactory returns the standard package factory
func NewFactory() Factory {
	return FactoryFunc(func(id flowschema.ActionTypeID) (ActionType, error) {
		for _, action := range actions {
			if action.ID() == id {
				return action, nil
			}
		}
		return nil, fmt.Errorf("action type %v not found", id)
	})
}
