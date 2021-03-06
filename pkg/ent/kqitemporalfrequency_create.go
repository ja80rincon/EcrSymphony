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
	"github.com/facebookincubator/symphony/pkg/ent/kqi"
	"github.com/facebookincubator/symphony/pkg/ent/kqitemporalfrequency"
)

// KqiTemporalFrequencyCreate is the builder for creating a KqiTemporalFrequency entity.
type KqiTemporalFrequencyCreate struct {
	config
	mutation *KqiTemporalFrequencyMutation
	hooks    []Hook
}

// SetCreateTime sets the create_time field.
func (ktfc *KqiTemporalFrequencyCreate) SetCreateTime(t time.Time) *KqiTemporalFrequencyCreate {
	ktfc.mutation.SetCreateTime(t)
	return ktfc
}

// SetNillableCreateTime sets the create_time field if the given value is not nil.
func (ktfc *KqiTemporalFrequencyCreate) SetNillableCreateTime(t *time.Time) *KqiTemporalFrequencyCreate {
	if t != nil {
		ktfc.SetCreateTime(*t)
	}
	return ktfc
}

// SetUpdateTime sets the update_time field.
func (ktfc *KqiTemporalFrequencyCreate) SetUpdateTime(t time.Time) *KqiTemporalFrequencyCreate {
	ktfc.mutation.SetUpdateTime(t)
	return ktfc
}

// SetNillableUpdateTime sets the update_time field if the given value is not nil.
func (ktfc *KqiTemporalFrequencyCreate) SetNillableUpdateTime(t *time.Time) *KqiTemporalFrequencyCreate {
	if t != nil {
		ktfc.SetUpdateTime(*t)
	}
	return ktfc
}

// SetName sets the name field.
func (ktfc *KqiTemporalFrequencyCreate) SetName(s string) *KqiTemporalFrequencyCreate {
	ktfc.mutation.SetName(s)
	return ktfc
}

// AddKqiTemporalFrequencyFkIDs adds the kqiTemporalFrequencyFk edge to Kqi by ids.
func (ktfc *KqiTemporalFrequencyCreate) AddKqiTemporalFrequencyFkIDs(ids ...int) *KqiTemporalFrequencyCreate {
	ktfc.mutation.AddKqiTemporalFrequencyFkIDs(ids...)
	return ktfc
}

// AddKqiTemporalFrequencyFk adds the kqiTemporalFrequencyFk edges to Kqi.
func (ktfc *KqiTemporalFrequencyCreate) AddKqiTemporalFrequencyFk(k ...*Kqi) *KqiTemporalFrequencyCreate {
	ids := make([]int, len(k))
	for i := range k {
		ids[i] = k[i].ID
	}
	return ktfc.AddKqiTemporalFrequencyFkIDs(ids...)
}

// Mutation returns the KqiTemporalFrequencyMutation object of the builder.
func (ktfc *KqiTemporalFrequencyCreate) Mutation() *KqiTemporalFrequencyMutation {
	return ktfc.mutation
}

// Save creates the KqiTemporalFrequency in the database.
func (ktfc *KqiTemporalFrequencyCreate) Save(ctx context.Context) (*KqiTemporalFrequency, error) {
	var (
		err  error
		node *KqiTemporalFrequency
	)
	ktfc.defaults()
	if len(ktfc.hooks) == 0 {
		if err = ktfc.check(); err != nil {
			return nil, err
		}
		node, err = ktfc.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*KqiTemporalFrequencyMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = ktfc.check(); err != nil {
				return nil, err
			}
			ktfc.mutation = mutation
			node, err = ktfc.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(ktfc.hooks) - 1; i >= 0; i-- {
			mut = ktfc.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, ktfc.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (ktfc *KqiTemporalFrequencyCreate) SaveX(ctx context.Context) *KqiTemporalFrequency {
	v, err := ktfc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// defaults sets the default values of the builder before save.
func (ktfc *KqiTemporalFrequencyCreate) defaults() {
	if _, ok := ktfc.mutation.CreateTime(); !ok {
		v := kqitemporalfrequency.DefaultCreateTime()
		ktfc.mutation.SetCreateTime(v)
	}
	if _, ok := ktfc.mutation.UpdateTime(); !ok {
		v := kqitemporalfrequency.DefaultUpdateTime()
		ktfc.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (ktfc *KqiTemporalFrequencyCreate) check() error {
	if _, ok := ktfc.mutation.CreateTime(); !ok {
		return &ValidationError{Name: "create_time", err: errors.New("ent: missing required field \"create_time\"")}
	}
	if _, ok := ktfc.mutation.UpdateTime(); !ok {
		return &ValidationError{Name: "update_time", err: errors.New("ent: missing required field \"update_time\"")}
	}
	if _, ok := ktfc.mutation.Name(); !ok {
		return &ValidationError{Name: "name", err: errors.New("ent: missing required field \"name\"")}
	}
	if v, ok := ktfc.mutation.Name(); ok {
		if err := kqitemporalfrequency.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	return nil
}

func (ktfc *KqiTemporalFrequencyCreate) sqlSave(ctx context.Context) (*KqiTemporalFrequency, error) {
	_node, _spec := ktfc.createSpec()
	if err := sqlgraph.CreateNode(ctx, ktfc.driver, _spec); err != nil {
		if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	return _node, nil
}

func (ktfc *KqiTemporalFrequencyCreate) createSpec() (*KqiTemporalFrequency, *sqlgraph.CreateSpec) {
	var (
		_node = &KqiTemporalFrequency{config: ktfc.config}
		_spec = &sqlgraph.CreateSpec{
			Table: kqitemporalfrequency.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: kqitemporalfrequency.FieldID,
			},
		}
	)
	if value, ok := ktfc.mutation.CreateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: kqitemporalfrequency.FieldCreateTime,
		})
		_node.CreateTime = value
	}
	if value, ok := ktfc.mutation.UpdateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: kqitemporalfrequency.FieldUpdateTime,
		})
		_node.UpdateTime = value
	}
	if value, ok := ktfc.mutation.Name(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: kqitemporalfrequency.FieldName,
		})
		_node.Name = value
	}
	if nodes := ktfc.mutation.KqiTemporalFrequencyFkIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   kqitemporalfrequency.KqiTemporalFrequencyFkTable,
			Columns: []string{kqitemporalfrequency.KqiTemporalFrequencyFkColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: kqi.FieldID,
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

// KqiTemporalFrequencyCreateBulk is the builder for creating a bulk of KqiTemporalFrequency entities.
type KqiTemporalFrequencyCreateBulk struct {
	config
	builders []*KqiTemporalFrequencyCreate
}

// Save creates the KqiTemporalFrequency entities in the database.
func (ktfcb *KqiTemporalFrequencyCreateBulk) Save(ctx context.Context) ([]*KqiTemporalFrequency, error) {
	specs := make([]*sqlgraph.CreateSpec, len(ktfcb.builders))
	nodes := make([]*KqiTemporalFrequency, len(ktfcb.builders))
	mutators := make([]Mutator, len(ktfcb.builders))
	for i := range ktfcb.builders {
		func(i int, root context.Context) {
			builder := ktfcb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*KqiTemporalFrequencyMutation)
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
					_, err = mutators[i+1].Mutate(root, ktfcb.builders[i+1].mutation)
				} else {
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, ktfcb.driver, &sqlgraph.BatchCreateSpec{Nodes: specs}); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, ktfcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX calls Save and panics if Save returns an error.
func (ktfcb *KqiTemporalFrequencyCreateBulk) SaveX(ctx context.Context) []*KqiTemporalFrequency {
	v, err := ktfcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}
