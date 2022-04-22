// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/require"
)

func TestSetUserEmailOnCreateHook(t *testing.T) {
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)
	foo, err := client.User.
		Create().
		SetAuthID("foo@example.com").
		Save(ctx)
	require.NoError(t, err)
	require.Equal(t, "foo@example.com", foo.Email)
	bar, err := client.User.
		Create().
		SetAuthID("bar").
		Save(ctx)
	require.NoError(t, err)
	require.Empty(t, bar.Email)
}
