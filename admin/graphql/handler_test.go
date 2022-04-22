// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package graphql_test

import (
	"context"
	"fmt"
	"regexp"
	"testing"

	"github.com/99designs/gqlgen/client"
	gql "github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/testserver"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/facebook/ent/dialect"
	"github.com/facebookincubator/symphony/admin/graphql"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/strutil"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestHandler(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	mock.ExpectQuery(regexp.QuoteMeta(
		"SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ? LIMIT 1",
	)).
		WithArgs("tenant_foo").
		WillReturnRows(
			mock.NewRows([]string{"COUNT"}).
				AddRow(1),
		).
		RowsWillBeClosed()

	handler := graphql.NewHandler(
		graphql.HandlerConfig{
			DB:      db,
			Dialect: strutil.Stringer(dialect.SQLite),
			Tenancy: viewer.NewFixedTenancy(
				viewertest.NewTestClient(t),
			),
		},
	)

	c := client.New(handler, client.Path("/query"))
	var rsp struct{ Tenant struct{ ID, Name string } }
	err = c.Post(`query { tenant(name: "foo") { id name } }`, &rsp)
	require.NoError(t, err)
	require.NotEmpty(t, rsp.Tenant.ID)
	require.Equal(t, "foo", rsp.Tenant.Name)
}

func TestTenancyInjector(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer func() {
		err := mock.ExpectationsWereMet()
		require.NoError(t, err)
	}()
	mock.ExpectBegin()
	tenants := []string{"foo", "bar", "baz"}
	result := sqlmock.NewResult(0, 0)
	for _, tenant := range tenants {
		mock.ExpectExec(
			fmt.Sprintf("USE `tenant_%s`", tenant),
		).
			WillReturnResult(result)
	}
	mock.ExpectCommit()

	srv := testserver.New()
	srv.AddTransport(transport.POST{})
	srv.Use(gqlutil.DBInjector{DB: db})
	srv.Use(graphql.TenancyInjector{
		Tenancy: viewer.NewFixedTenancy(&ent.Client{}),
		Dialect: dialect.MySQL,
	})
	srv.AroundResponses(func(ctx context.Context, _ gql.ResponseHandler) *gql.Response {
		type tenancyReleaser interface {
			viewer.Tenancy
			Release()
		}
		tenancy, ok := viewer.TenancyFromContext(ctx).(tenancyReleaser)
		require.True(t, ok)
		for _, tenant := range tenants {
			_, err := tenancy.ClientFor(ctx, tenant)
			require.NoError(t, err)
			tenancy.Release()
		}
		return &gql.Response{Data: []byte(`{"name":"test"}`)}
	})

	c := client.New(srv)
	err = c.Post(`mutation { name }`, &struct{ Name string }{})
	require.NoError(t, err)
}
