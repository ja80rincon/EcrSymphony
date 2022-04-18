// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package triggers

import (
	"fmt"

	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

var triggers = []TriggerType{
	workforceTrigger{},
}

// TriggerType is an interface for the configuration and execution of trigger block in flow
type TriggerType interface {
	ID() flowschema.TriggerTypeID
	Description() string
	Variables() []*flowschema.VariableDefinition
}

// Factory is that returns trigger type based on name requested
type Factory interface {
	GetType(id flowschema.TriggerTypeID) (TriggerType, error)
}

// FactoryFunc is an adapter to allow the use of
// ordinary functions as factories.
type FactoryFunc func(id flowschema.TriggerTypeID) (TriggerType, error)

// GetType returns f(name).
func (f FactoryFunc) GetType(id flowschema.TriggerTypeID) (TriggerType, error) {
	return f(id)
}

// NewFactory returns the standard package factory
func NewFactory() Factory {
	return FactoryFunc(func(id flowschema.TriggerTypeID) (TriggerType, error) {
		for _, trigger := range triggers {
			if trigger.ID() == id {
				return trigger, nil
			}
		}
		return nil, fmt.Errorf("trigger type %v not found", id)
	})
}
