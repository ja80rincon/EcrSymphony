// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"database/sql"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/database/mysql"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/viewer"
)

func CustomPaginateProjects(
	ctx context.Context, client *ent.Client, projectCursor *ent.Cursor,
	limit int, direction string, filterBy []*models.ProjectFilterInput,
	propertyColumn string) (*ent.ProjectConnection, error) {
	first, id, index, value := initValues(projectCursor)

	projectFilters := projectFilters(filterBy)
	propertyFilters := propertyFilters(filterBy)

	drv, err := Driver(ctx)
	if err != nil {
		return nil, err
	}

	propertyTypeQuery, args := ProjectPropertyFieldQuery(propertyColumn).Query()

	propertyTypeRows, err := drv.QueryContext(ctx, propertyTypeQuery, args...)

	if err != nil {
		drv.Close()
		return nil, err
	}
	defer propertyTypeRows.Close()

	propertyType, err := propertyTypeColumn(propertyTypeRows)
	if err != nil {
		drv.Close()
		return nil, err
	}

	projectQuery, args := ProjectQuery(propertyColumn, *propertyType,
		direction, limit+index, first, id, value, projectFilters, propertyFilters).Query()

	projectRows, err := drv.QueryContext(ctx, projectQuery, args...)

	if err != nil {
		drv.Close()
		return nil, err
	}
	defer projectRows.Close()

	edges := make([]*ent.ProjectEdge, 0)

	for projectRows.Next() {
		var projectID int
		var val interface{}

		if err := projectRows.Scan(&projectID, &val); err != nil {
			drv.Close()
			return nil, err
		}

		project := client.Project.GetX(ctx, projectID)

		edge := populateEdge(project, projectID, val)

		edges = append(edges, edge)
	}

	countQuery, args := CountQuery(propertyColumn, *propertyType,
		id, value, projectFilters, propertyFilters).Query()

	countRows, err := drv.QueryContext(ctx, countQuery, args...)

	if err != nil {
		drv.Close()
		return nil, err
	}
	defer countRows.Close()

	totalCount, err := totalCountValue(countRows)
	if err != nil {
		drv.Close()
		return nil, err
	}

	projectConnection := populateProjectConnection(first, id, limit, totalCount, edges)

	if err := projectRows.Err(); err != nil {
		drv.Close()
		return nil, err
	}

	drv.Close()

	return projectConnection, nil
}

func initValues(projectCursor *ent.Cursor) (bool, int, int, interface{}) {
	first := projectCursor == nil

	var id, index int
	var value interface{}
	if first {
		id = 0
		value = ""
		index = 1
	} else {
		id = projectCursor.ID
		value = projectCursor.Value
		index = 2
	}
	return first, id, index, value
}

func totalCountValue(countRows *sql.Rows) (int, error) {
	var totalCount int
	if countRows.Next() {
		if err := countRows.Scan(&totalCount); err != nil {
			return 0, err
		}
	}

	if err := countRows.Err(); err != nil {
		return 0, err
	}

	return totalCount, nil
}

func propertyTypeColumn(propertyTypeRows *sql.Rows) (*string, error) {
	var propertyType string
	if propertyTypeRows.Next() {
		if err := propertyTypeRows.Scan(&propertyType); err != nil {
			return nil, err
		}
	} else {
		propertyType = string(propertytype.TypeString)
	}

	if err := propertyTypeRows.Err(); err != nil {
		return nil, err
	}

	return &propertyType, nil
}

func populateEdge(project *ent.Project, projectID int, val interface{}) *ent.ProjectEdge {
	var val2 interface{}

	if val == nil {
		val2 = ""
	} else {
		val2 = val
	}

	cursor := ent.Cursor{
		ID:    projectID,
		Value: val2,
	}

	return &ent.ProjectEdge{
		Node:   project,
		Cursor: cursor,
	}
}

func populateProjectConnection(
	first bool, id, limit, totalCount int,
	edges []*ent.ProjectEdge) *ent.ProjectConnection {
	size := len(edges)

	var hasPreviousPage bool
	if !first && size > 0 && edges[0].Node.ID == id {
		edges = edges[1:]
		hasPreviousPage = true
	} else {
		hasPreviousPage = false
		if size == limit+2 {
			edges = edges[:size-1]
		}
	}

	size = len(edges)

	var hasNextPage bool
	if size == (limit + 1) {
		edges = edges[:size-1]
		hasNextPage = true
	} else {
		hasNextPage = false
	}

	size = len(edges)

	var startCursor, endCursor *ent.Cursor
	if size > 0 {
		startCursor = &edges[0].Cursor
		endCursor = &edges[size-1].Cursor
	} else {
		startCursor = nil
		endCursor = nil
	}

	pageInfo := ent.PageInfo{
		HasNextPage:     hasNextPage,
		HasPreviousPage: hasPreviousPage,
		StartCursor:     startCursor,
		EndCursor:       endCursor,
	}

	return &ent.ProjectConnection{
		Edges:      edges,
		PageInfo:   pageInfo,
		TotalCount: totalCount,
	}
}

func propertyFilters(filters []*models.ProjectFilterInput) []*models.ProjectFilterInput {
	pf := make([]*models.ProjectFilterInput, 0)

	for _, filter := range filters {
		if filter.FilterType == models.ProjectFilterTypeProperty &&
			filter.Operator == enum.FilterOperatorIs {
			pf = append(pf, filter)
		}
	}
	return pf
}

func projectFilters(filters []*models.ProjectFilterInput) []*models.ProjectFilterInput {
	pf := make([]*models.ProjectFilterInput, 0)

	for _, filter := range filters {
		switch filter.FilterType {
		case models.ProjectFilterTypeProjectName:
			if filter.Operator == enum.FilterOperatorContains && filter.StringValue != nil {
				pf = append(pf, filter)
			}
		case models.ProjectFilterTypeProjectOwnedBy:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				pf = append(pf, filter)
			}
		case models.ProjectFilterTypeProjectType:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				pf = append(pf, filter)
			}
		case models.ProjectFilterTypeProjectPriority:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				pf = append(pf, filter)
			}
		case models.ProjectFilterTypeLocationInst:
			if filter.Operator == enum.FilterOperatorIsOneOf {
				pf = append(pf, filter)
			}
		}
	}
	return pf
}

func Driver(ctx context.Context) (*sql.DB, error) {
	tenant := viewer.FromContext(ctx).Tenant()

	url := GlobalPropFlags.DatabaseURL
	url.Path = "/" + viewer.DBName(tenant)

	db, err := mysql.OpenURL(ctx, url)
	if err != nil {
		return nil, err
	}

	return db, nil
}
