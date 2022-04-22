// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"database/sql/driver"
	"errors"
	"fmt"
	"math"

	"github.com/facebook/ent/dialect/sql"
	"github.com/facebook/ent/dialect/sql/sqlgraph"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/ent/formula"
	"github.com/facebookincubator/symphony/pkg/ent/networktype"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
)

// NetworkTypeQuery is the builder for querying NetworkType entities.
type NetworkTypeQuery struct {
	config
	limit      *int
	offset     *int
	order      []OrderFunc
	unique     []string
	predicates []predicate.NetworkType
	// eager-loading edges.
	withFormulaNetworkTypeFK *FormulaQuery
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Where adds a new predicate for the builder.
func (ntq *NetworkTypeQuery) Where(ps ...predicate.NetworkType) *NetworkTypeQuery {
	ntq.predicates = append(ntq.predicates, ps...)
	return ntq
}

// Limit adds a limit step to the query.
func (ntq *NetworkTypeQuery) Limit(limit int) *NetworkTypeQuery {
	ntq.limit = &limit
	return ntq
}

// Offset adds an offset step to the query.
func (ntq *NetworkTypeQuery) Offset(offset int) *NetworkTypeQuery {
	ntq.offset = &offset
	return ntq
}

// Order adds an order step to the query.
func (ntq *NetworkTypeQuery) Order(o ...OrderFunc) *NetworkTypeQuery {
	ntq.order = append(ntq.order, o...)
	return ntq
}

// QueryFormulaNetworkTypeFK chains the current query on the formulaNetworkType_FK edge.
func (ntq *NetworkTypeQuery) QueryFormulaNetworkTypeFK() *FormulaQuery {
	query := &FormulaQuery{config: ntq.config}
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := ntq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := ntq.sqlQuery()
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(networktype.Table, networktype.FieldID, selector),
			sqlgraph.To(formula.Table, formula.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, networktype.FormulaNetworkTypeFKTable, networktype.FormulaNetworkTypeFKColumn),
		)
		fromU = sqlgraph.SetNeighbors(ntq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// First returns the first NetworkType entity in the query. Returns *NotFoundError when no networktype was found.
func (ntq *NetworkTypeQuery) First(ctx context.Context) (*NetworkType, error) {
	nodes, err := ntq.Limit(1).All(ctx)
	if err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nil, &NotFoundError{networktype.Label}
	}
	return nodes[0], nil
}

// FirstX is like First, but panics if an error occurs.
func (ntq *NetworkTypeQuery) FirstX(ctx context.Context) *NetworkType {
	node, err := ntq.First(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return node
}

// FirstID returns the first NetworkType id in the query. Returns *NotFoundError when no id was found.
func (ntq *NetworkTypeQuery) FirstID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = ntq.Limit(1).IDs(ctx); err != nil {
		return
	}
	if len(ids) == 0 {
		err = &NotFoundError{networktype.Label}
		return
	}
	return ids[0], nil
}

// FirstIDX is like FirstID, but panics if an error occurs.
func (ntq *NetworkTypeQuery) FirstIDX(ctx context.Context) int {
	id, err := ntq.FirstID(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return id
}

// Only returns the only NetworkType entity in the query, returns an error if not exactly one entity was returned.
func (ntq *NetworkTypeQuery) Only(ctx context.Context) (*NetworkType, error) {
	nodes, err := ntq.Limit(2).All(ctx)
	if err != nil {
		return nil, err
	}
	switch len(nodes) {
	case 1:
		return nodes[0], nil
	case 0:
		return nil, &NotFoundError{networktype.Label}
	default:
		return nil, &NotSingularError{networktype.Label}
	}
}

// OnlyX is like Only, but panics if an error occurs.
func (ntq *NetworkTypeQuery) OnlyX(ctx context.Context) *NetworkType {
	node, err := ntq.Only(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// OnlyID returns the only NetworkType id in the query, returns an error if not exactly one id was returned.
func (ntq *NetworkTypeQuery) OnlyID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = ntq.Limit(2).IDs(ctx); err != nil {
		return
	}
	switch len(ids) {
	case 1:
		id = ids[0]
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = &NotSingularError{networktype.Label}
	}
	return
}

// OnlyIDX is like OnlyID, but panics if an error occurs.
func (ntq *NetworkTypeQuery) OnlyIDX(ctx context.Context) int {
	id, err := ntq.OnlyID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// All executes the query and returns a list of NetworkTypes.
func (ntq *NetworkTypeQuery) All(ctx context.Context) ([]*NetworkType, error) {
	if err := ntq.prepareQuery(ctx); err != nil {
		return nil, err
	}
	return ntq.sqlAll(ctx)
}

// AllX is like All, but panics if an error occurs.
func (ntq *NetworkTypeQuery) AllX(ctx context.Context) []*NetworkType {
	nodes, err := ntq.All(ctx)
	if err != nil {
		panic(err)
	}
	return nodes
}

// IDs executes the query and returns a list of NetworkType ids.
func (ntq *NetworkTypeQuery) IDs(ctx context.Context) ([]int, error) {
	var ids []int
	if err := ntq.Select(networktype.FieldID).Scan(ctx, &ids); err != nil {
		return nil, err
	}
	return ids, nil
}

// IDsX is like IDs, but panics if an error occurs.
func (ntq *NetworkTypeQuery) IDsX(ctx context.Context) []int {
	ids, err := ntq.IDs(ctx)
	if err != nil {
		panic(err)
	}
	return ids
}

// Count returns the count of the given query.
func (ntq *NetworkTypeQuery) Count(ctx context.Context) (int, error) {
	if err := ntq.prepareQuery(ctx); err != nil {
		return 0, err
	}
	return ntq.sqlCount(ctx)
}

// CountX is like Count, but panics if an error occurs.
func (ntq *NetworkTypeQuery) CountX(ctx context.Context) int {
	count, err := ntq.Count(ctx)
	if err != nil {
		panic(err)
	}
	return count
}

// Exist returns true if the query has elements in the graph.
func (ntq *NetworkTypeQuery) Exist(ctx context.Context) (bool, error) {
	if err := ntq.prepareQuery(ctx); err != nil {
		return false, err
	}
	return ntq.sqlExist(ctx)
}

// ExistX is like Exist, but panics if an error occurs.
func (ntq *NetworkTypeQuery) ExistX(ctx context.Context) bool {
	exist, err := ntq.Exist(ctx)
	if err != nil {
		panic(err)
	}
	return exist
}

// Clone returns a duplicate of the query builder, including all associated steps. It can be
// used to prepare common query builders and use them differently after the clone is made.
func (ntq *NetworkTypeQuery) Clone() *NetworkTypeQuery {
	if ntq == nil {
		return nil
	}
	return &NetworkTypeQuery{
		config:                   ntq.config,
		limit:                    ntq.limit,
		offset:                   ntq.offset,
		order:                    append([]OrderFunc{}, ntq.order...),
		unique:                   append([]string{}, ntq.unique...),
		predicates:               append([]predicate.NetworkType{}, ntq.predicates...),
		withFormulaNetworkTypeFK: ntq.withFormulaNetworkTypeFK.Clone(),
		// clone intermediate query.
		sql:  ntq.sql.Clone(),
		path: ntq.path,
	}
}

//  WithFormulaNetworkTypeFK tells the query-builder to eager-loads the nodes that are connected to
// the "formulaNetworkType_FK" edge. The optional arguments used to configure the query builder of the edge.
func (ntq *NetworkTypeQuery) WithFormulaNetworkTypeFK(opts ...func(*FormulaQuery)) *NetworkTypeQuery {
	query := &FormulaQuery{config: ntq.config}
	for _, opt := range opts {
		opt(query)
	}
	ntq.withFormulaNetworkTypeFK = query
	return ntq
}

// GroupBy used to group vertices by one or more fields/columns.
// It is often used with aggregate functions, like: count, max, mean, min, sum.
//
// Example:
//
//	var v []struct {
//		CreateTime time.Time `json:"create_time,omitempty"`
//		Count int `json:"count,omitempty"`
//	}
//
//	client.NetworkType.Query().
//		GroupBy(networktype.FieldCreateTime).
//		Aggregate(ent.Count()).
//		Scan(ctx, &v)
//
func (ntq *NetworkTypeQuery) GroupBy(field string, fields ...string) *NetworkTypeGroupBy {
	group := &NetworkTypeGroupBy{config: ntq.config}
	group.fields = append([]string{field}, fields...)
	group.path = func(ctx context.Context) (prev *sql.Selector, err error) {
		if err := ntq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		return ntq.sqlQuery(), nil
	}
	return group
}

// Select one or more fields from the given query.
//
// Example:
//
//	var v []struct {
//		CreateTime time.Time `json:"create_time,omitempty"`
//	}
//
//	client.NetworkType.Query().
//		Select(networktype.FieldCreateTime).
//		Scan(ctx, &v)
//
func (ntq *NetworkTypeQuery) Select(field string, fields ...string) *NetworkTypeSelect {
	selector := &NetworkTypeSelect{config: ntq.config}
	selector.fields = append([]string{field}, fields...)
	selector.path = func(ctx context.Context) (prev *sql.Selector, err error) {
		if err := ntq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		return ntq.sqlQuery(), nil
	}
	return selector
}

func (ntq *NetworkTypeQuery) prepareQuery(ctx context.Context) error {
	if ntq.path != nil {
		prev, err := ntq.path(ctx)
		if err != nil {
			return err
		}
		ntq.sql = prev
	}
	if err := networktype.Policy.EvalQuery(ctx, ntq); err != nil {
		return err
	}
	return nil
}

func (ntq *NetworkTypeQuery) sqlAll(ctx context.Context) ([]*NetworkType, error) {
	var (
		nodes       = []*NetworkType{}
		_spec       = ntq.querySpec()
		loadedTypes = [1]bool{
			ntq.withFormulaNetworkTypeFK != nil,
		}
	)
	_spec.ScanValues = func() []interface{} {
		node := &NetworkType{config: ntq.config}
		nodes = append(nodes, node)
		values := node.scanValues()
		return values
	}
	_spec.Assign = func(values ...interface{}) error {
		if len(nodes) == 0 {
			return fmt.Errorf("ent: Assign called without calling ScanValues")
		}
		node := nodes[len(nodes)-1]
		node.Edges.loadedTypes = loadedTypes
		return node.assignValues(values...)
	}
	if err := sqlgraph.QueryNodes(ctx, ntq.driver, _spec); err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nodes, nil
	}

	if query := ntq.withFormulaNetworkTypeFK; query != nil {
		fks := make([]driver.Value, 0, len(nodes))
		nodeids := make(map[int]*NetworkType)
		for i := range nodes {
			fks = append(fks, nodes[i].ID)
			nodeids[nodes[i].ID] = nodes[i]
			nodes[i].Edges.FormulaNetworkTypeFK = []*Formula{}
		}
		query.withFKs = true
		query.Where(predicate.Formula(func(s *sql.Selector) {
			s.Where(sql.InValues(networktype.FormulaNetworkTypeFKColumn, fks...))
		}))
		neighbors, err := query.All(ctx)
		if err != nil {
			return nil, err
		}
		for _, n := range neighbors {
			fk := n.network_type_formula_network_type_fk
			if fk == nil {
				return nil, fmt.Errorf(`foreign-key "network_type_formula_network_type_fk" is nil for node %v`, n.ID)
			}
			node, ok := nodeids[*fk]
			if !ok {
				return nil, fmt.Errorf(`unexpected foreign-key "network_type_formula_network_type_fk" returned %v for node %v`, *fk, n.ID)
			}
			node.Edges.FormulaNetworkTypeFK = append(node.Edges.FormulaNetworkTypeFK, n)
		}
	}

	return nodes, nil
}

func (ntq *NetworkTypeQuery) sqlCount(ctx context.Context) (int, error) {
	_spec := ntq.querySpec()
	return sqlgraph.CountNodes(ctx, ntq.driver, _spec)
}

func (ntq *NetworkTypeQuery) sqlExist(ctx context.Context) (bool, error) {
	n, err := ntq.sqlCount(ctx)
	if err != nil {
		return false, fmt.Errorf("ent: check existence: %v", err)
	}
	return n > 0, nil
}

func (ntq *NetworkTypeQuery) querySpec() *sqlgraph.QuerySpec {
	_spec := &sqlgraph.QuerySpec{
		Node: &sqlgraph.NodeSpec{
			Table:   networktype.Table,
			Columns: networktype.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: networktype.FieldID,
			},
		},
		From:   ntq.sql,
		Unique: true,
	}
	if ps := ntq.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if limit := ntq.limit; limit != nil {
		_spec.Limit = *limit
	}
	if offset := ntq.offset; offset != nil {
		_spec.Offset = *offset
	}
	if ps := ntq.order; len(ps) > 0 {
		_spec.Order = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector, networktype.ValidColumn)
			}
		}
	}
	return _spec
}

