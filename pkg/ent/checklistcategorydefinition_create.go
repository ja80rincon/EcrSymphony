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
	"github.com/facebookincubator/symphony/pkg/ent/checklistcategorydefinition"
	"github.com/facebookincubator/symphony/pkg/ent/checklistitemdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/workordertemplate"
	"github.com/facebookincubator/symphony/pkg/ent/workordertype"
)

// CheckListCategoryDefinitionCreate is the builder for creating a CheckListCategoryDefinition entity.
type CheckListCategoryDefinitionCreate struct {
	config
	mutation *CheckListCategoryDefinitionMutation
	hooks    []Hook
}

// SetCreateTime sets the create_time field.
func (clcdc *CheckListCategoryDefinitionCreate) SetCreateTime(t time.Time) *CheckListCategoryDefinitionCreate {
	clcdc.mutation.SetCreateTime(t)
	return clcdc
}

// SetNillableCreateTime sets the create_time field if the given value is not nil.
func (clcdc *CheckListCategoryDefinitionCreate) SetNillableCreateTime(t *time.Time) *CheckListCategoryDefinitionCreate {
	if t != nil {
		clcdc.SetCreateTime(*t)
	}
	return clcdc
}

// SetUpdateTime sets the update_time field.
func (clcdc *CheckListCategoryDefinitionCreate) SetUpdateTime(t time.Time) *CheckListCategoryDefinitionCreate {
	clcdc.mutation.SetUpdateTime(t)
	return clcdc
}

// SetNillableUpdateTime sets the update_time field if the given value is not nil.
func (clcdc *CheckListCategoryDefinitionCreate) SetNillableUpdateTime(t *time.Time) *CheckListCategoryDefinitionCreate {
	if t != nil {
		clcdc.SetUpdateTime(*t)
	}
	return clcdc
}

// SetTitle sets the title field.
func (clcdc *CheckListCategoryDefinitionCreate) SetTitle(s string) *CheckListCategoryDefinitionCreate {
	clcdc.mutation.SetTitle(s)
	return clcdc
}

// SetDescription sets the description field.
func (clcdc *CheckListCategoryDefinitionCreate) SetDescription(s string) *CheckListCategoryDefinitionCreate {
	clcdc.mutation.SetDescription(s)
	return clcdc
}

// SetNillableDescription sets the description field if the given value is not nil.
func (clcdc *CheckListCategoryDefinitionCreate) SetNillableDescription(s *string) *CheckListCategoryDefinitionCreate {
	if s != nil {
		clcdc.SetDescription(*s)
	}
	return clcdc
}

// AddCheckListItemDefinitionIDs adds the check_list_item_definitions edge to CheckListItemDefinition by ids.
func (clcdc *CheckListCategoryDefinitionCreate) AddCheckListItemDefinitionIDs(ids ...int) *CheckListCategoryDefinitionCreate {
	clcdc.mutation.AddCheckListItemDefinitionIDs(ids...)
	return clcdc
}

