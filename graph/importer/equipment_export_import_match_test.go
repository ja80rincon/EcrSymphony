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
	"strconv"
	"strings"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ev"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

// TODO (T59270743): Move this file to importer folder and refactor similar code with exported_service_integration_test.go
func writeExportModifiedCSV(t *testing.T, r *csv.Reader, method pkgexporter.Method, withVerify bool) (*bytes.Buffer, string) {
	var newLine []string
	var lines = make([][]string, 3)
	var buf bytes.Buffer
	bw := multipart.NewWriter(&buf)

	if withVerify {
		_ = bw.WriteField("verify_before_commit", "true")
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
				if line[1] == currEquip {
					newLine[14] = "str-prop-value" + strconv.FormatInt(int64(i), 10)
					newLine[1] = "newName" + strconv.FormatInt(int64(i), 10)
					newLine[15] = "10" + strconv.FormatInt(int64(i), 10)
					newLine[16] = "new-prop-value" + strconv.FormatInt(int64(i), 10)
				}
			default:
				require.Fail(t, "method should be add or edit")
			}
			// parent row must exist before child row
			if line[1] == parentEquip {
				lines[1] = newLine
			} else {
				lines[2] = newLine
			}
		}
	}

	if withVerify {
		failLine := make([]string, len(lines[1]))
		copy(failLine, lines[1])
		lines = append(lines, failLine)
		lines[3][1] = "this"
		lines[3][2] = "should"
		lines[3][3] = "fail"
	}

	for _, l := range lines {
		stringLine := strings.Join(l, ",")
		_, _ = io.WriteString(fileWriter, stringLine+"\n")
	}
	ct := bw.FormDataContentType()
	require.NoError(t, bw.Close())
	return &buf, ct
}

func importEquipmentFile(t *testing.T, client *ent.Client, r io.Reader, method pkgexporter.Method, withVerify bool) {
	readr := csv.NewReader(r)
	buf, contentType := writeExportModifiedCSV(t, readr, method, withVerify)

	h := NewHandler(
		Config{
			Logger:          logtest.NewTestLogger(t),
			ReceiverFactory: ev.ErrFactory{},
		},
	)
	th := viewertest.TestHandler(t, h, client)
	server := httptest.NewServer(th)
	defer server.Close()

	req, err := http.NewRequest(http.MethodPost, server.URL+"/export_equipment", buf)
	require.Nil(t, err)

	viewertest.SetDefaultViewerHeaders(req)
	req.Header.Set("Content-Type", contentType)

	resp, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	require.Equal(t, resp.StatusCode, http.StatusOK)
	err = resp.Body.Close()
	require.NoError(t, err)
}

func deleteEquipmentData(ctx context.Context, t *testing.T, r *testExporterResolver) {
	id := r.Client.Equipment.Query().Where(equipment.Name(currEquip)).OnlyIDX(ctx)
	_, err := r.Mutation().RemoveEquipment(ctx, id, nil)
	require.NoError(t, err)

	id = r.Client.Equipment.Query().Where(equipment.Name(parentEquip)).OnlyIDX(ctx)
	_, err = r.Mutation().RemoveEquipment(ctx, id, nil)
	require.NoError(t, err)

	id = r.Client.Location.Query().Where(location.Name(childLocation)).OnlyIDX(ctx)
	_, err = r.Mutation().RemoveLocation(ctx, id)
	require.NoError(t, err)

	id = r.Client.Location.Query().Where(location.Name(parentLocation)).OnlyIDX(ctx)
	_, err = r.Mutation().RemoveLocation(ctx, id)
	require.NoError(t, err)

	id = r.Client.Location.Query().Where(location.Name(grandParentLocation)).OnlyIDX(ctx)
	_, err = r.Mutation().RemoveLocation(ctx, id)
	require.NoError(t, err)
}

