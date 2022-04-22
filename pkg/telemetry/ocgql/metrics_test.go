// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ocgql_test

import (
	"sort"
	"sync"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/testserver"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/facebookincubator/symphony/pkg/telemetry/ocgql"
	"github.com/stretchr/testify/require"
	"go.opencensus.io/stats/view"
	"go.opencensus.io/tag"
)

func TestMetrics(t *testing.T) {
	err := view.Register(ocgql.DefaultViews...)
	require.NoError(t, err)
	defer view.Unregister(ocgql.DefaultViews...)

	h := testserver.New()
	h.AddTransport(transport.POST{})
	h.AddTransport(transport.Websocket{})
	h.Use(ocgql.Metrics{})
	h.Use(extension.FixedComplexityLimit(100))
	h.SetCalculatedComplexity(50)

	c := client.New(h)
	err = c.Post(`query { name }`, &struct{ Name string }{})
	require.NoError(t, err)

	sk := c.Websocket(`subscription { name }`)
	defer func() {
		err := sk.Close()
		require.NoError(t, err)
	}()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := sk.Next(&struct{ Name string }{})
		require.NoError(t, err)
	}()
	h.SendNextSubscriptionMessage()
	wg.Wait()

	counters := []struct {
		name string
		rows []view.Row
	}{
		{
			name: ocgql.RequestTotalView.Name,
			rows: []view.Row{
				{
					Tags: []tag.Tag{{Key: ocgql.Operation, Value: "query"}},
					Data: &view.CountData{Value: 1},
				},
				{
					Tags: []tag.Tag{{Key: ocgql.Operation, Value: "subscription"}},
					Data: &view.CountData{Value: 1},
				},
			},
		},
		{
			name: ocgql.ResponseTotalView.Name,
			rows: []view.Row{
				{
					Tags: []tag.Tag{
						{Key: ocgql.Operation, Value: "query"},
						{Key: ocgql.Errors, Value: "0"},
					},
					Data: &view.CountData{Value: 1},
				},
				{
					Tags: []tag.Tag{
						{Key: ocgql.Operation, Value: "subscription"},
						{Key: ocgql.Errors, Value: "0"},
					},
					Data: &view.CountData{Value: 1},
				},
			},
		},
		{
			name: ocgql.ResolveTotalView.Name,
			rows: []view.Row{
				{
					Tags: []tag.Tag{
						{Key: ocgql.Object, Value: "Query"},
						{Key: ocgql.Field, Value: "name"},
						{Key: ocgql.Errors, Value: "0"},
					},
					Data: &view.CountData{Value: 1},
				},
			},
		},
		{
			name: ocgql.DeprecatedResolveTotalView.Name,
			rows: []view.Row{},
		},
	}
	for _, v := range counters {
		rows, err := view.RetrieveData(v.name)
		require.NoError(t, err)
		sort.Slice(rows, func(i, j int) bool {
			var leftOp, rightOp string
			for _, t := range rows[i].Tags {
				if t.Key == ocgql.Operation {
					leftOp = t.Value
					break
				}
			}
			for _, t := range rows[j].Tags {
				if t.Key == ocgql.Operation {
					rightOp = t.Value
					break
				}
			}
			return leftOp <= rightOp
		})
		for i := range rows {
			view.ClearStart(rows[i].Data)
			require.Equal(t, v.rows[i].Data, rows[i].Data)
			require.ElementsMatch(t, v.rows[i].Tags, rows[i].Tags)
		}
	}

	for _, distribution := range []string{
		ocgql.RequestLatencyView.Name,
		ocgql.ResponseBytesView.Name,
		ocgql.ResolveLatencyView.Name,
		ocgql.RequestComplexityView.Name,
	} {
		rows, err := view.RetrieveData(distribution)
		require.NoError(t, err)
		require.NotEmpty(t, rows)
		data, ok := rows[0].Data.(*view.DistributionData)
		require.True(t, ok)
		require.NotZero(t, data.Sum())
	}

	rows, err := view.RetrieveData(ocgql.NumSubscriptionsView.Name)
	require.NoError(t, err)
	require.Len(t, rows, 1)
	require.Equal(t, &view.LastValueData{Value: 1}, rows[0].Data)
}
