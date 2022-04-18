// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/graph/resolverutil"
	"github.com/facebookincubator/symphony/pkg/ent"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/pkg/errors"
)

func (r queryResolver) EquipmentSearch(ctx context.Context, filters []*pkgmodels.EquipmentFilterInput, limit *int) (*pkgmodels.EquipmentSearchResult, error) {
	return pkgexporter.EquipmentSearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) WorkOrderSearch(ctx context.Context, filters []*pkgmodels.WorkOrderFilterInput, limit *int) (*pkgmodels.WorkOrderSearchResult, error) {
	return pkgexporter.WorkOrderSearch(ctx, r.ClientFrom(ctx), filters, limit, graphql.CollectAllFields(ctx))
}

func (r queryResolver) LinkSearch(ctx context.Context, filters []*pkgmodels.LinkFilterInput, limit *int) (*pkgmodels.LinkSearchResult, error) {
	return pkgexporter.LinkSearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) PortSearch(ctx context.Context, filters []*pkgmodels.PortFilterInput, limit *int) (*pkgmodels.PortSearchResult, error) {
	return pkgexporter.PortSearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) LocationSearch(ctx context.Context, filters []*pkgmodels.LocationFilterInput, limit *int) (*pkgmodels.LocationSearchResult, error) {
	return pkgexporter.LocationSearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) ServiceSearch(ctx context.Context, filters []*pkgmodels.ServiceFilterInput, limit *int) (*pkgmodels.ServiceSearchResult, error) {
	return pkgexporter.ServiceSearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) UserSearch(ctx context.Context, filters []*models.UserFilterInput, limit *int) (*models.UserSearchResult, error) {
	return resolverutil.UserSearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) PermissionsPolicySearch(ctx context.Context, filters []*models.PermissionsPolicyFilterInput, limit *int) (*models.PermissionsPolicySearchResult, error) {
	return resolverutil.PermissionsPolicySearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) UsersGroupSearch(ctx context.Context, filters []*models.UsersGroupFilterInput, limit *int) (*models.UsersGroupSearchResult, error) {
	return resolverutil.UsersGroupSearch(ctx, r.ClientFrom(ctx), filters, limit)
}

func (r queryResolver) ProjectSearch(ctx context.Context, filters []*models.ProjectFilterInput, limit *int) ([]*ent.Project, error) {
	var (
		query = r.ClientFrom(ctx).Project.Query()
		err   error
	)
	pros, err := query.All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying projects failed")
	}
	return pros, nil
}

func (r queryResolver) CustomerSearch(ctx context.Context, limit *int) ([]*ent.Customer, error) {
	var (
		query = r.ClientFrom(ctx).Customer.Query()
		err   error
	)
	pros, err := query.Limit(*limit).All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying customers failed")
	}
	return pros, nil
}
