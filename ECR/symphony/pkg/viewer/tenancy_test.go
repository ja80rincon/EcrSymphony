// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package viewer_test

import (
	"context"
	"database/sql"
	"errors"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cenkalti/backoff/v4"
	"github.com/facebookincubator/symphony/pkg/database/mysql"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/mocks"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"gocloud.dev/server/health"
)

func TestFixedTenancy(t *testing.T) {
	want := &ent.Client{}
	tenancy := viewer.NewFixedTenancy(want)
	require.Implements(t, (*viewer.Tenancy)(nil), tenancy)
	t.Run("ClientFor", func(t *testing.T) {
		got, err := tenancy.ClientFor(context.Background(), "")
		require.NoError(t, err)
		require.True(t, want == got)
	})
	t.Run("Client", func(t *testing.T) {
		got := tenancy.Client()
		require.True(t, want == got)
	})
}

func TestCacheTenancy(t *testing.T) {
	var m mocks.Tenancy
	m.On("ClientFor", mock.Anything, "bar").
		Return(&ent.Client{}, nil).
		Once()
	m.On("ClientFor", mock.Anything, "baz").
		Return(nil, errors.New("try again")).
		Once()
	m.On("ClientFor", mock.Anything, "baz").
		Return(&ent.Client{}, nil).
		Once()
	defer m.AssertExpectations(t)

	var count int
	tenancy := viewer.NewCacheTenancy(&m, func(*ent.Client) { count++ })
	require.Implements(t, (*health.Checker)(nil), tenancy)

	client, err := tenancy.ClientFor(context.Background(), "bar")
	require.NoError(t, err)
	require.NotNil(t, client)
	cached, err := tenancy.ClientFor(context.Background(), "bar")
	require.NoError(t, err)
	require.True(t, client == cached)
	client, err = tenancy.ClientFor(context.Background(), "baz")
	require.Error(t, err)
	require.Nil(t, client)
	client, err = tenancy.ClientFor(context.Background(), "baz")
	require.NoError(t, err)
	require.NotNil(t, client)
	require.Equal(t, 2, count)
}

func createMySQLDatabase(db *sql.DB) (string, func() error, error) {
	name := "testdb_" + strconv.FormatInt(time.Now().UnixNano(), 10)
	if _, err := db.Exec("create database " + viewer.DBName(name)); err != nil {
		return "", nil, err
	}
	return name, func() error {
		_, err := db.Exec("drop database " + viewer.DBName(name))
		return err
	}, nil
}

func TestMySQLTenancy(t *testing.T) {
	dburl, ok := os.LookupEnv("DB_URL")
	if !ok {
		t.Skip("provide $DB_URL env to enable this test")
	}
	u, err := url.Parse(dburl)
	require.NoError(t, err)

	ctx := context.Background()
	db, err := mysql.OpenURL(ctx, u)
	require.NoError(t, err)
	tenancy, err := viewer.NewMySQLTenancy(ctx, u, 1)
	require.NoError(t, err)

	require.Implements(t, (*health.Checker)(nil), tenancy)
	ctx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)
	defer cancel()
	b := backoff.WithContext(
		backoff.NewConstantBackOff(10*time.Millisecond), ctx,
	)
	err = backoff.Retry(tenancy.CheckHealth, b)
	require.NoError(t, err)

	n1, cleaner, err := createMySQLDatabase(db)
	require.NoError(t, err)
	defer func(cleaner func() error) {
		require.NoError(t, cleaner())
	}(cleaner)
	n2, cleaner, err := createMySQLDatabase(db)
	require.NoError(t, err)
	defer func(cleaner func() error) {
		require.NoError(t, cleaner())
	}(cleaner)

	c1, err := tenancy.ClientFor(ctx, n1)
	require.NotNil(t, c1)
	require.NoError(t, err)
	c2, err := tenancy.ClientFor(ctx, n2)
	require.NoError(t, err)
	require.True(t, c1 != c2)
}

func TestGetTenantNames(t *testing.T) {
	db, sqlMock, err := sqlmock.New()
	require.NoError(t, err)
	sqlMock.ExpectQuery(regexp.QuoteMeta(
		"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME LIKE ?",
	)).
		WithArgs("tenant_%").
		WillReturnRows(
			sqlmock.NewRows([]string{"SCHEMA_NAME"}).
				AddRow("tenant_foo").
				AddRow("tenant_bar"),
		).
		RowsWillBeClosed()
	tenants, err := viewer.GetTenantNames(context.Background(), db)
	require.NoError(t, err)
	require.Equal(t, []string{"foo", "bar"}, tenants)
	err = sqlMock.ExpectationsWereMet()
	require.NoError(t, err)
}

func TestTenancyContext(t *testing.T) {
	want := &ent.Client{}
	var m mocks.Tenancy
	m.On("ClientFor", mock.Anything, t.Name()).
		Return(want, nil).
		Once()
	ctx := viewer.NewTenancyContext(context.Background(), &m)
	tenancy := viewer.TenancyFromContext(ctx)
	got, err := tenancy.ClientFor(ctx, t.Name())
	require.NoError(t, err)
	require.Equal(t, want, got)
}
