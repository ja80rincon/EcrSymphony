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
	"github.com/facebookincubator/symphony/pkg/ent/locationtype"
	"github.com/facebookincubator/symphony/pkg/ent/surveytemplatecategory"
	"github.com/facebookincubator/symphony/pkg/ent/surveytemplatequestion"
)

// SurveyTemplateCategoryCreate is the builder for creating a SurveyTemplateCategory entity.
type SurveyTemplateCategoryCreate struct {
	config
	mutation *SurveyTemplateCategoryMutation
	hooks    []Hook
}

// SetCreateTime sets the create_time field.
func (stcc *SurveyTemplateCategoryCreate) SetCreateTime(t time.Time) *SurveyTemplateCategoryCreate {
	stcc.mutation.SetCreateTime(t)
	return stcc
}

// SetNillableCreateTime sets the create_time field if the given value is not nil.
func (stcc *SurveyTemplateCategoryCreate) SetNillableCreateTime(t *time.Time) *SurveyTemplateCategoryCreate {
	if t != nil {
		stcc.SetCreateTime(*t)
	}
	return stcc
}

// SetUpdateTime sets the update_time field.
func (stcc *SurveyTemplateCategoryCreate) SetUpdateTime(t time.Time) *SurveyTemplateCategoryCreate {
	stcc.mutation.SetUpdateTime(t)
	return stcc
}

// SetNillableUpdateTime sets the update_time field if the given value is not nil.
func (stcc *SurveyTemplateCategoryCreate) SetNillableUpdateTime(t *time.Time) *SurveyTemplateCategoryCreate {
	if t != nil {
		stcc.SetUpdateTime(*t)
	}
	return stcc
}

// SetCategoryTitle sets the category_title field.
func (stcc *SurveyTemplateCategoryCreate) SetCategoryTitle(s string) *SurveyTemplateCategoryCreate {
	stcc.mutation.SetCategoryTitle(s)
	return stcc
}

// SetCategoryDescription sets the category_description field.
func (stcc *SurveyTemplateCategoryCreate) SetCategoryDescription(s string) *SurveyTemplateCategoryCreate {
	stcc.mutation.SetCategoryDescription(s)
	return stcc
}

// AddSurveyTemplateQuestionIDs adds the survey_template_questions edge to SurveyTemplateQuestion by ids.
func (stcc *SurveyTemplateCategoryCreate) AddSurveyTemplateQuestionIDs(ids ...int) *SurveyTemplateCategoryCreate {
	stcc.mutation.AddSurveyTemplateQuestionIDs(ids...)
	return stcc
}

