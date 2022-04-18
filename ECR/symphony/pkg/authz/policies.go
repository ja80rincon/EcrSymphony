// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package authz

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/authz/models"
	"github.com/facebookincubator/symphony/pkg/ent"

	"github.com/facebookincubator/symphony/pkg/ent/permissionspolicy"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/ent/usersgroup"

	"github.com/facebookincubator/symphony/pkg/viewer"
)

var allowedEnums = map[models.PermissionValue]int{
	models.PermissionValueNo:          1,
	models.PermissionValueByCondition: 2,
	models.PermissionValueYes:         3,
}

func newBasicPermissionRule(allowed bool) *models.BasicPermissionRule {
	rule := models.PermissionValueNo
	if allowed {
		rule = models.PermissionValueYes
	}
	return &models.BasicPermissionRule{IsAllowed: rule}
}

func newLocationPermissionRule(allowed bool) *models.LocationPermissionRule {
	rule := models.PermissionValueNo
	if allowed {
		rule = models.PermissionValueYes
	}
	return &models.LocationPermissionRule{IsAllowed: rule}
}

func newDocumentCategoryPermissionRule(allowed bool) *models.DocumentCategoryPermissionRule {
	rule := models.PermissionValueNo
	if allowed {
		rule = models.PermissionValueYes
	}
	return &models.DocumentCategoryPermissionRule{IsAllowed: rule}
}

func newPropertyCategoryPermissionRule(allowed bool) *models.PropertyCategoryPermissionRule {
	rule := models.PermissionValueNo
	if allowed {
		rule = models.PermissionValueYes
	}
	return &models.PropertyCategoryPermissionRule{IsAllowed: rule}
}

func newWorkforcePermissionRule(allowed bool) *models.WorkforcePermissionRule {
	rule := models.PermissionValueNo
	if allowed {
		rule = models.PermissionValueYes
	}
	return &models.WorkforcePermissionRule{IsAllowed: rule}
}

func newCUD(allowed bool) *models.Cud {
	return &models.Cud{
		Create: newBasicPermissionRule(allowed),
		Update: newBasicPermissionRule(allowed),
		Delete: newBasicPermissionRule(allowed),
	}
}

func newLocationCUD(allowed bool) *models.LocationCud {
	return &models.LocationCud{
		Create: newLocationPermissionRule(allowed),
		Update: newLocationPermissionRule(allowed),
		Delete: newLocationPermissionRule(allowed),
	}
}

func newDocumentCategoryCUD(allowed bool) *models.DocumentCategoryCud {
	return &models.DocumentCategoryCud{
		Read:   newDocumentCategoryPermissionRule(allowed),
		Create: newDocumentCategoryPermissionRule(allowed),
		Update: newDocumentCategoryPermissionRule(allowed),
		Delete: newDocumentCategoryPermissionRule(allowed),
	}
}

func newPropertyCategoryCUD(allowed bool) *models.PropertyCategoryCud {
	return &models.PropertyCategoryCud{
		Read:   newPropertyCategoryPermissionRule(allowed),
		Create: newPropertyCategoryPermissionRule(allowed),
		Update: newPropertyCategoryPermissionRule(allowed),
		Delete: newPropertyCategoryPermissionRule(allowed),
	}
}

func newWorkforceCUD(allowed bool) *models.WorkforceCud {
	return &models.WorkforceCud{
		Create:            newWorkforcePermissionRule(allowed),
		Update:            newWorkforcePermissionRule(allowed),
		Delete:            newWorkforcePermissionRule(allowed),
		Assign:            newWorkforcePermissionRule(allowed),
		TransferOwnership: newWorkforcePermissionRule(allowed),
	}
}

// NewInventoryPolicy builds an inventory policy based on general restriction on read,write
func NewInventoryPolicy(writeAllowed bool) *models.InventoryPolicy {
	return &models.InventoryPolicy{
		Read:             newBasicPermissionRule(true),
		Location:         newLocationCUD(writeAllowed),
		DocumentCategory: newDocumentCategoryCUD(writeAllowed),
		PropertyCategory: newPropertyCategoryCUD(writeAllowed),
		Equipment:        newCUD(writeAllowed),
		EquipmentType:    newCUD(writeAllowed),
		LocationType:     newCUD(writeAllowed),
		PortType:         newCUD(writeAllowed),
		ServiceType:      newCUD(writeAllowed),
	}
}

