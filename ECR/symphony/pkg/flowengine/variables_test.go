// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package flowengine_test

import (
	"context"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/flowengine"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestVariableName(t *testing.T) {
	def1 := &flowschema.VariableDefinition{
		Key: "Key",
	}
	require.Equal(t, "Key", def1.Name())
	def2 := &flowschema.VariableDefinition{
		Key:         "Key",
		VisibleName: pointer.ToString("Name"),
	}
	require.Equal(t, "Name", def2.Name())
}

func TestNestedVariableDefinitions(t *testing.T) {
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), c)

	definitions := []*flowschema.VariableDefinition{
		{
			Key:  "param1",
			Type: enum.VariableTypeString,
			NestedVariables: func(ctx context.Context, i []interface{}) ([]*flowschema.VariableDefinition, error) {
				if len(i) == 0 {
					return nil, nil
				}
				switch i[0].(string) {
				case "valueA":
					return []*flowschema.VariableDefinition{
						{
							Key:  "param2",
							Type: enum.VariableTypeInt,
						},
						{
							Key:   "param3",
							Type:  enum.VariableTypeWorkOrder,
							Usage: enum.VariableUsageOutput,
						},
					}, nil
				case "valueB":
					return []*flowschema.VariableDefinition{
						{
							Key:   "param4",
							Type:  enum.VariableTypeString,
							Usage: enum.VariableUsageOutput,
						},
						{
							Key:   "param5",
							Type:  enum.VariableTypeWorkOrderType,
							Usage: enum.VariableUsageInputAndOutput,
						},
					}, nil
				default:
					return nil, nil
				}
			},
		},
		{
			Key:   "param6",
			Type:  enum.VariableTypeString,
			Usage: enum.VariableUsageOutput,
		},
	}

	tests := []struct {
		name   string
		inputs []*flowschema.VariableExpression
		usages []enum.VariableUsage
		expect func([]*flowschema.VariableDefinition, error)
	}{
		{
			name:   "no_inputs_1",
			usages: []enum.VariableUsage{enum.VariableUsageInput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 1)
				require.Equal(t, "param1", definitions[0].Key)
			},
		},
		{
			name:   "no_inputs_2",
			usages: []enum.VariableUsage{enum.VariableUsageOutput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 1)
				require.Equal(t, "param6", definitions[0].Key)
			},
		},
		{
			name:   "no_inputs_3",
			usages: []enum.VariableUsage{enum.VariableUsageInputAndOutput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 0)
			},
		},
		{
			name: "input_not_exist",
			inputs: []*flowschema.VariableExpression{
				{
					VariableDefinitionKey: "param1",
					Expression:            "\"valueC\"",
				},
			},
			usages: []enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 1)
				require.Equal(t, "param1", definitions[0].Key)
			},
		},
		{
			name: "input_with_variables",
			inputs: []*flowschema.VariableExpression{
				{
					VariableDefinitionKey: "param1",
					Expression:            "\"${b_0}\"",
					BlockVariables: []*flowschema.BlockVariable{
						{
							BlockID:               13,
							VariableDefinitionKey: "other_param",
						},
					},
				},
			},
			usages: []enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 1)
			},
		},
		{
			name: "input_exist_1",
			inputs: []*flowschema.VariableExpression{
				{
					VariableDefinitionKey: "param1",
					Expression:            "valueA",
				},
			},
			usages: []enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 2)
				for _, definition := range definitions {
					switch definition.Key {
					case "param1", "param2":
					default:
						t.Fatalf("definition key unexpected: %s", definition.Key)
					}
				}
			},
		},
		{
			name: "input_exist_2",
			inputs: []*flowschema.VariableExpression{
				{
					VariableDefinitionKey: "param1",
					Expression:            "valueB",
				},
			},
			usages: []enum.VariableUsage{enum.VariableUsageInput, enum.VariableUsageInputAndOutput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 2)
				for _, definition := range definitions {
					switch definition.Key {
					case "param1", "param5":
					default:
						t.Fatalf("definition key unexpected: %s", definition.Key)
					}
				}
			},
		},
		{
			name: "input_exist_2",
			inputs: []*flowschema.VariableExpression{
				{
					VariableDefinitionKey: "param1",
					Expression:            "valueB",
				},
			},
			usages: []enum.VariableUsage{enum.VariableUsageOutput},
			expect: func(definitions []*flowschema.VariableDefinition, err error) {
				require.NoError(t, err)
				require.Len(t, definitions, 2)
				for _, definition := range definitions {
					switch definition.Key {
					case "param4", "param6":
					default:
						t.Fatalf("definition key unexpected: %s", definition.Key)
					}
				}
			},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			tc.expect(flowengine.FindAllNestedVariables(ctx, definitions, tc.inputs, tc.usages))
		})
	}
}
