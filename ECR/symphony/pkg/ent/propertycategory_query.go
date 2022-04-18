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
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
)

// PropertyCategoryQuery is the builder for querying PropertyCategory entities.
type PropertyCategoryQuery struct {
	config
	limit      *int
	offset     *int
	order      []OrderFunc
	unique     []string
	predicates []predicate.PropertyCategory
	// eager-loading edges.
	withPropertiesType   *PropertyTypeQuery
	withParameterCatalog *ParameterCatalogQuery
	withFKs              bool
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Where adds a new predicate for the builder.
func (pcq *PropertyCategoryQuery) Where(ps ...predicate.PropertyCategory) *PropertyCategoryQuery {
	pcq.predicates = append(pcq.predicates, ps...)
	return pcq
}

// Limit adds a limit step to the query.
func (pcq *PropertyCategoryQuery) Limit(limit int) *PropertyCategoryQuery {
	pcq.limit = &limit
	return pcq
}

// Offset adds an offset step to the query.
func (pcq *PropertyCategoryQuery) Offset(offset int) *PropertyCategoryQuery {
	pcq.offset = &offset
	return pcq
}

// Order adds an order step to the query.
func (pcq *PropertyCategoryQuery) Order(o ...OrderFunc) *PropertyCategoryQuery {
	pcq.order = append(pcq.order, o...)
	return pcq
}

// QueryPropertiesType chains the current query on the properties_type edge.
func (pcq *PropertyCategoryQuery) QueryPropertiesType() *PropertyTypeQuery {
	query := &PropertyTypeQuery{config: pcq.config}
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := pcq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := pcq.sqlQuery()
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(propertycategory.Table, propertycategory.FieldID, selector),
			sqlgraph.To(propertytype.Table, propertytype.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, propertycategory.PropertiesTypeTable, propertycategory.PropertiesTypeColumn),
		)
		fromU = sqlgraph.SetNeighbors(pcq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// QueryParameterCatalog chains the current query on the parameter_catalog edge.
func (pcq *PropertyCategoryQuery) QueryParameterCatalog() *ParameterCatalogQuery {
	query := &ParameterCatalogQuery{config: pcq.config}
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := pcq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := pcq.sqlQuery()
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(propertycategory.Table, propertycategory.FieldID, selector),
			sqlgraph.To(parametercatalog.Table, parametercatalog.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, propertycategory.ParameterCatalogTable, propertycategory.ParameterCatalogColumn),
		)
		fromU = sqlgraph.SetNeighbors(pcq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// First returns the first PropertyCategory entity in the query. Returns *NotFoundError when no propertycategory was found.
func (pcq *PropertyCategoryQuery) First(ctx context.Context) (*PropertyCategory, error) {
	nodes, err := pcq.Limit(1).All(ctx)
	if err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nil, &NotFoundError{propertycategory.Label}
	}
	return nodes[0], nil
}

// FirstX is like First, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) FirstX(ctx context.Context) *PropertyCategory {
	node, err := pcq.First(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return node
}

// FirstID returns the first PropertyCategory id in the query. Returns *NotFoundError when no id was found.
func (pcq *PropertyCategoryQuery) FirstID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = pcq.Limit(1).IDs(ctx); err != nil {
		return
	}
	if len(ids) == 0 {
		err = &NotFoundError{propertycategory.Label}
		return
	}
	return ids[0], nil
}

// FirstIDX is like FirstID, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) FirstIDX(ctx context.Context) int {
	id, err := pcq.FirstID(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return id
}

// Only returns the only PropertyCategory entity in the query, returns an error if not exactly one entity was returned.
func (pcq *PropertyCategoryQuery) Only(ctx context.Context) (*PropertyCategory, error) {
	nodes, err := pcq.Limit(2).All(ctx)
	if err != nil {
		return nil, err
	}
	switch len(nodes) {
	case 1:
		return nodes[0], nil
	case 0:
		return nil, &NotFoundError{propertycategory.Label}
	default:
		return nil, &NotSingularError{propertycategory.Label}
	}
}

// OnlyX is like Only, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) OnlyX(ctx context.Context) *PropertyCategory {
	node, err := pcq.Only(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// OnlyID returns the only PropertyCategory id in the query, returns an error if not exactly one id was returned.
func (pcq *PropertyCategoryQuery) OnlyID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = pcq.Limit(2).IDs(ctx); err != nil {
		return
	}
	switch len(ids) {
	case 1:
		id = ids[0]
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = &NotSingularError{propertycategory.Label}
	}
	return
}

// OnlyIDX is like OnlyID, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) OnlyIDX(ctx context.Context) int {
	id, err := pcq.OnlyID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// All executes the query and returns a list of PropertyCategories.
func (pcq *PropertyCategoryQuery) All(ctx context.Context) ([]*PropertyCategory, error) {
	if err := pcq.prepareQuery(ctx); err != nil {
		return nil, err
	}
	return pcq.sqlAll(ctx)
}

// AllX is like All, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) AllX(ctx context.Context) []*PropertyCategory {
	nodes, err := pcq.All(ctx)
	if err != nil {
		panic(err)
	}
	return nodes
}

