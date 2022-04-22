// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package models

type BasicPermissionRuleInput struct {
	IsAllowed PermissionValue `json:"isAllowed"`
}

type LocationPermissionRuleInput struct {
	IsAllowed       PermissionValue `json:"isAllowed"`
	LocationTypeIds []int           `json:"locationIds"`
}

type WorkforcePermissionRuleInput struct {
	IsAllowed        PermissionValue `json:"isAllowed"`
	ProjectTypeIds   []int           `json:"projectTypeIds"`
	WorkOrderTypeIds []int           `json:"workOrderTypeIds"`
	OrganizationIds  []int           `json:"organizationIds"`
}

type BasicCUDInput struct {
	Create *BasicPermissionRuleInput `json:"create"`
	Update *BasicPermissionRuleInput `json:"update"`
	Delete *BasicPermissionRuleInput `json:"delete"`
}

type LocationCUDInput struct {
	Create *BasicPermissionRuleInput    `json:"create"`
	Update *LocationPermissionRuleInput `json:"update"`
	Delete *BasicPermissionRuleInput    `json:"delete"`
}

type DocumentCategoryPermissionRuleInput struct {
	IsAllowed           PermissionValue `json:"isAllowed"`
	DocumentCategoryIds []int           `json:"documentCategoryIds"`
}

type PropertyCategoryPermissionRuleInput struct {
	IsAllowed           PermissionValue `json:"isAllowed"`
	PropertyCategoryIds []int           `json:"propertyCategoryIds"`
}

type WorkforceCUDInput struct {
	Create            *BasicPermissionRuleInput `json:"create"`
	Update            *BasicPermissionRuleInput `json:"update"`
	Delete            *BasicPermissionRuleInput `json:"delete"`
	Assign            *BasicPermissionRuleInput `json:"assign"`
	TransferOwnership *BasicPermissionRuleInput `json:"transferOwnership"`
}

type DocumentCategoryCUDInput struct {
	LocationTypeID int                                  `json:"locationTypeID"`
	Read           *DocumentCategoryPermissionRuleInput `json:"read"`
	Create         *DocumentCategoryPermissionRuleInput `json:"create"`
	Update         *DocumentCategoryPermissionRuleInput `json:"update"`
	Delete         *DocumentCategoryPermissionRuleInput `json:"delete"`
}

type PropertyCategoryCUDInput struct {
	Read   *PropertyCategoryPermissionRuleInput `json:"read"`
	Create *PropertyCategoryPermissionRuleInput `json:"create"`
	Update *PropertyCategoryPermissionRuleInput `json:"update"`
	Delete *PropertyCategoryPermissionRuleInput `json:"delete"`
}

type InventoryPolicyInput struct {
	Read             *BasicPermissionRuleInput `json:"read"`
	Location         *LocationCUDInput         `json:"location"`
	DocumentCategory *DocumentCategoryCUDInput `json:"documentCategory"`
	PropertyCategory *PropertyCategoryCUDInput `json:"propertyCategory"`
	Equipment        *BasicCUDInput            `json:"equipment"`
	EquipmentType    *BasicCUDInput            `json:"equipmentType"`
	LocationType     *BasicCUDInput            `json:"locationType"`
	PortType         *BasicCUDInput            `json:"portType"`
	ServiceType      *BasicCUDInput            `json:"serviceType"`
}

type WorkforcePolicyInput struct {
	Read          *WorkforcePermissionRuleInput `json:"read"`
	Data          *WorkforceCUDInput            `json:"data"`
	Templates     *BasicCUDInput                `json:"templates"`
	Organizations *BasicCUDInput                `json:"organization"`
}

type AutomationPolicyInput struct {
	Read      *BasicPermissionRuleInput `json:"read"`
	Templates *BasicCUDInput            `json:"templates"`
}

type AssurancePolicyInput struct {
	Read      *BasicPermissionRuleInput `json:"read"`
	Templates *BasicCUDInput            `json:"templates"`
}