// AddCheckListItemDefinitions adds the check_list_item_definitions edges to CheckListItemDefinition.
func (clcdc *CheckListCategoryDefinitionCreate) AddCheckListItemDefinitions(c ...*CheckListItemDefinition) *CheckListCategoryDefinitionCreate {
	ids := make([]int, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return clcdc.AddCheckListItemDefinitionIDs(ids...)
}

// SetWorkOrderTypeID sets the work_order_type edge to WorkOrderType by id.
func (clcdc *CheckListCategoryDefinitionCreate) SetWorkOrderTypeID(id int) *CheckListCategoryDefinitionCreate {
	clcdc.mutation.SetWorkOrderTypeID(id)
	return clcdc
}

// SetNillableWorkOrderTypeID sets the work_order_type edge to WorkOrderType by id if the given value is not nil.
func (clcdc *CheckListCategoryDefinitionCreate) SetNillableWorkOrderTypeID(id *int) *CheckListCategoryDefinitionCreate {
	if id != nil {
		clcdc = clcdc.SetWorkOrderTypeID(*id)
	}
	return clcdc
}

// SetWorkOrderType sets the work_order_type edge to WorkOrderType.
func (clcdc *CheckListCategoryDefinitionCreate) SetWorkOrderType(w *WorkOrderType) *CheckListCategoryDefinitionCreate {
	return clcdc.SetWorkOrderTypeID(w.ID)
}

// SetWorkOrderTemplateID sets the work_order_template edge to WorkOrderTemplate by id.
func (clcdc *CheckListCategoryDefinitionCreate) SetWorkOrderTemplateID(id int) *CheckListCategoryDefinitionCreate {
	clcdc.mutation.SetWorkOrderTemplateID(id)
	return clcdc
}

// SetNillableWorkOrderTemplateID sets the work_order_template edge to WorkOrderTemplate by id if the given value is not nil.
func (clcdc *CheckListCategoryDefinitionCreate) SetNillableWorkOrderTemplateID(id *int) *CheckListCategoryDefinitionCreate {
	if id != nil {
		clcdc = clcdc.SetWorkOrderTemplateID(*id)
	}
	return clcdc
}

// SetWorkOrderTemplate sets the work_order_template edge to WorkOrderTemplate.
func (clcdc *CheckListCategoryDefinitionCreate) SetWorkOrderTemplate(w *WorkOrderTemplate) *CheckListCategoryDefinitionCreate {
	return clcdc.SetWorkOrderTemplateID(w.ID)
}

// Mutation returns the CheckListCategoryDefinitionMutation object of the builder.
func (clcdc *CheckListCategoryDefinitionCreate) Mutation() *CheckListCategoryDefinitionMutation {
	return clcdc.mutation
}

// Save creates the CheckListCategoryDefinition in the database.
func (clcdc *CheckListCategoryDefinitionCreate) Save(ctx context.Context) (*CheckListCategoryDefinition, error) {
	var (
		err  error
		node *CheckListCategoryDefinition
	)
	clcdc.defaults()
	if len(clcdc.hooks) == 0 {
		if err = clcdc.check(); err != nil {
			return nil, err
		}
		node, err = clcdc.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*CheckListCategoryDefinitionMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = clcdc.check(); err != nil {
				return nil, err
			}
			clcdc.mutation = mutation
			node, err = clcdc.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(clcdc.hooks) - 1; i >= 0; i-- {
			mut = clcdc.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, clcdc.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (clcdc *CheckListCategoryDefinitionCreate) SaveX(ctx context.Context) *CheckListCategoryDefinition {
	v, err := clcdc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// defaults sets the default values of the builder before save.
func (clcdc *CheckListCategoryDefinitionCreate) defaults() {
	if _, ok := clcdc.mutation.CreateTime(); !ok {
		v := checklistcategorydefinition.DefaultCreateTime()
		clcdc.mutation.SetCreateTime(v)
	}
	if _, ok := clcdc.mutation.UpdateTime(); !ok {
		v := checklistcategorydefinition.DefaultUpdateTime()
		clcdc.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (clcdc *CheckListCategoryDefinitionCreate) check() error {
	if _, ok := clcdc.mutation.CreateTime(); !ok {
		return &ValidationError{Name: "create_time", err: errors.New("ent: missing required field \"create_time\"")}
	}
	if _, ok := clcdc.mutation.UpdateTime(); !ok {
		return &ValidationError{Name: "update_time", err: errors.New("ent: missing required field \"update_time\"")}
	}
	if _, ok := clcdc.mutation.Title(); !ok {
		return &ValidationError{Name: "title", err: errors.New("ent: missing required field \"title\"")}
	}
	if v, ok := clcdc.mutation.Title(); ok {
		if err := checklistcategorydefinition.TitleValidator(v); err != nil {
			return &ValidationError{Name: "title", err: fmt.Errorf("ent: validator failed for field \"title\": %w", err)}
		}
	}
	return nil
}

func (clcdc *CheckListCategoryDefinitionCreate) sqlSave(ctx context.Context) (*CheckListCategoryDefinition, error) {
	_node, _spec := clcdc.createSpec()
	if err := sqlgraph.CreateNode(ctx, clcdc.driver, _spec); err != nil {
		if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	return _node, nil
}

func (clcdc *CheckListCategoryDefinitionCreate) createSpec() (*CheckListCategoryDefinition, *sqlgraph.CreateSpec) {
	var (
		_node = &CheckListCategoryDefinition{config: clcdc.config}
		_spec = &sqlgraph.CreateSpec{
			Table: checklistcategorydefinition.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: checklistcategorydefinition.FieldID,
			},
		}
	)
	if value, ok := clcdc.mutation.CreateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: checklistcategorydefinition.FieldCreateTime,
		})
		_node.CreateTime = value
	}
	if value, ok := clcdc.mutation.UpdateTime(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: checklistcategorydefinition.FieldUpdateTime,
		})
		_node.UpdateTime = value
	}
	if value, ok := clcdc.mutation.Title(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: checklistcategorydefinition.FieldTitle,
		})
		_node.Title = value
	}
	if value, ok := clcdc.mutation.Description(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: checklistcategorydefinition.FieldDescription,
		})
		_node.Description = value
	}
	if nodes := clcdc.mutation.CheckListItemDefinitionsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   checklistcategorydefinition.CheckListItemDefinitionsTable,
			Columns: []string{checklistcategorydefinition.CheckListItemDefinitionsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: checklistitemdefinition.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := clcdc.mutation.WorkOrderTypeIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   checklistcategorydefinition.WorkOrderTypeTable,
			Columns: []string{checklistcategorydefinition.WorkOrderTypeColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: workordertype.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := clcdc.mutation.WorkOrderTemplateIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   checklistcategorydefinition.WorkOrderTemplateTable,
			Columns: []string{checklistcategorydefinition.WorkOrderTemplateColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: workordertemplate.FieldID,
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

// CheckListCategoryDefinitionCreateBulk is the builder for creating a bulk of CheckListCategoryDefinition entities.
type CheckListCategoryDefinitionCreateBulk struct {
	config
	builders []*CheckListCategoryDefinitionCreate
}

// Save creates the CheckListCategoryDefinition entities in the database.
func (clcdcb *CheckListCategoryDefinitionCreateBulk) Save(ctx context.Context) ([]*CheckListCategoryDefinition, error) {
	specs := make([]*sqlgraph.CreateSpec, len(clcdcb.builders))
	nodes := make([]*CheckListCategoryDefinition, len(clcdcb.builders))
	mutators := make([]Mutator, len(clcdcb.builders))
	for i := range clcdcb.builders {
		func(i int, root context.Context) {
			builder := clcdcb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*CheckListCategoryDefinitionMutation)
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
					_, err = mutators[i+1].Mutate(root, clcdcb.builders[i+1].mutation)
				} else {
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, clcdcb.driver, &sqlgraph.BatchCreateSpec{Nodes: specs}); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, clcdcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX calls Save and panics if Save returns an error.
func (clcdcb *CheckListCategoryDefinitionCreateBulk) SaveX(ctx context.Context) []*CheckListCategoryDefinition {
	v, err := clcdcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}
