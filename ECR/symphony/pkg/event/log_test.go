// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event_test

import (
	"context"
	"errors"
	"sync"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/locationtype"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/suite"
)

type logTestSuite struct {
	eventTestSuite
	toUpdate *ent.LocationType
	toDelete *ent.LocationType
}

func TestLogEvents(t *testing.T) {
	suite.Run(t, &logTestSuite{})
}

func (s *logTestSuite) SetupTest() {
	s.eventTestSuite.SetupTest()
	s.toUpdate = s.client.LocationType.Create().
		SetName("LocationTypeToUpdate").
		SaveX(s.ctx)
	s.toDelete = s.client.LocationType.Create().
		SetName("LocationTypeToDelete").
		SaveX(s.ctx)
}

func (s *logTestSuite) subscribeForOneEvent(expect func(entry event.LogEntry)) *sync.WaitGroup {
	ctx, cancel := context.WithCancel(s.ctx)
	svc, err := ev.NewService(
		ev.Config{
			Receiver: s.receiver,
			Handler: ev.EventHandlerFunc(func(ctx context.Context, evt *ev.Event) error {
				s.Require().Equal(viewertest.DefaultTenant, evt.Tenant)
				s.Require().Equal(event.EntMutation, evt.Name)
				entry, ok := evt.Object.(event.LogEntry)
				s.Require().True(ok)
				expect(entry)
				cancel()
				return nil
			}),
		},
		ev.WithTenant(viewertest.DefaultTenant),
		ev.WithEvent(event.EntMutation),
	)
	s.Require().NoError(err)

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer svc.Stop(context.Background())
		err := svc.Run(ctx)
		s.Require().True(errors.Is(err, context.Canceled))
	}()
	return &wg
}

func (s *logTestSuite) TestCreateEnt() {
	wg := s.subscribeForOneEvent(func(entry event.LogEntry) {
		s.Require().Equal(s.user.AuthID, entry.UserName)
		s.Require().Equal(s.user.ID, *entry.UserID)
		s.Require().Equal(ent.OpCreate, entry.Operation)
		s.Require().Nil(entry.PrevState)
		s.Require().NotNil(entry.CurrState)
		s.Require().Equal("LocationType", entry.CurrState.Type)
		found := 0
		for _, field := range entry.CurrState.Fields {
			switch field.Name {
			case locationtype.FieldName:
				s.Require().Equal("SomeName", field.MustGetString())
				s.Require().Equal("string", field.Type)
				found++
			case locationtype.FieldIndex:
				s.Require().Equal(3, field.MustGetInt())
				s.Require().Equal("int", field.Type)
				found++
			}
		}
		s.Require().Equal(2, found)
	})
	defer wg.Wait()

	_, err := s.client.LocationType.
		Create().
		SetName("SomeName").
		SetIndex(3).
		Save(s.ctx)
	s.Require().NoError(err)
}

func (s *logTestSuite) TestUpdateEnt() {
	wg := s.subscribeForOneEvent(func(entry event.LogEntry) {
		s.Require().Equal(s.user.AuthID, entry.UserName)
		s.Require().Equal(s.user.ID, *entry.UserID)
		s.Require().Equal(ent.OpUpdateOne, entry.Operation)
		s.Require().NotNil(entry.PrevState)
		found := 0
		for _, field := range entry.PrevState.Fields {
			if field.Name == locationtype.FieldName {
				s.Require().Equal("LocationTypeToUpdate", field.MustGetString())
				s.Require().Equal("string", field.Type)
				found++
			}
		}
		s.Require().NotNil(entry.CurrState)
		for _, field := range entry.CurrState.Fields {
			if field.Name == locationtype.FieldName {
				s.Require().Equal("NewName", field.MustGetString())
				s.Require().Equal("string", field.Type)
				found++
			}
		}
		s.Require().Equal(2, found)
	})
	defer wg.Wait()

	err := s.client.LocationType.
		UpdateOne(s.toUpdate).
		SetName("NewName").
		Exec(s.ctx)
	s.Require().NoError(err)
}

func (s *logTestSuite) TestDeleteEnt() {
	wg := s.subscribeForOneEvent(func(entry event.LogEntry) {
		s.Require().Equal(s.user.AuthID, entry.UserName)
		s.Require().Equal(s.user.ID, *entry.UserID)
		s.Require().Equal(ent.OpDeleteOne, entry.Operation)
		s.Require().NotNil(entry.PrevState)
		found := 0
		for _, field := range entry.PrevState.Fields {
			if field.Name == locationtype.FieldName {
				s.Require().Equal("LocationTypeToDelete", field.MustGetString())
				s.Require().Equal("string", field.Type)
				found++
			}
		}
		s.Require().Equal(1, found)
		s.Require().Nil(entry.CurrState)
	})
	defer wg.Wait()

	err := s.client.LocationType.
		DeleteOne(s.toDelete).
		Exec(s.ctx)
	s.Require().NoError(err)
}
