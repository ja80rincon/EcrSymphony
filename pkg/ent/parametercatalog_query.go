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
	"github.com/facebookincubator/symphony/pkg/ent/parametercatalog"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/propertycategory"
)

// ParameterCatalogQuery is the builder for querying ParameterCatalog entities.
type ParameterCatalogQuery struct {
	config
	limit      *int
	offset     *int
	order      []OrderFunc
	unique     []string
	predicates []predicate.ParameterCatalog
	// eager-loading edges.
	withPropertyCategories *PropertyCategoryQuery
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Where adds a new predicate for the builder.
func (pcq *ParameterCatalogQuery) Where(ps ...predicate.ParameterCatalog) *ParameterCatalogQuery {
	pcq.predicates = append(pcq.predicates, ps...)
	return pcq
}

// Limit adds a limit step to the query.
func (pcq *ParameterCatalogQuery) Limit(limit int) *ParameterCatalogQuery {
	pcq.limit = &limit
	return pcq
}

// Offset adds an offset step to the query.
func (pcq *ParameterCatalogQuery) Offset(offset int) *ParameterCatalogQuery {
	pcq.offset = &offset
	return pcq
}

// Order adds an order step to the query.
func (pcq *ParameterCatalogQuery) Order(o ...OrderFunc) *ParameterCatalogQuery {
	pcq.order = append(pcq.order, o...)
	return pcq
}

// QueryPropertyCategories chains the current query on the property_categories edge.
func (pcq *ParameterCatalogQuery) QueryPropertyCategories() *PropertyCategoryQuery {
	query := &PropertyCategoryQuery{config: pcq.config}
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := pcq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := pcq.sqlQuery()
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(parametercatalog.Table, parametercatalog.FieldID, selector),
			sqlgraph.To(propertycategory.Table, propertycategory.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, parametercatalog.PropertyCategoriesTable, parametercatalog.PropertyCategoriesColumn),
		)
		fromU = sqlgraph.SetNeighbors(pcq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// First returns the first ParameterCatalog entity in the query. Returns *NotFoundError when no parametercatalog was found.
func (pcq *ParameterCatalogQuery) First(ctx context.Context) (*ParameterCatalog, error) {
	nodes, err := pcq.Limit(1).All(ctx)
	if err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nil, &NotFoundError{parametercatalog.Label}
	}
	return nodes[0], nil
}

// FirstX is like First, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) FirstX(ctx context.Context) *ParameterCatalog {
	node, err := pcq.First(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return node
}

// FirstID returns the first ParameterCatalog id in the query. Returns *NotFoundError when no id was found.
func (pcq *ParameterCatalogQuery) FirstID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = pcq.Limit(1).IDs(ctx); err != nil {
		return
	}
	if len(ids) == 0 {
		err = &NotFoundError{parametercatalog.Label}
		return
	}
	return ids[0], nil
}

// FirstIDX is like FirstID, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) FirstIDX(ctx context.Context) int {
	id, err := pcq.FirstID(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return id
}

// Only returns the only ParameterCatalog entity in the query, returns an error if not exactly one entity was returned.
func (pcq *ParameterCatalogQuery) Only(ctx context.Context) (*ParameterCatalog, error) {
	nodes, err := pcq.Limit(2).All(ctx)
	if err != nil {
		return nil, err
	}
	switch len(nodes) {
	case 1:
		return nodes[0], nil
	case 0:
		return nil, &NotFoundError{parametercatalog.Label}
	default:
		return nil, &NotSingularError{parametercatalog.Label}
	}
}

// OnlyX is like Only, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) OnlyX(ctx context.Context) *ParameterCatalog {
	node, err := pcq.Only(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// OnlyID returns the only ParameterCatalog id in the query, returns an error if not exactly one id was returned.
func (pcq *ParameterCatalogQuery) OnlyID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = pcq.Limit(2).IDs(ctx); err != nil {
		return
	}
	switch len(ids) {
	case 1:
		id = ids[0]
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = &NotSingularError{parametercatalog.Label}
	}
	return
}

// OnlyIDX is like OnlyID, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) OnlyIDX(ctx context.Context) int {
	id, err := pcq.OnlyID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// All executes the query and returns a list of ParameterCatalogs.
