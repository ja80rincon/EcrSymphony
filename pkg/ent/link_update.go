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
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/link"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
)

// LinkUpdate is the builder for updating Link entities.
type LinkUpdate struct {
	config
	hooks    []Hook
	mutation *LinkMutation
}

// Where adds a new predicate for the builder.
func (lu *LinkUpdate) Where(ps ...predicate.Link) *LinkUpdate {
	lu.mutation.predicates = append(lu.mutation.predicates, ps...)
	return lu
}

// SetFutureState sets the future_state field.
func (lu *LinkUpdate) SetFutureState(es enum.FutureState) *LinkUpdate {
	lu.mutation.SetFutureState(es)
	return lu
}

// SetNillableFutureState sets the future_state field if the given value is not nil.
func (lu *LinkUpdate) SetNillableFutureState(es *enum.FutureState) *LinkUpdate {
	if es != nil {
		lu.SetFutureState(*es)
	}
	return lu
}

// ClearFutureState clears the value of future_state.
func (lu *LinkUpdate) ClearFutureState() *LinkUpdate {
	lu.mutation.ClearFutureState()
	return lu
}

// AddPortIDs adds the ports edge to EquipmentPort by ids.
func (lu *LinkUpdate) AddPortIDs(ids ...int) *LinkUpdate {
	lu.mutation.AddPortIDs(ids...)
	return lu
}

// AddPorts adds the ports edges to EquipmentPort.
func (lu *LinkUpdate) AddPorts(e ...*EquipmentPort) *LinkUpdate {
	ids := make([]int, len(e))
	for i := range e {
		ids[i] = e[i].ID
	}
	return lu.AddPortIDs(ids...)
}

// SetWorkOrderID sets the work_order edge to WorkOrder by id.
func (lu *LinkUpdate) SetWorkOrderID(id int) *LinkUpdate {
	lu.mutation.SetWorkOrderID(id)
	return lu
}

// SetNillableWorkOrderID sets the work_order edge to WorkOrder by id if the given value is not nil.
func (lu *LinkUpdate) SetNillableWorkOrderID(id *int) *LinkUpdate {
	if id != nil {
		lu = lu.SetWorkOrderID(*id)
	}
	return lu
}

// SetWorkOrder sets the work_order edge to WorkOrder.
func (lu *LinkUpdate) SetWorkOrder(w *WorkOrder) *LinkUpdate {
	return lu.SetWorkOrderID(w.ID)
}

// AddPropertyIDs adds the properties edge to Property by ids.
func (lu *LinkUpdate) AddPropertyIDs(ids ...int) *LinkUpdate {
	lu.mutation.AddPropertyIDs(ids...)
	return lu
}

// AddProperties adds the properties edges to Property.
func (lu *LinkUpdate) AddProperties(p ...*Property) *LinkUpdate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return lu.AddPropertyIDs(ids...)
}

// AddServiceIDs adds the service edge to Service by ids.
func (lu *LinkUpdate) AddServiceIDs(ids ...int) *LinkUpdate {
	lu.mutation.AddServiceIDs(ids...)
	return lu
}

// AddService adds the service edges to Service.
func (lu *LinkUpdate) AddService(s ...*Service) *LinkUpdate {
	ids := make([]int, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return lu.AddServiceIDs(ids...)
}

// Mutation returns the LinkMutation object of the builder.
func (lu *LinkUpdate) Mutation() *LinkMutation {
	return lu.mutation
}

// ClearPorts clears all "ports" edges to type EquipmentPort.
func (lu *LinkUpdate) ClearPorts() *LinkUpdate {
	lu.mutation.ClearPorts()
	return lu
}

// RemovePortIDs removes the ports edge to EquipmentPort by ids.
func (lu *LinkUpdate) RemovePortIDs(ids ...int) *LinkUpdate {
	lu.mutation.RemovePortIDs(ids...)
	return lu
}

// RemovePorts removes ports edges to EquipmentPort.
func (lu *LinkUpdate) RemovePorts(e ...*EquipmentPort) *LinkUpdate {
	ids := make([]int, len(e))
	for i := range e {
		ids[i] = e[i].ID
	}
	return lu.RemovePortIDs(ids...)
}

// ClearWorkOrder clears the "work_order" edge to type WorkOrder.
func (lu *LinkUpdate) ClearWorkOrder() *LinkUpdate {
	lu.mutation.ClearWorkOrder()
	return lu
}

// ClearProperties clears all "properties" edges to type Property.
func (lu *LinkUpdate) ClearProperties() *LinkUpdate {
	lu.mutation.ClearProperties()
	return lu
}

// RemovePropertyIDs removes the properties edge to Property by ids.
func (lu *LinkUpdate) RemovePropertyIDs(ids ...int) *LinkUpdate {
	lu.mutation.RemovePropertyIDs(ids...)
	return lu
}

// RemoveProperties removes properties edges to Property.
func (lu *LinkUpdate) RemoveProperties(p ...*Property) *LinkUpdate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return lu.RemovePropertyIDs(ids...)
}

