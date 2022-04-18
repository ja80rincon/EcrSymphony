// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebook/ent/dialect"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/migrate"
)

// Migrator runs tenant schema migration.
type Migrator interface {
	Migrate(context.Context, string) error
}

// migrator run ent schema migrations.
type migrator struct {
	logger  log.Logger
	dialect string
}

// MigratorConfig configures migrator.
type MigratorConfig struct {
	Logger  log.Logger
	Dialect fmt.Stringer
}

// NewMigrator creates an ent schema migrator.
func NewMigrator(cfg MigratorConfig) Migrator {
	m := &migrator{
		logger:  cfg.Logger,
		dialect: cfg.Dialect.String(),
	}
	if m.logger == nil {
		m.logger = log.NewNopLogger()
	}
	if m.dialect == "" {
		m.dialect = dialect.MySQL
	}
	return m
}

// Migrate implements Migrator interface.
func (m *migrator) Migrate(ctx context.Context, tenant string) error {
	migrator := migrate.NewMigrator(
		migrate.MigratorConfig{
			Driver: gqlutil.DrvFromTx(
				m.dialect,
				gqlutil.TxFromContext(ctx),
			),
			Logger: m.logger,
		},
	)
	return migrator.Migrate(ctx, tenant)
}
