// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package importer

import (
	"bytes"
	"context"
	"encoding/csv"
	"flag"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/facebook/ent/dialect"
	"github.com/facebook/ent/dialect/sql"
	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/graph/graphql/resolver"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/enttest"
	"github.com/facebookincubator/symphony/pkg/ent/migrate"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ev"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/testdb"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

const (
	svcName                                = "serviceName"
	svc2Name                               = "serviceName2"
	svc3Name                               = "serviceName3"
	grandParentLocation                    = "grandParentLocation"
	parentLocation                         = "parentLocation"
	childLocation                          = "childLocation"
	positionName                           = "Position"
	newPropNameStr                         = "newPropNameStr"
	propDefValue2                          = "defaultVal2"
	propDevValInt                          = 15
	propInstanceValue                      = "newVal"
	secondServiceName                      = "S2"
	propStr                                = "propStr"
	propStr2                               = "propStr2"
	portName1                              = "port1"
	portName2                              = "port2"
	methodAdd           pkgexporter.Method = "ADD"
	methodEdit          pkgexporter.Method = "EDIT"
)

var debug = flag.Bool("debug", false, "run database driver on debug mode")

type testImporterResolver struct {
	drv      dialect.Driver
	client   *ent.Client
	importer importer
}

type testExporterResolver struct {
	generated.ResolverRoot
	Drv      dialect.Driver
	Client   *ent.Client
	Exporter pkgexporter.Exporter
}

func newImporterTestResolver(t *testing.T) *testImporterResolver {
	db, name, err := testdb.Open()
	require.NoError(t, err)
	db.SetMaxOpenConns(1)
	return newImporterResolver(t, sql.OpenDB(name, db))
}

func newImporterResolver(t *testing.T, drv dialect.Driver) *testImporterResolver {
	client := enttest.NewClient(t,
		enttest.WithOptions(ent.Driver(drv)),
		enttest.WithMigrateOptions(migrate.WithGlobalUniqueID(true)),
	)
	r := resolver.New(resolver.Config{
		Logger:          logtest.NewTestLogger(t),
		ReceiverFactory: ev.ErrFactory{},
	})
	return &testImporterResolver{
		drv:    drv,
		client: client,
		importer: importer{
			logger: logtest.NewTestLogger(t),
			r:      r,
		},
	}
}

func prepareSvcData(ctx context.Context, t *testing.T, r testImporterResolver) {
	mr := r.importer.r.Mutation()
	serviceType, _ := mr.AddServiceType(ctx, models.ServiceTypeCreateData{Name: "L2 Service", HasCustomer: false})
	_, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          svcName,
		ServiceTypeID: serviceType.ID,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)
	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          svc2Name,
		ServiceTypeID: serviceType.ID,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)
	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          svc3Name,
		ServiceTypeID: serviceType.ID,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)
}

func newExporterTestResolver(t *testing.T) *testExporterResolver {
	db, name, err := testdb.Open()
	require.NoError(t, err)
	db.SetMaxOpenConns(1)
	return newExporterResolver(t, sql.OpenDB(name, db))
}

func newExporterResolver(t *testing.T, drv dialect.Driver) *testExporterResolver {
	if *debug {
		drv = dialect.Debug(drv)
	}
	client := enttest.NewClient(t,
		enttest.WithOptions(ent.Driver(drv)),
		enttest.WithMigrateOptions(migrate.WithGlobalUniqueID(true)),
	)
	logger := logtest.NewTestLogger(t)
	r := resolver.New(resolver.Config{
		Logger:          logger,
		ReceiverFactory: ev.ErrFactory{},
	})
	e := pkgexporter.Exporter{Log: logger, Rower: pkgexporter.EquipmentRower{Log: logger}}
	return &testExporterResolver{r, drv, client, e}
}

func prepareHandlerAndExport(t *testing.T, r *testExporterResolver, e *pkgexporter.Exporter) (context.Context, *bytes.Buffer) {
	var buf bytes.Buffer
	ctx := viewertest.NewContext(context.Background(), r.Client)
	pkgexporter.PrepareData(ctx, t)
	locs := r.Client.Location.Query().AllX(ctx)
	require.Len(t, locs, 3)
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	err = csv.NewWriter(&buf).WriteAll(rows)
	require.NoError(t, err, "error writing rows")
	return ctx, &buf
}

func importLinksPortsFile(t *testing.T, client *ent.Client, r io.Reader, entity ImportEntity, method pkgexporter.Method, skipLines, withVerify bool) {
	readr := csv.NewReader(r)
	var buf *bytes.Buffer
	var contentType, url string
	switch entity {
	case ImportEntityLink:
		buf, contentType = pkgexporter.WriteModifiedLinksCSV(t, readr, method, skipLines, withVerify)
	case ImportEntityPort:
		buf, contentType = pkgexporter.WriteModifiedPortsCSV(t, readr, skipLines, withVerify)
	}

	h := NewHandler(
		Config{
			Logger:          logtest.NewTestLogger(t),
			ReceiverFactory: ev.ErrFactory{},
		},
	)
	th := viewertest.TestHandler(t, h, client)
	server := httptest.NewServer(th)
	defer server.Close()
	switch entity {
	case ImportEntityLink:
		url = server.URL + "/export_links"
	case ImportEntityPort:
		fmt.Println("server.URL", server.URL)
		url = server.URL + "/export_ports"
	}
	req, err := http.NewRequest(http.MethodPost, url, buf)
	require.Nil(t, err)

	viewertest.SetDefaultViewerHeaders(req)
	req.Header.Set("Content-Type", contentType)
	resp, err := http.DefaultClient.Do(req)
	require.Nil(t, err)
	require.Equal(t, resp.StatusCode, http.StatusOK)
	err = resp.Body.Close()
	require.NoError(t, err)
}
