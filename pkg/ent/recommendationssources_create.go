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
	"github.com/facebookincubator/symphony/pkg/ent/recommendations"
	"github.com/facebookincubator/symphony/pkg/ent/recommendationssources"
)

// RecommendationsSourcesCreate is the builder for creating a RecommendationsSources entity.
type RecommendationsSourcesCreate struct {
	config
	mutation *RecommendationsSourcesMutation
	hooks    []Hook
}

// SetCreateTime sets the create_time field.
func (rsc *RecommendationsSourcesCreate) SetCreateTime(t time.Time) *RecommendationsSourcesCreate {
	rsc.mutation.SetCreateTime(t)
	return rsc
}

// SetNillableCreateTime sets the create_time field if the given value is not nil.
func (rsc *RecommendationsSourcesCreate) SetNillableCreateTime(t *time.Time) *RecommendationsSourcesCreate {
	if t != nil {
		rsc.SetCreateTime(*t)
	}
	return rsc
}

// SetUpdateTime sets the update_time field.
func (rsc *RecommendationsSourcesCreate) SetUpdateTime(t time.Time) *RecommendationsSourcesCreate {
	rsc.mutation.SetUpdateTime(t)
	return rsc
}

// SetNillableUpdateTime sets the update_time field if the given value is not nil.
func (rsc *RecommendationsSourcesCreate) SetNillableUpdateTime(t *time.Time) *RecommendationsSourcesCreate {
	if t != nil {
		rsc.SetUpdateTime(*t)
	}
	return rsc
}

// SetName sets the name field.
func (rsc *RecommendationsSourcesCreate) SetName(s string) *RecommendationsSourcesCreate {
	rsc.mutation.SetName(s)
	return rsc
}

// AddRecommendationIDs adds the recommendations edge to Recommendations by ids.
func (rsc *RecommendationsSourcesCreate) AddRecommendationIDs(ids ...int) *RecommendationsSourcesCreate {
	rsc.mutation.AddRecommendationIDs(ids...)
	return rsc
}

// AddRecommendations adds the recommendations edges to Recommendations.
func (rsc *RecommendationsSourcesCreate) AddRecommendations(r ...*Recommendations) *RecommendationsSourcesCreate {
	ids := make([]int, len(r))
	for i := range r {
		ids[i] = r[i].ID
	}
	return rsc.AddRecommendationIDs(ids...)
}

// Mutation returns the RecommendationsSourcesMutation object of the builder.
func (rsc *RecommendationsSourcesCreate) Mutation() *RecommendationsSourcesMutation {
	return rsc.mutation
}

// Save creates the RecommendationsSources in the database.
func (rsc *RecommendationsSourcesCreate) Save(ctx context.Context) (*RecommendationsSources, error) {
	var (
		err  error
		node *RecommendationsSources
	)
	rsc.defaults()
	if len(rsc.hooks) == 0 {
		if err = rsc.check(); err != nil {
			return nil, err
		}
		node, err = rsc.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*RecommendationsSourcesMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = rsc.check(); err != nil {
				return nil, err
			}
			rsc.mutation = mutation
			node, err = rsc.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(rsc.hooks) - 1; i >= 0; i-- {
			mut = rsc.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, rsc.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (rsc *RecommendationsSourcesCreate) SaveX(ctx context.Context) *RecommendationsSources {
	v, err := rsc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// defaults sets the default values of the builder before save.
func (rsc *RecommendationsSourcesCreate) defaults() {
	if _, ok := rsc.mutation.CreateTime(); !ok {
		v := recommendationssources.DefaultCreateTime()
		rsc.mutation.SetCreateTime(v)
	}
	if _, ok := rsc.mutation.UpdateTime(); !ok {
		v := recommendationssources.DefaultUpdateTime()
		rsc.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (rsc *RecommendationsSourcesCreate) check() error {
	if _, ok := rsc.mutation.CreateTime(); !ok {
		return &ValidationError{Name: "create_time", err: errors.New("ent: missing required field \"create_time\"")}
	}
	if _, ok := rsc.mutation.UpdateTime(); !ok {
		return &ValidationError{Name: "update_time", err: errors.New("ent: missing required field \"update_time\"")}
	}
	if _, ok := rsc.mutation.Name(); !ok {
		return &ValidationError{Name: "name", err: errors.New("ent: missing required field \"name\"")}
	}
	if v, ok := rsc.mutation.Name(); ok {
		if err := recommendationssources.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf("ent: validator failed for field \"name\": %w", err)}
		}
	}
	return nil
}

func (rsc *RecommendationsSourcesCreate) sqlSave(ctx context.Context) (*RecommendationsSources, error) {
	_node, _spec := rsc.createSpec()
	if err := sqlgraph.CreateNode(ctx, rsc.driver, _spec); err != nil {
		if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	return _node, nil
}

func (rsc *RecommendationsSourcesCreate) createSpec() (*RecommendationsSources, *sqlgraph.CreateSpec) {
	var (
		_node = &RecommendationsSources{config: rsc.config}
		_spec = &sqlgraph.CreateSpec{
			Table: recommendationssources.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: recommendationssources.FieldID,
			},
		}
	)
	if value, ok := rsc.mutation.CreateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: recommendationssources.FieldCreateTime,
		})
		_node.CreateTime = value
	}
	if value, ok := rsc.mutation.UpdateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: recommendationssources.FieldUpdateTime,
		})
		_node.UpdateTime = value
	}
	if value, ok := rsc.mutation.Name(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: recommendationssources.FieldName,
		})
		_node.Name = value
	}
	if nodes := rsc.mutation.RecommendationsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   recommendationssources.RecommendationsTable,
			Columns: []string{recommendationssources.RecommendationsColumn},
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
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// RecommendationsSourcesCreateBulk is the builder for creating a bulk of RecommendationsSources entities.
type RecommendationsSourcesCreateBulk struct {
	config
	builders []*RecommendationsSourcesCreate
}

// Save creates the RecommendationsSources entities in the database.
func (rscb *RecommendationsSourcesCreateBulk) Save(ctx context.Context) ([]*RecommendationsSources, error) {
	specs := make([]*sqlgraph.CreateSpec, len(rscb.builders))
	nodes := make([]*RecommendationsSources, len(rscb.builders))
	mutators := make([]Mutator, len(rscb.builders))
	for i := range rscb.builders {
		func(i int, root context.Context) {
			builder := rscb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*RecommendationsSourcesMutation)
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
					_, err = mutators[i+1].Mutate(root, rscb.builders[i+1].mutation)
				} else {
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, rscb.driver, &sqlgraph.BatchCreateSpec{Nodes: specs}); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, rscb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX calls Save and panics if Save returns an error.
func (rscb *RecommendationsSourcesCreateBulk) SaveX(ctx context.Context) []*RecommendationsSources {
	v, err := rscb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}