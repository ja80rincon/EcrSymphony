// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by entc, DO NOT EDIT.

package rulelimit

import (
	"time"

	"github.com/facebook/ent/dialect/sql"
	"github.com/facebook/ent/dialect/sql/sqlgraph"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
)

// ID filters vertices based on their identifier.
func ID(id int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldID), id))
	})
}

// IDEQ applies the EQ predicate on the ID field.
func IDEQ(id int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldID), id))
	})
}

// IDNEQ applies the NEQ predicate on the ID field.
func IDNEQ(id int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.NEQ(s.C(FieldID), id))
	})
}

// IDIn applies the In predicate on the ID field.
func IDIn(ids ...int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(ids) == 0 {
			s.Where(sql.False())
			return
		}
		v := make([]interface{}, len(ids))
		for i := range v {
			v[i] = ids[i]
		}
		s.Where(sql.In(s.C(FieldID), v...))
	})
}

// IDNotIn applies the NotIn predicate on the ID field.
func IDNotIn(ids ...int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(ids) == 0 {
			s.Where(sql.False())
			return
		}
		v := make([]interface{}, len(ids))
		for i := range v {
			v[i] = ids[i]
		}
		s.Where(sql.NotIn(s.C(FieldID), v...))
	})
}

// IDGT applies the GT predicate on the ID field.
func IDGT(id int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GT(s.C(FieldID), id))
	})
}

// IDGTE applies the GTE predicate on the ID field.
func IDGTE(id int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GTE(s.C(FieldID), id))
	})
}

// IDLT applies the LT predicate on the ID field.
func IDLT(id int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LT(s.C(FieldID), id))
	})
}

// IDLTE applies the LTE predicate on the ID field.
func IDLTE(id int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LTE(s.C(FieldID), id))
	})
}

// CreateTime applies equality check predicate on the "create_time" field. It's identical to CreateTimeEQ.
func CreateTime(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldCreateTime), v))
	})
}

// UpdateTime applies equality check predicate on the "update_time" field. It's identical to UpdateTimeEQ.
func UpdateTime(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldUpdateTime), v))
	})
}

// Number applies equality check predicate on the "number" field. It's identical to NumberEQ.
func Number(v int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldNumber), v))
	})
}

// LimitType applies equality check predicate on the "limitType" field. It's identical to LimitTypeEQ.
func LimitType(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldLimitType), v))
	})
}

// CreateTimeEQ applies the EQ predicate on the "create_time" field.
func CreateTimeEQ(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldCreateTime), v))
	})
}

// CreateTimeNEQ applies the NEQ predicate on the "create_time" field.
func CreateTimeNEQ(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.NEQ(s.C(FieldCreateTime), v))
	})
}

// CreateTimeIn applies the In predicate on the "create_time" field.
func CreateTimeIn(vs ...time.Time) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.In(s.C(FieldCreateTime), v...))
	})
}

// CreateTimeNotIn applies the NotIn predicate on the "create_time" field.
func CreateTimeNotIn(vs ...time.Time) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.NotIn(s.C(FieldCreateTime), v...))
	})
}

// CreateTimeGT applies the GT predicate on the "create_time" field.
func CreateTimeGT(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GT(s.C(FieldCreateTime), v))
	})
}

// CreateTimeGTE applies the GTE predicate on the "create_time" field.
func CreateTimeGTE(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GTE(s.C(FieldCreateTime), v))
	})
}

// CreateTimeLT applies the LT predicate on the "create_time" field.
func CreateTimeLT(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LT(s.C(FieldCreateTime), v))
	})
}

// CreateTimeLTE applies the LTE predicate on the "create_time" field.
func CreateTimeLTE(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LTE(s.C(FieldCreateTime), v))
	})
}

// UpdateTimeEQ applies the EQ predicate on the "update_time" field.
func UpdateTimeEQ(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldUpdateTime), v))
	})
}

// UpdateTimeNEQ applies the NEQ predicate on the "update_time" field.
func UpdateTimeNEQ(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.NEQ(s.C(FieldUpdateTime), v))
	})
}

// UpdateTimeIn applies the In predicate on the "update_time" field.
func UpdateTimeIn(vs ...time.Time) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.In(s.C(FieldUpdateTime), v...))
	})
}

// UpdateTimeNotIn applies the NotIn predicate on the "update_time" field.
func UpdateTimeNotIn(vs ...time.Time) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.NotIn(s.C(FieldUpdateTime), v...))
	})
}

// UpdateTimeGT applies the GT predicate on the "update_time" field.
func UpdateTimeGT(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GT(s.C(FieldUpdateTime), v))
	})
}

// UpdateTimeGTE applies the GTE predicate on the "update_time" field.
func UpdateTimeGTE(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GTE(s.C(FieldUpdateTime), v))
	})
}

// UpdateTimeLT applies the LT predicate on the "update_time" field.
func UpdateTimeLT(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LT(s.C(FieldUpdateTime), v))
	})
}

// UpdateTimeLTE applies the LTE predicate on the "update_time" field.
func UpdateTimeLTE(v time.Time) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LTE(s.C(FieldUpdateTime), v))
	})
}

// NumberEQ applies the EQ predicate on the "number" field.
func NumberEQ(v int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldNumber), v))
	})
}

