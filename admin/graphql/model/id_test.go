// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package model_test

import (
	"strconv"
	"strings"
	"testing"

	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

func TestID_Encoding(t *testing.T) {
	want := model.ID{Tenant: t.Name(), ID: 42}
	var buf strings.Builder
	want.MarshalGQL(&buf)
	var got model.ID
	s, err := strconv.Unquote(buf.String())
	require.NoError(t, err)
	err = got.UnmarshalGQL(s)
	require.NoError(t, err)
	require.Equal(t, want, got)
}

func TestID_MarshalLogObject(t *testing.T) {
	core, o := observer.New(zap.InfoLevel)
	logger := zap.New(core)
	id := model.ID{Tenant: t.Name(), ID: 42}
	logger.Info("foo", zap.Object("id", id))
	entries := o.FilterMessage("foo").TakeAll()
	require.Len(t, entries, 1)
	field, ok := entries[0].ContextMap()["id"].(map[string]interface{})
	require.True(t, ok)
	require.Equal(t, id.Tenant, field["tenant"])
	require.Equal(t, id.ID, field["id"])
}
