// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package models

import (
	"github.com/facebookincubator/symphony/pkg/ent"
)

type EquipmentSearchResult struct {
	Equipment []*ent.Equipment `json:"equipment"`
	Count     int              `json:"count"`
}

type LocationSearchResult struct {
	Locations []*ent.Location `json:"locations"`
	Count     int             `json:"count"`
}

type ServiceSearchResult struct {
	Services []*ent.Service `json:"services"`
	Count    int            `json:"count"`
}

type LinkSearchResult struct {
	Links []*ent.Link `json:"links"`
	Count int         `json:"count"`
}

type WorkOrderSearchResult struct {
	WorkOrders []*ent.WorkOrder `json:"workOrders"`
	Count      int              `json:"count"`
}

type ProjectSearchResult struct {
	Projects []*ent.Project `json:"projects"`
	Count    int            `json:"count"`
}

type PortSearchResult struct {
	Ports []*ent.EquipmentPort `json:"ports"`
	Count int                  `json:"count"`
}