// AddSurveyTemplateQuestions adds the survey_template_questions edges to SurveyTemplateQuestion.
func (stcc *SurveyTemplateCategoryCreate) AddSurveyTemplateQuestions(s ...*SurveyTemplateQuestion) *SurveyTemplateCategoryCreate {
	ids := make([]int, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return stcc.AddSurveyTemplateQuestionIDs(ids...)
}

// SetLocationTypeID sets the location_type edge to LocationType by id.
func (stcc *SurveyTemplateCategoryCreate) SetLocationTypeID(id int) *SurveyTemplateCategoryCreate {
	stcc.mutation.SetLocationTypeID(id)
	return stcc
}

// SetNillableLocationTypeID sets the location_type edge to LocationType by id if the given value is not nil.
func (stcc *SurveyTemplateCategoryCreate) SetNillableLocationTypeID(id *int) *SurveyTemplateCategoryCreate {
	if id != nil {
		stcc = stcc.SetLocationTypeID(*id)
	}
	return stcc
}

// SetLocationType sets the location_type edge to LocationType.
func (stcc *SurveyTemplateCategoryCreate) SetLocationType(l *LocationType) *SurveyTemplateCategoryCreate {
	return stcc.SetLocationTypeID(l.ID)
}

// Mutation returns the SurveyTemplateCategoryMutation object of the builder.
func (stcc *SurveyTemplateCategoryCreate) Mutation() *SurveyTemplateCategoryMutation {
	return stcc.mutation
}

// Save creates the SurveyTemplateCategory in the database.
func (stcc *SurveyTemplateCategoryCreate) Save(ctx context.Context) (*SurveyTemplateCategory, error) {
	var (
		err  error
		node *SurveyTemplateCategory
	)
	stcc.defaults()
	if len(stcc.hooks) == 0 {
		if err = stcc.check(); err != nil {
			return nil, err
		}
		node, err = stcc.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*SurveyTemplateCategoryMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = stcc.check(); err != nil {
				return nil, err
			}
			stcc.mutation = mutation
			node, err = stcc.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(stcc.hooks) - 1; i >= 0; i-- {
			mut = stcc.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, stcc.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (stcc *SurveyTemplateCategoryCreate) SaveX(ctx context.Context) *SurveyTemplateCategory {
	v, err := stcc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// defaults sets the default values of the builder before save.
func (stcc *SurveyTemplateCategoryCreate) defaults() {
	if _, ok := stcc.mutation.CreateTime(); !ok {
		v := surveytemplatecategory.DefaultCreateTime()
		stcc.mutation.SetCreateTime(v)
	}
	if _, ok := stcc.mutation.UpdateTime(); !ok {
		v := surveytemplatecategory.DefaultUpdateTime()
		stcc.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (stcc *SurveyTemplateCategoryCreate) check() error {
	if _, ok := stcc.mutation.CreateTime(); !ok {
		return &ValidationError{Name: "create_time", err: errors.New("ent: missing required field \"create_time\"")}
	}
	if _, ok := stcc.mutation.UpdateTime(); !ok {
		return &ValidationError{Name: "update_time", err: errors.New("ent: missing required field \"update_time\"")}
	}
	if _, ok := stcc.mutation.CategoryTitle(); !ok {
		return &ValidationError{Name: "category_title", err: errors.New("ent: missing required field \"category_title\"")}
	}
	if _, ok := stcc.mutation.CategoryDescription(); !ok {
		return &ValidationError{Name: "category_description", err: errors.New("ent: missing required field \"category_description\"")}
	}
	return nil
}

func (stcc *SurveyTemplateCategoryCreate) sqlSave(ctx context.Context) (*SurveyTemplateCategory, error) {
	_node, _spec := stcc.createSpec()
	if err := sqlgraph.CreateNode(ctx, stcc.driver, _spec); err != nil {
		if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	return _node, nil
}

func (stcc *SurveyTemplateCategoryCreate) createSpec() (*SurveyTemplateCategory, *sqlgraph.CreateSpec) {
	var (
		_node = &SurveyTemplateCategory{config: stcc.config}
		_spec = &sqlgraph.CreateSpec{
			Table: surveytemplatecategory.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: surveytemplatecategory.FieldID,
			},
		}
	)
	if value, ok := stcc.mutation.CreateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: surveytemplatecategory.FieldCreateTime,
		})
		_node.CreateTime = value
	}
	if value, ok := stcc.mutation.UpdateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: surveytemplatecategory.FieldUpdateTime,
		})
		_node.UpdateTime = value
	}
	if value, ok := stcc.mutation.CategoryTitle(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: surveytemplatecategory.FieldCategoryTitle,
		})
		_node.CategoryTitle = value
	}
	if value, ok := stcc.mutation.CategoryDescription(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: surveytemplatecategory.FieldCategoryDescription,
		})
		_node.CategoryDescription = value
	}
	if nodes := stcc.mutation.SurveyTemplateQuestionsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   surveytemplatecategory.SurveyTemplateQuestionsTable,
			Columns: []string{surveytemplatecategory.SurveyTemplateQuestionsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: surveytemplatequestion.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := stcc.mutation.LocationTypeIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   surveytemplatecategory.LocationTypeTable,
			Columns: []string{surveytemplatecategory.LocationTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: locationtype.FieldID,
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

// SurveyTemplateCategoryCreateBulk is the builder for creating a bulk of SurveyTemplateCategory entities.
type SurveyTemplateCategoryCreateBulk struct {
	config
	builders []*SurveyTemplateCategoryCreate
}

// Save creates the SurveyTemplateCategory entities in the database.
func (stccb *SurveyTemplateCategoryCreateBulk) Save(ctx context.Context) ([]*SurveyTemplateCategory, error) {
	specs := make([]*sqlgraph.CreateSpec, len(stccb.builders))
	nodes := make([]*SurveyTemplateCategory, len(stccb.builders))
	mutators := make([]Mutator, len(stccb.builders))
	for i := range stccb.builders {
		func(i int, root context.Context) {
			builder := stccb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*SurveyTemplateCategoryMutation)
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
					_, err = mutators[i+1].Mutate(root, stccb.builders[i+1].mutation)
				} else {
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, stccb.driver, &sqlgraph.BatchCreateSpec{Nodes: specs}); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, stccb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX calls Save and panics if Save returns an error.
func (stccb *SurveyTemplateCategoryCreateBulk) SaveX(ctx context.Context) []*SurveyTemplateCategory {
	v, err := stccb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}