func (pcq *ParameterCatalogQuery) All(ctx context.Context) ([]*ParameterCatalog, error) {
	if err := pcq.prepareQuery(ctx); err != nil {
		return nil, err
	}
	return pcq.sqlAll(ctx)
}

// AllX is like All, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) AllX(ctx context.Context) []*ParameterCatalog {
	nodes, err := pcq.All(ctx)
	if err != nil {
		panic(err)
	}
	return nodes
}

// IDs executes the query and returns a list of ParameterCatalog ids.
func (pcq *ParameterCatalogQuery) IDs(ctx context.Context) ([]int, error) {
	var ids []int
	if err := pcq.Select(parametercatalog.FieldID).Scan(ctx, &ids); err != nil {
		return nil, err
	}
	return ids, nil
}

// IDsX is like IDs, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) IDsX(ctx context.Context) []int {
	ids, err := pcq.IDs(ctx)
	if err != nil {
		panic(err)
	}
	return ids
}

// Count returns the count of the given query.
func (pcq *ParameterCatalogQuery) Count(ctx context.Context) (int, error) {
	if err := pcq.prepareQuery(ctx); err != nil {
		return 0, err
	}
	return pcq.sqlCount(ctx)
}

// CountX is like Count, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) CountX(ctx context.Context) int {
	count, err := pcq.Count(ctx)
	if err != nil {
		panic(err)
	}
	return count
}

// Exist returns true if the query has elements in the graph.
func (pcq *ParameterCatalogQuery) Exist(ctx context.Context) (bool, error) {
	if err := pcq.prepareQuery(ctx); err != nil {
		return false, err
	}
	return pcq.sqlExist(ctx)
}

// ExistX is like Exist, but panics if an error occurs.
func (pcq *ParameterCatalogQuery) ExistX(ctx context.Context) bool {
	exist, err := pcq.Exist(ctx)
	if err != nil {
		panic(err)
	}
	return exist
}

// Clone returns a duplicate of the query builder, including all associated steps. It can be
// used to prepare common query builders and use them differently after the clone is made.
func (pcq *ParameterCatalogQuery) Clone() *ParameterCatalogQuery {
	if pcq == nil {
		return nil
	}
	return &ParameterCatalogQuery{
		config:                 pcq.config,
		limit:                  pcq.limit,
		offset:                 pcq.offset,
		order:                  append([]OrderFunc{}, pcq.order...),
		unique:                 append([]string{}, pcq.unique...),
		predicates:             append([]predicate.ParameterCatalog{}, pcq.predicates...),
		withPropertyCategories: pcq.withPropertyCategories.Clone(),
		// clone intermediate query.
		sql:  pcq.sql.Clone(),
		path: pcq.path,
	}
}

