// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"context"
	stdlog "log"
	"net/url"
	"os"
	"syscall"

	"github.com/alecthomas/kong"
	"github.com/facebookincubator/symphony/async/handler"
	"github.com/facebookincubator/symphony/async/worker"
	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/ctxutil"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/kongtoml"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/server"
	"github.com/facebookincubator/symphony/pkg/server/metrics"
	"github.com/facebookincubator/symphony/pkg/telemetry"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"go.uber.org/zap"

	_ "github.com/facebookincubator/symphony/pkg/ent/runtime"
	_ "github.com/go-sql-driver/mysql"
	_ "gocloud.dev/blob/azureblob"
	_ "gocloud.dev/blob/gcsblob"
	_ "gocloud.dev/blob/s3blob"
	_ "gocloud.dev/pubsub/mempubsub"
	_ "gocloud.dev/pubsub/natspubsub"
)

type cliFlags struct {
	ConfigFile         kong.ConfigFlag  `type:"existingfile" placeholder:"PATH" help:"Configuration file path."`
	ListenAddress      string           `name:"web.listen-address" default:":http" help:"Web address to listen on."`
	MetricsAddress     metrics.Addr     `name:"metrics.listen-address" default:":9464" help:"Metrics address to listen on."`
	DatabaseURL        *url.URL         `name:"db.url" env:"DB_URL" required:"" placeholder:"URL" help:"Database URL."`
	EventPubURL        ev.TopicFactory  `name:"event.pub-url" env:"EVENT_PUB_URL" required:"" placeholder:"URL" help:"Event publish URL."`
	EventSubURL        ev.TopicFactory  `name:"event.sub-url" env:"EVENT_SUB_URL" required:"" placeholder:"URL" help:"Event subscribe URL."`
	ExportBucketURL    *url.URL         `name:"export.bucket-url" env:"EXPORT_BUCKET_URL" required:"" placeholder:"URL" help:"Export bucket URL."`
	ExportBucketPrefix string           `name:"export.bucket-prefix" env:"EXPORT_BUCKET_PREFIX" default:"exports/" help:"Export bucket prefix."`
	CadenceAddr        string           `name:"cadence.addr" env:"CADENCE_ADDR" required:"" help:"Cadence server address."`
	LogConfig          log.Config       `embed:""`
	TelemetryConfig    telemetry.Config `embed:""`
	TenancyConfig      viewer.Config    `embed:""`
}

func main() {
	var cf cliFlags
	kong.Parse(&cf,
		kong.Configuration(kongtoml.Loader),
		cf.TelemetryConfig,
	)

	ctx := ctxutil.WithSignal(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	app, cleanup, err := NewApplication(ctx, &cf)
	if err != nil {
		stdlog.Fatal(err)
	}
	defer cleanup()

	app.logger.Info("starting application")
	err = app.run(ctx)
	app.logger.Info("terminating application", zap.Error(err))
}

type application struct {
	logger      *zap.Logger
	httpServer  *server.Server
	httpAddr    string
	metrics     *metrics.Metrics
	metricsAddr metrics.Addr
	server      *handler.Server
	client      *worker.Client
}

func (app *application) run(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	g := ctxgroup.WithContext(ctx)
	g.Go(func(context.Context) error {
		err := app.httpServer.ListenAndServe(app.httpAddr)
		app.logger.Debug("http server terminated", zap.Error(err))
		return err
	})
	g.Go(func(ctx context.Context) error {
		return app.metrics.Serve(ctx, app.metricsAddr)
	})
	g.Go(func(ctx context.Context) error {
		err := app.server.Serve(ctx)
		app.logger.Debug("event server terminated", zap.Error(err))
		return err
	})

	g.Go(func(ctx context.Context) error {
		err := app.client.Run(ctx)
		app.logger.Debug("cadence client terminated", zap.Error(err))
		return err
	})

	g.Go(func(ctx context.Context) error {
		defer cancel()
		<-ctx.Done()
		return nil
	})
	<-ctx.Done()

	app.logger.Warn("start application termination",
		zap.NamedError("reason", ctx.Err()),
	)
	defer app.logger.Debug("end application termination")

	g.Go(func(context.Context) error {
		app.logger.Debug("start http server termination")
		err := app.httpServer.Shutdown(context.Background())
		app.logger.Debug("end http server termination", zap.Error(err))
		return err
	})
	g.Go(func(context.Context) error {
		app.logger.Debug("start event server termination")
		err := app.server.Shutdown(context.Background())
		app.logger.Debug("end event server termination", zap.Error(err))
		return err
	})
	g.Go(func(context.Context) error {
		app.logger.Debug("start cadence client termination")
		app.client.Shutdown()
		app.logger.Debug("end cadence client termination")
		return nil
	})
	return g.Wait()
}
