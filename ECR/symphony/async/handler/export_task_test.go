// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package handler_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/async/handler"
	"github.com/facebookincubator/symphony/async/worker"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"go.uber.org/cadence/mocks"
	"gocloud.dev/blob"
	"gocloud.dev/blob/memblob"
)

type exportTestSuite struct {
	suite.Suite
	client        *ent.Client
	ctx           context.Context
	bucket        *blob.Bucket
	tenant        string
	logger        log.Logger
	handler       *handler.ExportHandler
	cadenceClient *mocks.Client
}

func (s *exportTestSuite) SetupSuite() {
	s.client = viewertest.NewTestClient(s.T())
	s.ctx = viewertest.NewContext(context.Background(), s.client)
	s.bucket = memblob.OpenBucket(nil)
	s.logger = logtest.NewTestLogger(s.T())
	s.tenant = viewer.FromContext(s.ctx).Tenant()
	s.cadenceClient = &mocks.Client{}
	s.handler = handler.NewExportHandler(s.bucket, "exports/", s.cadenceClient)
	s.Require().NotNil(s.handler)
}

func TestExports(t *testing.T) {
	suite.Run(t, &exportTestSuite{})
}

func (s *exportTestSuite) TestLocations() {
	s.testExport(exporttask.TypeLocation)
}

func (s *exportTestSuite) TestEquipments() {
	s.testExport(exporttask.TypeEquipment)
}

func (s *exportTestSuite) TestLinks() {
	s.testExport(exporttask.TypeLink)
}

func (s *exportTestSuite) TestPorts() {
	s.testExport(exporttask.TypePort)
}

func (s *exportTestSuite) TestServices() {
	s.testExport(exporttask.TypeService)
}

func (s *exportTestSuite) TestWorkOrders() {
	s.testExport(exporttask.TypeWorkOrder)
}

func (s *exportTestSuite) TestSingleWorkOrder() {
	task, err := s.createExportTask(s.ctx, s.client, exporttask.TypeSingleWorkOrder)
	s.Require().NoError(err)
	var (
		workflowName  string
		workflowInput worker.ExportSingleWOInput
	)
	s.cadenceClient.On("StartWorkflow", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Run(func(args mock.Arguments) {
			workflowName = args.Get(2).(string)
			workflowInput = args.Get(3).(worker.ExportSingleWOInput)
		}).
		Return(nil, nil).
		Once()
	evt := s.createLogEntry(task.ID)
	err = s.handler.Handle(s.ctx, s.logger, evt)
	s.Require().NoError(err)
	s.Equal(worker.ExportWorkOrderWorkflowName, workflowName)
	s.Equal(task.ID, workflowInput.ExportTaskID)
}

func (s *exportTestSuite) testExport(t exporttask.Type) {
	task, err := s.createExportTask(s.ctx, s.client, t)
	s.Require().NoError(err)
	evt := s.createLogEntry(task.ID)
	err = s.handler.Handle(s.ctx, s.logger, evt)
	s.Require().NoError(err)

	task, err = s.client.ExportTask.Get(s.ctx, task.ID)
	s.Require().NoError(err)
	s.Require().NotNil(task.StoreKey)
	s.Require().Equal(exporttask.StatusSucceeded, task.Status)
	attrs, err := s.bucket.Attributes(s.ctx, s.tenant+"/"+*task.StoreKey)
	s.Require().NoError(err)
	s.Require().Equal("text/csv", attrs.ContentType)
	s.Require().NotEmpty(attrs.ContentDisposition)
}

func (s *exportTestSuite) TestBadExport() {
	_, err := s.createExportTask(s.ctx, s.client, exporttask.TypeLocation)
	s.Require().NoError(err)
	evt := s.createBadLogEntry()
	err = s.handler.Handle(s.ctx, s.logger, evt)
	s.Require().Error(err)

	task, err := s.client.ExportTask.Query().Only(s.ctx)
	s.Require().NoError(err)
	s.Require().Nil(task.StoreKey)
}

func (s *exportTestSuite) createBadLogEntry() event.LogEntry {
	return event.LogEntry{
		Type:      ent.TypeExportTask,
		Operation: ent.OpCreate,
		CurrState: &ent.Node{
			ID: 0,
		},
	}
}

func (s *exportTestSuite) createLogEntry(id int) event.LogEntry {
	return event.LogEntry{
		Type:      ent.TypeExportTask,
		Operation: ent.OpCreate,
		CurrState: &ent.Node{
			ID: id,
		},
	}
}

func (s *exportTestSuite) createExportTask(ctx context.Context, client *ent.Client, taskType exporttask.Type) (*ent.ExportTask, error) {
	return client.ExportTask.Create().
		SetType(taskType).
		SetStatus(exporttask.StatusPending).
		Save(ctx)
}
