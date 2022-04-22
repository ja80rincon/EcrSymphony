// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"fmt"

	"github.com/facebook/ent/dialect/sql"
	"github.com/facebook/ent/dialect/sql/sqlgraph"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/ent/parametercatalog"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/propertycategory"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
)

// PropertyCategoryUpdate is the builder for updating PropertyCategory entities.
type PropertyCategoryUpdate struct {
	config
	hooks    []Hook
	mutation *PropertyCategoryMutation
}

// Where adds a new predicate for the builder.
func (pcu *PropertyCategoryUpdate) Where(ps ...predicate.PropertyCategory) *PropertyCategoryUpdate {
	pcu.mutation.predicates = append(pcu.mutation.predicates, ps...)
	return pcu
}

// SetName sets the name field.
func (pcu *PropertyCategoryUpdate) SetName(s string) *PropertyCategoryUpdate {
	pcu.mutation.SetName(s)
	return pcu
}

// SetIndex sets the index field.
func (pcu *PropertyCategoryUpdate) SetIndex(i int) *PropertyCategoryUpdate {
	pcu.mutation.ResetIndex()
	pcu.mutation.SetIndex(i)
	return pcu
}

// AddIndex adds i to index.
func (pcu *PropertyCategoryUpdate) AddIndex(i int) *PropertyCategoryUpdate {
	pcu.mutation.AddIndex(i)
	return pcu
}

// AddPropertiesTypeIDs adds the properties_type edge to PropertyType by ids.
func (pcu *PropertyCategoryUpdate) AddPropertiesTypeIDs(ids ...int) *PropertyCategoryUpdate {
	pcu.mutation.AddPropertiesTypeIDs(ids...)
	return pcu
}

// AddPropertiesType adds the properties_type edges to PropertyType.
func (pcu *PropertyCategoryUpdate) AddPropertiesType(p ...*PropertyType) *PropertyCategoryUpdate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return pcu.AddPropertiesTypeIDs(ids...)
}

// SetParameterCatalogID sets the parameter_catalog edge to ParameterCatalog by id.
func (pcu *PropertyCategoryUpdate) SetParameterCatalogID(id int) *PropertyCategoryUpdate {
	pcu.mutation.SetParameterCatalogID(id)
	return pcu
}

// SetNillableParameterCatalogID sets the parameter_catalog edge to ParameterCatalog by id if the given value is not nil.
func (pcu *PropertyCategoryUpdate) SetNillableParameterCatalogID(id *int) *PropertyCategoryUpdate {
	if id != nil {
		pcu = pcu.SetParameterCatalogID(*id)
	}
	return pcu
}

// SetParameterCatalog sets the parameter_catalog edge to ParameterCatalog.
func (pcu *PropertyCategoryUpdate) SetParameterCatalog(p *ParameterCatalog) *PropertyCategoryUpdate {
	return pcu.SetParameterCatalogID(p.ID)
}

// Mutation returns the PropertyCategoryMutation object of the builder.
func (pcu *PropertyCategoryUpdate) Mutation() *PropertyCategoryMutation {
	return pcu.mutation
}

// ClearPropertiesType clears all "properties_type" edges to type PropertyType.
func (pcu *PropertyCategoryUpdate) ClearPropertiesType() *PropertyCategoryUpdate {
	pcu.mutation.ClearPropertiesType()
	return pcu
}

// RemovePropertiesTypeIDs removes the properties_type edge to PropertyType by ids.
func (pcu *PropertyCategoryUpdate) RemovePropertiesTypeIDs(ids ...int) *PropertyCategoryUpdate {
	pcu.mutation.RemovePropertiesTypeIDs(ids...)
	return pcu
}

// RemovePropertiesType removes properties_type edges to PropertyType.
func (pcu *PropertyCategoryUpdate) RemovePropertiesType(p ...*PropertyType) *PropertyCategoryUpdate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return pcu.RemovePropertiesTypeIDs(ids...)
}

