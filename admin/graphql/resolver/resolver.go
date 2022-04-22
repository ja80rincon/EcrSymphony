// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/admin/graphql/exec"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/gqlutil"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"go.uber.org/zap"
)

// resolver is a graphql resolver root.
type resolver struct {
	log      log.Logger
	migrator Migrator
}

// Config configures resolver root.
type Config struct {
	Logger   log.Logger
	Migrator Migrator
}

// New creates a resolver root from config.
func New(cfg Config) exec.ResolverRoot {
	if cfg.Logger == nil {
		cfg.Logger = log.NewNopLogger()
	}
	if cfg.Migrator == nil {
		cfg.Migrator = NewMigrator(
			MigratorConfig{
				Logger: cfg.Logger,
			},
		)
	}
	return &resolver{
		log:      cfg.Logger,
		migrator: cfg.Migrator,
	}
}

// db returns the database attached to context.
func (resolver) db(ctx context.Context) gqlutil.ExecQueryer {
	return gqlutil.DBFromContext(ctx)
}

// err logs the passed in err and returns it wrapped in a message.
func (r *resolver) err(ctx context.Context, err error, msg string) error {
	r.log.For(ctx).
		WithOptions(zap.AddCallerSkip(1)).
		Error(msg, zap.Error(err))
	return fmt.Errorf(msg+": %w", err)
}

// errf formats the given string and calls err.
func (r *resolver) errf(ctx context.Context, err error, format string, args ...interface{}) error {
	msg := fmt.Sprintf(format, args...)
	return r.err(ctx, err, msg)
}

// withClient calls fn with ent client of tenant name passed in.
func (resolver) withClient(ctx context.Context, tenant string, fn func(*ent.Client) error) error {
	tenancy := viewer.TenancyFromContext(ctx)
	client, err := tenancy.ClientFor(ctx, tenant)
	if err != nil {
		return err
	}
	if tenancy, ok := tenancy.(interface{ Release() }); ok {
		defer tenancy.Release()
	}
	return fn(client)
}
