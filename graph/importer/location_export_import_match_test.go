// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package importer

import (
	"bytes"
	"context"
	"encoding/csv"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ev"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func writeModifiedLocationsCSV(t *testing.T, r *csv.Reader, method pkgexporter.Method, withVerify, skipLines bool) (*bytes.Buffer, string) {
	var newLine []string
	var lines = make([][]string, 4)
	var buf bytes.Buffer
	bw := multipart.NewWriter(&buf)
	if skipLines {
		err := bw.WriteField("skip_lines", "[2,3]")
		require.NoError(t, err)
	}
	if withVerify {
		err := bw.WriteField("verify_before_commit", "true")
		require.NoError(t, err)
	}
	fileWriter, err := bw.CreateFormFile("file_0", "name1")
	require.Nil(t, err)
	for i := 0; ; i++ {
		line, err := r.Read()
		if err != nil {
			if err == io.EOF {
				break
			}
			require.Nil(t, err)
		}
		if i == 0 {
			lines[0] = line
		} else {
			switch method {
			case methodAdd:
				newLine = append([]string{""}, line[1:]...)
			case methodEdit:
				newLine = line
				if line[3] == childLocation {
					newLine[4] = "new-external-id"
					newLine[5] = "44"
					newLine[6] = "55"
					newLine[7] = "new-str"
					newLine[8] = "false"
					newLine[9] = "1988-01-01"
				}
			default:
				require.Fail(t, "method should be add or edit")
			}
			lines[i] = newLine
		}
	}
	if withVerify {
		lines[2][0] = "this"
		lines[3][5] = "should"
		lines[3][6] = "fail"
	}
	for _, line := range lines {
		stringLine := strings.Join(line, ",")
		_, _ = io.WriteString(fileWriter, stringLine+"\n")
	}
	ct := bw.FormDataContentType()
	require.NoError(t, bw.Close())
	return &buf, ct
}

func importLocationsFile(t *testing.T, client *ent.Client, r io.Reader, method pkgexporter.Method, withVerify, skipLines bool) {
	readr := csv.NewReader(r)
	buf, contentType := writeModifiedLocationsCSV(t, readr, method, withVerify, skipLines)

	logger := logtest.NewTestLogger(t)
	h := NewHandler(
		Config{
			Logger:          logger,
			ReceiverFactory: ev.ErrFactory{},
		},
	)
	th := viewertest.TestHandler(t, h, client)
	server := httptest.NewServer(th)
	defer server.Close()

	req, err := http.NewRequest(http.MethodPost, server.URL+"/export_locations", buf)
	require.Nil(t, err)

	viewertest.SetDefaultViewerHeaders(req)
	req.Header.Set("Content-Type", contentType)

	resp, err := http.DefaultClient.Do(req)
	require.Nil(t, err)
	require.Equal(t, resp.StatusCode, http.StatusOK)
	resp.Body.Close()
}

func TestExportAndEditLocations(t *testing.T) {
	for _, withVerify := range []bool{true, false} {
		for _, skipLines := range []bool{true, false} {
			r := newExporterTestResolver(t)
			log := r.Exporter.Log
			e := &pkgexporter.Exporter{Log: log, Rower: pkgexporter.LocationsRower{Log: log}}
			ctx, res := prepareHandlerAndExport(t, r, e)
			importLocationsFile(t, r.Client, res, methodEdit, withVerify, skipLines)

			locations, err := r.Query().Locations(ctx, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil)
			require.NoError(t, err)
			switch {
			case skipLines || withVerify:
				require.Equal(t, 3, locations.TotalCount)
				require.Len(t, locations.Edges, 3)
				for _, edge := range locations.Edges {
					loc := edge.Node
					if loc.Name == childLocation {
						require.Empty(t, loc.ExternalID)
						require.Zero(t, loc.Latitude)
						require.Zero(t, loc.Longitude)
					}
				}
			default:
				require.Equal(t, 3, locations.TotalCount)
				for _, edge := range locations.Edges {
					loc := edge.Node
					props := loc.QueryProperties().AllX(ctx)
					if loc.Name == childLocation {
						require.Equal(t, "new-external-id", loc.ExternalID)
						require.Equal(t, 44.0, loc.Latitude)
						require.Equal(t, 55.0, loc.Longitude)
						for _, prop := range props {
							switch prop.QueryType().OnlyX(ctx).Name {
							case propNameDate:
								require.Equal(t, "1988-01-01", pointer.GetString(prop.StringVal))
							case propNameBool:
								require.NotNil(t, prop.BoolVal)
								require.Equal(t, false, *prop.BoolVal)
							case propNameStr:
								require.Equal(t, "new-str", pointer.GetString(prop.StringVal))
							}
						}
					}
				}
			}
		}
	}
}

func TestExportAndAddLocations(t *testing.T) {
	for _, withVerify := range []bool{true, false} {
		for _, skipLines := range []bool{true, false} {
			r := newExporterTestResolver(t)
			log := r.Exporter.Log
			e := &pkgexporter.Exporter{Log: log, Rower: pkgexporter.LocationsRower{Log: log}}
			ctx, res := prepareHandlerAndExport(t, r, e)

			locs := r.Client.Location.Query().AllX(ctx)
			require.Len(t, locs, 3)
			// Deleting link and of side's equipment to verify it creates it on import
			deleteLocationsForReImport(ctx, t, r)
			locs = r.Client.Location.Query().AllX(ctx)
			require.Len(t, locs, 0)

			importLocationsFile(t, r.Client, res, methodAdd, withVerify, skipLines)

			locations, err := r.Query().Locations(ctx, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil)
			require.NoError(t, err)
			switch {
			case !skipLines && withVerify:
				require.Zero(t, 0, locations.TotalCount)
				require.Empty(t, locations.Edges)
			case skipLines || withVerify:
				require.Equal(t, 1, locations.TotalCount)
				require.Len(t, locations.Edges, 1)
			default:
				require.Equal(t, 3, locations.TotalCount)
				for _, edge := range locations.Edges {
					loc := edge.Node
					props := loc.QueryProperties().AllX(ctx)
					for _, prop := range props {
						switch prop.QueryType().OnlyX(ctx).Name {
						case propNameDate:
							require.Equal(t, "1988-03-29", pointer.GetString(prop.StringVal))
						case propNameBool:
							require.Equal(t, true, pointer.GetBool(prop.BoolVal))
						case propNameStr:
							require.Equal(t, "override", pointer.GetString(prop.StringVal))
						}
					}
				}
			}
		}
	}
}

func deleteLocationsForReImport(ctx context.Context, t *testing.T, r *testExporterResolver) {
	locs := r.Client.Location.Query().AllX(ctx)
	for _, loc := range locs {
		err := r.Client.Location.DeleteOne(loc).Exec(ctx)
		require.NoError(t, err)
	}
}