//  WithPropertyCategories tells the query-builder to eager-loads the nodes that are connected to
// the "property_categories" edge. The optional arguments used to configure the query builder of the edge.
func (pcq *ParameterCatalogQuery) WithPropertyCategories(opts ...func(*PropertyCategoryQuery)) *ParameterCatalogQuery {
	query := &PropertyCategoryQuery{config: pcq.config}
	for _, opt := range opts {
		opt(query)
	}
	pcq.withPropertyCategories = query
	return pcq
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
//	client.ParameterCatalog.Query().
//		GroupBy(parametercatalog.FieldCreateTime).
//		Aggregate(ent.Count()).
//		Scan(ctx, &v)
//
func (pcq *ParameterCatalogQuery) GroupBy(field string, fields ...string) *ParameterCatalogGroupBy {
	group := &ParameterCatalogGroupBy{config: pcq.config}
	group.fields = append([]string{field}, fields...)
	group.path = func(ctx context.Context) (prev *sql.Selector, err error) {
		if err := pcq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		return pcq.sqlQuery(), nil
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
//	client.ParameterCatalog.Query().
//		Select(parametercatalog.FieldCreateTime).
//		Scan(ctx, &v)
//
func (pcq *ParameterCatalogQuery) Select(field string, fields ...string) *ParameterCatalogSelect {
	selector := &ParameterCatalogSelect{config: pcq.config}
	selector.fields = append([]string{field}, fields...)
	selector.path = func(ctx context.Context) (prev *sql.Selector, err error) {
		if err := pcq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		return pcq.sqlQuery(), nil
	}
	return selector
}

func (pcq *ParameterCatalogQuery) prepareQuery(ctx context.Context) error {
	if pcq.path != nil {
		prev, err := pcq.path(ctx)
		if err != nil {
			return err
		}
		pcq.sql = prev
	}
	if err := parametercatalog.Policy.EvalQuery(ctx, pcq); err != nil {
		return err
	}
	return nil
}

func (pcq *ParameterCatalogQuery) sqlAll(ctx context.Context) ([]*ParameterCatalog, error) {
	var (
		nodes       = []*ParameterCatalog{}
		_spec       = pcq.querySpec()
		loadedTypes = [1]bool{
			pcq.withPropertyCategories != nil,
		}
	)
	_spec.ScanValues = func() []interface{} {
		node := &ParameterCatalog{config: pcq.config}
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
	if err := sqlgraph.QueryNodes(ctx, pcq.driver, _spec); err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nodes, nil
	}

	if query := pcq.withPropertyCategories; query != nil {
		fks := make([]driver.Value, 0, len(nodes))
		nodeids := make(map[int]*ParameterCatalog)
		for i := range nodes {
			fks = append(fks, nodes[i].ID)
			nodeids[nodes[i].ID] = nodes[i]
			nodes[i].Edges.PropertyCategories = []*PropertyCategory{}
		}
		query.withFKs = true
		query.Where(predicate.PropertyCategory(func(s *sql.Selector) {
			s.Where(sql.InValues(parametercatalog.PropertyCategoriesColumn, fks...))
		}))
		neighbors, err := query.All(ctx)
		if err != nil {
			return nil, err
		}
		for _, n := range neighbors {
			fk := n.parameter_catalog_property_categories
			if fk == nil {
				return nil, fmt.Errorf(`foreign-key "parameter_catalog_property_categories" is nil for node %v`, n.ID)
			}
			node, ok := nodeids[*fk]
			if !ok {
				return nil, fmt.Errorf(`unexpected foreign-key "parameter_catalog_property_categories" returned %v for node %v`, *fk, n.ID)
			}
			node.Edges.PropertyCategories = append(node.Edges.PropertyCategories, n)
		}
	}

	return nodes, nil
}

func (pcq *ParameterCatalogQuery) sqlCount(ctx context.Context) (int, error) {
	_spec := pcq.querySpec()
	return sqlgraph.CountNodes(ctx, pcq.driver, _spec)
}

func (pcq *ParameterCatalogQuery) sqlExist(ctx context.Context) (bool, error) {
	n, err := pcq.sqlCount(ctx)
	if err != nil {
		return false, fmt.Errorf("ent: check existence: %v", err)
	}
	return n > 0, nil
}

func (pcq *ParameterCatalogQuery) querySpec() *sqlgraph.QuerySpec {
	_spec := &sqlgraph.QuerySpec{
		Node: &sqlgraph.NodeSpec{
			Table:   parametercatalog.Table,
			Columns: parametercatalog.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: parametercatalog.FieldID,
			},
		},
		From:   pcq.sql,
		Unique: true,
	}
	if ps := pcq.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if limit := pcq.limit; limit != nil {
		_spec.Limit = *limit
	}
	if offset := pcq.offset; offset != nil {
		_spec.Offset = *offset
	}
	if ps := pcq.order; len(ps) > 0 {
		_spec.Order = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector, parametercatalog.ValidColumn)
			}
		}
	}
	return _spec
}

func (pcq *ParameterCatalogQuery) sqlQuery() *sql.Selector {
	builder := sql.Dialect(pcq.driver.Dialect())
	t1 := builder.Table(parametercatalog.Table)
	selector := builder.Select(t1.Columns(parametercatalog.Columns...)...).From(t1)
	if pcq.sql != nil {
		selector = pcq.sql
		selector.Select(selector.Columns(parametercatalog.Columns...)...)
	}
	for _, p := range pcq.predicates {
		p(selector)
	}
	for _, p := range pcq.order {
		p(selector, parametercatalog.ValidColumn)
	}
	if offset := pcq.offset; offset != nil {
		// limit is mandatory for offset clause. We start
		// with default value, and override it below if needed.
		selector.Offset(*offset).Limit(math.MaxInt32)
	}
	if limit := pcq.limit; limit != nil {
		selector.Limit(*limit)
	}
	return selector
}

