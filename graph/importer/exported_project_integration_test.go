// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package importer

import (
	"bytes"
	"context"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/locationtype"
	"github.com/facebookincubator/symphony/pkg/ent/project"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/stretchr/testify/require"
)

func importProjectData(ctx context.Context, t *testing.T, r *testImporterResolver) int {
	var buf bytes.Buffer
	bw := multipart.NewWriter(&buf)
	err := bw.WriteField("skip_lines", "[4,5,6]")
	require.NoError(t, err)
	file, err := os.Open("testdata/ProjectData.csv")
	require.NoError(t, err)
	fileWriter, err := bw.CreateFormFile("file_0", file.Name())
	require.NoError(t, err)
	_, err = io.Copy(fileWriter, file)
	require.NoError(t, err)
	contentType := bw.FormDataContentType()
	require.NoError(t, bw.Close())

	th := viewer.TenancyHandler(
		http.HandlerFunc(r.importer.processExportedProject),
		viewer.NewFixedTenancy(r.client),
		logtest.NewTestLogger(t),
	)
	h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		th.ServeHTTP(w, r.WithContext(ctx))
	})
	server := httptest.NewServer(h)
	defer server.Close()

	req, err := http.NewRequest(http.MethodPost, server.URL, &buf)
	require.Nil(t, err)

	viewertest.SetDefaultViewerHeaders(req)
	req.Header.Set("Content-Type", contentType)

	resp, err := http.DefaultClient.Do(req)
	require.Nil(t, err)
	code := resp.StatusCode
	err = resp.Body.Close()
	require.NoError(t, err)

	return code
}

func createProjectTypes(ctx context.Context, t *testing.T, r *testImporterResolver) {
	proptypes := []*pkgmodels.PropertyTypeInput{{
		Name: "Prop_color",
		Type: "enum",
	}, {
		Name: "Prop_revenue",
		Type: "int",
	}, {
		Name: "Prop_service",
		Type: "enum",
	}, {
		Name: "Prop_Note",
		Type: "string",
	},
	}

	m := r.importer.r.Mutation()
	_, err := m.CreateProjectType(ctx, models.AddProjectTypeInput{
		Name:       "Incidents",
		Properties: proptypes,
	})
	require.NoError(t, err)

	_, err = m.CreateProjectType(ctx, models.AddProjectTypeInput{
		Name:       "Deployment",
		Properties: proptypes,
	})
	require.NoError(t, err)

	_, err = m.CreateProjectType(ctx, models.AddProjectTypeInput{
		Name:       "Ticket Management",
		Properties: proptypes,
	})
	require.NoError(t, err)
}

func createLocations(ctx context.Context, t *testing.T, r *testImporterResolver) {
	m := r.importer
	var currParentID *int
	client := m.ClientFrom(ctx)
	_, err := client.LocationType.Create().SetName("Country").SetIndex(1).Save(ctx)
	require.NoError(t, err)

	var country *ent.Location
	typ := client.LocationType.Query().OnlyX(ctx)
	country, _, err = m.getOrCreateLocation(ctx, "United States", 0.0, 0.0, typ, currParentID, nil, nil)
	require.NoError(t, err)

	_, err = client.LocationType.Create().SetName("State").SetIndex(2).Save(ctx)
	require.NoError(t, err)

	typ = client.LocationType.Query().Where(locationtype.Name("State")).OnlyX(ctx)
	state1, _, err := m.getOrCreateLocation(ctx, "Texas", 0.0, 0.0, typ, &country.ID, nil, nil)
	require.NoError(t, err)
	state2, _, err := m.getOrCreateLocation(ctx, "New York", 0.0, 0.0, typ, &country.ID, nil, nil)
	require.NoError(t, err)
	state3, _, err := m.getOrCreateLocation(ctx, "Massachusetts", 0.0, 0.0, typ, &country.ID, nil, nil)
	require.NoError(t, err)

	_, err = client.LocationType.Create().SetName("City").SetIndex(3).Save(ctx)
	require.NoError(t, err)
	typ = client.LocationType.Query().Where(locationtype.Name("City")).OnlyX(ctx)
	city1, _, err := m.getOrCreateLocation(ctx, "Houston", 0.0, 0.0, typ, &state1.ID, nil, nil)
	require.NoError(t, err)
	city2, _, err := m.getOrCreateLocation(ctx, "Bufalo", 0.0, 0.0, typ, &state2.ID, nil, nil)
	require.NoError(t, err)
	city3, _, err := m.getOrCreateLocation(ctx, "Boston", 0.0, 0.0, typ, &state3.ID, nil, nil)
	require.NoError(t, err)

	_, err = client.LocationType.Create().SetName("Building").SetIndex(4).Save(ctx)
	require.NoError(t, err)
	typ = client.LocationType.Query().Where(locationtype.Name("Building")).OnlyX(ctx)
	_, _, err = m.getOrCreateLocation(ctx, "2391 S Wayside", 0.0, 0.0, typ, &city1.ID, nil, nil)
	require.NoError(t, err)
	_, _, err = m.getOrCreateLocation(ctx, "2451 N Way", 0.0, 0.0, typ, &city2.ID, nil, nil)
	require.NoError(t, err)
	_, _, err = m.getOrCreateLocation(ctx, "1214 S Roosevelt", 0.0, 0.0, typ, &city3.ID, nil, nil)
	require.NoError(t, err)
}

