// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event_test

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/ev"
	evmocks "github.com/facebookincubator/symphony/pkg/ev/mocks"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type workOrderTestSuite struct {
	eventTestSuite
	typ *ent.WorkOrderType
}

func TestWorkOrderEvents(t *testing.T) {
	suite.Run(t, &workOrderTestSuite{})
}

func (s *workOrderTestSuite) SetupTest() {
	s.eventTestSuite.SetupTest()
	s.typ = s.client.WorkOrderType.
		Create().
		SetName("Chore").
		SaveX(s.ctx)
}

func (s *workOrderTestSuite) TestWorkOrderCreate() {
	runCtx, cancel := context.WithCancel(s.ctx)
	var handler evmocks.EventHandler
	for _, c := range []struct {
		name   string
		action func()
	}{
		{name: event.WorkOrderAdded, action: func() {}},
		{name: event.WorkOrderDone, action: cancel},
	} {
		name, action := c.name, c.action
		handler.On("HandleEvent", mock.Anything, mock.AnythingOfType("*ev.Event")).
			Run(func(args mock.Arguments) {
				defer action()
				evt := args.Get(1).(*ev.Event)
				s.Require().Equal(name, evt.Name)
				_, ok := evt.Object.(*ent.WorkOrder)
				s.Require().True(ok)
			}).
			Return(nil).
			Once()
	}
	defer handler.AssertExpectations(s.T())

	svc, err := ev.NewService(
		ev.Config{
			Receiver: s.receiver,
			Handler: ev.LoggingEventHandler{
				Handler: &handler,
				Logger:  logtest.NewTestLogger(s.T()),
			},
		},
		ev.WithTenant(viewertest.DefaultTenant),
		ev.WithEvent(event.WorkOrderAdded, event.WorkOrderDone),
		ev.WithMaxConcurrency(1),
	)
	s.Require().NoError(err)

	var wg sync.WaitGroup
	wg.Add(1)
	defer wg.Wait()
	go func() {
		defer func() {
			_ = svc.Stop(s.ctx)
			wg.Done()
		}()
		err := svc.Run(runCtx)
		s.Require().True(errors.Is(err, context.Canceled))
	}()

	s.client.WorkOrder.Create().
		SetName("Clean").
		SetType(s.typ).
		SetCreationDate(time.Now()).
		SetOwner(s.user).
		SetStatus(workorder.StatusClosed).
		SaveX(s.ctx)
}

func (s *workOrderTestSuite) TestWorkOrderUpdate() {
	err := s.client.WorkOrder.Update().
		SetStatus(workorder.StatusClosed).
		Exec(s.ctx)
	s.Require().True(
		errors.Is(err, event.ErrWorkOrderUpdateStatusOfMany),
	)
}

func (s *workOrderTestSuite) TestWorkOrderUpdateOne() {
	runCtx, cancel := context.WithCancel(s.ctx)
	var handler evmocks.EventHandler
	handler.On("HandleEvent", mock.Anything, mock.AnythingOfType("*ev.Event")).
		Run(func(args mock.Arguments) {
			defer cancel()
			evt := args.Get(1).(*ev.Event)
			s.Require().Equal(event.WorkOrderDone, evt.Name)
			wo, ok := evt.Object.(*ent.WorkOrder)
			s.Require().True(ok)
			s.Require().Equal("Vacuum", wo.Name)
		}).
		Return(nil).
		Once()
	defer handler.AssertExpectations(s.T())

	svc, err := ev.NewService(
		ev.Config{
			Receiver: s.receiver,
			Handler:  &handler,
		},
		ev.WithTenant(viewertest.DefaultTenant),
		ev.WithEvent(event.WorkOrderDone),
	)
	s.Require().NoError(err)

	var wg sync.WaitGroup
	wg.Add(1)
	defer wg.Wait()

	go func() {
		defer func() {
			_ = svc.Stop(s.ctx)
			wg.Done()
		}()
		err := svc.Run(runCtx)
		s.Require().True(errors.Is(err, context.Canceled))
	}()

	wo := s.client.WorkOrder.Create().
		SetName("Vacuum").
		SetType(s.typ).
		SetCreationDate(time.Now()).
		SetOwner(s.user).
		SaveX(s.ctx)
	tx, err := s.client.Tx(s.ctx)
	s.Require().NoError(err)
	ctx := ent.NewTxContext(s.ctx, tx)
	err = tx.WorkOrder.UpdateOne(wo).
		SetStatus(workorder.StatusClosed).
		Exec(ctx)
	s.Require().NoError(err)
	err = tx.Commit()
	s.Require().NoError(err)
}

func (s *workOrderTestSuite) TestWorkOrderStatusChanged() {
	runCtx, cancel := context.WithCancel(s.ctx)
	var handler evmocks.EventHandler
	handler.On("HandleEvent", mock.Anything, mock.AnythingOfType("*ev.Event")).
		Run(func(args mock.Arguments) {
			evt := args.Get(1).(*ev.Event)
			s.Require().Equal(event.WorkOrderStatusChanged, evt.Name)
			payload, ok := evt.Object.(*event.WorkOrderStatusChangedPayload)
			s.Require().True(ok)
			s.Require().Nil(payload.From)
			s.Require().Equal(workorder.StatusPlanned, payload.To)
			s.Require().Equal("Test", payload.WorkOrder.Name)
		}).
		Return(nil).
		Once()
	handler.On("HandleEvent", mock.Anything, mock.AnythingOfType("*ev.Event")).
		Run(func(args mock.Arguments) {
			defer cancel()
			evt := args.Get(1).(*ev.Event)
			s.Require().Equal(event.WorkOrderStatusChanged, evt.Name)
			payload, ok := evt.Object.(*event.WorkOrderStatusChangedPayload)
			s.Require().True(ok)
			s.Require().Equal(workorder.StatusPlanned, *payload.From)
			s.Require().Equal(workorder.StatusClosed, payload.To)
			s.Require().Equal("Test", payload.WorkOrder.Name)
		}).
		Return(nil).
		Once()
	defer handler.AssertExpectations(s.T())

	svc, err := ev.NewService(
		ev.Config{
			Receiver: s.receiver,
			Handler:  &handler,
		},
		ev.WithTenant(viewertest.DefaultTenant),
		ev.WithEvent(event.WorkOrderStatusChanged),
	)
	s.Require().NoError(err)

	var wg sync.WaitGroup
	wg.Add(1)
	defer wg.Wait()

	go func() {
		defer func() {
			_ = svc.Stop(s.ctx)
			wg.Done()
		}()
		err := svc.Run(runCtx)
		s.Require().True(errors.Is(err, context.Canceled))
	}()

	workOrder, err := s.client.WorkOrder.Create().
		SetName("Test").
		SetType(s.typ).
		SetCreationDate(time.Now()).
		SetOwner(s.user).
		SetStatus(workorder.StatusPlanned).
		Save(s.ctx)
	s.Require().NoError(err)

	err = workOrder.Update().
		SetStatus(workorder.StatusClosed).
		Exec(s.ctx)
	s.Require().NoError(err)
}
