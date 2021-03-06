// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"github.com/facebook/ent/dialect/sql"
	"github.com/facebook/ent/dialect/sql/sqlgraph"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/flow"
	"github.com/facebookincubator/symphony/pkg/ent/flowdraft"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
)

// FlowDraftUpdate is the builder for updating FlowDraft entities.
type FlowDraftUpdate struct {
	config
	hooks    []Hook
	mutation *FlowDraftMutation
}

// Where adds a new predicate for the builder.
func (fdu *FlowDraftUpdate) Where(ps ...predicate.FlowDraft) *FlowDraftUpdate {
	fdu.mutation.predicates = append(fdu.mutation.predicates, ps...)
	return fdu
}

// SetName sets the name field.
func (fdu *FlowDraftUpdate) SetName(s string) *FlowDraftUpdate {
	fdu.mutation.SetName(s)
	return fdu
}

// SetDescription sets the description field.
func (fdu *FlowDraftUpdate) SetDescription(s string) *FlowDraftUpdate {
	fdu.mutation.SetDescription(s)
	return fdu
}

// SetNillableDescription sets the description field if the given value is not nil.
func (fdu *FlowDraftUpdate) SetNillableDescription(s *string) *FlowDraftUpdate {
	if s != nil {
		fdu.SetDescription(*s)
	}
	return fdu
}

// ClearDescription clears the value of description.
func (fdu *FlowDraftUpdate) ClearDescription() *FlowDraftUpdate {
	fdu.mutation.ClearDescription()
	return fdu
}

// SetEndParamDefinitions sets the end_param_definitions field.
func (fdu *FlowDraftUpdate) SetEndParamDefinitions(fd []*flowschema.VariableDefinition) *FlowDraftUpdate {
	fdu.mutation.SetEndParamDefinitions(fd)
	return fdu
}

// ClearEndParamDefinitions clears the value of end_param_definitions.
func (fdu *FlowDraftUpdate) ClearEndParamDefinitions() *FlowDraftUpdate {
	fdu.mutation.ClearEndParamDefinitions()
	return fdu
}

// SetSameAsFlow sets the sameAsFlow field.
func (fdu *FlowDraftUpdate) SetSameAsFlow(b bool) *FlowDraftUpdate {
	fdu.mutation.SetSameAsFlow(b)
	return fdu
}

// SetNillableSameAsFlow sets the sameAsFlow field if the given value is not nil.
func (fdu *FlowDraftUpdate) SetNillableSameAsFlow(b *bool) *FlowDraftUpdate {
	if b != nil {
		fdu.SetSameAsFlow(*b)
	}
	return fdu
}

// AddBlockIDs adds the blocks edge to Block by ids.
func (fdu *FlowDraftUpdate) AddBlockIDs(ids ...int) *FlowDraftUpdate {
	fdu.mutation.AddBlockIDs(ids...)
	return fdu
}

// AddBlocks adds the blocks edges to Block.
func (fdu *FlowDraftUpdate) AddBlocks(b ...*Block) *FlowDraftUpdate {
	ids := make([]int, len(b))
	for i := range b {
		ids[i] = b[i].ID
	}
	return fdu.AddBlockIDs(ids...)
}

// SetFlowID sets the flow edge to Flow by id.
func (fdu *FlowDraftUpdate) SetFlowID(id int) *FlowDraftUpdate {
	fdu.mutation.SetFlowID(id)
	return fdu
}

// SetFlow sets the flow edge to Flow.
func (fdu *FlowDraftUpdate) SetFlow(f *Flow) *FlowDraftUpdate {
	return fdu.SetFlowID(f.ID)
}

// Mutation returns the FlowDraftMutation object of the builder.
func (fdu *FlowDraftUpdate) Mutation() *FlowDraftMutation {
	return fdu.mutation
}

// ClearBlocks clears all "blocks" edges to type Block.
func (fdu *FlowDraftUpdate) ClearBlocks() *FlowDraftUpdate {
	fdu.mutation.ClearBlocks()
	return fdu
}

