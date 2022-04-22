// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package models

type PermissionValue string

const (
	PermissionValueYes         PermissionValue = "YES"
	PermissionValueNo          PermissionValue = "NO"
	PermissionValueByCondition PermissionValue = "BY_CONDITION"
)

type BasicPermissionRule struct {
	IsAllowed PermissionValue `json:"isAllowed"`
}

type LocationPermissionRule struct {
	IsAllowed       PermissionValue `json:"isAllowed"`
	LocationTypeIds []int           `json:"locationTypeIds"`
}

type DocumentCategoryPermissionRule struct {
	IsAllowed           PermissionValue `json:"isAllowed"`
	DocumentCategoryIds []int           `json:"documentCategoryIds"`
}

type PropertyCategoryPermissionRule struct {
	IsAllowed           PermissionValue `json:"isAllowed"`
	PropertyCategoryIds []int           `json:"propertyCategoryIds"`
}

type Cud struct {
	Create *BasicPermissionRule `json:"create"`
	Update *BasicPermissionRule `json:"update"`
	Delete *BasicPermissionRule `json:"delete"`
}

type LocationCud struct {
	Create *LocationPermissionRule `json:"create"`
	Update *LocationPermissionRule `json:"update"`
	Delete *LocationPermissionRule `json:"delete"`
}

type DocumentCategoryCud struct {
	LocationTypeID int                             `json:"locationTypeID"`
	Read           *DocumentCategoryPermissionRule `json:"read"`
	Create         *DocumentCategoryPermissionRule `json:"create"`
	Update         *DocumentCategoryPermissionRule `json:"update"`
	Delete         *DocumentCategoryPermissionRule `json:"delete"`
}

type PropertyCategoryCud struct {
	Read   *PropertyCategoryPermissionRule `json:"read"`
	Create *PropertyCategoryPermissionRule `json:"create"`
	Update *PropertyCategoryPermissionRule `json:"update"`
	Delete *PropertyCategoryPermissionRule `json:"delete"`
}

type WorkforcePermissionRule struct {
	IsAllowed        PermissionValue `json:"isAllowed"`
	ProjectTypeIds   []int           `json:"projectTypeIds"`
	WorkOrderTypeIds []int           `json:"workOrderTypeIds"`
	OrganizationIds  []int           `json:"organizationIds"`
}

type WorkforceCud struct {
	Create            *WorkforcePermissionRule `json:"create"`
	Update            *WorkforcePermissionRule `json:"update"`
	Delete            *WorkforcePermissionRule `json:"delete"`
	Assign            *WorkforcePermissionRule `json:"assign"`
	TransferOwnership *WorkforcePermissionRule `json:"transferOwnership"`
}

type AdministrativePolicy struct {
	Access *BasicPermissionRule `json:"access"`
}

type InventoryPolicy struct {
	Read             *BasicPermissionRule `json:"read"`
	Location         *LocationCud         `json:"location"`
	DocumentCategory *DocumentCategoryCud `json:"documentCategory"`
	PropertyCategory *PropertyCategoryCud `json:"propertyCategory"`
	Equipment        *Cud                 `json:"equipment"`
	EquipmentType    *Cud                 `json:"equipmentType"`
	LocationType     *Cud                 `json:"locationType"`
	PortType         *Cud                 `json:"portType"`
	ServiceType      *Cud                 `json:"serviceType"`
}

type WorkforcePolicy struct {
	Read         *WorkforcePermissionRule `json:"read"`
	Data         *WorkforceCud            `json:"data"`
	Templates    *Cud                     `json:"templates"`
	Organization *Cud                     `json:"organization"`
}

type AutomationPolicy struct {
	Read      *BasicPermissionRule `json:"read"`
	Templates *Cud                 `json:"templates"`
}

type AssurancePolicy struct {
	Read      *BasicPermissionRule `json:"read"`
	Templates *Cud                 `json:"templates"`
}

type PermissionSettings struct {
	AdminPolicy      *AdministrativePolicy `json:"adminPolicy"`
	InventoryPolicy  *InventoryPolicy      `json:"inventoryPolicy"`
	WorkforcePolicy  *WorkforcePolicy      `json:"workforcePolicy"`
	AutomationPolicy *AutomationPolicy     `json:"automationPolicy"`
	AssurancePolicy  *AssurancePolicy      `json:"assurancePolicy"`
}

type SystemPolicy interface {
	IsSystemPolicy()
}

func (InventoryPolicy) IsSystemPolicy()  {}
func (WorkforcePolicy) IsSystemPolicy()  {}
func (AutomationPolicy) IsSystemPolicy() {}
func (AssurancePolicy) IsSystemPolicy()  {}
