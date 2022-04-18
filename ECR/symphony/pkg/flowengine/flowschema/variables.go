// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package flowschema

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
)

// VariableDefinition is a definition of a variable that can be delivered via a client (for start\end blocks) or via internal action\trigger definition.
type VariableDefinition struct {
	// Key is the identifier of the definition and is used to reference it. Most of the time it is also the name of the definition
	Key string
	// VisibleName is needed when Key is not readable or we wish to have another more friendly name to present
	VisibleName     *string
	Type            enum.VariableType
	Mandatory       bool
	Usage           enum.VariableUsage
	MultipleValues  bool
	Choices         []string
	DefaultValue    *string
	NestedVariables func(context.Context, []interface{}) ([]*VariableDefinition, error) `json:"-"`
}

func (v VariableDefinition) Name() string {
	if v.VisibleName != nil {
		return *v.VisibleName
	}
	return v.Key
}

// BlockVariable is used to define variable inside expression that references previous block in the flow
type BlockVariable struct {
	BlockID                   int
	Type                      enum.VariableExpressionType
	VariableDefinitionKey     string
	PropertyTypeID            int
	CheckListItemDefinitionID int
}

// VariableExpression is a an expression inside block that correlates to variable definition
type VariableExpression struct {
	BlockID               int
	Type                  enum.VariableExpressionType
	VariableDefinitionKey string
	PropertyTypeID        int
	Expression            string
	BlockVariables        []*BlockVariable
}

// VariableValue is the variable value (with no variables)
type VariableValue struct {
	VariableDefinitionKey string
	Value                 string
}
