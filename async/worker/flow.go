// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker

import (
	"context"
	"fmt"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/block"
	"github.com/facebookincubator/symphony/pkg/ent/blockinstance"
	"github.com/facebookincubator/symphony/pkg/ent/flowinstance"
	"github.com/facebookincubator/symphony/pkg/log"
	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"

	// "go.uber.org/cadence/activity"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

const (
	RunFlowWorkflowName = "RunFlow"
	badID               = -1
)

var (
	defaultLocalActivityOptions = workflow.LocalActivityOptions{
		ScheduleToCloseTimeout: 5 * time.Second,
	}
	defaultActivityOptions = workflow.ActivityOptions{
		ScheduleToStartTimeout: 5 * time.Second,
		StartToCloseTimeout:    5 * time.Second,
	}
)

// RunFlowInput is the input for the RunFlow workflow
type RunFlowInput struct {
	FlowInstanceID int
}

// CompleteFlowInput is the input for the CompleteFlow activity
type CompleteFlowInput struct {
	FlowInstanceID       int
	StartBlockInstanceID int
}

// FlowFactory contains the workflow and all activities required for the flow engine
type FlowFactory struct {
	logger log.Logger
}

// NewFlowFactory return flow factory given its configuration
func NewFlowFactory(logger log.Logger) *FlowFactory {
	return &FlowFactory{
		logger: logger,
	}
}

// RunFlowWorkflow is the workflow that runs the main flow. It is tied to flow instance ent and reads the ent graph
// database to find the next block that needs to be executed as activity
func (ff *FlowFactory) RunFlowWorkflow(ctx workflow.Context, input RunFlowInput) error {
	var startBlockInstanceID int
	info := workflow.GetInfo(ctx)
	workflow.GetLogger(ctx).Info("workflow started", zap.String("name", info.WorkflowExecution.ID))
	if err := workflow.ExecuteLocalActivity(
		workflow.WithLocalActivityOptions(ctx, defaultLocalActivityOptions), ff.ReadStartBlockLocalActivity, input).
		Get(ctx, &startBlockInstanceID); err != nil {
		return err
	}
	if err := workflow.ExecuteActivity(
		workflow.WithActivityOptions(ctx, defaultActivityOptions), ff.CompleteFlowActivity, &CompleteFlowInput{
			FlowInstanceID:       input.FlowInstanceID,
			StartBlockInstanceID: startBlockInstanceID,
		}).Get(ctx, nil); err != nil {
		return err
	}
	workflow.GetLogger(ctx).Info("workflow completed", zap.String("name", info.WorkflowExecution.ID))
	return nil
}

// CompleteFlowActivity marks the the flow instance as completed. This should be the last activity in the flow workflow
func (ff *FlowFactory) CompleteFlowActivity(ctx context.Context, input CompleteFlowInput) error {
	ff.logger.For(ctx).Info("completing flow instance",
		zap.Int("instanceID", input.FlowInstanceID))
	return ent.RunWithTransaction(ctx, func(ctx context.Context, client *ent.Client) error {
		if err := client.FlowInstance.UpdateOneID(input.FlowInstanceID).
			SetStatus(flowinstance.StatusCompleted).
			Exec(ctx); err != nil {
			return fmt.Errorf("failed to update flow instance: %w", err)
		}
		blockInstance, err := client.BlockInstance.Query().Where(blockinstance.ID(input.StartBlockInstanceID)).Only(ctx)
		if err != nil {
			return fmt.Errorf("failed to query block instance: %w", err)
		}
		if err := client.BlockInstance.UpdateOneID(input.StartBlockInstanceID).
			SetStatus(blockinstance.StatusCompleted).
			SetOutputs(blockInstance.Inputs).
			Exec(ctx); err != nil {
			return fmt.Errorf("failed to update block instance: %w", err)
		}
		return nil
	})
}

// ReadStartBlockLocalActivity reads the start point of the flow instance. This should be the first activity of flow workflow
func (ff *FlowFactory) ReadStartBlockLocalActivity(ctx context.Context, input RunFlowInput) (int, error) {
	client := ent.FromContext(ctx)
	ff.logger.For(ctx).Info("reading flow start",
		zap.Int("instanceID", input.FlowInstanceID))
	startID, err := client.BlockInstance.Query().Where(
		blockinstance.HasFlowInstanceWith(flowinstance.ID(input.FlowInstanceID)),
		blockinstance.HasBlockWith(block.TypeEQ(block.TypeStart)),
	).OnlyID(ctx)
	if err != nil {
		return badID, err
	}
	return startID, nil
}

// NewWorkers registers the workflow and all activities to the cadence worker
func (ff *FlowFactory) NewWorkers(client workflowserviceclient.Interface, workerOptions worker.Options) []worker.Worker {
	// w := worker.New(client, FlowDomainName.String(), TaskListName, workerOptions)
	// w.RegisterWorkflowWithOptions(ff.RunFlowWorkflow, workflow.RegisterOptions{
	//	Name: RunFlowWorkflowName,
	// })
	// w.RegisterActivityWithOptions(ff.CompleteFlowActivity, activity.RegisterOptions{})
	// return []worker.Worker{w}
	return nil
}

// GetDomain returns the factory domain
func (FlowFactory) GetDomain() Domain {
	return FlowDomainName
}
