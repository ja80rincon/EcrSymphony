// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package strutil_test

import (
	"fmt"
	"testing"

	"github.com/facebookincubator/symphony/pkg/strutil"
	"github.com/stretchr/testify/require"
)

func TestStringer(t *testing.T) {
	stringer := strutil.Stringer(t.Name())
	require.Implements(t, (*fmt.Stringer)(nil), stringer)
	require.Equal(t, t.Name(), stringer.String())
}