func TestProjectImportData(t *testing.T) {
	r := newImporterTestResolver(t)
	ctx := newImportContext(viewertest.NewContext(context.Background(), r.client))

	createProjectTypes(ctx, t, r)
	createLocations(ctx, t, r)

	code := importProjectData(ctx, t, r)
	require.Equal(t, 200, code)
	q := r.importer.r.Query()

	projs, err := q.Projects(ctx, nil, nil, nil, nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.Equal(t, 3, len(projs.Edges))
	client := r.client

	locStruct = map[string]*ent.Location{
		"Building1": client.Location.Query().Where(location.Name("2391 S Wayside")).OnlyX(ctx),
		"Building2": client.Location.Query().Where(location.Name("2451 N Way")).OnlyX(ctx),
		"Building3": client.Location.Query().Where(location.Name("1214 S Roosevelt")).OnlyX(ctx),
	}

	for _, edge := range projs.Edges {
		pjt := edge.Node
		switch pjt.Name {
		case "Project 1":
			require.Equal(t, "Project 1", *pjt.Description)
			require.Equal(t, project.Priority("LOW"), pjt.Priority)
			require.Equal(t, "Incidents", pjt.QueryType().OnlyX(ctx).Name)
			require.Equal(t, locStruct["Building1"].ID, pjt.QueryLocation().OnlyIDX(ctx))
			require.Equal(t, "black", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_color"))).OnlyX(ctx).StringVal))
			require.Equal(t, 1000, pointer.GetInt(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_revenue"))).OnlyX(ctx).IntVal))
			require.Equal(t, "Bitstream", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_service"))).OnlyX(ctx).StringVal))
			require.Equal(t, "install new OTB", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_Note"))).OnlyX(ctx).StringVal))
		case "Project 2":
			require.Equal(t, "Project 2", *pjt.Description)
			require.Equal(t, project.Priority("URGENT"), pjt.Priority)
			require.Equal(t, "Deployment", pjt.QueryType().OnlyX(ctx).Name)
			require.Equal(t, locStruct["Building2"].ID, pjt.QueryLocation().OnlyIDX(ctx))
			require.Equal(t, "blue", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_color"))).OnlyX(ctx).StringVal))
			require.Equal(t, 5000, pointer.GetInt(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_revenue"))).OnlyX(ctx).IntVal))
			require.Equal(t, "PWA", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_service"))).OnlyX(ctx).StringVal))
			require.Equal(t, "", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_Note"))).OnlyX(ctx).StringVal))
		case "Project 3":
			require.Equal(t, "Project 3", *pjt.Description)
			require.Equal(t, project.Priority("LOW"), pjt.Priority)
			require.Equal(t, "Ticket Management", pjt.QueryType().OnlyX(ctx).Name)
			require.Equal(t, locStruct["Building3"].ID, pjt.QueryLocation().OnlyIDX(ctx))
			require.Equal(t, "red", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_color"))).OnlyX(ctx).StringVal))
			require.Equal(t, 48000, pointer.GetInt(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_revenue"))).OnlyX(ctx).IntVal))
			require.Equal(t, "Bitstream", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_service"))).OnlyX(ctx).StringVal))
			require.Equal(t, "request authorization", pointer.GetString(pjt.QueryProperties().Where(property.HasTypeWith(propertytype.Name("Prop_Note"))).OnlyX(ctx).StringVal))
		}
	}
}