// RemoveBlockIDs removes the blocks edge to Block by ids.
func (fdu *FlowDraftUpdate) RemoveBlockIDs(ids ...int) *FlowDraftUpdate {
	fdu.mutation.RemoveBlockIDs(ids...)
	return fdu
}

// RemoveBlocks removes blocks edges to Block.
func (fdu *FlowDraftUpdate) RemoveBlocks(b ...*Block) *FlowDraftUpdate {
	ids := make([]int, len(b))
	for i := range b {
		ids[i] = b[i].ID
	}
	return fdu.RemoveBlockIDs(ids...)
}

// ClearFlow clears the "flow" edge to type Flow.
func (fdu *FlowDraftUpdate) ClearFlow() *FlowDraftUpdate {
	fdu.mutation.ClearFlow()
	return fdu
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (fdu *FlowDraftUpdate) Save(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	fdu.defaults()
	if len(fdu.hooks) == 0 {
		if err = fdu.check(); err != nil {
			return 0, err
		}
		affected, err = fdu.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*FlowDraftMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = fdu.check(); err != nil {
				return 0, err
			}
			fdu.mutation = mutation
			affected, err = fdu.sqlSave(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(fdu.hooks) - 1; i >= 0; i-- {
			mut = fdu.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, fdu.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// SaveX is like Save, but panics if an error occurs.
func (fdu *FlowDraftUpdate) SaveX(ctx context.Context) int {
	affected, err := fdu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (fdu *FlowDraftUpdate) Exec(ctx context.Context) error {
	_, err := fdu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (fdu *FlowDraftUpdate) ExecX(ctx context.Context) {
	if err := fdu.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (fdu *FlowDraftUpdate) defaults() {
	if _, ok := fdu.mutation.UpdateTime(); !ok {
		v := flowdraft.UpdateDefaultUpdateTime()
		fdu.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (fdu *FlowDraftUpdate) check() error {
	if v, ok := fdu.mutation.Name(); ok {
		if err := flowdraft.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	if _, ok := fdu.mutation.FlowID(); fdu.mutation.FlowCleared() && !ok {
		return errors.New("ent: clearing a required unique edge \"flow\"")
	}
	return nil
}

func (fdu *FlowDraftUpdate) sqlSave(ctx context.Context) (n int, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   flowdraft.Table,
			Columns: flowdraft.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: flowdraft.FieldID,
			},
		},
	}
	if ps := fdu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := fdu.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: flowdraft.FieldUpdateTime,
		})
	}
	if value, ok := fdu.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: flowdraft.FieldName,
		})
	}
	if value, ok := fdu.mutation.Description(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: flowdraft.FieldDescription,
		})
	}
	if fdu.mutation.DescriptionCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Column: flowdraft.FieldDescription,
		})
	}
	if value, ok := fdu.mutation.EndParamDefinitions(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeJSON,
			Value:  value,
			Column: flowdraft.FieldEndParamDefinitions,
		})
	}
	if fdu.mutation.EndParamDefinitionsCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeJSON,
			Column: flowdraft.FieldEndParamDefinitions,
		})
	}
	if value, ok := fdu.mutation.SameAsFlow(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeBool,
			Value:  value,
			Column: flowdraft.FieldSameAsFlow,
		})
	}
	if fdu.mutation.BlocksCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   flowdraft.BlocksTable,
			Columns: []string{flowdraft.BlocksColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: block.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := fdu.mutation.RemovedBlocksIDs(); len(nodes) > 0 && !fdu.mutation.BlocksCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   flowdraft.BlocksTable,
			Columns: []string{flowdraft.BlocksColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: block.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := fdu.mutation.BlocksIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   flowdraft.BlocksTable,
			Columns: []string{flowdraft.BlocksColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: block.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if fdu.mutation.FlowCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   flowdraft.FlowTable,
			Columns: []string{flowdraft.FlowColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: flow.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := fdu.mutation.FlowIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   flowdraft.FlowTable,
			Columns: []string{flowdraft.FlowColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: flow.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, fdu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{flowdraft.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return 0, err
	}
	return n, nil
}

// FlowDraftUpdateOne is the builder for updating a single FlowDraft entity.
type FlowDraftUpdateOne struct {
	config
	hooks    []Hook
	mutation *FlowDraftMutation
}

// SetName sets the name field.
func (fduo *FlowDraftUpdateOne) SetName(s string) *FlowDraftUpdateOne {
	fduo.mutation.SetName(s)
	return fduo
}

// SetDescription sets the description field.
func (fduo *FlowDraftUpdateOne) SetDescription(s string) *FlowDraftUpdateOne {
	fduo.mutation.SetDescription(s)
	return fduo
}

// SetNillableDescription sets the description field if the given value is not nil.
func (fduo *FlowDraftUpdateOne) SetNillableDescription(s *string) *FlowDraftUpdateOne {
	if s != nil {
		fduo.SetDescription(*s)
	}
	return fduo
}

// ClearDescription clears the value of description.
func (fduo *FlowDraftUpdateOne) ClearDescription() *FlowDraftUpdateOne {
	fduo.mutation.ClearDescription()
	return fduo
}

// SetEndParamDefinitions sets the end_param_definitions field.
func (fduo *FlowDraftUpdateOne) SetEndParamDefinitions(fd []*flowschema.VariableDefinition) *FlowDraftUpdateOne {
	fduo.mutation.SetEndParamDefinitions(fd)
	return fduo
}

// ClearEndParamDefinitions clears the value of end_param_definitions.
func (fduo *FlowDraftUpdateOne) ClearEndParamDefinitions() *FlowDraftUpdateOne {
	fduo.mutation.ClearEndParamDefinitions()
	return fduo
}

// SetSameAsFlow sets the sameAsFlow field.
func (fduo *FlowDraftUpdateOne) SetSameAsFlow(b bool) *FlowDraftUpdateOne {
	fduo.mutation.SetSameAsFlow(b)
	return fduo
}

// SetNillableSameAsFlow sets the sameAsFlow field if the given value is not nil.
func (fduo *FlowDraftUpdateOne) SetNillableSameAsFlow(b *bool) *FlowDraftUpdateOne {
	if b != nil {
		fduo.SetSameAsFlow(*b)
	}
	return fduo
}

// AddBlockIDs adds the blocks edge to Block by ids.
func (fduo *FlowDraftUpdateOne) AddBlockIDs(ids ...int) *FlowDraftUpdateOne {
	fduo.mutation.AddBlockIDs(ids...)
	return fduo
}

// AddBlocks adds the blocks edges to Block.
func (fduo *FlowDraftUpdateOne) AddBlocks(b ...*Block) *FlowDraftUpdateOne {
	ids := make([]int, len(b))
	for i := range b {
		ids[i] = b[i].ID
	}
	return fduo.AddBlockIDs(ids...)
}

// SetFlowID sets the flow edge to Flow by id.
func (fduo *FlowDraftUpdateOne) SetFlowID(id int) *FlowDraftUpdateOne {
	fduo.mutation.SetFlowID(id)
	return fduo
}

// SetFlow sets the flow edge to Flow.
func (fduo *FlowDraftUpdateOne) SetFlow(f *Flow) *FlowDraftUpdateOne {
	return fduo.SetFlowID(f.ID)
}

// Mutation returns the FlowDraftMutation object of the builder.
func (fduo *FlowDraftUpdateOne) Mutation() *FlowDraftMutation {
	return fduo.mutation
}

// ClearBlocks clears all "blocks" edges to type Block.
func (fduo *FlowDraftUpdateOne) ClearBlocks() *FlowDraftUpdateOne {
	fduo.mutation.ClearBlocks()
	return fduo
}

// RemoveBlockIDs removes the blocks edge to Block by ids.
func (fduo *FlowDraftUpdateOne) RemoveBlockIDs(ids ...int) *FlowDraftUpdateOne {
	fduo.mutation.RemoveBlockIDs(ids...)
	return fduo
}

// RemoveBlocks removes blocks edges to Block.
func (fduo *FlowDraftUpdateOne) RemoveBlocks(b ...*Block) *FlowDraftUpdateOne {
	ids := make([]int, len(b))
	for i := range b {
		ids[i] = b[i].ID
	}
	return fduo.RemoveBlockIDs(ids...)
}

// ClearFlow clears the "flow" edge to type Flow.
func (fduo *FlowDraftUpdateOne) ClearFlow() *FlowDraftUpdateOne {
	fduo.mutation.ClearFlow()
	return fduo
}

// Save executes the query and returns the updated entity.
func (fduo *FlowDraftUpdateOne) Save(ctx context.Context) (*FlowDraft, error) {
	var (
		err  error
		node *FlowDraft
	)
	fduo.defaults()
	if len(fduo.hooks) == 0 {
		if err = fduo.check(); err != nil {
			return nil, err
		}
		node, err = fduo.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*FlowDraftMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = fduo.check(); err != nil {
				return nil, err
			}
			fduo.mutation = mutation
			node, err = fduo.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(fduo.hooks) - 1; i >= 0; i-- {
			mut = fduo.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, fduo.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX is like Save, but panics if an error occurs.
func (fduo *FlowDraftUpdateOne) SaveX(ctx context.Context) *FlowDraft {
	node, err := fduo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (fduo *FlowDraftUpdateOne) Exec(ctx context.Context) error {
	_, err := fduo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (fduo *FlowDraftUpdateOne) ExecX(ctx context.Context) {
	if err := fduo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (fduo *FlowDraftUpdateOne) defaults() {
	if _, ok := fduo.mutation.UpdateTime(); !ok {
		v := flowdraft.UpdateDefaultUpdateTime()
		fduo.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (fduo *FlowDraftUpdateOne) check() error {
	if v, ok := fduo.mutation.Name(); ok {
		if err := flowdraft.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	if _, ok := fduo.mutation.FlowID(); fduo.mutation.FlowCleared() && !ok {
		return errors.New("ent: clearing a required unique edge \"flow\"")
	}
	return nil
}

func (fduo *FlowDraftUpdateOne) sqlSave(ctx context.Context) (_node *FlowDraft, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   flowdraft.Table,
			Columns: flowdraft.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: flowdraft.FieldID,
			},
		},
	}
	id, ok := fduo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "ID", err: fmt.Errorf("missing FlowDraft.ID for update")}
	}
	_spec.Node.ID.Value = id
	if value, ok := fduo.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: flowdraft.FieldUpdateTime,
		})
	}
	if value, ok := fduo.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: flowdraft.FieldName,
		})
	}
	if value, ok := fduo.mutation.Description(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: flowdraft.FieldDescription,
		})
	}
	if fduo.mutation.DescriptionCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Column: flowdraft.FieldDescription,
		})
	}
	if value, ok := fduo.mutation.EndParamDefinitions(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeJSON,
			Value:  value,
			Column: flowdraft.FieldEndParamDefinitions,
		})
	}
	if fduo.mutation.EndParamDefinitionsCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeJSON,
			Column: flowdraft.FieldEndParamDefinitions,
		})
	}
	if value, ok := fduo.mutation.SameAsFlow(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeBool,
			Value:  value,
			Column: flowdraft.FieldSameAsFlow,
		})
	}
	if fduo.mutation.BlocksCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   flowdraft.BlocksTable,
			Columns: []string{flowdraft.BlocksColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: block.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := fduo.mutation.RemovedBlocksIDs(); len(nodes) > 0 && !fduo.mutation.BlocksCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   flowdraft.BlocksTable,
			Columns: []string{flowdraft.BlocksColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: block.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := fduo.mutation.BlocksIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   flowdraft.BlocksTable,
			Columns: []string{flowdraft.BlocksColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: block.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if fduo.mutation.FlowCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   flowdraft.FlowTable,
			Columns: []string{flowdraft.FlowColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: flow.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := fduo.mutation.FlowIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   flowdraft.FlowTable,
			Columns: []string{flowdraft.FlowColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: flow.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &FlowDraft{config: fduo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues()
	if err = sqlgraph.UpdateNode(ctx, fduo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{flowdraft.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	return _node, nil
}
