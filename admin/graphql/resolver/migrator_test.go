// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"database/sql"
	"fmt"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/facebook/ent/dialect"
	"github.com/facebookincubator/symphony/admin/graphql/resolver"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/strutil"
	"github.com/stretchr/testify/require"

	_ "github.com/mattn/go-sqlite3"
)

type testTx struct {
	gqlutil.TxExecQueryer
	query string
}

func (tx testTx) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	if tx.query == query {
		return sqlmock.NewResult(1, 1), nil
	}
	return tx.TxExecQueryer.ExecContext(ctx, query, args...)
}

func TestMigrator(t *testing.T) {
	db, err := sql.Open(dialect.SQLite,
		fmt.Sprintf("file:%s-%d?mode=memory&cache=shared&_fk=1",
			t.Name(), time.Now().UnixNano(),
		),
	)
	require.NoError(t, err)
	defer db.Close()

	ctx := context.Background()
	tx, err := db.BeginTx(ctx, nil)
	require.NoError(t, err)
	defer func() {
		err := tx.Commit()
		require.NoError(t, err)
	}()

	ctx = gqlutil.NewDBContext(ctx, testTx{
		TxExecQueryer: tx,
		query: fmt.Sprintf(
			"USE `tenant_%s`", t.Name(),
		),
	})
	err = resolver.NewMigrator(
		resolver.MigratorConfig{
			Dialect: strutil.Stringer(
				dialect.SQLite,
			),
		},
	).Migrate(ctx, t.Name())
	require.NoError(t, err)
}
