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
	"github.com/facebookincubator/symphony/pkg/ent/counterfamily"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
)

// CounterFamilyDelete is the builder for deleting a CounterFamily entity.
type CounterFamilyDelete struct {
	config
	hooks    []Hook
	mutation *CounterFamilyMutation
}

// Where adds a new predicate to the delete builder.
func (cfd *CounterFamilyDelete) Where(ps ...predicate.CounterFamily) *CounterFamilyDelete {
	cfd.mutation.predicates = append(cfd.mutation.predicates, ps...)
	return cfd
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (cfd *CounterFamilyDelete) Exec(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	if len(cfd.hooks) == 0 {
		affected, err = cfd.sqlExec(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*CounterFamilyMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			cfd.mutation = mutation
			affected, err = cfd.sqlExec(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(cfd.hooks) - 1; i >= 0; i-- {
			mut = cfd.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, cfd.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// ExecX is like Exec, but panics if an error occurs.
func (cfd *CounterFamilyDelete) ExecX(ctx context.Context) int {
	n, err := cfd.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (cfd *CounterFamilyDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := &sqlgraph.DeleteSpec{
		Node: &sqlgraph.NodeSpec{
			Table: counterfamily.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: counterfamily.FieldID,
			},
		},
	}
	if ps := cfd.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	return sqlgraph.DeleteNodes(ctx, cfd.driver, _spec)
}

// CounterFamilyDeleteOne is the builder for deleting a single CounterFamily entity.
type CounterFamilyDeleteOne struct {
	cfd *CounterFamilyDelete
}

// Exec executes the deletion query.
func (cfdo *CounterFamilyDeleteOne) Exec(ctx context.Context) error {
	n, err := cfdo.cfd.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{counterfamily.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (cfdo *CounterFamilyDeleteOne) ExecX(ctx context.Context) {
	cfdo.cfd.ExecX(ctx)
}
