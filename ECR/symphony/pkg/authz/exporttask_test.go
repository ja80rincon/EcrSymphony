// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package authz_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

func TestExportTaskCanAlwaysBeWritten(t *testing.T) {
	c := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(
		context.Background(),
		c,
		viewertest.WithRole(user.RoleUser),
		viewertest.WithPermissions(authz.EmptyPermissions()))
	exportTask, err := c.ExportTask.Create().
		SetType(exporttask.TypeLocation).
		SetProgress(1).
		SetStatus(exporttask.StatusInProgress).
		Save(ctx)
	require.NoError(t, err)
	err = c.ExportTask.UpdateOne(exportTask).
		SetProgress(100).
		SetStatus(exporttask.StatusSucceeded).
		Exec(ctx)
	require.NoError(t, err)
	err = c.ExportTask.DeleteOne(exportTask).
		Exec(ctx)
	require.NoError(t, err)
}