// NewWorkforcePolicy build a workforce policy based on general restriction on read,write
func NewWorkforcePolicy(readAllowed, writeAllowed bool) *models.WorkforcePolicy {
	return &models.WorkforcePolicy{
		Read:         newWorkforcePermissionRule(readAllowed),
		Data:         newWorkforceCUD(writeAllowed),
		Templates:    newCUD(writeAllowed),
		Organization: newCUD(writeAllowed),
	}
}

// NewAutomationPolicy build a automation policy based on general restriction on read,write
func NewAutomationPolicy(readAllowed, writeAllowed bool) *models.AutomationPolicy {
	return &models.AutomationPolicy{
		Read:      newBasicPermissionRule(readAllowed),
		Templates: newCUD(writeAllowed),
	}
}

// NewAssurancePolicy build a automation policy based on general restriction on read,write
func NewAssurancePolicy(readAllowed, writeAllowed bool) *models.AssurancePolicy {
	return &models.AssurancePolicy{
		Read:      newBasicPermissionRule(readAllowed),
		Templates: newCUD(writeAllowed),
	}
}

// NewAdministrativePolicy builds administrative policy of given user
func NewAdministrativePolicy(isAdmin bool) *models.AdministrativePolicy {
	return &models.AdministrativePolicy{
		Access: newBasicPermissionRule(isAdmin),
	}
}

func appendBasicPermissionRule(rule *models.BasicPermissionRule, addRule *models.BasicPermissionRuleInput) *models.BasicPermissionRule {
	if addRule != nil && allowedEnums[addRule.IsAllowed] >= allowedEnums[rule.IsAllowed] {
		rule.IsAllowed = addRule.IsAllowed
	}
	return rule
}

func appendTopLevelLocationPermissionRuleInput(
	rule *models.LocationPermissionRuleInput, bottomRule *models.BasicPermissionRuleInput) *models.LocationPermissionRuleInput {
	if bottomRule == nil || bottomRule.IsAllowed == models.PermissionValueNo {
		return &models.LocationPermissionRuleInput{IsAllowed: models.PermissionValueNo}
	}
	return rule
}

func appendLocationPermissionRule(rule *models.LocationPermissionRule, addRule *models.LocationPermissionRuleInput) *models.LocationPermissionRule {
	if addRule == nil {
		return rule
	}
	if allowedEnums[addRule.IsAllowed] >= allowedEnums[rule.IsAllowed] {
		rule.IsAllowed = addRule.IsAllowed
	}
	switch rule.IsAllowed {
	case models.PermissionValueYes:
		rule.LocationTypeIds = nil
	case models.PermissionValueNo:
		rule.LocationTypeIds = nil
	case models.PermissionValueByCondition:
		rule.LocationTypeIds = append(rule.LocationTypeIds, addRule.LocationTypeIds...)
	}
	return rule
}

func appendDocCategoryPermissionRule(rule *models.DocumentCategoryPermissionRule, addRule *models.DocumentCategoryPermissionRuleInput) *models.DocumentCategoryPermissionRule {
	if addRule == nil {
		return rule
	}
	if allowedEnums[addRule.IsAllowed] >= allowedEnums[rule.IsAllowed] {
		rule.IsAllowed = addRule.IsAllowed
	}
	switch rule.IsAllowed {
	case models.PermissionValueYes:
		rule.DocumentCategoryIds = nil
	case models.PermissionValueNo:
		rule.DocumentCategoryIds = nil
	case models.PermissionValueByCondition:
		rule.DocumentCategoryIds = append(rule.DocumentCategoryIds, addRule.DocumentCategoryIds...)
	}
	return rule
}

func appendPropertyCategoryPermissionRule(rule *models.PropertyCategoryPermissionRule, addRule *models.PropertyCategoryPermissionRuleInput) *models.PropertyCategoryPermissionRule {
	if addRule == nil {
		return rule
	}
	if allowedEnums[addRule.IsAllowed] >= allowedEnums[rule.IsAllowed] {
		rule.IsAllowed = addRule.IsAllowed
	}
	switch rule.IsAllowed {
	case models.PermissionValueYes:
		rule.PropertyCategoryIds = nil
	case models.PermissionValueNo:
		rule.PropertyCategoryIds = nil
	case models.PermissionValueByCondition:
		rule.PropertyCategoryIds = append(rule.PropertyCategoryIds, addRule.PropertyCategoryIds...)
	}
	return rule
}

