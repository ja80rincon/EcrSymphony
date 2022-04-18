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
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/recommendations"
	"github.com/facebookincubator/symphony/pkg/ent/recommendationscategory"
)

// RecommendationsCategoryUpdate is the builder for updating RecommendationsCategory entities.
type RecommendationsCategoryUpdate struct {
	config
	hooks    []Hook
	mutation *RecommendationsCategoryMutation
}

// Where adds a new predicate for the builder.
func (rcu *RecommendationsCategoryUpdate) Where(ps ...predicate.RecommendationsCategory) *RecommendationsCategoryUpdate {
	rcu.mutation.predicates = append(rcu.mutation.predicates, ps...)
	return rcu
}

// SetName sets the name field.
func (rcu *RecommendationsCategoryUpdate) SetName(s string) *RecommendationsCategoryUpdate {
	rcu.mutation.SetName(s)
	return rcu
}

// AddRecommendationIDs adds the recommendations edge to Recommendations by ids.
func (rcu *RecommendationsCategoryUpdate) AddRecommendationIDs(ids ...int) *RecommendationsCategoryUpdate {
	rcu.mutation.AddRecommendationIDs(ids...)
	return rcu
}

// AddRecommendations adds the recommendations edges to Recommendations.
func (rcu *RecommendationsCategoryUpdate) AddRecommendations(r ...*Recommendations) *RecommendationsCategoryUpdate {
	ids := make([]int, len(r))
	for i := range r {
		ids[i] = r[i].ID
	}
	return rcu.AddRecommendationIDs(ids...)
}

// Mutation returns the RecommendationsCategoryMutation object of the builder.
func (rcu *RecommendationsCategoryUpdate) Mutation() *RecommendationsCategoryMutation {
	return rcu.mutation
}

// ClearRecommendations clears all "recommendations" edges to type Recommendations.
func (rcu *RecommendationsCategoryUpdate) ClearRecommendations() *RecommendationsCategoryUpdate {
	rcu.mutation.ClearRecommendations()
	return rcu
}

// RemoveRecommendationIDs removes the recommendations edge to Recommendations by ids.
func (rcu *RecommendationsCategoryUpdate) RemoveRecommendationIDs(ids ...int) *RecommendationsCategoryUpdate {
	rcu.mutation.RemoveRecommendationIDs(ids...)
	return rcu
}