// ClearParameterCatalog clears the "parameter_catalog" edge to type ParameterCatalog.
func (pcu *PropertyCategoryUpdate) ClearParameterCatalog() *PropertyCategoryUpdate {
	pcu.mutation.ClearParameterCatalog()
	return pcu
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (pcu *PropertyCategoryUpdate) Save(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	pcu.defaults()
	if len(pcu.hooks) == 0 {
		if err = pcu.check(); err != nil {
			return 0, err
		}
		affected, err = pcu.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*PropertyCategoryMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = pcu.check(); err != nil {
				return 0, err
			}
			pcu.mutation = mutation
			affected, err = pcu.sqlSave(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(pcu.hooks) - 1; i >= 0; i-- {
			mut = pcu.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, pcu.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// SaveX is like Save, but panics if an error occurs.
func (pcu *PropertyCategoryUpdate) SaveX(ctx context.Context) int {
	affected, err := pcu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (pcu *PropertyCategoryUpdate) Exec(ctx context.Context) error {
	_, err := pcu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (pcu *PropertyCategoryUpdate) ExecX(ctx context.Context) {
	if err := pcu.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (pcu *PropertyCategoryUpdate) defaults() {
	if _, ok := pcu.mutation.UpdateTime(); !ok {
		v := propertycategory.UpdateDefaultUpdateTime()
		pcu.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (pcu *PropertyCategoryUpdate) check() error {
	if v, ok := pcu.mutation.Name(); ok {
		if err := propertycategory.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	return nil
}

func (pcu *PropertyCategoryUpdate) sqlSave(ctx context.Context) (n int, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   propertycategory.Table,
			Columns: propertycategory.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: propertycategory.FieldID,
			},
		},
	}
	if ps := pcu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := pcu.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: propertycategory.FieldUpdateTime,
		})
	}
	if value, ok := pcu.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: propertycategory.FieldName,
		})
	}
	if value, ok := pcu.mutation.Index(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: propertycategory.FieldIndex,
		})
	}
	if value, ok := pcu.mutation.AddedIndex(); ok {
		_spec.Fields.Add = append(_spec.Fields.Add, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: propertycategory.FieldIndex,
		})
	}
	if pcu.mutation.PropertiesTypeCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   propertycategory.PropertiesTypeTable,
			Columns: []string{propertycategory.PropertiesTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: propertytype.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := pcu.mutation.RemovedPropertiesTypeIDs(); len(nodes) > 0 && !pcu.mutation.PropertiesTypeCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   propertycategory.PropertiesTypeTable,
			Columns: []string{propertycategory.PropertiesTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: propertytype.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := pcu.mutation.PropertiesTypeIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   propertycategory.PropertiesTypeTable,
			Columns: []string{propertycategory.PropertiesTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: propertytype.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if pcu.mutation.ParameterCatalogCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   propertycategory.ParameterCatalogTable,
			Columns: []string{propertycategory.ParameterCatalogColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: parametercatalog.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := pcu.mutation.ParameterCatalogIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   propertycategory.ParameterCatalogTable,
			Columns: []string{propertycategory.ParameterCatalogColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: parametercatalog.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, pcu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{propertycategory.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return 0, err
	}
	return n, nil
}

// PropertyCategoryUpdateOne is the builder for updating a single PropertyCategory entity.
type PropertyCategoryUpdateOne struct {
	config
	hooks    []Hook
	mutation *PropertyCategoryMutation
}

// SetName sets the name field.
func (pcuo *PropertyCategoryUpdateOne) SetName(s string) *PropertyCategoryUpdateOne {
	pcuo.mutation.SetName(s)
	return pcuo
}

// SetIndex sets the index field.
func (pcuo *PropertyCategoryUpdateOne) SetIndex(i int) *PropertyCategoryUpdateOne {
	pcuo.mutation.ResetIndex()
	pcuo.mutation.SetIndex(i)
	return pcuo
}

// AddIndex adds i to index.
func (pcuo *PropertyCategoryUpdateOne) AddIndex(i int) *PropertyCategoryUpdateOne {
	pcuo.mutation.AddIndex(i)
	return pcuo
}

// AddPropertiesTypeIDs adds the properties_type edge to PropertyType by ids.
func (pcuo *PropertyCategoryUpdateOne) AddPropertiesTypeIDs(ids ...int) *PropertyCategoryUpdateOne {
	pcuo.mutation.AddPropertiesTypeIDs(ids...)
	return pcuo
}

// AddPropertiesType adds the properties_type edges to PropertyType.
func (pcuo *PropertyCategoryUpdateOne) AddPropertiesType(p ...*PropertyType) *PropertyCategoryUpdateOne {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return pcuo.AddPropertiesTypeIDs(ids...)
}

// SetParameterCatalogID sets the parameter_catalog edge to ParameterCatalog by id.
func (pcuo *PropertyCategoryUpdateOne) SetParameterCatalogID(id int) *PropertyCategoryUpdateOne {
	pcuo.mutation.SetParameterCatalogID(id)
	return pcuo
}

// SetNillableParameterCatalogID sets the parameter_catalog edge to ParameterCatalog by id if the given value is not nil.
func (pcuo *PropertyCategoryUpdateOne) SetNillableParameterCatalogID(id *int) *PropertyCategoryUpdateOne {
	if id != nil {
		pcuo = pcuo.SetParameterCatalogID(*id)
	}
	return pcuo
}

// SetParameterCatalog sets the parameter_catalog edge to ParameterCatalog.
func (pcuo *PropertyCategoryUpdateOne) SetParameterCatalog(p *ParameterCatalog) *PropertyCategoryUpdateOne {
	return pcuo.SetParameterCatalogID(p.ID)
}

// Mutation returns the PropertyCategoryMutation object of the builder.
func (pcuo *PropertyCategoryUpdateOne) Mutation() *PropertyCategoryMutation {
	return pcuo.mutation
}

// ClearPropertiesType clears all "properties_type" edges to type PropertyType.
func (pcuo *PropertyCategoryUpdateOne) ClearPropertiesType() *PropertyCategoryUpdateOne {
	pcuo.mutation.ClearPropertiesType()
	return pcuo
}

// RemovePropertiesTypeIDs removes the properties_type edge to PropertyType by ids.
func (pcuo *PropertyCategoryUpdateOne) RemovePropertiesTypeIDs(ids ...int) *PropertyCategoryUpdateOne {
	pcuo.mutation.RemovePropertiesTypeIDs(ids...)
	return pcuo
}

// RemovePropertiesType removes properties_type edges to PropertyType.
func (pcuo *PropertyCategoryUpdateOne) RemovePropertiesType(p ...*PropertyType) *PropertyCategoryUpdateOne {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return pcuo.RemovePropertiesTypeIDs(ids...)
}

// ClearParameterCatalog clears the "parameter_catalog" edge to type ParameterCatalog.
func (pcuo *PropertyCategoryUpdateOne) ClearParameterCatalog() *PropertyCategoryUpdateOne {
	pcuo.mutation.ClearParameterCatalog()
	return pcuo
}

// Save executes the query and returns the updated entity.
func (pcuo *PropertyCategoryUpdateOne) Save(ctx context.Context) (*PropertyCategory, error) {
	var (
		err  error
		node *PropertyCategory
	)
	pcuo.defaults()
	if len(pcuo.hooks) == 0 {
		if err = pcuo.check(); err != nil {
			return nil, err
		}
		node, err = pcuo.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*PropertyCategoryMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = pcuo.check(); err != nil {
				return nil, err
			}
			pcuo.mutation = mutation
			node, err = pcuo.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(pcuo.hooks) - 1; i >= 0; i-- {
			mut = pcuo.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, pcuo.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX is like Save, but panics if an error occurs.
func (pcuo *PropertyCategoryUpdateOne) SaveX(ctx context.Context) *PropertyCategory {
	node, err := pcuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (pcuo *PropertyCategoryUpdateOne) Exec(ctx context.Context) error {
	_, err := pcuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (pcuo *PropertyCategoryUpdateOne) ExecX(ctx context.Context) {
	if err := pcuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (pcuo *PropertyCategoryUpdateOne) defaults() {
	if _, ok := pcuo.mutation.UpdateTime(); !ok {
		v := propertycategory.UpdateDefaultUpdateTime()
		pcuo.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (pcuo *PropertyCategoryUpdateOne) check() error {
	if v, ok := pcuo.mutation.Name(); ok {
		if err := propertycategory.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	return nil
}

func (pcuo *PropertyCategoryUpdateOne) sqlSave(ctx context.Context) (_node *PropertyCategory, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   propertycategory.Table,
			Columns: propertycategory.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: propertycategory.FieldID,
			},
		},
	}
	id, ok := pcuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "ID", err: fmt.Errorf("missing PropertyCategory.ID for update")}
	}
	_spec.Node.ID.Value = id
	if value, ok := pcuo.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: propertycategory.FieldUpdateTime,
		})
	}
	if value, ok := pcuo.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: propertycategory.FieldName,
		})
	}
	if value, ok := pcuo.mutation.Index(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: propertycategory.FieldIndex,
		})
	}
	if value, ok := pcuo.mutation.AddedIndex(); ok {
		_spec.Fields.Add = append(_spec.Fields.Add, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: propertycategory.FieldIndex,
		})
	}
	if pcuo.mutation.PropertiesTypeCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   propertycategory.PropertiesTypeTable,
			Columns: []string{propertycategory.PropertiesTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: propertytype.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := pcuo.mutation.RemovedPropertiesTypeIDs(); len(nodes) > 0 && !pcuo.mutation.PropertiesTypeCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   propertycategory.PropertiesTypeTable,
			Columns: []string{propertycategory.PropertiesTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: propertytype.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := pcuo.mutation.PropertiesTypeIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   propertycategory.PropertiesTypeTable,
			Columns: []string{propertycategory.PropertiesTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: propertytype.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if pcuo.mutation.ParameterCatalogCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   propertycategory.ParameterCatalogTable,
			Columns: []string{propertycategory.ParameterCatalogColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: parametercatalog.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := pcuo.mutation.ParameterCatalogIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   propertycategory.ParameterCatalogTable,
			Columns: []string{propertycategory.ParameterCatalogColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: parametercatalog.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &PropertyCategory{config: pcuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues()
	if err = sqlgraph.UpdateNode(ctx, pcuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{propertycategory.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	return _node, nil
}