func (ntq *NetworkTypeQuery) sqlQuery() *sql.Selector {
	builder := sql.Dialect(ntq.driver.Dialect())
	t1 := builder.Table(networktype.Table)
	selector := builder.Select(t1.Columns(networktype.Columns...)...).From(t1)
	if ntq.sql != nil {
		selector = ntq.sql
		selector.Select(selector.Columns(networktype.Columns...)...)
	}
	for _, p := range ntq.predicates {
		p(selector)
	}
	for _, p := range ntq.order {
		p(selector, networktype.ValidColumn)
	}
	if offset := ntq.offset; offset != nil {
		// limit is mandatory for offset clause. We start
		// with default value, and override it below if needed.
		selector.Offset(*offset).Limit(math.MaxInt32)
	}
	if limit := ntq.limit; limit != nil {
		selector.Limit(*limit)
	}
	return selector
}

// NetworkTypeGroupBy is the builder for group-by NetworkType entities.
type NetworkTypeGroupBy struct {
	config
	fields []string
	fns    []AggregateFunc
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Aggregate adds the given aggregation functions to the group-by query.
func (ntgb *NetworkTypeGroupBy) Aggregate(fns ...AggregateFunc) *NetworkTypeGroupBy {
	ntgb.fns = append(ntgb.fns, fns...)
	return ntgb
}

// Scan applies the group-by query and scan the result into the given value.
func (ntgb *NetworkTypeGroupBy) Scan(ctx context.Context, v interface{}) error {
	query, err := ntgb.path(ctx)
	if err != nil {
		return err
	}
	ntgb.sql = query
	return ntgb.sqlScan(ctx, v)
}

// ScanX is like Scan, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) ScanX(ctx context.Context, v interface{}) {
	if err := ntgb.Scan(ctx, v); err != nil {
		panic(err)
	}
}

