// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker_test

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/async/worker"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/viewer/mocks"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"go.uber.org/cadence/testsuite"
	"go.uber.org/cadence/workflow"
)

type TenancyWorkflowTestSuite struct {
	suite.Suite
	testsuite.WorkflowTestSuite
	entClient *ent.Client
	ctx       context.Context
}

func (s *TenancyWorkflowTestSuite) SetupTest() {
	var m mocks.Tenancy
	s.entClient = viewertest.NewTestClient(s.T())
	s.ctx = viewertest.NewContext(context.Background(), s.entClient)
	m.On("ClientFor", mock.Anything, viewertest.DefaultTenant).
		Return(s.entClient, nil)
	m.On("ClientFor", mock.Anything, mock.MatchedBy(func(tenant string) bool { return tenant != viewertest.DefaultTenant })).
		Return(nil, fmt.Errorf("tenant not found"))
	s.SetContextPropagators([]workflow.ContextPropagator{
		worker.NewContextPropagator(&m),
	})
}
