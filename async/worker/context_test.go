// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker_test

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/async/worker"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/mocks"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"go.uber.org/cadence/.gen/go/shared"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/testsuite"
	"go.uber.org/cadence/workflow"
)

const (
	activityName = "Activity"
	WorkflowName = "Flow"
)

type ContextTestSuite struct {
	suite.Suite
	testsuite.WorkflowTestSuite
	client     *ent.Client
	env        *testsuite.TestWorkflowEnvironment
	propagator workflow.ContextPropagator
}

type headerWriter struct {
	header *shared.Header
}

func (hw *headerWriter) Set(key string, value []byte) {
	hw.header.Fields[key] = value
}

type headerReader struct {
	header *shared.Header
}

func (hr *headerReader) ForEachKey(handler func(string, []byte) error) error {
	if hr.header == nil {
		return nil
	}
	for key, value := range hr.header.Fields {
		if err := handler(key, value); err != nil {
			return err
		}
	}
	return nil
}

func (s *ContextTestSuite) SetupTest() {
	var m mocks.Tenancy
	s.client = viewertest.NewTestClient(s.T())
	m.On("ClientFor", mock.Anything, viewertest.DefaultTenant).
		Return(s.client, nil)
	m.On("ClientFor", mock.Anything, mock.MatchedBy(func(tenant string) bool { return tenant != viewertest.DefaultTenant })).
		Return(nil, fmt.Errorf("tenant not found"))
	s.propagator = worker.NewContextPropagator(&m)
	s.SetContextPropagators([]workflow.ContextPropagator{s.propagator})
	s.env = s.NewTestWorkflowEnvironment()
}

func (s *ContextTestSuite) AfterTest(_, _ string) {
	s.env.AssertExpectations(s.T())
}

func (s *ContextTestSuite) registerActivity(f func(ctx context.Context)) {
	s.env.RegisterActivityWithOptions(func(ctx context.Context) error {
		if f != nil {
			f(ctx)
		}
		return nil
	}, activity.RegisterOptions{
		Name: activityName,
	})
}

func (s *ContextTestSuite) registerWorkflow(f func(ctx workflow.Context) workflow.Context) {
	s.env.RegisterWorkflowWithOptions(func(ctx workflow.Context) error {
		if f != nil {
			ctx = f(ctx)
		}
		ao := workflow.ActivityOptions{
			ScheduleToStartTimeout: 10 * time.Second,
			StartToCloseTimeout:    5 * time.Second,
		}
		ctx = workflow.WithActivityOptions(ctx, ao)
		if err := workflow.ExecuteActivity(ctx, activityName).Get(ctx, nil); err != nil {
			return fmt.Errorf("activity failed: %w", err)
		}
		return nil
	}, workflow.RegisterOptions{
		Name: WorkflowName,
	})
}

func (s *ContextTestSuite) TestRunWorkflow() {
	s.registerActivity(func(ctx context.Context) {
		v := viewer.FromContext(ctx)
		s.Equal(viewertest.DefaultTenant, v.Tenant())
		s.Equal(viewertest.DefaultUser, v.Name())
		s.Equal(viewertest.DefaultRole, v.Role())
		s.Equal(len(viewertest.DefaultFeatures), len(v.Features()))
		for _, feature := range viewertest.DefaultFeatures {
			s.True(v.Features().Enabled(feature))
		}
		_, ok := v.(*viewer.UserViewer)
		s.True(ok)
		s.NotNil(ent.FromContext(ctx))
		permissions := authz.FromContext(ctx)
		s.EqualValues(authz.EmptyPermissions(), permissions)
	})
	ctx := viewertest.NewContext(context.Background(), s.client)
	v := viewer.FromContext(ctx)
	s.registerWorkflow(func(ctx workflow.Context) workflow.Context {
		return worker.NewWorkflowContext(ctx, v)
	})
	s.env.ExecuteWorkflow(WorkflowName)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *ContextTestSuite) TestAdminUserViewer() {
	ctx := viewertest.NewContext(context.Background(), s.client)
	adminName := "admin"
	u := s.client.User.Create().
		SetAuthID(adminName).
		SetRole(user.RoleAdmin).
		SaveX(ctx)
	s.registerActivity(func(ctx context.Context) {
		v := viewer.FromContext(ctx)
		s.Equal(viewertest.DefaultTenant, v.Tenant())
		s.Equal(adminName, v.Name())
		s.Equal(user.RoleAdmin, v.Role())
		s.Equal(len(viewertest.DefaultFeatures), len(v.Features()))
		for _, feature := range viewertest.DefaultFeatures {
			s.True(v.Features().Enabled(feature))
		}
		_, ok := v.(*viewer.UserViewer)
		s.True(ok)
		s.NotNil(ent.FromContext(ctx))
		permissions := authz.FromContext(ctx)
		s.EqualValues(authz.FullPermissions(), permissions)
	})
	s.registerWorkflow(func(ctx workflow.Context) workflow.Context {
		return worker.NewWorkflowContext(ctx,
			viewer.NewUser(viewertest.DefaultTenant, u, viewer.WithFeatures(viewertest.DefaultFeatures...)))
	})
	s.env.ExecuteWorkflow(WorkflowName)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *ContextTestSuite) TestBadTenant() {
	ctx := viewertest.NewContext(context.Background(), s.client)
	u := viewer.FromContext(ctx).(*viewer.UserViewer).User()
	s.registerActivity(nil)
	s.registerWorkflow(func(ctx workflow.Context) workflow.Context {
		return worker.NewWorkflowContext(ctx, viewer.NewUser("bad_tenant", u))
	})
	s.env.ExecuteWorkflow(WorkflowName)
	s.True(s.env.IsWorkflowCompleted())
	s.Error(s.env.GetWorkflowError())
}

