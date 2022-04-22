// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package testdb

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestOpen(t *testing.T) {
	db, name, err := Open()
	require.NotNil(t, db)
	require.NotEmpty(t, name)
	require.NoError(t, err)
}
