// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package migrate_test

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/facebook/ent/dialect"
	"github.com/facebook/ent/dialect/sql"
	"github.com/facebook/ent/dialect/sql/schema"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/migrate"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

type testCreator struct {
	mock.Mock
}

func (m *testCreator) Create(ctx context.Context, opts ...schema.MigrateOption) error {
	return m.Called(ctx, opts).Error(0)
}

func TestMigrator(t *testing.T) {
	db, m, err := sqlmock.New()
	require.NoError(t, err)
	drv := sql.OpenDB(dialect.MySQL, db)
	require.NotNil(t, drv)

	tenants := []string{"foo", "bar", "baz"}
	m.ExpectBegin()
	for i, tenant := range tenants {
		m.ExpectExec(fmt.Sprintf("USE `%s`", viewer.DBName(tenant))).
			WillReturnResult(sqlmock.NewResult(int64(i)+1, 1))
	}
	m.ExpectCommit()

	var c testCreator
	c.On("Create", mock.Anything, mock.Anything).
		Return(nil).
		Times(len(tenants))
	defer c.AssertExpectations(t)

	err = migrate.NewMigrator(migrate.MigratorConfig{
		Driver:  drv,
		Logger:  logtest.NewTestLogger(t),
		Creator: func(dialect.Driver) migrate.Creator { return &c },
	}).Migrate(context.Background(), "foo", "bar", "baz")
	require.NoError(t, err)
}

func TestMigratorError(t *testing.T) {
	db, m, err := sqlmock.New()
	require.NoError(t, err)
	drv := sql.OpenDB(dialect.MySQL, db)
	require.NotNil(t, drv)

	m.ExpectBegin()
	m.ExpectExec(fmt.Sprintf("USE `%s`", viewer.DBName("foo"))).
		WillReturnResult(sqlmock.NewResult(1, 1))
	m.ExpectRollback()

	var c testCreator
	c.On("Create", mock.Anything, mock.Anything).
		Return(errors.New("bad database")).
		Once()
	defer c.AssertExpectations(t)

	err = migrate.NewMigrator(migrate.MigratorConfig{
		Driver:  drv,
		Logger:  logtest.NewTestLogger(t),
		Creator: func(dialect.Driver) migrate.Creator { return &c },
	}).Migrate(context.Background(), "foo", "bar", "baz")
	require.EqualError(t, err, "migrating schema: bad database")
}
