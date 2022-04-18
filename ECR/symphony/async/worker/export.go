// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker

import (
	"context"
	"fmt"
	"time"

	"github.com/AlekSi/pointer"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/exporter"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/google/uuid"
	"github.com/hashicorp/go-multierror"
	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
	"gocloud.dev/blob"
)

const (
	ExportWorkOrderTaskListName = "wo-exporter"
	ExportWorkOrderWorkflowName = "ExportWorkOrderWorkflow"
	ExportWorkOrderActivityName = "ExportWorkOrderActivity"
)

// ExportFactory contains the workflow and all activities required for exporting work order information
type ExportFactory struct {
	logger       log.Logger
	bucket       *blob.Bucket
	bucketPrefix string
}

// NewExportFactory return export factory given its configuration
func NewExportFactory(logger log.Logger, bucket *blob.Bucket, bucketPrefix string) *ExportFactory {
	return &ExportFactory{
		logger:       logger,
		bucket:       bucket,
		bucketPrefix: bucketPrefix,
	}
}

// ExportSingleWOInput is the input for the export single work order workflow and activity
type ExportSingleWOInput struct {
	ExportTaskID int
}

// SaveTaskResultInput is the input for local activity that saves the results
type SaveTaskResultInput struct {
	ExportTaskID int
	Status       exporttask.Status
	Key          *string
}

// ExportSingleWoWorkflow is the workflow that receives export task id and delegate work to activity for export and
// activity for reporting results
func (ew *ExportFactory) ExportSingleWoWorkflow(ctx workflow.Context, input ExportSingleWOInput) error {
	var key string
	workflow.GetLogger(ctx).Debug("handling export single work order workflow",
		zap.Int("task_id", input.ExportTaskID))
	err := workflow.ExecuteActivity(workflow.WithActivityOptions(ctx, workflow.ActivityOptions{
		TaskList:               ExportWorkOrderTaskListName,
		ScheduleToStartTimeout: 1 * time.Hour,
		StartToCloseTimeout:    5 * time.Minute,
	}), ExportWorkOrderActivityName, input).Get(ctx, &key)
	status := exporttask.StatusSucceeded
	if err != nil {
		status = exporttask.StatusFailed
	}
	return workflow.ExecuteLocalActivity(
		workflow.WithLocalActivityOptions(ctx, defaultLocalActivityOptions), ew.SaveTaskResultLocalActivity, SaveTaskResultInput{
			ExportTaskID: input.ExportTaskID,
			Status:       status,
			Key:          pointer.ToStringOrNil(key),
		}).
		Get(ctx, nil)
}

// SaveTaskResultLocalActivity is local activity that receives the task status and result s3 key and store it in task ent
func (ew *ExportFactory) SaveTaskResultLocalActivity(ctx context.Context, input SaveTaskResultInput) error {
	client := ent.FromContext(ctx)
	if err := client.ExportTask.UpdateOneID(input.ExportTaskID).
		SetStatus(input.Status).
		SetNillableStoreKey(input.Key).
		Exec(ctx); err != nil {
		ew.logger.For(ctx).Error("cannot update task status", zap.Error(err), zap.Int("id", input.ExportTaskID))
		return err
	}
	return nil
}

// ExportSingleWoActivity is the activity that takes the work order id from task and export all its content into s3 file
func (ew *ExportFactory) ExportSingleWoActivity(ctx context.Context, input ExportSingleWOInput) (string, error) {
	client := ent.FromContext(ctx)
	task, err := client.ExportTask.Get(ctx, input.ExportTaskID)
	if err != nil {
		return "", fmt.Errorf("failed to get export task: %w", err)
	}
	if task.WoIDToExport == nil {
		ew.logger.For(ctx).Error("cannot create single work order file, work order id is nil", zap.Int("id", task.ID))
		return "", fmt.Errorf("cannot create single work order file: work order id is nil")
	}
	woIDToExport := *task.WoIDToExport
	excelExporter := exporter.SingleWo{
		Log:    ew.logger,
		Bucket: ew.bucket,
	}
	excelFile, err := excelExporter.CreateExcelFile(ctx, woIDToExport)
	if err != nil {
		ew.logger.For(ctx).Error("cannot create single work order file",
			zap.Error(err), zap.Int("woIDToExport", woIDToExport))
		return "", fmt.Errorf("cannot create single work order file: %w", err)
	}
	tenant := viewer.FromContext(ctx).Tenant()
	key := ew.bucketPrefix + uuid.New().String()
	writeKey := tenant + "/" + key

	b, err := ew.bucket.NewWriter(ctx, writeKey, &blob.WriterOptions{
		ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		ContentDisposition: fmt.Sprintf(
			"attachment; filename=work-order-%d-%s.xlsx",
			woIDToExport,
			time.Now().Format(time.RFC3339),
		),
		BeforeWrite: func(asFunc func(interface{}) bool) error {
			var req *s3manager.UploadInput
			if asFunc(&req) {
				req.Tagging = aws.String("autoclean=true")
			}
			return nil
		},
	})
	if err != nil {
		return "", fmt.Errorf("cannot create bucket writer: %w", err)
	}

	defer func() {
		if cerr := b.Close(); cerr != nil {
			cerr = fmt.Errorf("cannot close writer: %w", cerr)
			err = multierror.Append(err, cerr).ErrorOrNil()
		}
	}()

	err = excelFile.Write(b)
	if err != nil {
		ew.logger.For(ctx).Error("cannot write file to bucket", zap.Error(err))
		return "", err
	}
	return key, nil
}

// NewWorkers returns cadence workers that have workflows and activities registered
func (ew *ExportFactory) NewWorkers(client workflowserviceclient.Interface, workerOptions worker.Options) []worker.Worker {
	w := worker.New(client, ExportDomainName.String(), TaskListName, workerOptions)
	w.RegisterWorkflowWithOptions(ew.ExportSingleWoWorkflow, workflow.RegisterOptions{
		Name: ExportWorkOrderWorkflowName,
	})
	workerOptions2 := workerOptions
	workerOptions2.MaxConcurrentActivityExecutionSize = 1
	w2 := worker.New(client, ExportDomainName.String(), ExportWorkOrderTaskListName, workerOptions2)
	w2.RegisterActivityWithOptions(ew.ExportSingleWoActivity, activity.RegisterOptions{
		Name: ExportWorkOrderActivityName,
	})
	return []worker.Worker{w, w2}
}

// GetDomain returns the factory domain
func (ExportFactory) GetDomain() Domain {
	return ExportDomainName
}