func prepareEquipmentAndExport(t *testing.T, r *testExporterResolver) (context.Context, *bytes.Buffer) {
	var buf bytes.Buffer
	log := r.Exporter.Log
	e := &pkgexporter.Exporter{Log: log, Rower: pkgexporter.EquipmentRower{Log: log}}

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

func TestEquipmentExportAndImportMatch(t *testing.T) {
	for _, verify := range []bool{true, false} {
		verify := verify
		t.Run("Verify/"+strconv.FormatBool(verify), func(t *testing.T) {
			r := newExporterTestResolver(t)
			ctx, res := prepareEquipmentAndExport(t, r)
			deleteEquipmentData(ctx, t, r)

			locs := r.Client.Location.Query().AllX(ctx)
			require.Len(t, locs, 0)

			importEquipmentFile(t, r.Client, res, methodAdd, verify)
			locs = r.Client.Location.Query().AllX(ctx)
			if verify {
				require.Len(t, locs, 0)
			} else {
				require.Len(t, locs, 3)
			}
			for _, loc := range locs {
				switch loc.Name {
				case grandParentLocation:
					require.Equal(t, locTypeNameL, loc.QueryType().OnlyX(ctx).Name)
					require.Equal(t, parentLocation, loc.QueryChildren().OnlyX(ctx).Name)
				case parentLocation:
					require.Equal(t, locTypeNameM, loc.QueryType().OnlyX(ctx).Name)
					require.Equal(t, childLocation, loc.QueryChildren().OnlyX(ctx).Name)
				case childLocation:
					require.Equal(t, locTypeNameS, loc.QueryType().OnlyX(ctx).Name)
					require.Equal(t, parentEquip, loc.QueryEquipment().OnlyX(ctx).Name)
				}
			}
			equips, err := r.Query().Equipments(ctx, nil, nil, nil, nil, nil, nil)
			require.NoError(t, err)
			if verify {
				require.Equal(t, 0, equips.TotalCount)
			} else {
				require.Equal(t, 2, equips.TotalCount)
			}
			for _, edge := range equips.Edges {
				equip := edge.Node
				switch equip.Name {
				case currEquip:
					require.Equal(t, equipmentType2Name, equip.QueryType().OnlyX(ctx).Name)
					pos := equip.QueryParentPosition().OnlyX(ctx)
					require.Equal(t, positionName, pos.QueryDefinition().OnlyX(ctx).Name)
					require.Equal(t, parentEquip, pos.QueryParent().OnlyX(ctx).Name)
					prop := equip.QueryProperties().Where(property.HasTypeWith(propertytype.Name(propNameStr))).OnlyX(ctx)
					require.Equal(t, propInstanceValue, pointer.GetString(prop.StringVal))

					prop = equip.QueryProperties().Where(property.HasTypeWith(propertytype.Name(propNameInt))).OnlyX(ctx)
					require.Equal(t, propDevValInt, pointer.GetInt(prop.IntVal))

					prop = equip.QueryProperties().Where(property.HasTypeWith(propertytype.Name(newPropNameStr))).OnlyX(ctx)
					require.Equal(t, propDefValue2, pointer.GetString(prop.StringVal))

				case parentEquip:
					require.Equal(t, childLocation, equip.QueryLocation().OnlyX(ctx).Name)
					require.Equal(t, equipmentTypeName, equip.QueryType().OnlyX(ctx).Name)
				}
			}
		})
	}
}

func TestEquipmentImportAndEdit(t *testing.T) {
	for _, verify := range []bool{true, false} {
		verify := verify
		t.Run("Verify/"+strconv.FormatBool(verify), func(t *testing.T) {
			r := newExporterTestResolver(t)
			ctx, res := prepareEquipmentAndExport(t, r)

			importEquipmentFile(t, r.Client, res, methodEdit, verify)
			locs := r.Client.Location.Query().AllX(ctx)
			require.Len(t, locs, 3)
			equips, err := r.Query().Equipments(ctx, nil, nil, nil, nil, nil, nil)
			require.NoError(t, err)
			require.Equal(t, 2, equips.TotalCount)
			for _, edge := range equips.Edges {
				equip := edge.Node
				switch equip.Name {
				case parentEquip:
					require.Equal(t, equipmentTypeName, equip.QueryType().OnlyX(ctx).Name)
					pos := equip.QueryPositions().OnlyX(ctx)
					require.Equal(t, positionName, pos.QueryDefinition().OnlyX(ctx).Name)
				case "newName2":
					require.Equal(t, equipmentType2Name, equip.QueryType().OnlyX(ctx).Name)
					pos := equip.QueryParentPosition().OnlyX(ctx)
					require.Equal(t, positionName, pos.QueryDefinition().OnlyX(ctx).Name)
					require.Equal(t, parentEquip, pos.QueryParent().OnlyX(ctx).Name)
					prop := equip.QueryProperties().Where(property.HasTypeWith(propertytype.Name(propNameStr))).OnlyX(ctx)
					require.Equal(t, "str-prop-value2", prop.StringVal)

					prop = equip.QueryProperties().Where(property.HasTypeWith(propertytype.Name(propNameInt))).OnlyX(ctx)
					require.Equal(t, 102, prop.IntVal)

					prop = equip.QueryProperties().Where(property.HasTypeWith(propertytype.Name(newPropNameStr))).OnlyX(ctx)
					require.Equal(t, "new-prop-value2", prop.StringVal)
				case currEquip:
					// reach here on "verify mode" that failed (this is the name with no edit
					require.True(t, verify)
					require.Equal(t, equipmentType2Name, equip.QueryType().OnlyX(ctx).Name)
					prop := equip.QueryProperties().Where(property.HasTypeWith(propertytype.Name(propNameStr))).OnlyX(ctx)
					require.Equal(t, propInstanceValue, pointer.GetString(prop.StringVal))
				}
			}
		})
	}
}