// Strings returns list of strings from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) Strings(ctx context.Context) ([]string, error) {
	if len(ntgb.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeGroupBy.Strings is not achievable when grouping more than 1 field")
	}
	var v []string
	if err := ntgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// StringsX is like Strings, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) StringsX(ctx context.Context) []string {
	v, err := ntgb.Strings(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// String returns a single string from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) String(ctx context.Context) (_ string, err error) {
	var v []string
	if v, err = ntgb.Strings(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeGroupBy.Strings returned %d results when one was expected", len(v))
	}
	return
}

// StringX is like String, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) StringX(ctx context.Context) string {
	v, err := ntgb.String(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Ints returns list of ints from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) Ints(ctx context.Context) ([]int, error) {
	if len(ntgb.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeGroupBy.Ints is not achievable when grouping more than 1 field")
	}
	var v []int
	if err := ntgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// IntsX is like Ints, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) IntsX(ctx context.Context) []int {
	v, err := ntgb.Ints(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Int returns a single int from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) Int(ctx context.Context) (_ int, err error) {
	var v []int
	if v, err = ntgb.Ints(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeGroupBy.Ints returned %d results when one was expected", len(v))
	}
	return
}

// IntX is like Int, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) IntX(ctx context.Context) int {
	v, err := ntgb.Int(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64s returns list of float64s from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) Float64s(ctx context.Context) ([]float64, error) {
	if len(ntgb.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeGroupBy.Float64s is not achievable when grouping more than 1 field")
	}
	var v []float64
	if err := ntgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// Float64sX is like Float64s, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) Float64sX(ctx context.Context) []float64 {
	v, err := ntgb.Float64s(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64 returns a single float64 from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) Float64(ctx context.Context) (_ float64, err error) {
	var v []float64
	if v, err = ntgb.Float64s(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeGroupBy.Float64s returned %d results when one was expected", len(v))
	}
	return
}

// Float64X is like Float64, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) Float64X(ctx context.Context) float64 {
	v, err := ntgb.Float64(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bools returns list of bools from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) Bools(ctx context.Context) ([]bool, error) {
	if len(ntgb.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeGroupBy.Bools is not achievable when grouping more than 1 field")
	}
	var v []bool
	if err := ntgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// BoolsX is like Bools, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) BoolsX(ctx context.Context) []bool {
	v, err := ntgb.Bools(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bool returns a single bool from group-by. It is only allowed when querying group-by with one field.
func (ntgb *NetworkTypeGroupBy) Bool(ctx context.Context) (_ bool, err error) {
	var v []bool
	if v, err = ntgb.Bools(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeGroupBy.Bools returned %d results when one was expected", len(v))
	}
	return
}

// BoolX is like Bool, but panics if an error occurs.
func (ntgb *NetworkTypeGroupBy) BoolX(ctx context.Context) bool {
	v, err := ntgb.Bool(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

func (ntgb *NetworkTypeGroupBy) sqlScan(ctx context.Context, v interface{}) error {
	for _, f := range ntgb.fields {
		if !networktype.ValidColumn(f) {
			return &ValidationError{Name: f, err: fmt.Errorf("invalid field %q for group-by", f)}
		}
	}
	selector := ntgb.sqlQuery()
	if err := selector.Err(); err != nil {
		return err
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := ntgb.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}

func (ntgb *NetworkTypeGroupBy) sqlQuery() *sql.Selector {
	selector := ntgb.sql
	columns := make([]string, 0, len(ntgb.fields)+len(ntgb.fns))
	columns = append(columns, ntgb.fields...)
	for _, fn := range ntgb.fns {
		columns = append(columns, fn(selector, networktype.ValidColumn))
	}
	return selector.Select(columns...).GroupBy(ntgb.fields...)
}

// NetworkTypeSelect is the builder for select fields of NetworkType entities.
type NetworkTypeSelect struct {
	config
	fields []string
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Scan applies the selector query and scan the result into the given value.
func (nts *NetworkTypeSelect) Scan(ctx context.Context, v interface{}) error {
	query, err := nts.path(ctx)
	if err != nil {
		return err
	}
	nts.sql = query
	return nts.sqlScan(ctx, v)
}

// ScanX is like Scan, but panics if an error occurs.
func (nts *NetworkTypeSelect) ScanX(ctx context.Context, v interface{}) {
	if err := nts.Scan(ctx, v); err != nil {
		panic(err)
	}
}

// Strings returns list of strings from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) Strings(ctx context.Context) ([]string, error) {
	if len(nts.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeSelect.Strings is not achievable when selecting more than 1 field")
	}
	var v []string
	if err := nts.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// StringsX is like Strings, but panics if an error occurs.
func (nts *NetworkTypeSelect) StringsX(ctx context.Context) []string {
	v, err := nts.Strings(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// String returns a single string from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) String(ctx context.Context) (_ string, err error) {
	var v []string
	if v, err = nts.Strings(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeSelect.Strings returned %d results when one was expected", len(v))
	}
	return
}

// StringX is like String, but panics if an error occurs.
func (nts *NetworkTypeSelect) StringX(ctx context.Context) string {
	v, err := nts.String(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Ints returns list of ints from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) Ints(ctx context.Context) ([]int, error) {
	if len(nts.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeSelect.Ints is not achievable when selecting more than 1 field")
	}
	var v []int
	if err := nts.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// IntsX is like Ints, but panics if an error occurs.
func (nts *NetworkTypeSelect) IntsX(ctx context.Context) []int {
	v, err := nts.Ints(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Int returns a single int from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) Int(ctx context.Context) (_ int, err error) {
	var v []int
	if v, err = nts.Ints(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeSelect.Ints returned %d results when one was expected", len(v))
	}
	return
}

// IntX is like Int, but panics if an error occurs.
func (nts *NetworkTypeSelect) IntX(ctx context.Context) int {
	v, err := nts.Int(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64s returns list of float64s from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) Float64s(ctx context.Context) ([]float64, error) {
	if len(nts.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeSelect.Float64s is not achievable when selecting more than 1 field")
	}
	var v []float64
	if err := nts.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// Float64sX is like Float64s, but panics if an error occurs.
func (nts *NetworkTypeSelect) Float64sX(ctx context.Context) []float64 {
	v, err := nts.Float64s(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64 returns a single float64 from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) Float64(ctx context.Context) (_ float64, err error) {
	var v []float64
	if v, err = nts.Float64s(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeSelect.Float64s returned %d results when one was expected", len(v))
	}
	return
}

// Float64X is like Float64, but panics if an error occurs.
func (nts *NetworkTypeSelect) Float64X(ctx context.Context) float64 {
	v, err := nts.Float64(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bools returns list of bools from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) Bools(ctx context.Context) ([]bool, error) {
	if len(nts.fields) > 1 {
		return nil, errors.New("ent: NetworkTypeSelect.Bools is not achievable when selecting more than 1 field")
	}
	var v []bool
	if err := nts.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// BoolsX is like Bools, but panics if an error occurs.
func (nts *NetworkTypeSelect) BoolsX(ctx context.Context) []bool {
	v, err := nts.Bools(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bool returns a single bool from selector. It is only allowed when selecting one field.
func (nts *NetworkTypeSelect) Bool(ctx context.Context) (_ bool, err error) {
	var v []bool
	if v, err = nts.Bools(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{networktype.Label}
	default:
		err = fmt.Errorf("ent: NetworkTypeSelect.Bools returned %d results when one was expected", len(v))
	}
	return
}

// BoolX is like Bool, but panics if an error occurs.
func (nts *NetworkTypeSelect) BoolX(ctx context.Context) bool {
	v, err := nts.Bool(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

func (nts *NetworkTypeSelect) sqlScan(ctx context.Context, v interface{}) error {
	for _, f := range nts.fields {
		if !networktype.ValidColumn(f) {
			return &ValidationError{Name: f, err: fmt.Errorf("invalid field %q for selection", f)}
		}
	}
	rows := &sql.Rows{}
	query, args := nts.sqlQuery().Query()
	if err := nts.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}

func (nts *NetworkTypeSelect) sqlQuery() sql.Querier {
	selector := nts.sql
	selector.Select(selector.Columns(nts.fields...)...)
	return selector
}