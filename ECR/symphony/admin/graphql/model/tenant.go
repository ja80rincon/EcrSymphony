// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package model

// NewTenant creates a new tenant with given name.
func NewTenant(name string) *Tenant {
	return &Tenant{
		ID:   ID{Tenant: name},
		Name: name,
	}
}
