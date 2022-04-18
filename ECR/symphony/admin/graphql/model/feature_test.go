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

func TestNewFeature(t *testing.T) {
	const name = "foo"
	user := model.NewFeature(
		t.Name(), &ent.Feature{Name: name},
	)
	require.NotNil(t, user)
	require.Equal(t, t.Name(), user.ID.Tenant)
	require.Equal(t, name, user.Name)
}
