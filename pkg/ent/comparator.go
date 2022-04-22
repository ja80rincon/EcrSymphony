// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"
	"time"

	"github.com/facebook/ent/dialect/sql"
	"github.com/facebookincubator/symphony/pkg/ent/comparator"
)

// Comparator is the model entity for the Comparator schema.
type Comparator struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// CreateTime holds the value of the "create_time" field.
	CreateTime time.Time `json:"create_time,omitempty"`
	// UpdateTime holds the value of the "update_time" field.
	UpdateTime time.Time `json:"update_time,omitempty"`
	// Name holds the value of the "name" field.
	Name string `json:"name,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ComparatorQuery when eager-loading is set.
	Edges ComparatorEdges `json:"edges"`
}

// ComparatorEdges holds the relations/edges for other nodes in the graph.
type ComparatorEdges struct {
	// Comparatorrulelimit holds the value of the comparatorrulelimit edge.
	Comparatorrulelimit []*RuleLimit
	// Comparatorkqitargetfk holds the value of the comparatorkqitargetfk edge.
	Comparatorkqitargetfk []*KqiComparator
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [2]bool
}

// ComparatorrulelimitOrErr returns the Comparatorrulelimit value or an error if the edge
// was not loaded in eager-loading.
func (e ComparatorEdges) ComparatorrulelimitOrErr() ([]*RuleLimit, error) {
	if e.loadedTypes[0] {
		return e.Comparatorrulelimit, nil
	}
	return nil, &NotLoadedError{edge: "comparatorrulelimit"}
}

// ComparatorkqitargetfkOrErr returns the Comparatorkqitargetfk value or an error if the edge
// was not loaded in eager-loading.
func (e ComparatorEdges) ComparatorkqitargetfkOrErr() ([]*KqiComparator, error) {
	if e.loadedTypes[1] {
		return e.Comparatorkqitargetfk, nil
	}
	return nil, &NotLoadedError{edge: "comparatorkqitargetfk"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Comparator) scanValues() []interface{} {
	return []interface{}{
		&sql.NullInt64{},  // id
		&sql.NullTime{},   // create_time
		&sql.NullTime{},   // update_time
		&sql.NullString{}, // name
	}
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Comparator fields.
func (c *Comparator) assignValues(values ...interface{}) error {
	if m, n := len(values), len(comparator.Columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	value, ok := values[0].(*sql.NullInt64)
	if !ok {
		return fmt.Errorf("unexpected type %T for field id", value)
	}
	c.ID = int(value.Int64)
	values = values[1:]
	if value, ok := values[0].(*sql.NullTime); !ok {
		return fmt.Errorf("unexpected type %T for field create_time", values[0])
	} else if value.Valid {
		c.CreateTime = value.Time
	}
	if value, ok := values[1].(*sql.NullTime); !ok {
		return fmt.Errorf("unexpected type %T for field update_time", values[1])
	} else if value.Valid {
		c.UpdateTime = value.Time
	}
	if value, ok := values[2].(*sql.NullString); !ok {
		return fmt.Errorf("unexpected type %T for field name", values[2])
	} else if value.Valid {
		c.Name = value.String
	}
	return nil
}

// QueryComparatorrulelimit queries the comparatorrulelimit edge of the Comparator.
func (c *Comparator) QueryComparatorrulelimit() *RuleLimitQuery {
	return (&ComparatorClient{config: c.config}).QueryComparatorrulelimit(c)
}

// QueryComparatorkqitargetfk queries the comparatorkqitargetfk edge of the Comparator.
func (c *Comparator) QueryComparatorkqitargetfk() *KqiComparatorQuery {
	return (&ComparatorClient{config: c.config}).QueryComparatorkqitargetfk(c)
}

// Update returns a builder for updating this Comparator.
// Note that, you need to call Comparator.Unwrap() before calling this method, if this Comparator
// was returned from a transaction, and the transaction was committed or rolled back.
func (c *Comparator) Update() *ComparatorUpdateOne {
	return (&ComparatorClient{config: c.config}).UpdateOne(c)
}

// Unwrap unwraps the entity that was returned from a transaction after it was closed,
// so that all next queries will be executed through the driver which created the transaction.
func (c *Comparator) Unwrap() *Comparator {
	tx, ok := c.config.driver.(*txDriver)
	if !ok {
		panic("ent: Comparator is not a transactional entity")
	}
	c.config.driver = tx.drv
	return c
}

// String implements the fmt.Stringer.
func (c *Comparator) String() string {
	var builder strings.Builder
	builder.WriteString("Comparator(")
	builder.WriteString(fmt.Sprintf("id=%v", c.ID))
	builder.WriteString(", create_time=")
	builder.WriteString(c.CreateTime.Format(time.ANSIC))
	builder.WriteString(", update_time=")
	builder.WriteString(c.UpdateTime.Format(time.ANSIC))
	builder.WriteString(", name=")
	builder.WriteString(c.Name)
	builder.WriteByte(')')
	return builder.String()
}

// Comparators is a parsable slice of Comparator.
type Comparators []*Comparator

func (c Comparators) config(cfg config) {
	for _i := range c {
		c[_i].config = cfg
	}
}