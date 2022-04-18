// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package cmd

import (
	"context"
	"fmt"
	"net/url"
	"strings"
	"sync"

	sq "github.com/Masterminds/squirrel"
	"github.com/hashicorp/go-multierror"
	"github.com/scylladb/go-set/strset"
	"github.com/shurcooL/graphql"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	cdkmysql "gocloud.dev/mysql"

	// Enable RDS as source.
	_ "gocloud.dev/mysql/awsmysql"
)

// Features implements the sync features command.
type Features struct {
	From *url.URL `name:"from" required:"" placeholder:"<url>" help:"database to read features from."`
	To   *url.URL `name:"to" required:"" placeholder:"<url>" help:"admin endpoint to write features to."`
}

// Run runs the sync features command.
func (cmd *Features) Run(ctx *Context) error {
	src, err := newSource(ctx, cmd.From)
	if err != nil {
		ctx.Error("cannot create source", zap.Error(err))
		return err
	}
	dst := newDestination(cmd.To)

	ctx.Info("getting existing admin tenants")
	tenants, err := dst.tenants(ctx)
	if err != nil {
		ctx.Error("cannot get existing admin tenants",
			zap.Error(err),
		)
		return err
	}
	ctx.Debug("existing admin tenants",
		zap.Array("tenants", tenants),
	)

	ctx.Info("getting existing front features")
	features, err := src.features(ctx, tenants.names()...)
	if err != nil {
		ctx.Error("cannot get existing front features",
			zap.Error(err),
		)
		return err
	}
	ctx.Debug("existing front features",
		zap.Array("features", features),
	)

	ctx.Info("writing features")
	for _, feature := range features {
		if err := dst.upsertFeature(ctx, feature); err != nil {
			ctx.Error("cannot create feature",
				zap.Object("feature", feature),
				zap.Error(err),
			)
			return err
		}
	}
	ctx.Info("finished writing features")
	return nil
}

// source where data is read from (i.e. front mysql database).
type source struct {
	sq.RunnerContext
}

// newSource create a source from context and stringer.
func newSource(ctx context.Context, s fmt.Stringer) (*source, error) {
	db, err := cdkmysql.Open(ctx, s.String())
	if err != nil {
		return nil, err
	}
	return &source{sq.WrapStdSqlCtx(db)}, nil
}

// features returns a list of existing front features filtered by the passed in tenant names.
func (s *source) features(ctx context.Context, tenants ...string) (features, error) {
	rows, err := sq.Select("featureId", "enabled", "GROUP_CONCAT(DISTINCT organization)").
		From("FeatureFlags").
		Where(sq.Eq{"organization": tenants}).
		GroupBy("featureId").
		RunWith(s).
		QueryContext(ctx)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var features features
	for rows.Next() {
		var (
			feature       feature
			organizations string
		)
		if err := rows.Scan(
			&feature.Name,
			&feature.Enabled,
			&organizations,
		); err != nil {
			return nil, err
		}
		feature.Tenants = strings.Split(organizations, ",")
		features = append(features, feature)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return features, nil
}

// feature is a front feature flag.
type feature struct {
	Name    string   `json:"name"`
	Enabled bool     `json:"enabled"`
	Tenants []string `json:"tenants"`
}

// MarshalLogObject implements zapcore.ObjectMarshaler interface.
func (f feature) MarshalLogObject(enc zapcore.ObjectEncoder) error {
	enc.AddString("name", f.Name)
	enc.AddBool("enabled", f.Enabled)
	zap.Strings("tenants", f.Tenants).AddTo(enc)
	return nil
}

// features is a slice of feature structs.
type features []feature

// MarshalLogArray implements zapcore.ArrayMarshaler interface.
func (fs features) MarshalLogArray(enc zapcore.ArrayEncoder) error {
	err := &multierror.Error{}
	for _, feature := range fs {
		err = multierror.Append(err, enc.AppendObject(feature))
	}
	return err.ErrorOrNil()
}

// destination where data is written (i.e. admin graphql endpoint).
type destination struct {
	client *graphql.Client
	mu     sync.Mutex
	cached tenants
}

// newDestination create a destination from stringer.
func newDestination(s fmt.Stringer) *destination {
	return &destination{
		client: graphql.NewClient(s.String(), nil),
	}
}

// tenants returns a list of existing admin tenants.
func (d *destination) tenants(ctx context.Context) (tenants, error) {
	d.mu.Lock()
	defer d.mu.Unlock()
	if d.cached != nil {
		return d.cached, nil
	}
	var q struct{ Tenants tenants }
	if err := d.client.Query(ctx, &q, nil); err != nil {
		return nil, err
	}
	d.cached = q.Tenants
	return d.cached, nil
}

// upsertFeature creates or updates an admin feature.
func (d *destination) upsertFeature(ctx *Context, feature feature) error {
	tenants, err := d.tenants(ctx)
	if err != nil {
		return err
	}
	type UpsertFeatureInput struct {
		Name        graphql.String  `json:"name"`
		Enabled     graphql.Boolean `json:"enabled"`
		Description graphql.String  `json:"description"`
		Tenants     []graphql.ID    `json:"tenants"`
	}
	input := UpsertFeatureInput{
		Name:        graphql.String(feature.Name),
		Enabled:     graphql.Boolean(feature.Enabled),
		Description: "imported by sync tool",
	}
	for _, id := range tenants.having(feature.Tenants).ids() {
		input.Tenants = append(input.Tenants, id)
	}

	var m struct {
		UpsertFeature struct {
			Features []struct {
				ID      string
				Name    string
				Enabled bool
				Tenant  struct {
					Name string
				}
			}
		} `graphql:"upsertFeature(input: $input)"`
	}
	vars := map[string]interface{}{"input": input}
	if err := d.client.Mutate(ctx, &m, vars); err != nil {
		return err
	}
	for _, f := range m.UpsertFeature.Features {
		ctx.Debug("upserted feature",
			zap.String("tenant", f.Tenant.Name),
			zap.String("name", f.Name),
			zap.Bool("enabled", f.Enabled),
			zap.String("id", f.ID),
		)
	}
	return nil
}

// tenant is an admin tenant.
type tenant struct {
	ID   string
	Name string
}

// MarshalLogObject implements zapcore.ObjectMarshaler interface.
func (t tenant) MarshalLogObject(enc zapcore.ObjectEncoder) error {
	enc.AddString("id", t.ID)
	enc.AddString("name", t.Name)
	return nil
}

// tenants is a slice of tenant structs.
type tenants []tenant

// ids return a list of ids stored in tenants.
func (ts tenants) ids() []string {
	ids := make([]string, 0, len(ts))
	for _, tenant := range ts {
		ids = append(ids, tenant.ID)
	}
	return ids
}

// names return a list of names stored in tenants.
func (ts tenants) names() []string {
	names := make([]string, 0, len(ts))
	for _, tenant := range ts {
		names = append(names, tenant.Name)
	}
	return names
}

// having filters out tenants who's name does
// match any of the passed in names.
func (ts tenants) having(names []string) tenants {
	set := strset.New(names...)
	var filtered tenants
	for _, tenant := range ts {
		if set.Has(tenant.Name) {
			filtered = append(filtered, tenant)
		}
	}
	return filtered
}

// MarshalLogArray implements zapcore.ArrayMarshaler interface.
func (ts tenants) MarshalLogArray(enc zapcore.ArrayEncoder) error {
	err := &multierror.Error{}
	for _, tenant := range ts {
		err = multierror.Append(err, enc.AppendObject(tenant))
	}
	return err.ErrorOrNil()
}
