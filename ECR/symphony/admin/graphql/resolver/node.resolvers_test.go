// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/stretchr/testify/suite"
)

type nodeSuite struct{ testSuite }

func TestNode(t *testing.T) {
	suite.Run(t, &nodeSuite{})
}

func (s *nodeSuite) TestQueryTenantNode() {
	tenant := s.T().Name()
	s.expectTenantCountQuery(tenant, 1)
	id := model.ID{Tenant: tenant}.String()
	var rsp struct{ Node struct{ ID, Name string } }
	err := s.client.Post(
		`query($id: ID!) { node(id: $id) { ... on Tenant { id name } } }`,
		&rsp, client.Var("id", id),
	)
	s.Require().NoError(err)
	s.Require().Equal(tenant, rsp.Node.Name)
	s.Require().Equal(id, rsp.Node.ID)
}

func (s *nodeSuite) TestQueryUserNode() {
	s.expectBeginCommit()
	id := model.ID{Tenant: s.T().Name()}.String()
	var mrsp struct {
		UpsertUser struct{ User struct{ ID string } }
	}
	const username = "baz"
	err := s.client.Post(
		`mutation($tenant: ID!, $username: String!) {
			upsertUser(input: {tenantId: $tenant, authId: $username}) {
				user {
					id
				}
			}
		}`,
		&mrsp,
		client.Var("tenant", id),
		client.Var("username", username),
	)
	s.Require().NoError(err)
	s.Require().NotEmpty(mrsp.UpsertUser.User.ID)

	var rsp struct{ User userData }
	err = s.client.Post(
		`query($id: ID!) { user: node(id: $id) { ... on User { id authId role status } } }`,
		&rsp, client.Var("id", mrsp.UpsertUser.User.ID),
	)
	s.Require().NoError(err)
	s.Require().Equal(mrsp.UpsertUser.User.ID, rsp.User.ID)
	s.Require().Equal(username, rsp.User.AuthID)
	s.Require().Equal(user.DefaultRole.String(), rsp.User.Role)
	s.Require().Equal(user.DefaultStatus.String(), rsp.User.Status)
}

func (s *nodeSuite) TestQueryNodeNotFound() {
	tenant := s.T().Name()
	s.expectTenantCountQuery(tenant, 0)
	id := model.ID{Tenant: tenant}.String()
	var rsp struct{ Node struct{ Name string } }
	err := s.client.Post(
		`query($id: ID!) { node(id: $id) { ... on Tenant { name } } }`,
		&rsp, client.Var("id", id),
	)
	s.Require().Error(err)
	s.Require().Contains(err.Error(), "Could not resolve to a node with the global id of '"+id+"'")
}