// IDs executes the query and returns a list of PropertyCategory ids.
func (pcq *PropertyCategoryQuery) IDs(ctx context.Context) ([]int, error) {
	var ids []int
	if err := pcq.Select(propertycategory.FieldID).Scan(ctx, &ids); err != nil {
		return nil, err
	}
	return ids, nil
}

// IDsX is like IDs, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) IDsX(ctx context.Context) []int {
	ids, err := pcq.IDs(ctx)
	if err != nil {
		panic(err)
	}
	return ids
}

// Count returns the count of the given query.
func (pcq *PropertyCategoryQuery) Count(ctx context.Context) (int, error) {
	if err := pcq.prepareQuery(ctx); err != nil {
		return 0, err
	}
	return pcq.sqlCount(ctx)
}

// CountX is like Count, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) CountX(ctx context.Context) int {
	count, err := pcq.Count(ctx)
	if err != nil {
		panic(err)
	}
	return count
}

// Exist returns true if the query has elements in the graph.
func (pcq *PropertyCategoryQuery) Exist(ctx context.Context) (bool, error) {
	if err := pcq.prepareQuery(ctx); err != nil {
		return false, err
	}
	return pcq.sqlExist(ctx)
}

// ExistX is like Exist, but panics if an error occurs.
func (pcq *PropertyCategoryQuery) ExistX(ctx context.Context) bool {
	exist, err := pcq.Exist(ctx)
	if err != nil {
		panic(err)
	}
	return exist
}

// Clone returns a duplicate of the query builder, including all associated steps. It can be
// used to prepare common query builders and use them differently after the clone is made.
func (pcq *PropertyCategoryQuery) Clone() *PropertyCategoryQuery {
	if pcq == nil {
		return nil
	}
	return &PropertyCategoryQuery{
		config:               pcq.config,
		limit:                pcq.limit,
		offset:               pcq.offset,
		order:                append([]OrderFunc{}, pcq.order...),
		unique:               append([]string{}, pcq.unique...),
		predicates:           append([]predicate.PropertyCategory{}, pcq.predicates...),
		withPropertiesType:   pcq.withPropertiesType.Clone(),
		withParameterCatalog: pcq.withParameterCatalog.Clone(),
		// clone intermediate query.
		sql:  pcq.sql.Clone(),
		path: pcq.path,
	}
}

//  WithPropertiesType tells the query-builder to eager-loads the nodes that are connected to
// the "properties_type" edge. The optional arguments used to configure the query builder of the edge.
func (pcq *PropertyCategoryQuery) WithPropertiesType(opts ...func(*PropertyTypeQuery)) *PropertyCategoryQuery {
	query := &PropertyTypeQuery{config: pcq.config}
	for _, opt := range opts {
		opt(query)
	}
	pcq.withPropertiesType = query
	return pcq
}

