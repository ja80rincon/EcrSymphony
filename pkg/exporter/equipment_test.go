// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"strconv"
	"testing"

	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

const nameTitle = "Equipment Name"

func TestEmptyWOExport(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	e := &Exporter{Log: log, Rower: EquipmentRower{Log: log}}
	ctx := viewertest.NewContext(context.Background(), client)
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.EqualValues(t, []string{
			"\ufeffEquipment ID",
			nameTitle,
			"Equipment Type",
			"External ID",
			"Work Order",
			"Parent Equipment (3)",
			"Position (3)",
			"Parent Equipment (2)",
			"Position (2)",
			"Parent Equipment",
			"Equipment Position",
		}, ln)
	}
}

func TestExport(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	e := &Exporter{Log: log, Rower: EquipmentRower{Log: log}}

	ctx := viewertest.NewContext(context.Background(), client)
	PrepareData(ctx, t)
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.NoError(t, err, "error reading row")
		switch {
		case ln[1] == nameTitle:
			require.EqualValues(t, []string{
				"\ufeffEquipment ID",
				nameTitle,
				"Equipment Type",
				"External ID",
				"Work Order",
				locTypeNameL,
				locTypeNameM,
				locTypeNameS,
				"Parent Equipment (3)",
				"Position (3)",
				"Parent Equipment (2)",
				"Position (2)",
				"Parent Equipment",
				"Equipment Position",
				propNameStr,
				propNameInt,
				newPropNameStr,
			}, ln)
		case ln[1] == parentEquip:
			require.EqualValues(t, ln[1:], []string{
				parentEquip,
				equipmentTypeName,
				"",
				"",
				grandParentLocation,
				parentLocation,
				childLocation,
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
			})
		case ln[1] == currEquip:
			require.EqualValues(t, ln[1:], []string{
				currEquip,
				equipmentType2Name,
				externalIDM,
				"",
				grandParentLocation,
				parentLocation,
				childLocation,
				"",
				"",
				"",
				"",
				parentEquip,
				positionName,
				propInstanceValue,
				strconv.FormatInt(int64(propDevValInt), 10),
				propDefValue2,
			})
		default:
			require.Fail(t, "line does not match")
		}
	}
}

func TestExportWithFilters(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	ctx := viewertest.NewContext(context.Background(), client)
	e := &Exporter{Log: log, Rower: EquipmentRower{Log: log}}

	PrepareData(ctx, t)
	loc := client.Location.Query().Where(location.Name(childLocation)).OnlyX(ctx)

	f, err := json.Marshal([]equipmentFilterInput{
		{
			Name:     "LOCATION_INST",
			Operator: "IS_ONE_OF",
			IDSet:    []string{strconv.Itoa(loc.ID)},
		},
		{
			Name:        "EQUIP_INST_NAME",
			Operator:    "CONTAINS",
			StringValue: "pa",
		},
	})
	require.NoError(t, err)
	rows, err := e.Rower.Rows(ctx, string(f))
	require.NoError(t, err, "error getting rows")
	linesCount := 0
	for _, ln := range rows {
		linesCount++
		require.NoError(t, err, "error reading row")
		if ln[1] == parentEquip {
			require.EqualValues(t, []string{
				parentEquip,
				equipmentTypeName,
				"",
				"",
				grandParentLocation,
				parentLocation,
				childLocation,
				"",
				"",
				"",
				"",
				"",
				"",
			}, ln[1:])
		}
	}
	require.Equal(t, 2, linesCount)
}

func TestEquipmentsAsyncExport(t *testing.T) {
	testAsyncExport(t, exporttask.TypeEquipment)
}
