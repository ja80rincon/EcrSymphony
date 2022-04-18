// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package jobrunner

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/shurcooL/graphql"
	"go.uber.org/zap"
)

// Cmd triggers jobs.
type Cmd struct {
	GraphHost string   `name:"graph-host" env:"GRAPH_HOST" default:"graph" help:"graph hostname."`
	AdminHost string   `name:"admin-host" env:"ADMIN_HOST" default:"admin" help:"admin hostname."`
	Jobs      []string `arg:"" name:"job" help:"list of jobs names to trigger."`
}

// Run is the command entrypoint.
func (c *Cmd) Run(ctx context.Context) error {
	tenants, err := c.tenants(ctx)
	if err != nil {
		zap.L().Error("cannot get tenants", zap.Error(err))
		return err
	}
	return c.run(ctx, tenants)
}

func (c *Cmd) tenants(ctx context.Context) ([]string, error) {
	endpoint := fmt.Sprintf("http://%s/query", c.AdminHost)
	client := graphql.NewClient(endpoint, nil)
	var q struct{ Tenants []struct{ Name string } }
	err := client.Query(ctx, &q, nil)
	if err != nil {
		return nil, err
	}
	names := make([]string, 0, len(q.Tenants))
	for _, tenant := range q.Tenants {
		names = append(names, tenant.Name)
	}
	return names, nil
}

func (c *Cmd) run(ctx context.Context, tenants []string) error {
	for _, job := range c.Jobs {
		logger := zap.L().With(zap.String("job", job))
		endpoint := fmt.Sprintf("http://%s/jobs/%s", c.GraphHost, job)
		req, _ := http.NewRequest(http.MethodPost, endpoint, nil)
		req.Header.Add("x-auth-automation-name", "job_runner")
		req.Header.Add("x-auth-user-role", "OWNER")
		for _, tenant := range tenants {
			logger := logger.With(zap.String("tenant", tenant))
			req := req.Clone(ctx)
			req.Header.Add("x-auth-organization", tenant)
			logger.Info("running job")
			rsp, err := http.DefaultClient.Do(req)
			if err != nil {
				logger.Error("cannot run job", zap.Error(err))
				continue
			}
			body, err := ioutil.ReadAll(rsp.Body)
			rsp.Body.Close()
			if err != nil {
				logger.Error("cannot read response body", zap.Error(err))
				continue
			}
			logger.Info("finished job execution", zap.ByteString("output", body))
		}
	}
	return nil
}
