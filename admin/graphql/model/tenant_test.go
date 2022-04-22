// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package model_test

import (
	"testing"

	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/stretchr/testify/require"
)

func TestNewTenant(t *testing.T) {
	tenant := model.NewTenant(t.Name())
	require.Equal(t, t.Name(), tenant.ID.Tenant)
	require.Zero(t, tenant.ID.ID)
	require.Equal(t, t.Name(), tenant.Name)
}
