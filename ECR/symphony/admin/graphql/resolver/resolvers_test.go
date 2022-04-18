// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"database/sql/driver"
	"fmt"
	"regexp"
	"sort"
	"strings"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/facebookincubator/symphony/admin/graphql/directive"
	"github.com/facebookincubator/symphony/admin/graphql/exec"
	"github.com/facebookincubator/symphony/admin/graphql/resolver"
	"github.com/facebookincubator/symphony/admin/graphql/resolver/mocks"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/suite"
)

type testSuite struct {
	suite.Suite
	server   *handler.Server
	client   *client.Client
	mock     sqlmock.SqlmockCommon
	migrator *mocks.Migrator
	tenancy  viewertest.Tenancy
}

func (s *testSuite) SetupTest() {
	db, mock, err := sqlmock.New()
	s.Require().NoError(err)
	s.migrator = &mocks.Migrator{}
	s.server = handler.New(
		exec.NewExecutableSchema(
			exec.Config{
				Resolvers: resolver.New(
					resolver.Config{
						Logger:   logtest.NewTestLogger(s.T()),
						Migrator: s.migrator,
					},
				),
				Directives: directive.New(),
			},
		),
	)
	s.server.AddTransport(transport.POST{})
	s.server.Use(gqlutil.DBInjector{DB: db})
	s.server.AroundOperations(
		func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
			ctx = privacy.DecisionContext(ctx, privacy.Allow)
			ctx = viewer.NewTenancyContext(ctx, &s.tenancy)
			return next(ctx)
		},
	)
	s.client = client.New(s.server)
	s.mock = mock
}

func (s *testSuite) TearDownTest() {
	err := s.mock.ExpectationsWereMet()
	s.Require().NoError(err)
	s.migrator.AssertExpectations(s.T())
	err = s.tenancy.Close()
	s.Require().NoError(err)
}

func (s *testSuite) expectTenantCountQuery(name string, count int) {
	s.mock.ExpectQuery(regexp.QuoteMeta(
		"SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ? LIMIT 1",
	)).
		WithArgs("tenant_" + name).
		WillReturnRows(
			s.mock.NewRows([]string{"COUNT"}).
				AddRow(count),
		).
		RowsWillBeClosed()
}

func (s *testSuite) newTenantRows(tenants ...string) *sqlmock.Rows {
	sort.Strings(tenants)
	rows := s.mock.NewRows([]string{"SCHEMA_NAME"})
	for _, tenant := range tenants {
		rows = rows.AddRow("tenant_" + tenant)
	}
	return rows
}

func (s *testSuite) expectTenantsInQuery(tenants ...string) *sqlmock.ExpectedQuery {
	args := make([]driver.Value, 0, len(tenants)+1)
	for _, tenant := range tenants {
		args = append(args, "tenant_"+tenant)
	}
	rows := s.newTenantRows(tenants...)
	return s.mock.ExpectQuery(regexp.QuoteMeta(
		fmt.Sprintf("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME IN (%s) LIMIT %d",
			strings.Repeat(",?", len(args))[1:], len(tenants),
		),
	)).
		WithArgs(args...).
		WillReturnRows(rows).
		RowsWillBeClosed()
}

func (s *testSuite) expectTenantsLikeQuery(tenants ...string) *sqlmock.ExpectedQuery {
	query := s.mock.ExpectQuery(regexp.QuoteMeta(
		"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME LIKE ?",
	)).
		WithArgs("tenant_%")
	if len(tenants) > 0 {
		query = query.WillReturnRows(s.newTenantRows(tenants...))
	}
	return query
}

func (s *testSuite) expectBeginCommit() {
	s.mock.ExpectBegin()
	s.mock.ExpectCommit()
}
