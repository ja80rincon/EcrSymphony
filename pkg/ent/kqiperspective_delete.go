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
	"github.com/facebookincubator/symphony/pkg/ent/kqiperspective"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
)

// KqiPerspectiveDelete is the builder for deleting a KqiPerspective entity.
type KqiPerspectiveDelete struct {
	config
	hooks    []Hook
	mutation *KqiPerspectiveMutation
}

// Where adds a new predicate to the delete builder.
func (kpd *KqiPerspectiveDelete) Where(ps ...predicate.KqiPerspective) *KqiPerspectiveDelete {
	kpd.mutation.predicates = append(kpd.mutation.predicates, ps...)
	return kpd
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (kpd *KqiPerspectiveDelete) Exec(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	if len(kpd.hooks) == 0 {
		affected, err = kpd.sqlExec(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*KqiPerspectiveMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			kpd.mutation = mutation
			affected, err = kpd.sqlExec(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(kpd.hooks) - 1; i >= 0; i-- {
			mut = kpd.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, kpd.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// ExecX is like Exec, but panics if an error occurs.
func (kpd *KqiPerspectiveDelete) ExecX(ctx context.Context) int {
	n, err := kpd.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (kpd *KqiPerspectiveDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := &sqlgraph.DeleteSpec{
		Node: &sqlgraph.NodeSpec{
			Table: kqiperspective.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: kqiperspective.FieldID,
			},
		},
	}
	if ps := kpd.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	return sqlgraph.DeleteNodes(ctx, kpd.driver, _spec)
}

// KqiPerspectiveDeleteOne is the builder for deleting a single KqiPerspective entity.
type KqiPerspectiveDeleteOne struct {
	kpd *KqiPerspectiveDelete
}

// Exec executes the deletion query.
func (kpdo *KqiPerspectiveDeleteOne) Exec(ctx context.Context) error {
	n, err := kpdo.kpd.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{kqiperspective.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (kpdo *KqiPerspectiveDeleteOne) ExecX(ctx context.Context) {
	kpdo.kpd.ExecX(ctx)
}