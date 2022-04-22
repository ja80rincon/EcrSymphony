// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"database/sql"
	"fmt"
	"regexp"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/VividCortex/mysqlerr"
	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/facebookincubator/symphony/pkg/ent/migrate"
	"github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type tenantSuite struct{ testSuite }

func TestTenant(t *testing.T) {
	suite.Run(t, &tenantSuite{})
}

func (s *tenantSuite) TestCreateTenant() {
	s.mock.ExpectBegin()
	s.mock.ExpectExec(
		regexp.QuoteMeta("CREATE DATABASE `tenant_foo`"),
	).
		WillReturnResult(
			sqlmock.NewResult(1, 1),
		)
	s.migrator.On("Migrate", mock.Anything, "foo").
		Return(nil).
		Once()
	s.mock.ExpectCommit()

	var rsp struct {
		CreateTenant struct {
			ClientMutationID string
			Tenant           struct{ Name string }
		}
	}
	err := s.client.Post(`mutation($clientMutationId: String!) {
		createTenant(input: {clientMutationId: $clientMutationId, name: "foo"}) {
			clientMutationId
			tenant { name }
		}
	}`, &rsp, client.Var("clientMutationId", s.T().Name()))
	s.Require().NoError(err)
	s.Require().Equal(s.T().Name(), rsp.CreateTenant.ClientMutationID)
	s.Require().Equal("foo", rsp.CreateTenant.Tenant.Name)
}

func (s *tenantSuite) TestTruncateTenant() {
	s.mock.ExpectBegin()
	s.expectTenantCountQuery("bar", 1)
	result := sqlmock.NewResult(0, 0)
	s.mock.ExpectExec("SET FOREIGN_KEY_CHECKS=0").
		WillReturnResult(result)
	for _, table := range migrate.Tables {
		query := fmt.Sprintf("DELETE FROM `tenant_bar`.`%s`", table.Name)
		s.mock.ExpectExec(query).WillReturnResult(result)
	}
	s.mock.ExpectExec("SET FOREIGN_KEY_CHECKS=1").
		WillReturnResult(result)
	s.mock.ExpectCommit()

	var rsp struct {
		TruncateTenant struct{ ClientMutationID string }
	}
	err := s.client.Post(`mutation($clientMutationId: String!) {
		truncateTenant(input: {clientMutationId: $clientMutationId, name: "bar"}) {
			clientMutationId
		}
	}`, &rsp, client.Var("clientMutationId", s.T().Name()))
	s.Require().NoError(err)
}

func (s *tenantSuite) TestDeleteTenant() {
	s.mock.ExpectBegin()
	s.mock.ExpectExec(
		regexp.QuoteMeta("DROP DATABASE `tenant_foo`"),
	).
		WillReturnResult(
			sqlmock.NewResult(1, 1),
		)
	s.mock.ExpectCommit()

	var rsp struct {
		DeleteTenant struct{ ClientMutationID string }
	}
	err := s.client.Post(`mutation($id: ID!, $clientMutationId: String!) {
		deleteTenant(input: {clientMutationId: $clientMutationId, id: $id}) {
			clientMutationId
		}
	}`,
		&rsp,
		client.Var("id", model.ID{Tenant: "foo"}.String()),
		client.Var("clientMutationId", s.T().Name()),
	)
	s.Require().NoError(err)
	s.Require().Equal(s.T().Name(), rsp.DeleteTenant.ClientMutationID)
}

func (s *tenantSuite) TestDeleteBadTenant() {
	s.mock.ExpectBegin()
	s.mock.ExpectExec(
		regexp.QuoteMeta("DROP DATABASE `tenant_baz`"),
	).
		WillReturnError(&mysql.MySQLError{Number: mysqlerr.ER_DB_DROP_EXISTS})
	s.mock.ExpectRollback()

	id := model.ID{Tenant: "baz"}.String()
	var rsp struct {
		DeleteTenant struct{ ClientMutationID string }
	}
	err := s.client.Post(`mutation($id: ID!, $clientMutationId: String!) {
		deleteTenant(input: {clientMutationId: $clientMutationId, id: $id}) {
			clientMutationId
		}
	}`,
		&rsp,
		client.Var("id", id),
		client.Var("clientMutationId", s.T().Name()),
	)
	s.Require().Error(err)
	s.Require().Contains(err.Error(), "Could not resolve to a node with the global id of '"+id+"'")
}

func (s *tenantSuite) TestQueryTenant() {
	const tenant = "foo"
	s.expectTenantCountQuery(tenant, 1)
	const query = `query { tenant(name: "foo") { name } }`
	var rsp struct{ Tenant model.Tenant }
	err := s.client.Post(query, &rsp)
	s.Require().NoError(err)
	s.Require().Equal(tenant, rsp.Tenant.Name)

	s.expectTenantCountQuery(tenant, 0)
	err = s.client.Post(query, &rsp)
	s.Require().Error(err)
	s.Require().Contains(err.Error(), "NOT_FOUND")
}

func (s *tenantSuite) TestQueryTenants() {
	s.expectTenantsInQuery("foo", "bar")
	var rsp struct{ Tenants []model.Tenant }
	err := s.client.Post(`query {
		tenants(filterBy: { names: ["foo", "bar"] }) {
			name
		}
	}`, &rsp)
	s.Require().NoError(err)
	s.Require().Equal([]model.Tenant{{Name: "bar"}, {Name: "foo"}}, rsp.Tenants)
}

func (s *tenantSuite) TestQueryTenantsNoSchemata() {
	s.expectTenantsLikeQuery().WillReturnError(sql.ErrConnDone)
	err := s.client.Post(`query { tenants { name } }`, &struct{ Tenants []model.Tenant }{})
	s.Require().Error(err)
	s.Require().Contains(err.Error(), "cannot query tenant names")
}

func (s *tenantSuite) TestQueryTenantsRowErr() {
	s.expectTenantsLikeQuery().
		WillReturnRows(
			s.newTenantRows("test").
				RowError(0, sql.ErrConnDone),
		).
		RowsWillBeClosed()
	err := s.client.Post(`query { tenants { name } }`, &struct{ Tenants []model.Tenant }{})
	s.Require().Error(err)
	s.Require().Contains(err.Error(), sql.ErrConnDone.Error())
}
