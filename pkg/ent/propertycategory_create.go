// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/facebook/ent/dialect/sql/sqlgraph"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/ent/parametercatalog"
	"github.com/facebookincubator/symphony/pkg/ent/propertycategory"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
)

// PropertyCategoryCreate is the builder for creating a PropertyCategory entity.
type PropertyCategoryCreate struct {
	config
	mutation *PropertyCategoryMutation
	hooks    []Hook
}

// SetCreateTime sets the create_time field.
func (pcc *PropertyCategoryCreate) SetCreateTime(t time.Time) *PropertyCategoryCreate {
	pcc.mutation.SetCreateTime(t)
	return pcc
}

// SetNillableCreateTime sets the create_time field if the given value is not nil.
func (pcc *PropertyCategoryCreate) SetNillableCreateTime(t *time.Time) *PropertyCategoryCreate {
	if t != nil {
		pcc.SetCreateTime(*t)
	}
	return pcc
}

// SetUpdateTime sets the update_time field.
func (pcc *PropertyCategoryCreate) SetUpdateTime(t time.Time) *PropertyCategoryCreate {
	pcc.mutation.SetUpdateTime(t)
	return pcc
}

// SetNillableUpdateTime sets the update_time field if the given value is not nil.
func (pcc *PropertyCategoryCreate) SetNillableUpdateTime(t *time.Time) *PropertyCategoryCreate {
	if t != nil {
		pcc.SetUpdateTime(*t)
	}
	return pcc
}

// SetName sets the name field.
func (pcc *PropertyCategoryCreate) SetName(s string) *PropertyCategoryCreate {
	pcc.mutation.SetName(s)
	return pcc
}

// SetIndex sets the index field.
func (pcc *PropertyCategoryCreate) SetIndex(i int) *PropertyCategoryCreate {
	pcc.mutation.SetIndex(i)
	return pcc
}

// AddPropertiesTypeIDs adds the properties_type edge to PropertyType by ids.
func (pcc *PropertyCategoryCreate) AddPropertiesTypeIDs(ids ...int) *PropertyCategoryCreate {
	pcc.mutation.AddPropertiesTypeIDs(ids...)
	return pcc
}

// AddPropertiesType adds the properties_type edges to PropertyType.
func (pcc *PropertyCategoryCreate) AddPropertiesType(p ...*PropertyType) *PropertyCategoryCreate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return pcc.AddPropertiesTypeIDs(ids...)
}

// SetParameterCatalogID sets the parameter_catalog edge to ParameterCatalog by id.
func (pcc *PropertyCategoryCreate) SetParameterCatalogID(id int) *PropertyCategoryCreate {
	pcc.mutation.SetParameterCatalogID(id)
	return pcc
}

// SetNillableParameterCatalogID sets the parameter_catalog edge to ParameterCatalog by id if the given value is not nil.
func (pcc *PropertyCategoryCreate) SetNillableParameterCatalogID(id *int) *PropertyCategoryCreate {
	if id != nil {
		pcc = pcc.SetParameterCatalogID(*id)
	}
	return pcc
}

// SetParameterCatalog sets the parameter_catalog edge to ParameterCatalog.
func (pcc *PropertyCategoryCreate) SetParameterCatalog(p *ParameterCatalog) *PropertyCategoryCreate {
	return pcc.SetParameterCatalogID(p.ID)
}

// Mutation returns the PropertyCategoryMutation object of the builder.
func (pcc *PropertyCategoryCreate) Mutation() *PropertyCategoryMutation {
	return pcc.mutation
}

