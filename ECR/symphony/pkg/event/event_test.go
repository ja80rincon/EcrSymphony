// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package event_test

import (
	"context"
	"fmt"
	"time"

	"github.com/facebook/ent/dialect"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/enttest"
	"github.com/facebookincubator/symphony/pkg/ent/migrate"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/suite"
)

type eventTestSuite struct {
	suite.Suite
	ctx      context.Context
	logger   log.Logger
	client   *ent.Client
	user     *ent.User
	emitter  ev.Emitter
	receiver ev.Receiver
}

func (s *eventTestSuite) SetupSuite() {
	s.logger = logtest.NewTestLogger(s.T())
}

func (s *eventTestSuite) SetupTest() {
	s.client = enttest.Open(s.T(), dialect.SQLite,
		fmt.Sprintf("file:%s-%d?mode=memory&cache=shared&_fk=1",
			s.T().Name(), time.Now().UnixNano(),
		),
		enttest.WithMigrateOptions(
			migrate.WithGlobalUniqueID(true),
		),
	)
	s.ctx = viewertest.NewContext(context.Background(), s.client)
	s.user = viewer.FromContext(s.ctx).(*viewer.UserViewer).User()
	s.emitter, s.receiver = ev.Pipe()
}

func (s *eventTestSuite) BeforeTest(string, string) {
	eventer := event.Eventer{
		Logger:  s.logger,
		Emitter: s.emitter,
	}
	eventer.HookTo(s.client)
}

func (s *eventTestSuite) TearDownTest() {
	ctx := context.Background()
	s.emitter.Shutdown(ctx)
	s.receiver.Shutdown(ctx)
	s.client.Close()
}
