// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package hooks_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/suite"
)

type projectTestSuite struct {
	suite.Suite
	ctx    context.Context
	client *ent.Client
	user   *ent.User
	typ    *ent.ProjectType
}

func (s *projectTestSuite) SetupSuite() {
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
	s.typ, err = client.ProjectType.
		Create().
		SetName("deploy").
		Save(s.ctx)
	s.Require().NoError(err)
}

func (s *projectTestSuite) CreateProject() *ent.ProjectCreate {
	return s.client.Project.Create().
		SetType(s.typ)
}

func (s *projectTestSuite) TestProjectAddedWithTemplate() {
	_, err := s.client.PropertyType.Create().
		SetName("str_prop").
		SetType(propertytype.TypeString).
		SetProjectType(s.typ).
		Save(s.ctx)
	s.Require().NoError(err)
	project, err := s.CreateProject().
		SetName("project").
		Save(s.ctx)
	s.Require().NoError(err)
	template, err := project.QueryTemplate().Only(s.ctx)
	s.Require().NoError(err)
	s.Equal("deploy", template.Name)
	_, err = template.QueryProperties().Where(propertytype.Name("str_prop")).Only(s.ctx)
	s.Require().NoError(err)
}

func TestProjectHooks(t *testing.T) {
	suite.Run(t, &projectTestSuite{})
}
