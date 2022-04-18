// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package mysql_test

import (
	"context"
	"os"
	"testing"

	"github.com/facebookincubator/symphony/pkg/database/mysql"
	"github.com/stretchr/testify/require"
	"go.opencensus.io/trace"
)

type testExporter struct {
	spans []*trace.SpanData
}

func (e *testExporter) ExportSpan(s *trace.SpanData) {
	e.spans = append(e.spans, s)
}

func TestOpen(t *testing.T) {
	dburl, ok := os.LookupEnv("DB_URL")
	if !ok {
		t.Skip("provide $DB_URL env to enable this test")
	}

	e := &testExporter{}
	trace.RegisterExporter(e)
	defer trace.UnregisterExporter(e)

	ctx := context.Background()
	t.Log("Connecting to:", dburl)
	db, err := mysql.Open(ctx, dburl)
	require.NoError(t, err)

	ctx, span := trace.StartSpan(ctx, "test",
		trace.WithSampler(trace.AlwaysSample()),
	)
	err = db.PingContext(ctx)
	require.NoError(t, err)
	span.End()

	err = db.Close()
	require.NoError(t, err)
}
