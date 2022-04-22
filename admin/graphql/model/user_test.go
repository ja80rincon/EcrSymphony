// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package model_test

import (
	"testing"

	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/stretchr/testify/require"
)

func TestNewUser(t *testing.T) {
	user := model.NewUser(
		t.Name(),
		&ent.User{ID: 42},
	)
	require.NotNil(t, user)
	require.Equal(t, t.Name(), user.ID.Tenant)
	require.Equal(t, 42, user.ID.ID)
}
