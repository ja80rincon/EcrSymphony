// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ctxutil

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestDoneCtx(t *testing.T) {
	t.Parallel()
	ctx := DoneCtx()
	require.Implements(t, (*context.Context)(nil), ctx)
	select {
	case <-ctx.Done():
	default:
		require.Fail(t, "unreadable done channel")
	}
	require.EqualError(t, ctx.Err(), ErrDone.Error())
	deadline, ok := ctx.Deadline()
	require.True(t, deadline.IsZero())
	require.False(t, ok)
}