func (s *ContextTestSuite) TestAutomationViewer() {
	automationName := "flow-engine"
	s.registerActivity(func(ctx context.Context) {
		v := viewer.FromContext(ctx)
		s.Equal(viewertest.DefaultTenant, v.Tenant())
		s.Equal(automationName, v.Name())
		s.Equal(user.RoleUser, v.Role())
		features := v.Features()
		s.Equal(0, len(features))
		_, ok := v.(*viewer.AutomationViewer)
		s.True(ok)
		s.NotNil(ent.FromContext(ctx))
		permissions := authz.FromContext(ctx)
		s.EqualValues(authz.EmptyPermissions(), permissions)
	})
	s.registerWorkflow(func(ctx workflow.Context) workflow.Context {
		return worker.NewWorkflowContext(ctx,
			viewer.NewAutomation(viewertest.DefaultTenant, automationName, user.RoleUser))
	})
	s.env.ExecuteWorkflow(WorkflowName)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *ContextTestSuite) TestViewerNotExist() {
	s.registerActivity(func(ctx context.Context) {
		s.Fail("you should not get here")
	})
	s.registerWorkflow(nil)
	s.env.ExecuteWorkflow(WorkflowName)
	s.True(s.env.IsWorkflowCompleted())
	s.Error(s.env.GetWorkflowError())
}

func (s *ContextTestSuite) TestInjectingContextHasMissingViewer() {
	header := &shared.Header{
		Fields: make(map[string][]byte),
	}
	hw := headerWriter{header}
	err := s.propagator.Inject(context.Background(), &hw)
	s.Error(err)
}

func (s *ContextTestSuite) TestInjectionAndExtraction() {
	header := &shared.Header{
		Fields: make(map[string][]byte),
	}
	hw := headerWriter{header}
	hr := headerReader{header}
	ctx := viewertest.NewContext(context.Background(), s.client)
	err := s.propagator.Inject(ctx, &hw)
	s.NoError(err)
	s.registerActivity(func(ctx context.Context) {
		v := viewer.FromContext(ctx)
		s.Equal(viewertest.DefaultTenant, v.Tenant())
		s.Equal(viewertest.DefaultUser, v.Name())
		s.Equal(viewertest.DefaultRole, v.Role())
		s.Equal(len(viewertest.DefaultFeatures), len(v.Features()))
		for _, feature := range viewertest.DefaultFeatures {
			s.True(v.Features().Enabled(feature))
		}
		_, ok := v.(*viewer.UserViewer)
		s.True(ok)
		s.NotNil(ent.FromContext(ctx))
		permissions := authz.FromContext(ctx)
		s.EqualValues(authz.EmptyPermissions(), permissions)
	})
	s.registerWorkflow(func(ctx workflow.Context) workflow.Context {
		ctx, err := s.propagator.ExtractToWorkflow(ctx, &hr)
		s.NoError(err)
		return ctx
	})
	s.env.ExecuteWorkflow(WorkflowName)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func TestContextTestSuite(t *testing.T) {
	suite.Run(t, new(ContextTestSuite))
}
