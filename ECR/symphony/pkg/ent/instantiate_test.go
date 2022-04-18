// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ent_test

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	"github.com/facebook/ent/dialect"
	"github.com/facebookincubator/symphony/pkg/ent/enttest"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/stretchr/testify/require"

	_ "github.com/mattn/go-sqlite3"
)

func TestInstantiation(t *testing.T) {
	client := enttest.Open(t, dialect.SQLite,
		fmt.Sprintf("file:%s-%d?mode=memory&cache=shared&_fk=1",
			t.Name(), time.Now().UnixNano(),
		),
	)

	ctx := privacy.DecisionContext(
		context.Background(), privacy.Allow,
	)
	typ := client.LocationType.
		Create().
		SetName("planet").
		SetMapZoomLevel(5).
		SetSite(true).
		SaveX(ctx)
	_ = client.Location.
		Create().
		SetName("earth").
		SetType(typ).
		SaveX(ctx)

	data, err := json.Marshal(typ)
	require.NoError(t, err)
	typ = nil
	err = json.Unmarshal(data, &typ)
	require.NoError(t, err)

	count := client.LocationType.
		Instantiate(typ).
		QueryLocations().
		CountX(ctx)
	require.Equal(t, 1, count)
}