//  WithParameterCatalog tells the query-builder to eager-loads the nodes that are connected to
// the "parameter_catalog" edge. The optional arguments used to configure the query builder of the edge.
func (pcq *PropertyCategoryQuery) WithParameterCatalog(opts ...func(*ParameterCatalogQuery)) *PropertyCategoryQuery {
	query := &ParameterCatalogQuery{config: pcq.config}
	for _, opt := range opts {
		opt(query)
	}
	pcq.withParameterCatalog = query
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
//	client.PropertyCategory.Query().
//		GroupBy(propertycategory.FieldCreateTime).
//		Aggregate(ent.Count()).
//		Scan(ctx, &v)
//
func (pcq *PropertyCategoryQuery) GroupBy(field string, fields ...string) *PropertyCategoryGroupBy {
	group := &PropertyCategoryGroupBy{config: pcq.config}
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
//	client.PropertyCategory.Query().
//		Select(propertycategory.FieldCreateTime).
//		Scan(ctx, &v)
//
func (pcq *PropertyCategoryQuery) Select(field string, fields ...string) *PropertyCategorySelect {
	selector := &PropertyCategorySelect{config: pcq.config}
	selector.fields = append([]string{field}, fields...)
	selector.path = func(ctx context.Context) (prev *sql.Selector, err error) {
		if err := pcq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		return pcq.sqlQuery(), nil
	}
	return selector
}

func (pcq *PropertyCategoryQuery) prepareQuery(ctx context.Context) error {
	if pcq.path != nil {
		prev, err := pcq.path(ctx)
		if err != nil {
			return err
		}
		pcq.sql = prev
	}
	if err := propertycategory.Policy.EvalQuery(ctx, pcq); err != nil {
		return err
	}
	return nil
}

func (pcq *PropertyCategoryQuery) sqlAll(ctx context.Context) ([]*PropertyCategory, error) {
	var (
		nodes       = []*PropertyCategory{}
		withFKs     = pcq.withFKs
		_spec       = pcq.querySpec()
		loadedTypes = [2]bool{
			pcq.withPropertiesType != nil,
			pcq.withParameterCatalog != nil,
		}
	)
	if pcq.withParameterCatalog != nil {
		withFKs = true
	}
	if withFKs {
		_spec.Node.Columns = append(_spec.Node.Columns, propertycategory.ForeignKeys...)
	}
	_spec.ScanValues = func() []interface{} {
		node := &PropertyCategory{config: pcq.config}
		nodes = append(nodes, node)
		values := node.scanValues()
		if withFKs {
			values = append(values, node.fkValues()...)
		}
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

	if query := pcq.withPropertiesType; query != nil {
		fks := make([]driver.Value, 0, len(nodes))
		nodeids := make(map[int]*PropertyCategory)
		for i := range nodes {
			fks = append(fks, nodes[i].ID)
			nodeids[nodes[i].ID] = nodes[i]
			nodes[i].Edges.PropertiesType = []*PropertyType{}
		}
		query.withFKs = true
		query.Where(predicate.PropertyType(func(s *sql.Selector) {
			s.Where(sql.InValues(propertycategory.PropertiesTypeColumn, fks...))
		}))
		neighbors, err := query.All(ctx)
		if err != nil {
			return nil, err
		}
		for _, n := range neighbors {
			fk := n.property_category_properties_type
			if fk == nil {
				return nil, fmt.Errorf(`foreign-key "property_category_properties_type" is nil for node %v`, n.ID)
			}
			node, ok := nodeids[*fk]
			if !ok {
				return nil, fmt.Errorf(`unexpected foreign-key "property_category_properties_type" returned %v for node %v`, *fk, n.ID)
			}
			node.Edges.PropertiesType = append(node.Edges.PropertiesType, n)
		}
	}

	if query := pcq.withParameterCatalog; query != nil {
		ids := make([]int, 0, len(nodes))
		nodeids := make(map[int][]*PropertyCategory)
		for i := range nodes {
			if fk := nodes[i].parameter_catalog_property_categories; fk != nil {
				ids = append(ids, *fk)
				nodeids[*fk] = append(nodeids[*fk], nodes[i])
			}
		}
		query.Where(parametercatalog.IDIn(ids...))
		neighbors, err := query.All(ctx)
		if err != nil {
			return nil, err
		}
		for _, n := range neighbors {
			nodes, ok := nodeids[n.ID]
			if !ok {
				return nil, fmt.Errorf(`unexpected foreign-key "parameter_catalog_property_categories" returned %v`, n.ID)
			}
			for i := range nodes {
				nodes[i].Edges.ParameterCatalog = n
			}
		}
	}

	return nodes, nil
}

func (pcq *PropertyCategoryQuery) sqlCount(ctx context.Context) (int, error) {
	_spec := pcq.querySpec()
	return sqlgraph.CountNodes(ctx, pcq.driver, _spec)
}

func (pcq *PropertyCategoryQuery) sqlExist(ctx context.Context) (bool, error) {
	n, err := pcq.sqlCount(ctx)
	if err != nil {
		return false, fmt.Errorf("ent: check existence: %v", err)
	}
	return n > 0, nil
}

func (pcq *PropertyCategoryQuery) querySpec() *sqlgraph.QuerySpec {
	_spec := &sqlgraph.QuerySpec{
		Node: &sqlgraph.NodeSpec{
			Table:   propertycategory.Table,
			Columns: propertycategory.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeInt,
				Column: propertycategory.FieldID,
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
				ps[i](selector, propertycategory.ValidColumn)
			}
		}
	}
	return _spec
}

func (pcq *PropertyCategoryQuery) sqlQuery() *sql.Selector {
	builder := sql.Dialect(pcq.driver.Dialect())
	t1 := builder.Table(propertycategory.Table)
	selector := builder.Select(t1.Columns(propertycategory.Columns...)...).From(t1)
	if pcq.sql != nil {
		selector = pcq.sql
		selector.Select(selector.Columns(propertycategory.Columns...)...)
	}
	for _, p := range pcq.predicates {
		p(selector)
	}
	for _, p := range pcq.order {
		p(selector, propertycategory.ValidColumn)
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

// PropertyCategoryGroupBy is the builder for group-by PropertyCategory entities.
type PropertyCategoryGroupBy struct {
	config
	fields []string
	fns    []AggregateFunc
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Aggregate adds the given aggregation functions to the group-by query.
func (pcgb *PropertyCategoryGroupBy) Aggregate(fns ...AggregateFunc) *PropertyCategoryGroupBy {
	pcgb.fns = append(pcgb.fns, fns...)
	return pcgb
}

// Scan applies the group-by query and scan the result into the given value.
func (pcgb *PropertyCategoryGroupBy) Scan(ctx context.Context, v interface{}) error {
	query, err := pcgb.path(ctx)
	if err != nil {
		return err
	}
	pcgb.sql = query
	return pcgb.sqlScan(ctx, v)
}

// ScanX is like Scan, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) ScanX(ctx context.Context, v interface{}) {
	if err := pcgb.Scan(ctx, v); err != nil {
		panic(err)
	}
}

// Strings returns list of strings from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) Strings(ctx context.Context) ([]string, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: PropertyCategoryGroupBy.Strings is not achievable when grouping more than 1 field")
	}
	var v []string
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// StringsX is like Strings, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) StringsX(ctx context.Context) []string {
	v, err := pcgb.Strings(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// String returns a single string from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) String(ctx context.Context) (_ string, err error) {
	var v []string
	if v, err = pcgb.Strings(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategoryGroupBy.Strings returned %d results when one was expected", len(v))
	}
	return
}

// StringX is like String, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) StringX(ctx context.Context) string {
	v, err := pcgb.String(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Ints returns list of ints from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) Ints(ctx context.Context) ([]int, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: PropertyCategoryGroupBy.Ints is not achievable when grouping more than 1 field")
	}
	var v []int
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// IntsX is like Ints, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) IntsX(ctx context.Context) []int {
	v, err := pcgb.Ints(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Int returns a single int from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) Int(ctx context.Context) (_ int, err error) {
	var v []int
	if v, err = pcgb.Ints(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategoryGroupBy.Ints returned %d results when one was expected", len(v))
	}
	return
}

// IntX is like Int, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) IntX(ctx context.Context) int {
	v, err := pcgb.Int(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64s returns list of float64s from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) Float64s(ctx context.Context) ([]float64, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: PropertyCategoryGroupBy.Float64s is not achievable when grouping more than 1 field")
	}
	var v []float64
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// Float64sX is like Float64s, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) Float64sX(ctx context.Context) []float64 {
	v, err := pcgb.Float64s(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64 returns a single float64 from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) Float64(ctx context.Context) (_ float64, err error) {
	var v []float64
	if v, err = pcgb.Float64s(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategoryGroupBy.Float64s returned %d results when one was expected", len(v))
	}
	return
}

// Float64X is like Float64, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) Float64X(ctx context.Context) float64 {
	v, err := pcgb.Float64(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bools returns list of bools from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) Bools(ctx context.Context) ([]bool, error) {
	if len(pcgb.fields) > 1 {
		return nil, errors.New("ent: PropertyCategoryGroupBy.Bools is not achievable when grouping more than 1 field")
	}
	var v []bool
	if err := pcgb.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// BoolsX is like Bools, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) BoolsX(ctx context.Context) []bool {
	v, err := pcgb.Bools(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bool returns a single bool from group-by. It is only allowed when querying group-by with one field.
func (pcgb *PropertyCategoryGroupBy) Bool(ctx context.Context) (_ bool, err error) {
	var v []bool
	if v, err = pcgb.Bools(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategoryGroupBy.Bools returned %d results when one was expected", len(v))
	}
	return
}

// BoolX is like Bool, but panics if an error occurs.
func (pcgb *PropertyCategoryGroupBy) BoolX(ctx context.Context) bool {
	v, err := pcgb.Bool(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

func (pcgb *PropertyCategoryGroupBy) sqlScan(ctx context.Context, v interface{}) error {
	for _, f := range pcgb.fields {
		if !propertycategory.ValidColumn(f) {
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

func (pcgb *PropertyCategoryGroupBy) sqlQuery() *sql.Selector {
	selector := pcgb.sql
	columns := make([]string, 0, len(pcgb.fields)+len(pcgb.fns))
	columns = append(columns, pcgb.fields...)
	for _, fn := range pcgb.fns {
		columns = append(columns, fn(selector, propertycategory.ValidColumn))
	}
	return selector.Select(columns...).GroupBy(pcgb.fields...)
}

// PropertyCategorySelect is the builder for select fields of PropertyCategory entities.
type PropertyCategorySelect struct {
	config
	fields []string
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Scan applies the selector query and scan the result into the given value.
func (pcs *PropertyCategorySelect) Scan(ctx context.Context, v interface{}) error {
	query, err := pcs.path(ctx)
	if err != nil {
		return err
	}
	pcs.sql = query
	return pcs.sqlScan(ctx, v)
}

// ScanX is like Scan, but panics if an error occurs.
func (pcs *PropertyCategorySelect) ScanX(ctx context.Context, v interface{}) {
	if err := pcs.Scan(ctx, v); err != nil {
		panic(err)
	}
}

// Strings returns list of strings from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) Strings(ctx context.Context) ([]string, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: PropertyCategorySelect.Strings is not achievable when selecting more than 1 field")
	}
	var v []string
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// StringsX is like Strings, but panics if an error occurs.
func (pcs *PropertyCategorySelect) StringsX(ctx context.Context) []string {
	v, err := pcs.Strings(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// String returns a single string from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) String(ctx context.Context) (_ string, err error) {
	var v []string
	if v, err = pcs.Strings(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategorySelect.Strings returned %d results when one was expected", len(v))
	}
	return
}

// StringX is like String, but panics if an error occurs.
func (pcs *PropertyCategorySelect) StringX(ctx context.Context) string {
	v, err := pcs.String(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Ints returns list of ints from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) Ints(ctx context.Context) ([]int, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: PropertyCategorySelect.Ints is not achievable when selecting more than 1 field")
	}
	var v []int
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// IntsX is like Ints, but panics if an error occurs.
func (pcs *PropertyCategorySelect) IntsX(ctx context.Context) []int {
	v, err := pcs.Ints(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Int returns a single int from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) Int(ctx context.Context) (_ int, err error) {
	var v []int
	if v, err = pcs.Ints(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategorySelect.Ints returned %d results when one was expected", len(v))
	}
	return
}

// IntX is like Int, but panics if an error occurs.
func (pcs *PropertyCategorySelect) IntX(ctx context.Context) int {
	v, err := pcs.Int(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64s returns list of float64s from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) Float64s(ctx context.Context) ([]float64, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: PropertyCategorySelect.Float64s is not achievable when selecting more than 1 field")
	}
	var v []float64
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// Float64sX is like Float64s, but panics if an error occurs.
func (pcs *PropertyCategorySelect) Float64sX(ctx context.Context) []float64 {
	v, err := pcs.Float64s(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Float64 returns a single float64 from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) Float64(ctx context.Context) (_ float64, err error) {
	var v []float64
	if v, err = pcs.Float64s(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategorySelect.Float64s returned %d results when one was expected", len(v))
	}
	return
}

// Float64X is like Float64, but panics if an error occurs.
func (pcs *PropertyCategorySelect) Float64X(ctx context.Context) float64 {
	v, err := pcs.Float64(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bools returns list of bools from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) Bools(ctx context.Context) ([]bool, error) {
	if len(pcs.fields) > 1 {
		return nil, errors.New("ent: PropertyCategorySelect.Bools is not achievable when selecting more than 1 field")
	}
	var v []bool
	if err := pcs.Scan(ctx, &v); err != nil {
		return nil, err
	}
	return v, nil
}

// BoolsX is like Bools, but panics if an error occurs.
func (pcs *PropertyCategorySelect) BoolsX(ctx context.Context) []bool {
	v, err := pcs.Bools(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Bool returns a single bool from selector. It is only allowed when selecting one field.
func (pcs *PropertyCategorySelect) Bool(ctx context.Context) (_ bool, err error) {
	var v []bool
	if v, err = pcs.Bools(ctx); err != nil {
		return
	}
	switch len(v) {
	case 1:
		return v[0], nil
	case 0:
		err = &NotFoundError{propertycategory.Label}
	default:
		err = fmt.Errorf("ent: PropertyCategorySelect.Bools returned %d results when one was expected", len(v))
	}
	return
}

// BoolX is like Bool, but panics if an error occurs.
func (pcs *PropertyCategorySelect) BoolX(ctx context.Context) bool {
	v, err := pcs.Bool(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

func (pcs *PropertyCategorySelect) sqlScan(ctx context.Context, v interface{}) error {
	for _, f := range pcs.fields {
		if !propertycategory.ValidColumn(f) {
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

func (pcs *PropertyCategorySelect) sqlQuery() sql.Querier {
	selector := pcs.sql
	selector.Select(selector.Columns(pcs.fields...)...)
	return selector
}