// RemoveRecommendations removes recommendations edges to Recommendations.
func (rcu *RecommendationsCategoryUpdate) RemoveRecommendations(r ...*Recommendations) *RecommendationsCategoryUpdate {
	ids := make([]int, len(r))
	for i := range r {
		ids[i] = r[i].ID
	}
	return rcu.RemoveRecommendationIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (rcu *RecommendationsCategoryUpdate) Save(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	rcu.defaults()
	if len(rcu.hooks) == 0 {
		if err = rcu.check(); err != nil {
			return 0, err
		}
		affected, err = rcu.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*RecommendationsCategoryMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = rcu.check(); err != nil {
				return 0, err
			}
			rcu.mutation = mutation
			affected, err = rcu.sqlSave(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(rcu.hooks) - 1; i >= 0; i-- {
			mut = rcu.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, rcu.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// SaveX is like Save, but panics if an error occurs.
func (rcu *RecommendationsCategoryUpdate) SaveX(ctx context.Context) int {
	affected, err := rcu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (rcu *RecommendationsCategoryUpdate) Exec(ctx context.Context) error {
	_, err := rcu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (rcu *RecommendationsCategoryUpdate) ExecX(ctx context.Context) {
	if err := rcu.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (rcu *RecommendationsCategoryUpdate) defaults() {
	if _, ok := rcu.mutation.UpdateTime(); !ok {
		v := recommendationscategory.UpdateDefaultUpdateTime()
		rcu.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (rcu *RecommendationsCategoryUpdate) check() error {
	if v, ok := rcu.mutation.Name(); ok {
		if err := recommendationscategory.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	return nil
}

func (rcu *RecommendationsCategoryUpdate) sqlSave(ctx context.Context) (n int, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   recommendationscategory.Table,
			Columns: recommendationscategory.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: recommendationscategory.FieldID,
			},
		},
	}
	if ps := rcu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := rcu.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: recommendationscategory.FieldUpdateTime,
		})
	}
	if value, ok := rcu.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: recommendationscategory.FieldName,
		})
	}
	if rcu.mutation.RecommendationsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   recommendationscategory.RecommendationsTable,
			Columns: []string{recommendationscategory.RecommendationsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: recommendations.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := rcu.mutation.RemovedRecommendationsIDs(); len(nodes) > 0 && !rcu.mutation.RecommendationsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   recommendationscategory.RecommendationsTable,
			Columns: []string{recommendationscategory.RecommendationsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: recommendations.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := rcu.mutation.RecommendationsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   recommendationscategory.RecommendationsTable,
			Columns: []string{recommendationscategory.RecommendationsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: recommendations.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, rcu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{recommendationscategory.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return 0, err
	}
	return n, nil
}

// RecommendationsCategoryUpdateOne is the builder for updating a single RecommendationsCategory entity.
type RecommendationsCategoryUpdateOne struct {
	config
	hooks    []Hook
	mutation *RecommendationsCategoryMutation
}

// SetName sets the name field.
func (rcuo *RecommendationsCategoryUpdateOne) SetName(s string) *RecommendationsCategoryUpdateOne {
	rcuo.mutation.SetName(s)
	return rcuo
}

// AddRecommendationIDs adds the recommendations edge to Recommendations by ids.
func (rcuo *RecommendationsCategoryUpdateOne) AddRecommendationIDs(ids ...int) *RecommendationsCategoryUpdateOne {
	rcuo.mutation.AddRecommendationIDs(ids...)
	return rcuo
}

// AddRecommendations adds the recommendations edges to Recommendations.
func (rcuo *RecommendationsCategoryUpdateOne) AddRecommendations(r ...*Recommendations) *RecommendationsCategoryUpdateOne {
	ids := make([]int, len(r))
	for i := range r {
		ids[i] = r[i].ID
	}
	return rcuo.AddRecommendationIDs(ids...)
}

// Mutation returns the RecommendationsCategoryMutation object of the builder.
func (rcuo *RecommendationsCategoryUpdateOne) Mutation() *RecommendationsCategoryMutation {
	return rcuo.mutation
}

// ClearRecommendations clears all "recommendations" edges to type Recommendations.
func (rcuo *RecommendationsCategoryUpdateOne) ClearRecommendations() *RecommendationsCategoryUpdateOne {
	rcuo.mutation.ClearRecommendations()
	return rcuo
}

// RemoveRecommendationIDs removes the recommendations edge to Recommendations by ids.
func (rcuo *RecommendationsCategoryUpdateOne) RemoveRecommendationIDs(ids ...int) *RecommendationsCategoryUpdateOne {
	rcuo.mutation.RemoveRecommendationIDs(ids...)
	return rcuo
}

// RemoveRecommendations removes recommendations edges to Recommendations.
func (rcuo *RecommendationsCategoryUpdateOne) RemoveRecommendations(r ...*Recommendations) *RecommendationsCategoryUpdateOne {
	ids := make([]int, len(r))
	for i := range r {
		ids[i] = r[i].ID
	}
	return rcuo.RemoveRecommendationIDs(ids...)
}

// Save executes the query and returns the updated entity.
func (rcuo *RecommendationsCategoryUpdateOne) Save(ctx context.Context) (*RecommendationsCategory, error) {
	var (
		err  error
		node *RecommendationsCategory
	)
	rcuo.defaults()
	if len(rcuo.hooks) == 0 {
		if err = rcuo.check(); err != nil {
			return nil, err
		}
		node, err = rcuo.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*RecommendationsCategoryMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = rcuo.check(); err != nil {
				return nil, err
			}
			rcuo.mutation = mutation
			node, err = rcuo.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(rcuo.hooks) - 1; i >= 0; i-- {
			mut = rcuo.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, rcuo.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX is like Save, but panics if an error occurs.
func (rcuo *RecommendationsCategoryUpdateOne) SaveX(ctx context.Context) *RecommendationsCategory {
	node, err := rcuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (rcuo *RecommendationsCategoryUpdateOne) Exec(ctx context.Context) error {
	_, err := rcuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (rcuo *RecommendationsCategoryUpdateOne) ExecX(ctx context.Context) {
	if err := rcuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (rcuo *RecommendationsCategoryUpdateOne) defaults() {
	if _, ok := rcuo.mutation.UpdateTime(); !ok {
		v := recommendationscategory.UpdateDefaultUpdateTime()
		rcuo.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (rcuo *RecommendationsCategoryUpdateOne) check() error {
	if v, ok := rcuo.mutation.Name(); ok {
		if err := recommendationscategory.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	return nil
}

func (rcuo *RecommendationsCategoryUpdateOne) sqlSave(ctx context.Context) (_node *RecommendationsCategory, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   recommendationscategory.Table,
			Columns: recommendationscategory.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: recommendationscategory.FieldID,
			},
		},
	}
	id, ok := rcuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "ID", err: fmt.Errorf("missing RecommendationsCategory.ID for update")}
	}
	_spec.Node.ID.Value = id
	if value, ok := rcuo.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: recommendationscategory.FieldUpdateTime,
		})
	}
	if value, ok := rcuo.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: recommendationscategory.FieldName,
		})
	}
	if rcuo.mutation.RecommendationsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   recommendationscategory.RecommendationsTable,
			Columns: []string{recommendationscategory.RecommendationsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: recommendations.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := rcuo.mutation.RemovedRecommendationsIDs(); len(nodes) > 0 && !rcuo.mutation.RecommendationsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   recommendationscategory.RecommendationsTable,
			Columns: []string{recommendationscategory.RecommendationsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: recommendations.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := rcuo.mutation.RecommendationsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   recommendationscategory.RecommendationsTable,
			Columns: []string{recommendationscategory.RecommendationsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: recommendations.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &RecommendationsCategory{config: rcuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues()
	if err = sqlgraph.UpdateNode(ctx, rcuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{recommendationscategory.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	return _node, nil
}
