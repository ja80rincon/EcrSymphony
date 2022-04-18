// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	models2 "github.com/facebookincubator/symphony/pkg/authz/models"

	"github.com/facebookincubator/symphony/graph/resolverutil"
	"github.com/pkg/errors"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type permissionsPolicyResolver struct{}

func (r permissionsPolicyResolver) Policy(_ context.Context, obj *ent.PermissionsPolicy) (models2.SystemPolicy, error) {
	switch {
	case obj.InventoryPolicy != nil:
		return authz.AppendInventoryPolicies(
			authz.NewInventoryPolicy(false),
			obj.InventoryPolicy), nil
	case obj.WorkforcePolicy != nil:
		return authz.AppendWorkforcePolicies(
			authz.NewWorkforcePolicy(false, false),
			obj.WorkforcePolicy), nil
	case obj.AutomationPolicy != nil:
		return authz.AppendAutomationPolicies(
			authz.NewAutomationPolicy(false, false),
			obj.AutomationPolicy), nil
	case obj.AssurancePolicy != nil:
		return authz.AppendAssurancePolicies(
			authz.NewAssurancePolicy(false, false),
			obj.AssurancePolicy), nil
	default:
		return nil, fmt.Errorf("policy not found")
	}
}

func (mutationResolver) AddPermissionsPolicy(
	ctx context.Context,
	input models.AddPermissionsPolicyInput,
) (*ent.PermissionsPolicy, error) {
	client := ent.FromContext(ctx)
	mutation := client.PermissionsPolicy.Create().
		SetName(input.Name).
		SetNillableDescription(input.Description).
		SetNillableIsGlobal(input.IsGlobal)
	if input.Groups != nil {
		mutation = mutation.AddGroupIDs(input.Groups...)
	}
	var exist = 0
	if input.InventoryInput != nil {
		exist++
	}
	if input.WorkforceInput != nil {
		exist++
	}
	if input.AutomationInput != nil {
		exist++
	}
	if input.AssuranceInput != nil {
		exist++
	}

	if exist > 1 {
		return nil, fmt.Errorf("policy cannot be of different types")
	}

	/*if (input.InventoryInput != nil && input.WorkforceInput != nil && input.AutomationInput == nil) ||
		(input.InventoryInput != nil && input.WorkforceInput == nil && input.AutomationInput != nil) ||
		(input.InventoryInput == nil && input.WorkforceInput != nil && input.AutomationInput != nil) {
		return nil, fmt.Errorf("policy cannot be of different types")
	}*/
	switch {
	case input.InventoryInput != nil:
		mutation.SetInventoryPolicy(input.InventoryInput)
	case input.WorkforceInput != nil:
		mutation.SetWorkforcePolicy(input.WorkforceInput)
	case input.AutomationInput != nil:
		mutation.SetAutomationPolicy(input.AutomationInput)
	case input.AssuranceInput != nil:
		mutation.SetAssurancePolicy(input.AssuranceInput)
	default:
		return nil, fmt.Errorf("no policy found in input")
	}
	policy, err := mutation.Save(ctx)
	if ent.IsConstraintError(err) {
		return nil, gqlerror.Errorf("A policy with the given name already exists: %s", input.Name)
	}
	return policy, err
}

func (mutationResolver) EditPermissionsPolicy(
	ctx context.Context,
	input models.EditPermissionsPolicyInput,
) (*ent.PermissionsPolicy, error) {
	client := ent.FromContext(ctx)
	p, err := client.PermissionsPolicy.Get(ctx, input.ID)
	if err != nil {
		return nil, fmt.Errorf("querying permissionsPolicy %q: %w", input.ID, err)
	}
	upd := client.PermissionsPolicy.
		UpdateOne(p).
		SetNillableDescription(input.Description).
		SetNillableIsGlobal(input.IsGlobal)
	if input.Name != nil {
		upd = upd.SetName(*input.Name)
	}
	if input.Groups != nil {
		currentGroups, err := client.PermissionsPolicy.QueryGroups(p).IDs(ctx)
		if err != nil {
			return nil, errors.Wrapf(err, "querying groups of permissionPolicy %q", input.ID)
		}
		addGroupIds, removeGroupIds := resolverutil.GetDifferenceBetweenSlices(currentGroups, input.Groups)
		upd = upd.
			AddGroupIDs(addGroupIds...).
			RemoveGroupIDs(removeGroupIds...)
	}

	var exist = 0
	if input.InventoryInput != nil {
		exist++
	}
	if input.WorkforceInput != nil {
		exist++
	}
	if input.AutomationInput != nil {
		exist++
	}
	if input.AssuranceInput != nil {
		exist++
	}

	if exist > 1 {
		return nil, fmt.Errorf("policy cannot be of different types")
	}

	switch {
	case input.InventoryInput != nil && p.InventoryPolicy != nil:
		upd.SetInventoryPolicy(input.InventoryInput)
	case input.WorkforceInput != nil && p.WorkforcePolicy != nil:
		upd.SetWorkforcePolicy(input.WorkforceInput)
	case input.AutomationInput != nil && p.AutomationPolicy != nil:
		upd.SetAutomationPolicy(input.AutomationInput)
	case input.AssuranceInput != nil && p.AssurancePolicy != nil:
		upd.SetAssurancePolicy(input.AssuranceInput)
	}
	p, err = upd.Save(ctx)

	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("A policy with the name %v already exists", *input.Name)
		}
		return nil, fmt.Errorf("updating permissionsPolicy %q: %w", input.ID, err)
	}
	return p, nil
}

func (r mutationResolver) DeletePermissionsPolicy(ctx context.Context, id int) (bool, error) {
	client := r.ClientFrom(ctx)
	if err := client.PermissionsPolicy.DeleteOneID(id).Exec(ctx); err != nil {
		if ent.IsNotFound(err) {
			return false, gqlerror.Errorf("permissionsPolicy doesn't exist")
		}
		return false, fmt.Errorf("deleting permissionsPolicy: %w", err)
	}
	return true, nil
}