// Save creates the PropertyCategory in the database.
func (pcc *PropertyCategoryCreate) Save(ctx context.Context) (*PropertyCategory, error) {
	var (
		err  error
		node *PropertyCategory
	)
	pcc.defaults()
	if len(pcc.hooks) == 0 {
		if err = pcc.check(); err != nil {
			return nil, err
		}
		node, err = pcc.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*PropertyCategoryMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = pcc.check(); err != nil {
				return nil, err
			}
			pcc.mutation = mutation
			node, err = pcc.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(pcc.hooks) - 1; i >= 0; i-- {
			mut = pcc.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, pcc.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (pcc *PropertyCategoryCreate) SaveX(ctx context.Context) *PropertyCategory {
	v, err := pcc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// defaults sets the default values of the builder before save.
func (pcc *PropertyCategoryCreate) defaults() {
	if _, ok := pcc.mutation.CreateTime(); !ok {
		v := propertycategory.DefaultCreateTime()
		pcc.mutation.SetCreateTime(v)
	}
	if _, ok := pcc.mutation.UpdateTime(); !ok {
		v := propertycategory.DefaultUpdateTime()
		pcc.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (pcc *PropertyCategoryCreate) check() error {
	if _, ok := pcc.mutation.CreateTime(); !ok {
		return &ValidationError{Name: "create_time", err: errors.New("ent: missing required field \"create_time\"")}
	}
	if _, ok := pcc.mutation.UpdateTime(); !ok {
		return &ValidationError{Name: "update_time", err: errors.New("ent: missing required field \"update_time\"")}
	}
	if _, ok := pcc.mutation.Name(); !ok {
		return &ValidationError{Name: "name", err: errors.New("ent: missing required field \"name\"")}
	}
	if v, ok := pcc.mutation.Name(); ok {
		if err := propertycategory.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	if _, ok := pcc.mutation.Index(); !ok {
		return &ValidationError{Name: "index", err: errors.New("ent: missing required field \"index\"")}
	}
	return nil
}

func (pcc *PropertyCategoryCreate) sqlSave(ctx context.Context) (*PropertyCategory, error) {
	_node, _spec := pcc.createSpec()
	if err := sqlgraph.CreateNode(ctx, pcc.driver, _spec); err != nil {
		if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	return _node, nil
}

func (pcc *PropertyCategoryCreate) createSpec() (*PropertyCategory, *sqlgraph.CreateSpec) {
	var (
		_node = &PropertyCategory{config: pcc.config}
		_spec = &sqlgraph.CreateSpec{
			Table: propertycategory.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: propertycategory.FieldID,
			},
		}
	)
	if value, ok := pcc.mutation.CreateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: propertycategory.FieldCreateTime,
		})
		_node.CreateTime = value
	}
	if value, ok := pcc.mutation.UpdateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: propertycategory.FieldUpdateTime,
		})
		_node.UpdateTime = value
	}
	if value, ok := pcc.mutation.Name(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: propertycategory.FieldName,
		})
		_node.Name = value
	}
	if value, ok := pcc.mutation.Index(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: propertycategory.FieldIndex,
		})
		_node.Index = value
	}
	if nodes := pcc.mutation.PropertiesTypeIDs(); len(nodes) > 0 {
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
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := pcc.mutation.ParameterCatalogIDs(); len(nodes) > 0 {
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
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// PropertyCategoryCreateBulk is the builder for creating a bulk of PropertyCategory entities.
type PropertyCategoryCreateBulk struct {
	config
	builders []*PropertyCategoryCreate
}

// Save creates the PropertyCategory entities in the database.
func (pccb *PropertyCategoryCreateBulk) Save(ctx context.Context) ([]*PropertyCategory, error) {
	specs := make([]*sqlgraph.CreateSpec, len(pccb.builders))
	nodes := make([]*PropertyCategory, len(pccb.builders))
	mutators := make([]Mutator, len(pccb.builders))
	for i := range pccb.builders {
		func(i int, root context.Context) {
			builder := pccb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*PropertyCategoryMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				nodes[i], specs[i] = builder.createSpec()
				var err error
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, pccb.builders[i+1].mutation)
				} else {
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, pccb.driver, &sqlgraph.BatchCreateSpec{Nodes: specs}); err != nil {
						if cerr, ok := isSQLConstraintError(err); ok {
							err = cerr
						}
					}
				}
				mutation.done = true
				if err != nil {
					return nil, err
				}
				id := specs[i].ID.Value.(int64)
				nodes[i].ID = int(id)
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, pccb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX calls Save and panics if Save returns an error.
func (pccb *PropertyCategoryCreateBulk) SaveX(ctx context.Context) []*PropertyCategory {
	v, err := pccb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}