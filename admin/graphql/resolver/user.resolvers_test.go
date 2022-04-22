// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"strconv"
	"testing"
	"time"

	"github.com/99designs/gqlgen/client"
	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/stretchr/testify/suite"
)

type userSuite struct{ testSuite }

func TestUser(t *testing.T) {
	suite.Run(t, &userSuite{})
}

type upsertUserInput struct {
	model.UpsertUserInput
	TenantID string `json:"tenantId"`
}

type userData struct {
	ID     string
	AuthID string
	Role   string
	Status string
}

func (s *userSuite) upsertUser(input upsertUserInput) userData {
	s.expectBeginCommit()
	input.ClientMutationID = pointer.ToString(
		strconv.FormatInt(time.Now().UnixNano(), 10),
	)
	var rsp struct {
		UpsertUser struct {
			ClientMutationID string
			User             userData
		}
	}
	err := s.client.Post(`mutation($input: UpsertUserInput!) {
		upsertUser(input: $input) {
			clientMutationId	
			user {
				id
				authId
				role
				status
			}
		}
	}`, &rsp, client.Var("input", input))
	s.Require().NoError(err)
	s.Require().Equal(*input.ClientMutationID, rsp.UpsertUser.ClientMutationID)
	return rsp.UpsertUser.User
}

func (s *userSuite) createUsers(tenant string, names ...string) (ids []string) {
	input := upsertUserInput{
		TenantID: model.NewTenant(tenant).ID.String(),
	}
	for _, name := range names {
		input.AuthID = name
		data := s.upsertUser(input)
		ids = append(ids, data.ID)
	}
	return ids
}

func (s *userSuite) TestUpsertUser() {
	tenant := s.T().Name()
	role := user.RoleAdmin
	input := upsertUserInput{
		UpsertUserInput: model.UpsertUserInput{
			AuthID: "foo@example.com",
			Role:   &role,
		},
		TenantID: model.NewTenant(tenant).ID.String(),
	}
	data := s.upsertUser(input)
	s.Require().Equal(input.AuthID, data.AuthID)
	s.Require().Equal(role.String(), data.Role)

	status := user.StatusDeactivated
	input.Role = nil
	input.Status = &status
	data = s.upsertUser(input)
	s.Require().Equal(input.AuthID, data.AuthID)
	s.Require().Equal(role.String(), data.Role)
	s.Require().Equal(status.String(), data.Status)
}

func (s *userSuite) TestQueryTenantUsers() {
	tenant := s.T().Name()
	users := []string{"foo", "bar", "baz"}
	s.createUsers(tenant, users...)
	var rsp struct {
		Tenant struct {
			Users struct {
				Edges []struct {
					Node struct {
						AuthID string
					}
				}
				PageInfo struct {
					EndCursor string
				}
				TotalCount int
			}
		}
	}
	s.expectTenantCountQuery(tenant, 1)
	err := s.client.Post(`query($tenant: String!) {
		tenant(name: $tenant) {
			users(first: 2) {
				edges {
					node {
						authId
					}
				}
				pageInfo {
					endCursor
				}
				totalCount
			}
		}
	}`, &rsp, client.Var("tenant", tenant))
	s.Require().NoError(err)
	s.Require().Equal(len(users), rsp.Tenant.Users.TotalCount)
	s.Require().NotEmpty(rsp.Tenant.Users.PageInfo.EndCursor)
	s.Require().Len(rsp.Tenant.Users.Edges, 2)
	s.Require().Equal(users[0], rsp.Tenant.Users.Edges[0].Node.AuthID)
	s.Require().Equal(users[1], rsp.Tenant.Users.Edges[1].Node.AuthID)

	s.expectTenantCountQuery(tenant, 1)
	err = s.client.Post(`query($tenant: String!, $after: Cursor) {
		tenant(name: $tenant) {
			users(after: $after) {
				edges {
					node {
						authId
					}
				}
				totalCount
			}
		}
	}`, &rsp,
		client.Var("tenant", tenant),
		client.Var("after", rsp.Tenant.Users.PageInfo.EndCursor),
	)
	s.Require().NoError(err)
	s.Require().Len(rsp.Tenant.Users.Edges, 1)
	s.Require().Equal(users[2], rsp.Tenant.Users.Edges[0].Node.AuthID)
}

func (s *userSuite) TestQueryUserTenant() {
	tenant := s.T().Name()
	ids := s.createUsers(tenant, "foo")
	var rsp struct {
		User struct{ Tenant struct{ Name string } }
	}
	err := s.client.Post(
		`query($id: ID!) {
			user: node(id: $id) {
				... on User {
					tenant {
						name
					}
				}
			}
		}`,
		&rsp, client.Var("id", ids[0]),
	)
	s.Require().NoError(err)
	s.Require().Equal(tenant, rsp.User.Tenant.Name)
}
