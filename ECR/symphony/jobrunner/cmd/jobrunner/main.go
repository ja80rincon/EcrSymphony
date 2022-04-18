// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"context"

	"github.com/alecthomas/kong"
	"github.com/facebookincubator/symphony/jobrunner"
	"go.uber.org/zap"
)

func main() {
	var cmd jobrunner.Cmd
	kong.Parse(&cmd)

	ctx := context.Background()
	logger, _ := zap.NewDevelopment()
	zap.ReplaceGlobals(logger)

	if err := cmd.Run(ctx); err != nil {
		logger.Fatal("cannot run command", zap.Error(err))
	}
}
