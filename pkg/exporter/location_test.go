// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"

	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestEmptyLocationDataExport(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	ctx := viewertest.NewContext(context.Background(), client)

	e := &Exporter{Log: log, Rower: LocationsRower{Log: log}}
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.EqualValues(t, []string{
			"\ufeffLocation ID",
			"External ID",
			"Latitude",
			"Longitude",
		}, ln)
	}
}

func TestLocationsExport(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &Exporter{Log: log, Rower: LocationsRower{Log: log}}
	ctx := viewertest.NewContext(context.Background(), client)
	PrepareData(ctx, t)
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		switch {
		case ln[1] == locTypeNameL:
			require.EqualValues(t, []string{
				"\ufeffLocation ID",
				locTypeNameL,
				locTypeNameM,
				locTypeNameS,
				"External ID",
				"Latitude",
				"Longitude",
				propNameStr,
				propNameBool,
				propNameDate,
			}, ln)
		case ln[4] == externalIDL:
			require.EqualValues(t, ln[1:], []string{
				grandParentLocation,
				"",
				"",
				externalIDL,
				fmt.Sprintf("%f", lat),
				fmt.Sprintf("%f", long),
				"",
				"",
				"",
			})
		case ln[4] == externalIDM:
			require.EqualValues(t, ln[1:], []string{
				grandParentLocation,
				parentLocation,
				"",
				externalIDM,
				fmt.Sprintf("%f", lat),
				fmt.Sprintf("%f", long),
				"",
				"",
				"",
			})
		case ln[3] == childLocation:
			require.EqualValues(t, ln[1:], []string{
				grandParentLocation,
				parentLocation,
				childLocation,
				"",
				fmt.Sprintf("%f", 0.0),
				fmt.Sprintf("%f", 0.0),
				"override",
				"true",
				"1988-03-29",
			})
		default:
			require.Fail(t, "line does not match")
		}
	}
}

func TestExportLocationWithFilters(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &Exporter{Log: log, Rower: LocationsRower{Log: log}}
	ctx := viewertest.NewContext(context.Background(), client)
	PrepareData(ctx, t)

	f, err := json.Marshal([]locationsFilterInput{
		{
			Name:      "LOCATION_INST_HAS_EQUIPMENT",
			Operator:  "IS",
			BoolValue: pointer.ToBool(false),
		},
	})
	require.NoError(t, err)

	rows, err := e.Rower.Rows(ctx, string(f))
	require.NoError(t, err, "error getting rows")
	linesCount := 0
	for _, ln := range rows {
		linesCount++
		require.NoError(t, err, "error reading row")
		switch ln[4] {
		case externalIDL:
			require.EqualValues(t, ln[1:], []string{
				grandParentLocation,
				"",
				"",
				externalIDL,
				fmt.Sprintf("%f", lat),
				fmt.Sprintf("%f", long),
			})
		case externalIDM:
			require.EqualValues(t, ln[1:], []string{
				grandParentLocation,
				parentLocation,
				"",
				externalIDM,
				fmt.Sprintf("%f", lat),
				fmt.Sprintf("%f", long),
			})
		default:
			if ln[1] == locTypeNameL {
				continue
			} else {
				require.Fail(t, "unknown line %s", ln)
			}
		}
	}
	require.Equal(t, 3, linesCount)
}

func TestExportLocationWithPropertyFilters(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	e := &Exporter{Log: log, Rower: LocationsRower{Log: log}}

	ctx := viewertest.NewContext(context.Background(), client)
	PrepareData(ctx, t)

	f, err := json.Marshal([]locationsFilterInput{
		{
			Name:     "PROPERTY",
			Operator: "IS",
			PropertyValue: models.PropertyTypeInput{
				Name:        propNameStr,
				Type:        "string",
				StringValue: pointer.ToString("override"),
			},
		},
	})
	require.NoError(t, err)

	rows, err := e.Rower.Rows(ctx, string(f))
	require.NoError(t, err, "error getting rows")
	linesCount := 0
	for _, ln := range rows {
		linesCount++
		require.NoError(t, err, "error reading row")
		if ln[3] == childLocation {
			require.EqualValues(t, ln[1:], []string{
				grandParentLocation,
				parentLocation,
				childLocation,
				"",
				fmt.Sprintf("%f", 0.0),
				fmt.Sprintf("%f", 0.0),
				"override",
				"true",
				"1988-03-29",
			})
		}
	}
	require.Equal(t, 2, linesCount)
}

func TestLocationsAsyncExport(t *testing.T) {
	testAsyncExport(t, exporttask.TypeLocation)
}
