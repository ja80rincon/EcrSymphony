// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"context"
	"os"

	"github.com/alecthomas/kong"
	"github.com/facebookincubator/symphony/migrate/internal/cmd"
	"github.com/facebookincubator/symphony/pkg/ctxutil"
	_ "github.com/facebookincubator/symphony/pkg/ent/runtime"
	"github.com/facebookincubator/symphony/pkg/log"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	var cli struct {
		Graph   cmd.GraphCmd   `cmd:"graph" help:"Run graph migration."`
		Cadence cmd.CadenceCmd `cmd:"cadence" help:"Run cadence migration."`
		Logging log.Config     `embed:""`
	}
	ctx := kong.Parse(&cli)
	err := ctx.Run(&cmd.Context{
		Context: ctxutil.WithSignal(
			context.Background(),
			os.Interrupt,
		),
		Logger: log.MustNew(cli.Logging).
			Background(),
	})
	ctx.FatalIfErrorf(err)
}
