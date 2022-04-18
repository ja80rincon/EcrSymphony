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

func TestNewContext(t *testing.T) {
	tenantName := "facebook"
	userName := "fbuser@fb.com"
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(
		context.Background(),
		c,
		viewertest.WithTenant(tenantName),
		viewertest.WithUser(userName),
	)
	got := viewer.FromContext(ctx)
	require.Equal(t, tenantName, got.Tenant())
	require.Equal(t, userName, got.Name())
}