func appendTopLevelWorkforcePermissionRuleInput(
	rule *models.WorkforcePermissionRuleInput, bottomRule *models.BasicPermissionRuleInput) *models.WorkforcePermissionRuleInput {
	if bottomRule == nil || bottomRule.IsAllowed == models.PermissionValueNo {
		return &models.WorkforcePermissionRuleInput{IsAllowed: models.PermissionValueNo}
	}
	return rule
}

func appendWorkforcePermissionRule(rule *models.WorkforcePermissionRule, addRule *models.WorkforcePermissionRuleInput) *models.WorkforcePermissionRule {
	if addRule == nil {
		return rule
	}
	if allowedEnums[addRule.IsAllowed] >= allowedEnums[rule.IsAllowed] {
		rule.IsAllowed = addRule.IsAllowed
	}
	switch rule.IsAllowed {
	case models.PermissionValueYes:
		rule.WorkOrderTypeIds = nil
		rule.ProjectTypeIds = nil
		if addRule.OrganizationIds != nil {
			rule.OrganizationIds = append(rule.OrganizationIds, addRule.OrganizationIds...)
		} else {
			rule.OrganizationIds = nil
		}
	case models.PermissionValueNo:
		rule.WorkOrderTypeIds = nil
		rule.ProjectTypeIds = nil
		rule.OrganizationIds = nil
	case models.PermissionValueByCondition:
		rule.WorkOrderTypeIds = append(rule.WorkOrderTypeIds, addRule.WorkOrderTypeIds...)
		rule.ProjectTypeIds = append(rule.ProjectTypeIds, addRule.ProjectTypeIds...)
		rule.OrganizationIds = append(rule.OrganizationIds, addRule.OrganizationIds...)
	}
	return rule
}

func appendCUD(cud *models.Cud, addCUD *models.BasicCUDInput) *models.Cud {
	if addCUD == nil {
		return cud
	}
	cud.Create = appendBasicPermissionRule(cud.Create, addCUD.Create)
	cud.Delete = appendBasicPermissionRule(cud.Delete, addCUD.Delete)
	cud.Update = appendBasicPermissionRule(cud.Update, addCUD.Update)
	return cud
}

func appendLocationCUD(cud *models.LocationCud, addCUD *models.LocationCUDInput) *models.LocationCud {
	if addCUD == nil {
		return cud
	}
	cud.Create = appendLocationPermissionRule(
		cud.Create, appendTopLevelLocationPermissionRuleInput(addCUD.Update, addCUD.Create))
	cud.Update = appendLocationPermissionRule(cud.Update, addCUD.Update)
	cud.Delete = appendLocationPermissionRule(
		cud.Delete, appendTopLevelLocationPermissionRuleInput(addCUD.Update, addCUD.Delete))
	return cud
}

func appendDocCategoryCUD(cud *models.DocumentCategoryCud, addCUD *models.DocumentCategoryCUDInput) *models.DocumentCategoryCud {
	if addCUD == nil {
		return cud
	}
	cud.LocationTypeID = addCUD.LocationTypeID
	cud.Read = appendDocCategoryPermissionRule(cud.Read, addCUD.Read)
	cud.Create = appendDocCategoryPermissionRule(cud.Create, addCUD.Create)
	cud.Update = appendDocCategoryPermissionRule(cud.Update, addCUD.Update)
	cud.Delete = appendDocCategoryPermissionRule(cud.Delete, addCUD.Delete)
	return cud
}

func appendPropertyCategoryCUD(cud *models.PropertyCategoryCud, addCUD *models.PropertyCategoryCUDInput) *models.PropertyCategoryCud {
	if addCUD == nil {
		return cud
	}
	cud.Read = appendPropertyCategoryPermissionRule(cud.Read, addCUD.Read)
	cud.Create = appendPropertyCategoryPermissionRule(cud.Create, addCUD.Create)
	cud.Update = appendPropertyCategoryPermissionRule(cud.Update, addCUD.Update)
	cud.Delete = appendPropertyCategoryPermissionRule(cud.Delete, addCUD.Delete)
	return cud
}

