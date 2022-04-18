// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker_test

import (
	"testing"
	"time"

	"github.com/facebookincubator/symphony/async/worker"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/testsuite"
	"go.uber.org/cadence/workflow"
	"gocloud.dev/blob"
	"gocloud.dev/blob/memblob"
)

type ExportTaskTestSuite struct {
	TenancyWorkflowTestSuite
	factory *worker.ExportFactory
	env     *testsuite.TestWorkflowEnvironment
	bucket  *blob.Bucket
}

func (s *ExportTaskTestSuite) SetupTest() {
	s.TenancyWorkflowTestSuite.SetupTest()
	s.bucket = memblob.OpenBucket(nil)
	s.factory = worker.NewExportFactory(logtest.NewTestLogger(s.T()), s.bucket, "exports/")
	s.env = s.NewTestWorkflowEnvironment()
	v := viewer.FromContext(s.ctx)
	s.env.RegisterActivityWithOptions(s.factory.ExportSingleWoActivity, activity.RegisterOptions{
		Name: worker.ExportWorkOrderActivityName,
	})
	s.env.OnWorkflow(s.factory.ExportSingleWoWorkflow, mock.Anything, mock.Anything).
		Return(func(ctx workflow.Context, input worker.ExportSingleWOInput) error {
			return s.factory.ExportSingleWoWorkflow(worker.NewWorkflowContext(ctx, v), input)
		})
}

func (s *ExportTaskTestSuite) AfterTest(_, _ string) {
	s.env.AssertExpectations(s.T())
}

func (s *ExportTaskTestSuite) createSingleWO() (*ent.WorkOrder, error) {
	wotype, err := s.entClient.WorkOrderType.Create().
		SetName("woTemplate").
		SetDescription("woTemplate = desc").
		Save(s.ctx)
	s.Require().NoError(err)

	user := viewer.FromContext(s.ctx).(*viewer.UserViewer).User()
	return s.entClient.WorkOrder.
		Create().
		SetName("WO").
		SetDescription("WO - description").
		SetCreationDate(time.Now()).
		SetOwner(user).
		SetType(wotype).
		Save(s.ctx)
}

func (s *ExportTaskTestSuite) TestSingleWorkOrder() {
	wo, err := s.createSingleWO()
	s.Require().NoError(err)
	task, err := s.entClient.ExportTask.Create().
		SetType(exporttask.TypeSingleWorkOrder).
		SetWoIDToExport(wo.ID).
		SetStatus(exporttask.StatusPending).
		Save(s.ctx)
	s.Require().NoError(err)

	s.env.ExecuteWorkflow(s.factory.ExportSingleWoWorkflow, worker.ExportSingleWOInput{
		ExportTaskID: task.ID,
	})
	task, err = s.entClient.ExportTask.Get(s.ctx, task.ID)
	s.Require().NoError(err)
	s.Require().NotNil(task.StoreKey)
	s.Require().Equal(exporttask.StatusSucceeded, task.Status)
	v := viewer.FromContext(s.ctx)
	attrs, err := s.bucket.Attributes(s.ctx, v.Tenant()+"/"+*task.StoreKey)
	s.Require().NoError(err)
	s.Require().Equal("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", attrs.ContentType)
	s.Require().NotEmpty(attrs.ContentDisposition)
}

func TestExportTestSuite(t *testing.T) {
	suite.Run(t, new(ExportTaskTestSuite))
}
