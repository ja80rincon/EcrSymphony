// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"context"

	"github.com/alecthomas/kong"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/tools/sync/internal/cmd"
)

func main() {
	var cli struct {
		Features cmd.Features `cmd:"features" help:"Sync feature flags."`
		Logging  log.Config   `embed:""`
	}
	ctx := kong.Parse(&cli)
	err := ctx.Run(&cmd.Context{
		Context: context.Background(),
		Logger: log.MustNew(cli.Logging).
			Background(),
	})
	ctx.FatalIfErrorf(err)
}