// ParameterCatalogGroupBy is the builder for group-by ParameterCatalog entities.
type ParameterCatalogGroupBy struct {
	config
	fields []string
	fns    []AggregateFunc
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Aggregate adds the given aggregation functions to the group-by query.
func (pcgb *ParameterCatalogGroupBy) Aggregate(fns ...AggregateFunc) *ParameterCatalogGroupBy {
	pcgb.fns = append(pcgb.fns, fns...)
	return pcgb
}

// Scan applies the group-by query and scan the result into the given value.
func (pcgb *ParameterCatalogGroupBy) Scan(ctx context.Context, v interface{}) error {
	query, err := pcgb.path(ctx)
	if err != nil {
		return err
	}
	pcgb.sql = query
	return pcgb.sqlScan(ctx, v)
}

// ScanX is like Scan, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) ScanX(ctx context.Context, v interface{}) {
	if err := pcgb.Scan(ctx, v); err != nil {
		panic(err)
	}
}

// Strings returns list of strings from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) Strings(ctx context.Context) ([]string, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogGroupBy.Strings is not achievable when grouping more than 1 field")
	}
	var v []string
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// StringsX is like Strings, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) StringsX(ctx context.Context) []string {
	v, err := pcgb.Strings(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// String returns a single string from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) String(ctx context.Context) (_ string, err error) {
	var v []string
	if v, err = pcgb.Strings(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogGroupBy.Strings returned %d results when one was expected", len(v))
	}
	return
}

// StringX is like String, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) StringX(ctx context.Context) string {
	v, err := pcgb.String(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Ints returns list of ints from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) Ints(ctx context.Context) ([]int, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogGroupBy.Ints is not achievable when grouping more than 1 field")
	}
	var v []int
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// IntsX is like Ints, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) IntsX(ctx context.Context) []int {
	v, err := pcgb.Ints(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Int returns a single int from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) Int(ctx context.Context) (_ int, err error) {
	var v []int
	if v, err = pcgb.Ints(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogGroupBy.Ints returned %d results when one was expected", len(v))
	}
	return
}

// IntX is like Int, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) IntX(ctx context.Context) int {
	v, err := pcgb.Int(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64s returns list of float64s from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) Float64s(ctx context.Context) ([]float64, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogGroupBy.Float64s is not achievable when grouping more than 1 field")
	}
	var v []float64
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// Float64sX is like Float64s, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) Float64sX(ctx context.Context) []float64 {
	v, err := pcgb.Float64s(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64 returns a single float64 from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) Float64(ctx context.Context) (_ float64, err error) {
	var v []float64
	if v, err = pcgb.Float64s(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogGroupBy.Float64s returned %d results when one was expected", len(v))
	}
	return
}