func appendWorkforceCUD(cud *models.WorkforceCud, readRule *models.WorkforcePermissionRuleInput, addCUD *models.WorkforceCUDInput) *models.WorkforceCud {
	if addCUD == nil {
		return cud
	}
	cud.Create = appendWorkforcePermissionRule(cud.Create, appendTopLevelWorkforcePermissionRuleInput(readRule, addCUD.Create))
	cud.Delete = appendWorkforcePermissionRule(cud.Delete, appendTopLevelWorkforcePermissionRuleInput(readRule, addCUD.Delete))
	cud.Update = appendWorkforcePermissionRule(cud.Update, appendTopLevelWorkforcePermissionRuleInput(readRule, addCUD.Update))
	cud.Assign = appendWorkforcePermissionRule(cud.Assign, appendTopLevelWorkforcePermissionRuleInput(readRule, addCUD.Assign))
	cud.TransferOwnership = appendWorkforcePermissionRule(
		cud.TransferOwnership, appendTopLevelWorkforcePermissionRuleInput(readRule, addCUD.TransferOwnership))
	return cud
}

// AppendInventoryPolicies append a list of inventory policy inputs to a inventory policy
func AppendInventoryPolicies(policy *models.InventoryPolicy, inputs ...*models.InventoryPolicyInput) *models.InventoryPolicy {
	for _, input := range inputs {
		if input == nil {
			continue
		}
		policy.Read = appendBasicPermissionRule(policy.Read, input.Read)
		policy.Location = appendLocationCUD(policy.Location, input.Location)
		policy.Equipment = appendCUD(policy.Equipment, input.Equipment)
		policy.EquipmentType = appendCUD(policy.EquipmentType, input.EquipmentType)
		policy.LocationType = appendCUD(policy.LocationType, input.LocationType)
		policy.PortType = appendCUD(policy.PortType, input.PortType)
		policy.ServiceType = appendCUD(policy.ServiceType, input.ServiceType)
		policy.DocumentCategory = appendDocCategoryCUD(policy.DocumentCategory, input.DocumentCategory)
		policy.PropertyCategory = appendPropertyCategoryCUD(policy.PropertyCategory, input.PropertyCategory)
	}
	return policy
}

// AppendInventoryPolicies append a list of workforce policy inputs to a workforce policy
func AppendWorkforcePolicies(policy *models.WorkforcePolicy, inputs ...*models.WorkforcePolicyInput) *models.WorkforcePolicy {
	for _, input := range inputs {
		if input == nil {
			continue
		}
		policy.Read = appendWorkforcePermissionRule(policy.Read, input.Read)
		policy.Data = appendWorkforceCUD(policy.Data, input.Read, input.Data)
		policy.Templates = appendCUD(policy.Templates, input.Templates)
	}
	return policy
}

// AppendAutomationPolicies append a list of workforce policy inputs to a workforce policy
func AppendAutomationPolicies(policy *models.AutomationPolicy, inputs ...*models.AutomationPolicyInput) *models.AutomationPolicy {
	for _, input := range inputs {
		if input == nil {
			continue
		}
		policy.Read = appendBasicPermissionRule(policy.Read, input.Read)
		policy.Templates = appendCUD(policy.Templates, input.Templates)
	}
	return policy
}

// AppendAssurancePolicies append a list of workforce policy inputs to a workforce policy
func AppendAssurancePolicies(policy *models.AssurancePolicy, inputs ...*models.AssurancePolicyInput) *models.AssurancePolicy {
	for _, input := range inputs {
		if input == nil {
			continue
		}
		policy.Read = appendBasicPermissionRule(policy.Read, input.Read)
		policy.Templates = appendCUD(policy.Templates, input.Templates)
	}
	return policy
}

