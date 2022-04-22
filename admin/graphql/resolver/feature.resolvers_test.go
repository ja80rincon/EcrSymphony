// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/admin/graphql/model"
	"github.com/stretchr/testify/suite"
)

type featureSuite struct{ testSuite }

func TestFeature(t *testing.T) {
	suite.Run(t, &featureSuite{})
}

type createFeatureInput struct {
	model.CreateFeatureInput
	Tenants []string `json:"tenants"`
}

func (s *featureSuite) createFeatures(name string, tenants ...string) []string {
	s.expectBeginCommit()
	input := createFeatureInput{
		CreateFeatureInput: model.CreateFeatureInput{
			Name: name,
		},
		Tenants: make([]string, len(tenants)),
	}
	for i := range tenants {
		input.Tenants[i] = model.NewTenant(tenants[i]).ID.String()
	}

	var rsp struct {
		CreateFeature struct {
			Features []struct {
				ID string
			}
		}
	}
	err := s.client.Post(`mutation($input: CreateFeatureInput!) {
		createFeature(input: $input) {
			features {
				id
			}
		}
	}`, &rsp, client.Var("input", input))
	s.Require().NoError(err)

	ids := make([]string, len(rsp.CreateFeature.Features))
	for i := range rsp.CreateFeature.Features {
		ids[i] = rsp.CreateFeature.Features[i].ID
	}
	return ids
}

func (s *featureSuite) TestCreateFeature() {
	tenants := []string{"foo", "bar", "baz"}
	ids := s.createFeatures(s.T().Name(), tenants...)
	for i, id := range ids {
		var rsp struct {
			Feature struct {
				ID     string
				Tenant struct {
					Name     string
					Features []struct {
						Name string
					}
				}
			}
		}
		err := s.client.Post(
			`query($id: ID!, $name: String!) {
				feature: node(id: $id) {
					... on Feature {
						id
						tenant {
							name
							features(filterBy: {names: [$name]}) {
								name
							}
						}
					}
				}
			}`,
			&rsp,
			client.Var("id", id),
			client.Var("name", s.T().Name()),
		)
		s.Require().NoError(err)
		s.Require().Equal(id, rsp.Feature.ID)
		s.Require().Equal(tenants[i], rsp.Feature.Tenant.Name)
		s.Require().Len(rsp.Feature.Tenant.Features, 1)
		s.Require().Equal(s.T().Name(), rsp.Feature.Tenant.Features[0].Name)
	}
}

func (s *featureSuite) TestUpsertFeature() {
	var input struct {
		model.UpsertFeatureInput
		Tenants []string `json:"tenants"`
	}
	input.Name = s.T().Name()
	input.Tenants = append(input.Tenants,
		model.NewTenant("foobar").ID.String(),
	)
	input.Enabled = pointer.ToBool(false)

	var rsp struct {
		UpsertFeature struct {
			Features []struct {
				ID      string
				Enabled bool
			}
		}
	}
	const mutation = `mutation($input: UpsertFeatureInput!) {
		upsertFeature(input: $input) {
			features {
				id
				enabled
			}
		}
	}`
	s.expectBeginCommit()
	err := s.client.Post(mutation, &rsp, client.Var("input", input))
	s.Require().NoError(err)
	s.Require().Len(rsp.UpsertFeature.Features, 1)
	s.Require().False(rsp.UpsertFeature.Features[0].Enabled)

	id := rsp.UpsertFeature.Features[0].ID
	input.Enabled = pointer.ToBool(true)
	s.expectBeginCommit()
	err = s.client.Post(mutation, &rsp, client.Var("input", input))
	s.Require().NoError(err)
	s.Require().Len(rsp.UpsertFeature.Features, 1)
	s.Require().Equal(id, rsp.UpsertFeature.Features[0].ID)
	s.Require().True(rsp.UpsertFeature.Features[0].Enabled)
}

func (s *featureSuite) TestUpdateFeature() {
	const tenant = "foobar"
	name := s.T().Name()
	id := s.createFeatures(name, tenant)[0]
	const query = `query($tenant: String!, $enabled: Boolean!) {
		tenant(name: $tenant) {
			features(filterBy: {enabled: $enabled}) {
				name
				description
			}
		}
	}`
	var rsp struct {
		Tenant struct {
			Features []struct {
				Name        string
				Description *string
			}
		}
	}
	s.expectTenantCountQuery(tenant, 1)
	err := s.client.Post(query, &rsp,
		client.Var("tenant", tenant),
		client.Var("enabled", true),
	)
	s.Require().NoError(err)
	s.Require().Empty(rsp.Tenant.Features)

	const desc = "testing feature update"
	s.expectBeginCommit()
	err = s.client.Post(`mutation($id: ID!, $desc: String!) {
		updateFeature(input: { id: $id, enabled: true, description: $desc }) {
			clientMutationId
		}
	}`, &struct {
		UpdateFeature struct{ ClientMutationID string }
	}{},
		client.Var("id", id),
		client.Var("desc", desc),
	)
	s.Require().NoError(err)

	s.expectTenantCountQuery(tenant, 1)
	err = s.client.Post(query, &rsp,
		client.Var("tenant", tenant),
		client.Var("enabled", true),
	)
	s.Require().NoError(err)
	s.Require().Len(rsp.Tenant.Features, 1)
	s.Require().Equal(name, rsp.Tenant.Features[0].Name)
	s.Require().NotNil(rsp.Tenant.Features[0].Description)
	s.Require().Equal(desc, *rsp.Tenant.Features[0].Description)
}

func (s *featureSuite) TestDeleteFeature() {
	tenants := []string{"foo", "bar", "baz"}
	s.createFeatures(s.T().Name(), tenants...)
	s.expectTenantsLikeQuery(tenants...).
		RowsWillBeClosed()
	var rsp struct {
		Tenants []struct {
			Features []struct {
				ID   string
				Name string
			}
		}
	}
	const tenantsQuery = `query {
		tenants {
			features {
				id
				name
			}
		}
	}`
	err := s.client.Post(tenantsQuery, &rsp)
	s.Require().NoError(err)
	s.Require().Len(rsp.Tenants, len(tenants))
	for _, tenant := range rsp.Tenants {
		s.Require().Len(tenant.Features, 1)
		s.Require().Equal(s.T().Name(), tenant.Features[0].Name)
	}

	for _, tenant := range rsp.Tenants {
		s.expectBeginCommit()
		err = s.client.Post(`mutation($id: ID!) {
			deleteFeature(input: { id: $id }) {
				clientMutationId
			}
		}`,
			&struct {
				DeleteFeature struct{ ClientMutationID string }
			}{},
			client.Var("id", tenant.Features[0].ID),
		)
		s.Require().NoError(err)
	}

	s.expectTenantsLikeQuery(tenants...).
		RowsWillBeClosed()
	err = s.client.Post(tenantsQuery, &rsp)
	s.Require().NoError(err)
	s.Require().Len(rsp.Tenants, len(tenants))
	for _, tenant := range rsp.Tenants {
		s.Require().Empty(tenant.Features)
	}
}
