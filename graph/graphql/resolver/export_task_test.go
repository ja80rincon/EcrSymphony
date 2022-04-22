// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestAddExportTask(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)
	qr := r.Query()

	data := prepareEquipmentData(ctx, r, "A", nil)
	filters := []*models.GeneralFilterInput{
		{
			FilterType: enum.EquipmentFilterTypeLocationInst.String(),
			Operator:   enum.FilterOperatorIsOneOf,
			Key:        "for-ui-purposes",
			IDSet:      []int{data.loc1, data.loc2},
		},
		{
			FilterType:  enum.EquipmentFilterTypeEquipInstName.String(),
			Operator:    enum.FilterOperatorContains,
			Key:         "for-ui-purposes",
			StringValue: pointer.ToString(substring),
		},
	}
	filtersInput, err := json.Marshal(filters)
	require.NoError(t, err)

	_, err = r.client.ExportTask.
		Create().
		SetType(exporttask.TypeLocation).
		SetStatus(exporttask.StatusPending).
		SetFilters(string(filtersInput)).
		Save(ctx)
	require.NoError(t, err)
	ets, err := r.client.ExportTask.
		Query().
		All(ctx)
	require.NoError(t, err)
	require.Len(t, ets, 1)

	et := ets[0]
	node, err := qr.Node(ctx, et.ID)
	require.NoError(t, err)
	_, ok := node.(*ent.ExportTask)
	require.True(t, ok)

	require.Equal(t, exporttask.StatusPending, et.Status)
	require.Equal(t, exporttask.TypeLocation, et.Type)
	require.Equal(t, float64(0), et.Progress)

	etFilters := []byte(et.Filters)
	require.Equal(t, filtersInput, etFilters)
}
