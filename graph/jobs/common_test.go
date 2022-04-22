// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package jobs

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/facebook/ent/dialect"
	"github.com/facebook/ent/dialect/sql"
	"github.com/facebookincubator/symphony/graph/graphql/resolver"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/enttest"
	"github.com/facebookincubator/symphony/pkg/ent/migrate"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/testdb"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func newJobsTestResolver(t *testing.T) *TestJobsResolver {
	db, name, err := testdb.Open()
	require.NoError(t, err)
	db.SetMaxOpenConns(1)
	return newResolver(t, sql.OpenDB(name, db))
}

func newResolver(t *testing.T, drv dialect.Driver) *TestJobsResolver {
	client := enttest.NewClient(t,
		enttest.WithOptions(ent.Driver(drv)),
		enttest.WithMigrateOptions(migrate.WithGlobalUniqueID(true)),
	)
	r := resolver.New(resolver.Config{
		Logger:          logtest.NewTestLogger(t),
		ReceiverFactory: ev.ErrFactory{},
	})
	return &TestJobsResolver{
		drv:    drv,
		client: client,
		jobsRunner: jobs{
			logger: logtest.NewTestLogger(t),
			r:      r,
		},
	}
}

func syncServicesRequest(t *testing.T, r *TestJobsResolver) {
	h := NewHandler(
		Config{
			Logger:          logtest.NewTestLogger(t),
			ReceiverFactory: ev.ErrFactory{},
		},
	)
	th := viewertest.TestHandler(t, h, r.client)
	req := httptest.NewRequest(http.MethodPost, "/sync_services", nil)
	viewertest.SetDefaultViewerHeaders(req)
	req.Header.Set("Content-Length", "100000")
	rec := httptest.NewRecorder()
	th.ServeHTTP(rec, req)
	require.Equal(t, http.StatusOK, rec.Code)
}
