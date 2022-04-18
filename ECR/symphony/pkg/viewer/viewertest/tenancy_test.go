// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package viewertest_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestTenancy(t *testing.T) {
	var tenancy viewertest.Tenancy
	defer func() {
		err := tenancy.Close()
		require.NoError(t, err)
	}()
	require.Implements(t, (*viewer.Tenancy)(nil), &tenancy)
	ctx := context.Background()
	names := []string{"foo", "bar"}
	for _, name := range names {
		want, err := tenancy.ClientFor(ctx, name)
		require.NoError(t, err)
		got, err := tenancy.ClientFor(ctx, name)
		require.NoError(t, err)
		require.Equal(t, want, got)
	}
	foo, err := tenancy.ClientFor(ctx, "foo")
	require.NoError(t, err)
	bar, err := tenancy.ClientFor(ctx, "bar")
	require.NoError(t, err)
	require.NotEqual(t, foo, bar)
	err = tenancy.Close()
	require.NoError(t, err)
	newest, err := tenancy.ClientFor(ctx, "foo")
	require.NoError(t, err)
	require.NotEqual(t, foo, newest)
}
