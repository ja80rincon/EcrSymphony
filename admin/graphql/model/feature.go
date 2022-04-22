// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package model

import (
	"github.com/facebookincubator/symphony/pkg/ent"
)

// Feature wraps an ent.Feature adding multi-tenant id.
type Feature struct {
	ID ID
	*ent.Feature
}

// IsNode implements graphql Node interface.
func (Feature) IsNode() {}

// NewFeature creates a feature given a tenant and feature entity.
func NewFeature(tenant string, feature *ent.Feature) *Feature {
	return &Feature{
		ID:      ID{Tenant: tenant, ID: feature.ID},
		Feature: feature,
	}
}