func permissionPolicies(ctx context.Context, v *viewer.UserViewer) (*models.InventoryPolicy, *models.WorkforcePolicy, *models.AutomationPolicy, *models.AssurancePolicy, error) {
	client := ent.FromContext(ctx)
	userID := v.User().ID
	inventoryPolicy := NewInventoryPolicy(false)
	workforcePolicy := NewWorkforcePolicy(false, false)
	automationPolicy := NewAutomationPolicy(false, false)
	assurancePolicy := NewAssurancePolicy(false, false)
	policies, err := client.PermissionsPolicy.Query().
		Where(permissionspolicy.Or(
			permissionspolicy.IsGlobal(true),
			permissionspolicy.HasGroupsWith(
				usersgroup.HasMembersWith(user.ID(userID)),
				usersgroup.StatusEQ(usersgroup.StatusActive),
			))).
		All(ctx)
	if err != nil {
		return nil, nil, nil, nil, fmt.Errorf("cannot query policies: %w", err)
	}
	for _, policy := range policies {
		switch {
		case policy.InventoryPolicy != nil:
			inventoryPolicy = AppendInventoryPolicies(inventoryPolicy, policy.InventoryPolicy)
		case policy.WorkforcePolicy != nil:
			workforcePolicy = AppendWorkforcePolicies(workforcePolicy, policy.WorkforcePolicy)
		case policy.AutomationPolicy != nil:
			automationPolicy = AppendAutomationPolicies(automationPolicy, policy.AutomationPolicy)
		case policy.AssurancePolicy != nil:
			assurancePolicy = AppendAssurancePolicies(assurancePolicy, policy.AssurancePolicy)
		default:
			return nil, nil, nil, nil, fmt.Errorf("empty policy found: %d", policy.ID)
		}
	}
	return inventoryPolicy, workforcePolicy, automationPolicy, assurancePolicy, nil
}

// Permissions builds the aggregated permissions for the given viewer
func Permissions(ctx context.Context) (*models.PermissionSettings, error) {
	var err error
	v := viewer.FromContext(ctx)
	fullPermissions := userHasFullPermissions(v)
	var (
		inventoryPolicy  *models.InventoryPolicy
		workforcePolicy  *models.WorkforcePolicy
		automationPolicy *models.AutomationPolicy
		assurancePolicy  *models.AssurancePolicy
	)
	if fullPermissions {
		inventoryPolicy = NewInventoryPolicy(true)
		workforcePolicy = NewWorkforcePolicy(true, true)
		automationPolicy = NewAutomationPolicy(true, true)
		assurancePolicy = NewAssurancePolicy(true, true)
	} else if uv, ok := v.(*viewer.UserViewer); ok {
		inventoryPolicy, workforcePolicy, automationPolicy, assurancePolicy, err = permissionPolicies(ctx, uv)
		if err != nil {
			return nil, err
		}
	} else {
		inventoryPolicy = NewInventoryPolicy(false)
		workforcePolicy = NewWorkforcePolicy(false, false)
		automationPolicy = NewAutomationPolicy(false, false)
		assurancePolicy = NewAssurancePolicy(false, false)
	}
	res := models.PermissionSettings{
		AdminPolicy:      NewAdministrativePolicy(fullPermissions),
		InventoryPolicy:  inventoryPolicy,
		WorkforcePolicy:  workforcePolicy,
		AutomationPolicy: automationPolicy,
		AssurancePolicy:  assurancePolicy,
	}
	return &res, nil
}

func FullPermissions() *models.PermissionSettings {
	return &models.PermissionSettings{
		AdminPolicy:      NewAdministrativePolicy(true),
		InventoryPolicy:  NewInventoryPolicy(true),
		WorkforcePolicy:  NewWorkforcePolicy(true, true),
		AutomationPolicy: NewAutomationPolicy(true, true),
		AssurancePolicy:  NewAssurancePolicy(true, true),
	}
}

func EmptyPermissions() *models.PermissionSettings {
	return &models.PermissionSettings{
		AdminPolicy:      NewAdministrativePolicy(false),
		InventoryPolicy:  NewInventoryPolicy(false),
		WorkforcePolicy:  NewWorkforcePolicy(false, false),
		AutomationPolicy: NewAutomationPolicy(false, false),
		AssurancePolicy:  NewAssurancePolicy(false, false),
	}
}

func AdminPermissions() *models.PermissionSettings {
	return &models.PermissionSettings{
		AdminPolicy:      NewAdministrativePolicy(true),
		InventoryPolicy:  NewInventoryPolicy(false),
		WorkforcePolicy:  NewWorkforcePolicy(false, false),
		AutomationPolicy: NewAutomationPolicy(false, false),
		AssurancePolicy:  NewAssurancePolicy(false, false),
	}
}
