// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks_test

import (
	"context"
	"testing"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/suite"

	_ "github.com/mattn/go-sqlite3"
)

type workOrderTestSuite struct {
	suite.Suite
	ctx    context.Context
	client *ent.Client
	user   *ent.User
	typ    *ent.WorkOrderType
}

func (s *workOrderTestSuite) SetupSuite() {
	client := viewertest.NewTestClient(s.T())
	s.ctx = viewertest.NewContext(
		context.Background(),
		client,
	)
	s.client = client
	u, ok := viewer.FromContext(s.ctx).(*viewer.UserViewer)
	s.Require().True(ok)
	s.user = u.User()
	var err error
	s.typ, err = s.client.WorkOrderType.
		Create().
		SetName("deploy").
		Save(s.ctx)
	s.Require().NoError(err)
}

func (s *workOrderTestSuite) CreateWorkOrder() *ent.WorkOrderCreate {
	return s.client.WorkOrder.Create().
		SetCreationDate(time.Now()).
		SetOwner(s.user).
		SetType(s.typ)
}

func (s *workOrderTestSuite) TestWorkOrderCloseDate() {
	s.Run("CreateDoneAndReopen", func() {
		order, err := s.CreateWorkOrder().
			SetName("antenna").
			SetStatus(workorder.StatusClosed).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Assert().False(order.CloseDate.IsZero())

		order, err = order.Update().
			SetStatus(workorder.StatusPending).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Assert().Nil(order.CloseDate)
	})
	s.Run("CreateDoneWithCloseDate", func() {
		now := time.Now()
		order, err := s.CreateWorkOrder().
			SetName("pole").
			SetStatus(workorder.StatusClosed).
			SetCloseDate(now).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Assert().True(order.CloseDate.Equal(now))

		order, err = order.Update().
			SetStatus(workorder.StatusClosed).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Assert().True(
			now.Equal(*order.CloseDate),
			"close date modified on status reapply",
		)
	})
	s.Run("CreatePlannedSetCloseDate", func() {
		order, err := s.CreateWorkOrder().
			SetName("tower").
			SetStatus(workorder.StatusPending).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Assert().Nil(order.CloseDate)

		now := time.Now()
		order, err = order.Update().
			SetCloseDate(now).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Assert().True(order.CloseDate.Equal(now))
	})
	s.Run("UpdateDoneMany", func() {
		var ids []int
		for _, name := range []string{"foo", "bar", "baz"} {
			order, err := s.CreateWorkOrder().
				SetName(name).
				Save(s.ctx)
			s.Require().NoError(err)
			s.Assert().Nil(order.CloseDate)
			ids = append(ids, order.ID)
		}
		n, err := s.client.WorkOrder.Update().
			SetStatus(workorder.StatusClosed).
			Where(workorder.IDIn(ids...)).
			Save(privacy.DecisionContext(
				s.ctx, privacy.Allow,
			))
		s.Require().NoError(err)
		s.Assert().Equal(len(ids), n)
		count, err := s.client.WorkOrder.
			Query().
			Where(
				workorder.IDIn(ids...),
				workorder.StatusEQ(workorder.StatusClosed),
				workorder.CloseDateNotNil(),
			).
			Count(s.ctx)
		s.Require().NoError(err)
		s.Assert().Equal(len(ids), count)
	})
}

func (s *workOrderTestSuite) TestWorkOrderAddedWithTemplate() {
	_, err := s.client.PropertyType.Create().
		SetName("str_prop").
		SetType(propertytype.TypeString).
		SetWorkOrderType(s.typ).
		Save(s.ctx)
	s.Require().NoError(err)
	order, err := s.CreateWorkOrder().
		SetName("antenna").
		Save(s.ctx)
	s.Require().NoError(err)
	template, err := order.QueryTemplate().Only(s.ctx)
	s.Require().NoError(err)
	s.Equal("deploy", template.Name)
	_, err = template.QueryPropertyTypes().Where(propertytype.Name("str_prop")).Only(s.ctx)
	s.Require().NoError(err)
}

func (s *workOrderTestSuite) TestWorkOrderUpdateStatus() {
	s.Run("InFeatureNoChange", func() {
		order, err := s.CreateWorkOrder().
			SetName("first").
			SetStatus(workorder.StatusPlanned).
			Save(s.ctx)
		s.Require().NoError(err)

		order, err = order.Update().
			SetStatus(workorder.StatusInProgress).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Equal(workorder.StatusInProgress, order.Status)

		order, err = order.Update().
			SetStatus(workorder.StatusClosed).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Equal(workorder.StatusClosed, order.Status)
	})
	s.Run("InFeatureWithStatusChange", func() {
		order, err := s.CreateWorkOrder().
			SetName("second").
			SetStatus(workorder.StatusPending).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Equal(workorder.StatusPlanned, order.Status)

		order, err = order.Update().
			SetStatus(workorder.StatusDone).
			Save(s.ctx)
		s.Require().NoError(err)
		s.Equal(workorder.StatusClosed, order.Status)
	})
}

func TestWorkOrderHooks(t *testing.T) {
	suite.Run(t, &workOrderTestSuite{})
}
