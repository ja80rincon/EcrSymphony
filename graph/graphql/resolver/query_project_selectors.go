// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"fmt"

	"github.com/facebook/ent/dialect/sql"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
)

const (
	projectAlias            string = "pj"
	propertyTypeAlias       string = "pt"
	propertyTypeFilterAlias string = "ptf"
	propertyAlias           string = "pp"
	propertyFilterAlias     string = "ppf"
	propertyQueryAlias      string = "pq"
	columnName              string = "_val_"
)

func propertiesFilterQuery(propertyFilters []*models.ProjectFilterInput) *sql.Selector {
	ppw := sql.Table(property.Table).As(propertyFilterAlias)
	ptw := sql.Table(propertytype.Table).As(propertyTypeFilterAlias)

	return sql.Select(ppw.C(property.ProjectColumn)).
		From(ppw).
		Join(ptw).On(ppw.C(property.TypeColumn), ptw.C(propertytype.FieldID)).
		Where(
			sql.P(
				func(b *sql.Builder) {
					option := "(%s = %s AND %s = %v)"
					stringValue := "'%s'"

					for index, propertyFilter := range propertyFilters {
						propertyValue := propertyFilter.PropertyValue

						if index != 0 {
							b.Pad().WriteString("OR").Pad()
						}

						var column string
						var value interface{}

						switch propertyValue.Type {
						case propertytype.TypeInt:
							column = ppw.C(propertytype.FieldIntVal)
							value = *propertyValue.IntValue
						case propertytype.TypeFloat:
							column = ppw.C(propertytype.FieldFloatVal)
							value = *propertyValue.FloatValue
						case propertytype.TypeBool:
							column = ppw.C(propertytype.FieldBoolVal)
							value = *propertyValue.BooleanValue
						default:
							column = ppw.C(propertytype.FieldStringVal)
							value = fmt.Sprintf(stringValue, *propertyValue.StringValue)
						}

						b.WriteString(
							fmt.Sprintf(
								option,
								ptw.C(propertytype.FieldName),
								fmt.Sprintf(stringValue, propertyValue.Name),
								column,
								value,
							),
						)
					}
				},
			),
		)
}

func propertiesQuery(columnName, propertyColumn, propertyType string) *sql.Selector {
	pp := sql.Table(property.Table).As(propertyAlias)
	pt := sql.Table(propertytype.Table).As(propertyTypeAlias)

	var propertyColumValue string

	switch propertyType {
	case string(propertytype.TypeInt):
		propertyColumValue = pp.C(property.FieldIntVal)
	case string(propertytype.TypeFloat):
		propertyColumValue = pp.C(property.FieldFloatVal)
	case string(propertytype.TypeGpsLocation):
		propertyColumValue = pp.C(property.FieldLatitudeVal)
	case string(propertytype.TypeBool):
		propertyColumValue = pp.C(property.FieldBoolVal)
	case string(propertytype.TypeRange):
		propertyColumValue = pp.C(property.FieldRangeFromVal)
	case string(propertytype.TypeDate):
		propertyColumValue = ToDate(pp.C(property.FieldStringVal))
	case string(propertytype.TypeDatetimeLocal):
		propertyColumValue = ToDateTime(pp.C(property.FieldStringVal))
	default:
		propertyColumValue = pp.C(property.FieldStringVal)
	}

	return sql.Select(
		pp.C(property.ProjectColumn),
		sql.As(propertyColumValue, columnName)).
		From(pp).
		Join(pt).On(pp.C(property.TypeColumn), pt.C(propertytype.FieldID)).
		Where(sql.EQ(pt.C(propertytype.FieldName), propertyColumn)).As(propertyQueryAlias)
}

func priorityFilter(selector *sql.Selector, filter *models.ProjectFilterInput, pj *sql.SelectTable) *sql.Selector {
	priorities := make([]interface{}, 0, len(filter.StringSet))
	for _, str := range filter.StringSet {
		priority := project.Priority(str)
		if err := project.PriorityValidator(priority); err == nil {
			priorities = append(priorities, priority)
		}
	}

	if len(priorities) == 0 {
		selector = selector.Where(sql.False())
	} else {
		selector = selector.Where(sql.In(pj.C(project.FieldPriority), priorities...))
	}
	return selector
}

