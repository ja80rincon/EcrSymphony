// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package authz

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/authz/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/ent/propertycategory"
)

// PropertyCategoryWritePolicyRule grants write permission to Property Category based on policy.
func PropertyCategoryWritePolicyRule() privacy.MutationRule {
	return privacy.PropertyCategoryMutationRuleFunc(func(ctx context.Context, m *ent.PropertyCategoryMutation) error {
		return privacy.Allow
	})
}

// PropertyCategoryReadPolicyRule grants read permission to property category based on policy.
func PropertyCategoryReadPolicyRule() privacy.QueryRule {
	return privacy.PropertyCategoryQueryRuleFunc(func(ctx context.Context, q *ent.PropertyCategoryQuery) error {
		propCatPredicates := PropertyCategoryReadPredicate(ctx)
		if propCatPredicates != nil {
			q.Where(propCatPredicates)
		}
		return privacy.Skip
	})
}

// PropertyCategoryReadPredicate return predicates on property category
func PropertyCategoryReadPredicate(ctx context.Context) predicate.PropertyCategory {
	var predicates []predicate.PropertyCategory
	rule := FromContext(ctx).InventoryPolicy.PropertyCategory.Read
	switch rule.IsAllowed {
	case models.PermissionValueYes:
		return nil
	case models.PermissionValueNo:
		predicates = append(predicates, propertycategory.And(
			propertycategory.Not(propertycategory.HasPropertiesType()),
			propertycategory.IDIn(rule.PropertyCategoryIds...)),
		)
	case models.PermissionValueByCondition:
		predicates = append(predicates, propertycategory.IDIn(rule.PropertyCategoryIds...))
	}
	return propertycategory.Or(predicates...)
}