// NumberNEQ applies the NEQ predicate on the "number" field.
func NumberNEQ(v int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.NEQ(s.C(FieldNumber), v))
	})
}

// NumberIn applies the In predicate on the "number" field.
func NumberIn(vs ...int) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.In(s.C(FieldNumber), v...))
	})
}

// NumberNotIn applies the NotIn predicate on the "number" field.
func NumberNotIn(vs ...int) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.NotIn(s.C(FieldNumber), v...))
	})
}

// NumberGT applies the GT predicate on the "number" field.
func NumberGT(v int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GT(s.C(FieldNumber), v))
	})
}

// NumberGTE applies the GTE predicate on the "number" field.
func NumberGTE(v int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GTE(s.C(FieldNumber), v))
	})
}

// NumberLT applies the LT predicate on the "number" field.
func NumberLT(v int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LT(s.C(FieldNumber), v))
	})
}

// NumberLTE applies the LTE predicate on the "number" field.
func NumberLTE(v int) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LTE(s.C(FieldNumber), v))
	})
}

// LimitTypeEQ applies the EQ predicate on the "limitType" field.
func LimitTypeEQ(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EQ(s.C(FieldLimitType), v))
	})
}

// LimitTypeNEQ applies the NEQ predicate on the "limitType" field.
func LimitTypeNEQ(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.NEQ(s.C(FieldLimitType), v))
	})
}

// LimitTypeIn applies the In predicate on the "limitType" field.
func LimitTypeIn(vs ...string) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.In(s.C(FieldLimitType), v...))
	})
}

// LimitTypeNotIn applies the NotIn predicate on the "limitType" field.
func LimitTypeNotIn(vs ...string) predicate.RuleLimit {
	v := make([]interface{}, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.RuleLimit(func(s *sql.Selector) {
		// if not arguments were provided, append the FALSE constants,
		// since we can't apply "IN ()". This will make this predicate falsy.
		if len(v) == 0 {
			s.Where(sql.False())
			return
		}
		s.Where(sql.NotIn(s.C(FieldLimitType), v...))
	})
}

// LimitTypeGT applies the GT predicate on the "limitType" field.
func LimitTypeGT(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GT(s.C(FieldLimitType), v))
	})
}

// LimitTypeGTE applies the GTE predicate on the "limitType" field.
func LimitTypeGTE(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.GTE(s.C(FieldLimitType), v))
	})
}

// LimitTypeLT applies the LT predicate on the "limitType" field.
func LimitTypeLT(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LT(s.C(FieldLimitType), v))
	})
}

// LimitTypeLTE applies the LTE predicate on the "limitType" field.
func LimitTypeLTE(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.LTE(s.C(FieldLimitType), v))
	})
}

// LimitTypeContains applies the Contains predicate on the "limitType" field.
func LimitTypeContains(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.Contains(s.C(FieldLimitType), v))
	})
}

// LimitTypeHasPrefix applies the HasPrefix predicate on the "limitType" field.
func LimitTypeHasPrefix(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.HasPrefix(s.C(FieldLimitType), v))
	})
}

// LimitTypeHasSuffix applies the HasSuffix predicate on the "limitType" field.
func LimitTypeHasSuffix(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.HasSuffix(s.C(FieldLimitType), v))
	})
}

// LimitTypeEqualFold applies the EqualFold predicate on the "limitType" field.
func LimitTypeEqualFold(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.EqualFold(s.C(FieldLimitType), v))
	})
}

// LimitTypeContainsFold applies the ContainsFold predicate on the "limitType" field.
func LimitTypeContainsFold(v string) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s.Where(sql.ContainsFold(s.C(FieldLimitType), v))
	})
}

// HasComparator applies the HasEdge predicate on the "comparator" edge.
func HasComparator() predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.To(ComparatorTable, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, ComparatorTable, ComparatorColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasComparatorWith applies the HasEdge predicate on the "comparator" edge with a given conditions (other predicates).
func HasComparatorWith(preds ...predicate.Comparator) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.To(ComparatorInverseTable, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, ComparatorTable, ComparatorColumn),
		)
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// HasRule applies the HasEdge predicate on the "rule" edge.
func HasRule() predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.To(RuleTable, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, RuleTable, RuleColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasRuleWith applies the HasEdge predicate on the "rule" edge with a given conditions (other predicates).
func HasRuleWith(preds ...predicate.Rule) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.To(RuleInverseTable, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, RuleTable, RuleColumn),
		)
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// And groups list of predicates with the AND operator between them.
func And(predicates ...predicate.RuleLimit) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s1 := s.Clone().SetP(nil)
		for _, p := range predicates {
			p(s1)
		}
		s.Where(s1.P())
	})
}

// Or groups list of predicates with the OR operator between them.
func Or(predicates ...predicate.RuleLimit) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		s1 := s.Clone().SetP(nil)
		for i, p := range predicates {
			if i > 0 {
				s1.Or()
			}
			p(s1)
		}
		s.Where(s1.P())
	})
}

// Not applies the not operator on the given predicate.
func Not(p predicate.RuleLimit) predicate.RuleLimit {
	return predicate.RuleLimit(func(s *sql.Selector) {
		p(s.Not())
	})
}
