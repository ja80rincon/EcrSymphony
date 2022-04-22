// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/projecttype"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	"github.com/pkg/errors"
)

func handleProjectFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.FilterType == models.ProjectFilterTypeProjectName {
		return projectNameFilter(q, filter)
	}
	if filter.FilterType == models.ProjectFilterTypeProjectOwnedBy {
		return projectOwnedByFilter(q, filter)
	}
	if filter.FilterType == models.ProjectFilterTypeLocationInst {
		return projectLocationInstFilter(q, filter)
	}
	if filter.FilterType == models.ProjectFilterTypeProjectType {
		return projectTypeFilter(q, filter)
	}
	if filter.FilterType == models.ProjectFilterTypeProjectPriority {
		return projectPriorityFilter(q, filter)
	}
	if filter.FilterType == models.ProjectFilterTypeProjectCreationDate {
		return projectCreationDateFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func handleProjectPropertyFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.FilterType == models.ProjectFilterTypeProperty {
		return projectPropertiesFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func projectNameFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(project.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func projectOwnedByFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(project.HasCreatorWith(user.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func projectLocationInstFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(project.HasLocationWith(location.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func handleProjectLocationFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.FilterType == models.ProjectFilterTypeLocationInst {
		return projectLocationFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func projectLocationFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		if filter.MaxDepth == nil {
			return nil, errors.New("max depth not supplied to location filter")
		}
		var ps []predicate.Project
		for _, lid := range filter.IDSet {
			ps = append(ps, project.HasLocationWith(pkgexporter.BuildLocationAncestorFilter(lid, 1, *filter.MaxDepth)))
		}
		return q.Where(project.Or(ps...)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func projectTypeFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(project.HasTypeWith(projecttype.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func projectPriorityFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator != enum.FilterOperatorIsOneOf {
		return nil, errors.Errorf("operation %q is not supported", filter.Operator)
	}
	priorities := make([]project.Priority, 0, len(filter.StringSet))
	for _, str := range filter.StringSet {
		priority := project.Priority(str)
		if err := project.PriorityValidator(priority); err != nil {
			return nil, errors.Errorf("%s is not a valid work order priority", str)
		}
		priorities = append(priorities, priority)
	}
	return q.Where(project.PriorityIn(priorities...)), nil
}

func projectPropertiesFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	p := filter.PropertyValue
	switch filter.Operator {
	case enum.FilterOperatorIs:
		pred, err := pkgexporter.GetPropertyPredicate(*p)
		if err != nil {
			return nil, err
		}
		predForType, err := pkgexporter.GetPropertyTypePredicate(*p)
		if err != nil {
			return nil, err
		}

		q = q.Where(
			project.Or(
				project.HasPropertiesWith(
					property.And(
						property.HasTypeWith(
							propertytype.Name(p.Name),
							propertytype.TypeEQ(p.Type),
						),
						pred,
					),
				),
				project.And(
					project.HasTypeWith(projecttype.HasPropertiesWith(
						propertytype.Name(p.Name),
						propertytype.TypeEQ(p.Type),
						predForType,
					)),
					project.Not(project.HasPropertiesWith(
						property.HasTypeWith(
							propertytype.Name(p.Name),
							propertytype.TypeEQ(p.Type),
						)),
					))))
		return q, nil
	default:
		return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
	}
}

func projectCreationDateFilter(q *ent.ProjectQuery, filter *models.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.TimeValue == nil {
		return nil, errors.Errorf("TimeValue is required: %s", filter.Operator)
	}
	switch filter.Operator {
	case enum.FilterOperatorDateLessThan:
		return q.Where(project.CreateTimeLT(*filter.TimeValue)), nil
	case enum.FilterOperatorDateLessOrEqualThan:
		return q.Where(project.CreateTimeLTE(*filter.TimeValue)), nil
	case enum.FilterOperatorDateGreaterThan:
		return q.Where(project.CreateTimeGT(*filter.TimeValue)), nil
	case enum.FilterOperatorDateGreaterOrEqualThan:
		return q.Where(project.CreateTimeGTE(*filter.TimeValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
