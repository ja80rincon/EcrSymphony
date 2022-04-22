// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"context"

	"github.com/facebookincubator/symphony/graph/cmd/entscript/migrations"
	"go.uber.org/zap"
)

var migrationMap = map[string]func(context.Context, *zap.Logger) error{
	"sample":                    migrations.MigrateSample,
	"migrate_project_templates": migrations.MigrateProjectTemplates,
	"migrate_workorder_status":  migrations.MigrateWorkOrderStatus,
}
