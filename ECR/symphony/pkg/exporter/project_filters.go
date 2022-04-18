// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/projecttemplate"
	"github.com/facebookincubator/symphony/pkg/ent/projecttype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"

	"github.com/pkg/errors"
)

func handleProjectFilter(q *ent.ProjectQuery, filter *pkgmodels.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.FilterType == enum.ProjectFilterTypeProjectName {
		return projectNameFilter(q, filter)
	}
	if filter.FilterType == enum.ProjectFilterTypeProjectTemplate {
		return projectTemplateFilter(q, filter)
	}
	if filter.FilterType == enum.ProjectFilterTypeProjectCreator {
		return projectCreatorFilter(q, filter)
	}
	if filter.FilterType == enum.ProjectFilterTypeProjectType {
		return projectTypeFilter(q, filter)
	}
	return nil, errors.Errorf("filter type is not supported: %s", filter.FilterType)
}

func projectNameFilter(q *ent.ProjectQuery, filter *pkgmodels.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
		return q.Where(project.NameContainsFold(*filter.StringValue)), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func projectTemplateFilter(q *ent.ProjectQuery, filter *pkgmodels.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(project.HasTemplateWith(projecttemplate.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation %q is not supported", filter.Operator)
}

func projectCreatorFilter(q *ent.ProjectQuery, filter *pkgmodels.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(project.HasCreatorWith(user.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}

func projectTypeFilter(q *ent.ProjectQuery, filter *pkgmodels.ProjectFilterInput) (*ent.ProjectQuery, error) {
	if filter.Operator == enum.FilterOperatorIsOneOf {
		return q.Where(project.HasTypeWith(projecttype.IDIn(filter.IDSet...))), nil
	}
	return nil, errors.Errorf("operation is not supported: %s", filter.Operator)
}