// ClearService clears all "service" edges to type Service.
func (lu *LinkUpdate) ClearService() *LinkUpdate {
	lu.mutation.ClearService()
	return lu
}

// RemoveServiceIDs removes the service edge to Service by ids.
func (lu *LinkUpdate) RemoveServiceIDs(ids ...int) *LinkUpdate {
	lu.mutation.RemoveServiceIDs(ids...)
	return lu
}

// RemoveService removes service edges to Service.
func (lu *LinkUpdate) RemoveService(s ...*Service) *LinkUpdate {
	ids := make([]int, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return lu.RemoveServiceIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (lu *LinkUpdate) Save(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	lu.defaults()
	if len(lu.hooks) == 0 {
		if err = lu.check(); err != nil {
			return 0, err
		}
		affected, err = lu.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*LinkMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = lu.check(); err != nil {
				return 0, err
			}
			lu.mutation = mutation
			affected, err = lu.sqlSave(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(lu.hooks) - 1; i >= 0; i-- {
			mut = lu.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, lu.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// SaveX is like Save, but panics if an error occurs.
func (lu *LinkUpdate) SaveX(ctx context.Context) int {
	affected, err := lu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (lu *LinkUpdate) Exec(ctx context.Context) error {
	_, err := lu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (lu *LinkUpdate) ExecX(ctx context.Context) {
	if err := lu.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (lu *LinkUpdate) defaults() {
	if _, ok := lu.mutation.UpdateTime(); !ok {
		v := link.UpdateDefaultUpdateTime()
		lu.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (lu *LinkUpdate) check() error {
	if v, ok := lu.mutation.FutureState(); ok {
		if err := link.FutureStateValidator(v); err != nil {
			return &ValidationError{Name: "future_state", err: fmt.Errorf("ent: validator failed for field \"future_state\": %w", err)}
		}
	}
	return nil
}

func (lu *LinkUpdate) sqlSave(ctx context.Context) (n int, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   link.Table,
			Columns: link.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: link.FieldID,
			},
		},
	}
	if ps := lu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := lu.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: link.FieldUpdateTime,
		})
	}
	if value, ok := lu.mutation.FutureState(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeEnum,
			Value:  value,
			Column: link.FieldFutureState,
		})
	}
	if lu.mutation.FutureStateCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeEnum,
			Column: link.FieldFutureState,
		})
	}
	if lu.mutation.PortsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   link.PortsTable,
			Columns: []string{link.PortsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: equipmentport.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := lu.mutation.RemovedPortsIDs(); len(nodes) > 0 && !lu.mutation.PortsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   link.PortsTable,
			Columns: []string{link.PortsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: equipmentport.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := lu.mutation.PortsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   link.PortsTable,
			Columns: []string{link.PortsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: equipmentport.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if lu.mutation.WorkOrderCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   link.WorkOrderTable,
			Columns: []string{link.WorkOrderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: workorder.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := lu.mutation.WorkOrderIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   link.WorkOrderTable,
			Columns: []string{link.WorkOrderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: workorder.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if lu.mutation.PropertiesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   link.PropertiesTable,
			Columns: []string{link.PropertiesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: property.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := lu.mutation.RemovedPropertiesIDs(); len(nodes) > 0 && !lu.mutation.PropertiesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   link.PropertiesTable,
			Columns: []string{link.PropertiesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: property.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := lu.mutation.PropertiesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   link.PropertiesTable,
			Columns: []string{link.PropertiesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: property.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if lu.mutation.ServiceCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   link.ServiceTable,
			Columns: link.ServicePrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: service.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := lu.mutation.RemovedServiceIDs(); len(nodes) > 0 && !lu.mutation.ServiceCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   link.ServiceTable,
			Columns: link.ServicePrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: service.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := lu.mutation.ServiceIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   link.ServiceTable,
			Columns: link.ServicePrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: service.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, lu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{link.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return 0, err
	}
	return n, nil
}

// LinkUpdateOne is the builder for updating a single Link entity.
type LinkUpdateOne struct {
	config
	hooks    []Hook
	mutation *LinkMutation
}

// SetFutureState sets the future_state field.
func (luo *LinkUpdateOne) SetFutureState(es enum.FutureState) *LinkUpdateOne {
	luo.mutation.SetFutureState(es)
	return luo
}

// SetNillableFutureState sets the future_state field if the given value is not nil.
func (luo *LinkUpdateOne) SetNillableFutureState(es *enum.FutureState) *LinkUpdateOne {
	if es != nil {
		luo.SetFutureState(*es)
	}
	return luo
}

// ClearFutureState clears the value of future_state.
func (luo *LinkUpdateOne) ClearFutureState() *LinkUpdateOne {
	luo.mutation.ClearFutureState()
	return luo
}

// AddPortIDs adds the ports edge to EquipmentPort by ids.
func (luo *LinkUpdateOne) AddPortIDs(ids ...int) *LinkUpdateOne {
	luo.mutation.AddPortIDs(ids...)
	return luo
}

// AddPorts adds the ports edges to EquipmentPort.
func (luo *LinkUpdateOne) AddPorts(e ...*EquipmentPort) *LinkUpdateOne {
	ids := make([]int, len(e))
	for i := range e {
		ids[i] = e[i].ID
	}
	return luo.AddPortIDs(ids...)
}

// SetWorkOrderID sets the work_order edge to WorkOrder by id.
func (luo *LinkUpdateOne) SetWorkOrderID(id int) *LinkUpdateOne {
	luo.mutation.SetWorkOrderID(id)
	return luo
}

// SetNillableWorkOrderID sets the work_order edge to WorkOrder by id if the given value is not nil.
func (luo *LinkUpdateOne) SetNillableWorkOrderID(id *int) *LinkUpdateOne {
	if id != nil {
		luo = luo.SetWorkOrderID(*id)
	}
	return luo
}

// SetWorkOrder sets the work_order edge to WorkOrder.
func (luo *LinkUpdateOne) SetWorkOrder(w *WorkOrder) *LinkUpdateOne {
	return luo.SetWorkOrderID(w.ID)
}

// AddPropertyIDs adds the properties edge to Property by ids.
func (luo *LinkUpdateOne) AddPropertyIDs(ids ...int) *LinkUpdateOne {
	luo.mutation.AddPropertyIDs(ids...)
	return luo
}

// AddProperties adds the properties edges to Property.
func (luo *LinkUpdateOne) AddProperties(p ...*Property) *LinkUpdateOne {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return luo.AddPropertyIDs(ids...)
}

// AddServiceIDs adds the service edge to Service by ids.
func (luo *LinkUpdateOne) AddServiceIDs(ids ...int) *LinkUpdateOne {
	luo.mutation.AddServiceIDs(ids...)
	return luo
}

// AddService adds the service edges to Service.
func (luo *LinkUpdateOne) AddService(s ...*Service) *LinkUpdateOne {
	ids := make([]int, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return luo.AddServiceIDs(ids...)
}

// Mutation returns the LinkMutation object of the builder.
func (luo *LinkUpdateOne) Mutation() *LinkMutation {
	return luo.mutation
}

// ClearPorts clears all "ports" edges to type EquipmentPort.
func (luo *LinkUpdateOne) ClearPorts() *LinkUpdateOne {
	luo.mutation.ClearPorts()
	return luo
}

// RemovePortIDs removes the ports edge to EquipmentPort by ids.
func (luo *LinkUpdateOne) RemovePortIDs(ids ...int) *LinkUpdateOne {
	luo.mutation.RemovePortIDs(ids...)
	return luo
}

// RemovePorts removes ports edges to EquipmentPort.
func (luo *LinkUpdateOne) RemovePorts(e ...*EquipmentPort) *LinkUpdateOne {
	ids := make([]int, len(e))
	for i := range e {
		ids[i] = e[i].ID
	}
	return luo.RemovePortIDs(ids...)
}

// ClearWorkOrder clears the "work_order" edge to type WorkOrder.
func (luo *LinkUpdateOne) ClearWorkOrder() *LinkUpdateOne {
	luo.mutation.ClearWorkOrder()
	return luo
}

// ClearProperties clears all "properties" edges to type Property.
func (luo *LinkUpdateOne) ClearProperties() *LinkUpdateOne {
	luo.mutation.ClearProperties()
	return luo
}

// RemovePropertyIDs removes the properties edge to Property by ids.
func (luo *LinkUpdateOne) RemovePropertyIDs(ids ...int) *LinkUpdateOne {
	luo.mutation.RemovePropertyIDs(ids...)
	return luo
}

// RemoveProperties removes properties edges to Property.
func (luo *LinkUpdateOne) RemoveProperties(p ...*Property) *LinkUpdateOne {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return luo.RemovePropertyIDs(ids...)
}

// ClearService clears all "service" edges to type Service.
func (luo *LinkUpdateOne) ClearService() *LinkUpdateOne {
	luo.mutation.ClearService()
	return luo
}

// RemoveServiceIDs removes the service edge to Service by ids.
func (luo *LinkUpdateOne) RemoveServiceIDs(ids ...int) *LinkUpdateOne {
	luo.mutation.RemoveServiceIDs(ids...)
	return luo
}

// RemoveService removes service edges to Service.
func (luo *LinkUpdateOne) RemoveService(s ...*Service) *LinkUpdateOne {
	ids := make([]int, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return luo.RemoveServiceIDs(ids...)
}

// Save executes the query and returns the updated entity.
func (luo *LinkUpdateOne) Save(ctx context.Context) (*Link, error) {
	var (
		err  error
		node *Link
	)
	luo.defaults()
	if len(luo.hooks) == 0 {
		if err = luo.check(); err != nil {
			return nil, err
		}
		node, err = luo.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*LinkMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = luo.check(); err != nil {
				return nil, err
			}
			luo.mutation = mutation
			node, err = luo.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(luo.hooks) - 1; i >= 0; i-- {
			mut = luo.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, luo.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX is like Save, but panics if an error occurs.
func (luo *LinkUpdateOne) SaveX(ctx context.Context) *Link {
	node, err := luo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (luo *LinkUpdateOne) Exec(ctx context.Context) error {
	_, err := luo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (luo *LinkUpdateOne) ExecX(ctx context.Context) {
	if err := luo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (luo *LinkUpdateOne) defaults() {
	if _, ok := luo.mutation.UpdateTime(); !ok {
		v := link.UpdateDefaultUpdateTime()
		luo.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (luo *LinkUpdateOne) check() error {
	if v, ok := luo.mutation.FutureState(); ok {
		if err := link.FutureStateValidator(v); err != nil {
			return &ValidationError{Name: "future_state", err: fmt.Errorf("ent: validator failed for field \"future_state\": %w", err)}
		}
	}
	return nil
}

func (luo *LinkUpdateOne) sqlSave(ctx context.Context) (_node *Link, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   link.Table,
			Columns: link.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: link.FieldID,
			},
		},
	}
	id, ok := luo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "ID", err: fmt.Errorf("missing Link.ID for update")}
	}
	_spec.Node.ID.Value = id
	if value, ok := luo.mutation.UpdateTime(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: link.FieldUpdateTime,
		})
	}
	if value, ok := luo.mutation.FutureState(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeEnum,
			Value:  value,
			Column: link.FieldFutureState,
		})
	}
	if luo.mutation.FutureStateCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeEnum,
			Column: link.FieldFutureState,
		})
	}
	if luo.mutation.PortsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   link.PortsTable,
			Columns: []string{link.PortsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: equipmentport.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := luo.mutation.RemovedPortsIDs(); len(nodes) > 0 && !luo.mutation.PortsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   link.PortsTable,
			Columns: []string{link.PortsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: equipmentport.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := luo.mutation.PortsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   link.PortsTable,
			Columns: []string{link.PortsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: equipmentport.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if luo.mutation.WorkOrderCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   link.WorkOrderTable,
			Columns: []string{link.WorkOrderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: workorder.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := luo.mutation.WorkOrderIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   link.WorkOrderTable,
			Columns: []string{link.WorkOrderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: workorder.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if luo.mutation.PropertiesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   link.PropertiesTable,
			Columns: []string{link.PropertiesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: property.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := luo.mutation.RemovedPropertiesIDs(); len(nodes) > 0 && !luo.mutation.PropertiesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   link.PropertiesTable,
			Columns: []string{link.PropertiesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: property.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := luo.mutation.PropertiesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   link.PropertiesTable,
			Columns: []string{link.PropertiesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: property.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if luo.mutation.ServiceCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   link.ServiceTable,
			Columns: link.ServicePrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: service.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := luo.mutation.RemovedServiceIDs(); len(nodes) > 0 && !luo.mutation.ServiceCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   link.ServiceTable,
			Columns: link.ServicePrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: service.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := luo.mutation.ServiceIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   link.ServiceTable,
			Columns: link.ServicePrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: service.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &Link{config: luo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues()
	if err = sqlgraph.UpdateNode(ctx, luo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{link.Label}
		} else if cerr, ok := isSQLConstraintError(err); ok {
			err = cerr
		}
		return nil, err
	}
	return _node, nil
}
