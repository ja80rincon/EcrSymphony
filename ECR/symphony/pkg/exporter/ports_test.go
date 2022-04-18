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

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentportdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

const portNameTitle = "Port Name"
const portTypeTitle = "Port Type"
const equipmentNameTitle = "Equipment Name"
const equipmentTypeTitle = "Equipment Type"
const p3Title = "Parent Equipment (3)"
const p2Title = "Parent Equipment (2)"
const p1Title = "Parent Equipment"
const positionTitle = "Equipment Position"
const linkPID = "Linked Port ID"
const linkPName = "Linked Port Name"
const linkEID = "Linked Equipment ID"
const linkEName = "Linked Equipment"
const servicesTitle = "Service Names"

func TestEmptyPortsDataExport(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	ctx := viewertest.NewContext(context.Background(), client)
	e := &Exporter{Log: log, Rower: PortsRower{Log: log}}

	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.EqualValues(t, []string{
			"\ufeffPort ID",
			portNameTitle,
			portTypeTitle,
			equipmentNameTitle,
			equipmentTypeTitle,
			p3Title,
			p2Title,
			p1Title,
			positionTitle,
			linkPID,
			linkPName,
			linkEID,
			linkEName,
			servicesTitle,
		}, ln)
	}
}

func TestPortsExport(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &Exporter{Log: log, Rower: PortsRower{Log: log}}

	ctx := viewertest.NewContext(context.Background(), client)
	PrepareData(ctx, t)
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		switch {
		case ln[1] == portNameTitle:
			require.EqualValues(t, []string{
				"\ufeffPort ID",
				portNameTitle,
				portTypeTitle,
				equipmentNameTitle,
				equipmentTypeTitle,
				"locTypeLarge",
				"locTypeMedium",
				"locTypeSmall",
				p3Title,
				p2Title,
				p1Title,
				positionTitle,
				linkPID,
				linkPName,
				linkEID,
				linkEName,
				servicesTitle,
				propStr,
				propStr2,
			}, ln)
		case ln[1] == portName1:
			ln[12] = "--"
			ln[14] = "--"
			require.EqualValues(t, ln[1:], []string{
				portName1,
				"portType1",
				parentEquip,
				equipmentTypeName,
				grandParentLocation,
				parentLocation,
				childLocation,
				"",
				"",
				"",
				"",
				"--",
				"port2",
				"--",
				currEquip,
				"S1;S2",
				"t1",
				"",
			})
		case ln[1] == portName2:
			ln[12] = "--"
			ln[14] = "--"
			require.EqualValues(t, ln[1:], []string{
				portName2,
				"",
				currEquip,
				equipmentType2Name,
				grandParentLocation,
				parentLocation,
				childLocation,
				"",
				"",
				parentEquip,
				positionName,
				"--",
				portName1,
				"--",
				parentEquip,
				"S1",
				"",
				"",
			})
		default:
			require.Fail(t, "line does not match")
		}
	}
}

func TestPortWithFilters(t *testing.T) {
	client := viewertest.NewTestClient(t)
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &Exporter{Log: log, Rower: PortsRower{Log: log}}

	ctx := viewertest.NewContext(context.Background(), client)
	PrepareData(ctx, t)
	loc := client.Location.Query().Where(location.Name(childLocation)).OnlyX(ctx)
	pDef2 := client.EquipmentPortDefinition.Query().Where(equipmentportdefinition.Name(portName2)).OnlyX(ctx)

	f1, err := json.Marshal([]portFilterInput{
		{
			Name:     "LOCATION_INST",
			Operator: "IS_ONE_OF",
			IDSet:    []string{strconv.Itoa(loc.ID)},
		},
		{
			Name:     "PORT_DEF",
			Operator: "IS_ONE_OF",
			IDSet:    []string{strconv.Itoa(pDef2.ID)},
		},
		{
			Name:      "PORT_INST_HAS_LINK",
			Operator:  "IS",
			BoolValue: true,
		},
	})
	require.NoError(t, err)
	f2, err := json.Marshal([]portFilterInput{
		{
			Name:     "PROPERTY",
			Operator: "IS",
			PropertyValue: pkgmodels.PropertyTypeInput{
				ID:          pointer.ToInt(42),
				Name:        propStr,
				StringValue: pointer.ToString("t1"),
				Type:        "string",
			},
		},
	})
	require.NoError(t, err)

	f3, err := json.Marshal([]portFilterInput{
		{
			Name:      "PORT_INST_HAS_LINK",
			Operator:  "IS",
			BoolValue: false,
		},
	})
	require.NoError(t, err)

	for i, filter := range [][]byte{f1, f2, f3} {
		rows, err := e.Rower.Rows(ctx, string(filter))
		require.NoError(t, err, "error getting rows")
		linesCount := 0
		for _, ln := range rows {
			linesCount++
			if i == 0 {
				if ln[1] == portName1 {
					ln[12] = "--"
					ln[14] = "--"
					require.EqualValues(t, []string{
						portName2,
						"",
						currEquip,
						equipmentType2Name,
						grandParentLocation,
						parentLocation,
						childLocation,
						"",
						"",
						parentEquip,
						positionName,
						"--",
						portName1,
						"--",
						parentEquip,
						"",
						"",
						"",
					}, ln[1:])
					require.Equal(t, 2, linesCount)
				}
			}
			if i == 1 {
				if ln[1] == portName1 {
					ln[12] = "--"
					ln[14] = "--"
					require.EqualValues(t, []string{
						portName1,
						"portType1",
						parentEquip,
						equipmentTypeName,
						grandParentLocation,
						parentLocation,
						childLocation,
						"",
						"",
						"",
						"",
						"--",
						"port2",
						"--",
						currEquip,
						"S1;S2",
						"t1",
						"",
					}, ln[1:])
					require.Equal(t, 2, linesCount)
				}
			}
			if i == 2 {
				require.Equal(t, 1, linesCount)
			}
		}
	}
}

func TestPortsAsyncExport(t *testing.T) {
	testAsyncExport(t, exporttask.TypePort)
}
