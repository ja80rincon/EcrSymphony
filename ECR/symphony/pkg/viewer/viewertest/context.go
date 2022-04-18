// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package viewertest

import (
	"context"
	"testing"

	"github.com/facebook/ent/dialect/sql"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/authz/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/enttest"
	"github.com/facebookincubator/symphony/pkg/ent/migrate"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/testdb"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/stretchr/testify/require"
)

type options struct {
	tenant      string
	user        string
	role        user.Role
	features    []string
	permissions *models.PermissionSettings
}

// Option enables viewer customization.
type Option func(*options)

var DefaultFeatures = []string{
	viewer.FeatureMandatoryPropertiesOnWorkOrderClose,
	viewer.FeatureExecuteAutomationFlows,
}

// WithTenant overrides default tenant name.
func WithTenant(tenant string) Option {
	return func(o *options) {
		o.tenant = tenant
	}
}

// WithUser overrides default user name.
func WithUser(user string) Option {
	return func(o *options) {
		o.user = user
	}
}

// WithRole overrides default role.
func WithRole(role user.Role) Option {
	return func(o *options) {
		o.role = role
	}
}

// WithFeatures adds the features into the default feature set.
func WithFeatures(features ...string) Option {
	return func(o *options) {
		o.features = append(o.features, features...)
	}
}

// WithoutFeatures removes the features from the default feature set.
func WithoutFeatures(removedFeatures ...string) Option {
	shouldRemoveFeature := func(feature string) bool {
		for _, removedFeature := range removedFeatures {
			if feature == removedFeature {
				return true
			}
		}
		return false
	}

	return func(o *options) {
		var newFeatures []string
		for _, feature := range o.features {
			if !shouldRemoveFeature(feature) {
				newFeatures = append(newFeatures, feature)
			}
		}
		o.features = newFeatures
	}
}

// WithPermissions overrides default permissions.
func WithPermissions(permissions *models.PermissionSettings) Option {
	return func(o *options) {
		o.permissions = permissions
	}
}

// NewContext returns viewer context for tests.
func NewContext(parent context.Context, c *ent.Client, opts ...Option) context.Context {
	o := &options{
		tenant:      DefaultTenant,
		user:        DefaultUser,
		role:        DefaultRole,
		features:    DefaultFeatures,
		permissions: authz.FullPermissions(),
	}
	for _, opt := range opts {
		opt(o)
	}
	ctx := ent.NewContext(parent, c)
	u := viewer.MustGetOrCreateUser(
		privacy.DecisionContext(ctx, privacy.Allow),
		o.user,
		o.role)
	v := viewer.NewUser(o.tenant, u, viewer.WithFeatures(o.features...))
	ctx = viewer.NewContext(ctx, v)
	return authz.NewContext(ctx, o.permissions)
}

// NewTestClient creates an ent test client
func NewTestClient(t *testing.T) *ent.Client {
	db, name, err := testdb.Open()
	require.NoError(t, err)
	db.SetMaxOpenConns(1)
	drv := sql.OpenDB(name, db)
	return enttest.NewClient(t,
		enttest.WithOptions(ent.Driver(drv)),
		enttest.WithMigrateOptions(migrate.WithGlobalUniqueID(true)),
	)
}