func projectFilter(selector *sql.Selector, filters []*models.ProjectFilterInput, pj *sql.SelectTable) *sql.Selector {
	for _, filter := range filters {
		switch filter.FilterType {
		case models.ProjectFilterTypeProjectName:
			if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
				selector = selector.Where(sql.ContainsFold(pj.C(project.FieldName), *filter.StringValue))
			}
		case models.ProjectFilterTypeProjectOwnedBy:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				selector = selector.Where(sql.InInts(pj.C(project.CreatorColumn), filter.IDSet...))
			}
		case models.ProjectFilterTypeProjectType:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				selector = selector.Where(sql.InInts(pj.C(project.TypeColumn), filter.IDSet...))
			}
		case models.ProjectFilterTypeLocationInst:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				selector = selector.Where(sql.InInts(pj.C(project.LocationColumn), filter.IDSet...))
			}
		case models.ProjectFilterTypeProjectPriority:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				selector = priorityFilter(selector, filter, pj)
			}
		}
	}

	return selector
}

func ProjectPropertyFieldQuery(propertyColumn string) *sql.Selector {
	pt := sql.Table(propertytype.Table)

	return sql.Select(pt.C(propertytype.FieldType)).
		Distinct().
		From(pt).
		Where(sql.EQ(pt.C(propertytype.FieldName), propertyColumn)).
		Limit(1)
}

func ProjectQuery(propertyColumn, propertyType, direction string,
	limit int, first bool, id int, value interface{}, projectFilters,
	propertyFilters []*models.ProjectFilterInput) *sql.Selector {
	pj := sql.Table(project.Table).As(projectAlias)
	pq := propertiesQuery(columnName, propertyColumn, propertyType)

	selector := sql.Select(
		pj.C(project.FieldID),
		sql.As(pq.C(columnName), columnName)).
		Distinct().
		From(pj).
		LeftJoin(pq).On(pj.C(project.FieldID), pq.C(property.ProjectColumn))

	if len(propertyFilters) > 0 {
		pf := propertiesFilterQuery(propertyFilters)

		selector = selector.
			Join(pf).On(pj.C(project.FieldID), pf.C(property.ProjectColumn))
	}

	if len(projectFilters) > 0 {
		selector = projectFilter(selector, projectFilters, pj)
	}

	switch direction {
	case ent.OrderDirectionAsc.String():
		if !first {
			selector = selector.
				Where(sql.GTE(pj.C(project.FieldID), id)).
				Where(sql.GTE(CoalesceColumn(pq.C(columnName), ""), value))
		}
		selector = selector.
			OrderBy(sql.Asc(columnName), sql.Asc(pj.C(project.FieldID)))
	case ent.OrderDirectionDesc.String():
		if !first {
			selector = selector.
				Where(sql.LTE(pj.C(project.FieldID), id)).
				Where(sql.LTE(CoalesceColumn(pq.C(columnName), ""), value))
		}
		selector = selector.
			OrderBy(sql.Desc(columnName), sql.Desc(pj.C(project.FieldID)))
	}

	return selector.Limit(limit)
}

func CountQuery(propertyColumn, propertyType string, id int, value interface{}, projectFilters, propertyFilters []*models.ProjectFilterInput) *sql.Selector {
	pj := sql.Table(project.Table).As(projectAlias)

	pq := propertiesQuery(columnName, propertyColumn, propertyType)

	selector := sql.Select().
		Count().
		From(pj).
		LeftJoin(pq).On(pj.C(project.FieldID), pq.C(property.ProjectColumn))

	if len(propertyFilters) > 0 {
		pf := propertiesFilterQuery(propertyFilters)

		selector = selector.
			Join(pf).On(pj.C(project.FieldID), pf.C(property.ProjectColumn))
	}

	if len(projectFilters) > 0 {
		selector = projectFilter(selector, projectFilters, pj)
	}

	return selector
}