// Float64X is like Float64, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) Float64X(ctx context.Context) float64 {
	v, err := pcgb.Float64(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bools returns list of bools from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) Bools(ctx context.Context) ([]bool, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogGroupBy.Bools is not achievable when grouping more than 1 field")
	}
	var v []bool
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// BoolsX is like Bools, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) BoolsX(ctx context.Context) []bool {
	v, err := pcgb.Bools(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bool returns a single bool from group-by. It is only allowed when querying group-by with one field.
func (pcgb *ParameterCatalogGroupBy) Bool(ctx context.Context) (_ bool, err error) {
	var v []bool
	if v, err = pcgb.Bools(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogGroupBy.Bools returned %d results when one was expected", len(v))
	}
	return
}

// BoolX is like Bool, but panics if an error occurs.
func (pcgb *ParameterCatalogGroupBy) BoolX(ctx context.Context) bool {
	v, err := pcgb.Bool(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

func (pcgb *ParameterCatalogGroupBy) sqlScan(ctx context.Context, v interface{}) error {
	for _, f := range pcgb.fields {
		if !parametercatalog.ValidColumn(f) {
			return &ValidationError{Name: f, err: fmt.Errorf("invalid field %q for group-by", f)}
		}
	}
	selector := pcgb.sqlQuery()
	if err := selector.Err(); err != nil {
		return err
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := pcgb.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}

func (pcgb *ParameterCatalogGroupBy) sqlQuery() *sql.Selector {
	selector := pcgb.sql
	columns := make([]string, 0, len(pcgb.fields)+len(pcgb.fns))
	columns = append(columns, pcgb.fields...)
	for _, fn := range pcgb.fns {
		columns = append(columns, fn(selector, parametercatalog.ValidColumn))
	}
	return selector.Select(columns...).GroupBy(pcgb.fields...)
}

// ParameterCatalogSelect is the builder for select fields of ParameterCatalog entities.
type ParameterCatalogSelect struct {
	config
	fields []string
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Scan applies the selector query and scan the result into the given value.
func (pcs *ParameterCatalogSelect) Scan(ctx context.Context, v interface{}) error {
	query, err := pcs.path(ctx)
	if err != nil {
		return err
	}
	pcs.sql = query
	return pcs.sqlScan(ctx, v)
}

// ScanX is like Scan, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) ScanX(ctx context.Context, v interface{}) {
	if err := pcs.Scan(ctx, v); err != nil {
		panic(err)
	}
}

// Strings returns list of strings from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) Strings(ctx context.Context) ([]string, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogSelect.Strings is not achievable when selecting more than 1 field")
	}
	var v []string
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// StringsX is like Strings, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) StringsX(ctx context.Context) []string {
	v, err := pcs.Strings(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// String returns a single string from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) String(ctx context.Context) (_ string, err error) {
	var v []string
	if v, err = pcs.Strings(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogSelect.Strings returned %d results when one was expected", len(v))
	}
	return
}

// StringX is like String, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) StringX(ctx context.Context) string {
	v, err := pcs.String(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Ints returns list of ints from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) Ints(ctx context.Context) ([]int, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogSelect.Ints is not achievable when selecting more than 1 field")
	}
	var v []int
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// IntsX is like Ints, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) IntsX(ctx context.Context) []int {
	v, err := pcs.Ints(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Int returns a single int from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) Int(ctx context.Context) (_ int, err error) {
	var v []int
	if v, err = pcs.Ints(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogSelect.Ints returned %d results when one was expected", len(v))
	}
	return
}

// IntX is like Int, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) IntX(ctx context.Context) int {
	v, err := pcs.Int(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64s returns list of float64s from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) Float64s(ctx context.Context) ([]float64, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogSelect.Float64s is not achievable when selecting more than 1 field")
	}
	var v []float64
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// Float64sX is like Float64s, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) Float64sX(ctx context.Context) []float64 {
	v, err := pcs.Float64s(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64 returns a single float64 from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) Float64(ctx context.Context) (_ float64, err error) {
	var v []float64
	if v, err = pcs.Float64s(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogSelect.Float64s returned %d results when one was expected", len(v))
	}
	return
}

// Float64X is like Float64, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) Float64X(ctx context.Context) float64 {
	v, err := pcs.Float64(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bools returns list of bools from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) Bools(ctx context.Context) ([]bool, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: ParameterCatalogSelect.Bools is not achievable when selecting more than 1 field")
	}
	var v []bool
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// BoolsX is like Bools, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) BoolsX(ctx context.Context) []bool {
	v, err := pcs.Bools(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bool returns a single bool from selector. It is only allowed when selecting one field.
func (pcs *ParameterCatalogSelect) Bool(ctx context.Context) (_ bool, err error) {
	var v []bool
	if v, err = pcs.Bools(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{parametercatalog.Label}
	default:
		err = fmt.Errorf("ent: ParameterCatalogSelect.Bools returned %d results when one was expected", len(v))
	}
	return
}

// BoolX is like Bool, but panics if an error occurs.
func (pcs *ParameterCatalogSelect) BoolX(ctx context.Context) bool {
	v, err := pcs.Bool(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

func (pcs *ParameterCatalogSelect) sqlScan(ctx context.Context, v interface{}) error {
	for _, f := range pcs.fields {
		if !parametercatalog.ValidColumn(f) {
			return &ValidationError{Name: f, err: fmt.Errorf("invalid field %q for selection", f)}
		}
	}
	rows := &sql.Rows{}
	query, args := pcs.sqlQuery().Query()
	if err := pcs.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}

func (pcs *ParameterCatalogSelect) sqlQuery() sql.Querier {
	selector := pcs.sql
	selector.Select(selector.Columns(pcs.fields...)...)
	return selector
}