// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package authz

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/authz/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/documentcategory"
	"github.com/facebookincubator/symphony/pkg/ent/predicate"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
)

// DocumentCategoryWritePolicyRule grants write permission to Category Document based on policy.
func DocumentCategoryWritePolicyRule() privacy.MutationRule {
	return privacy.DocumentCategoryMutationRuleFunc(func(ctx context.Context, m *ent.DocumentCategoryMutation) error {
		return privacy.Allow
	})
}

// DocumentCategoryReadPolicyRule grants read permission to Category Document based on policy.
func DocumentCategoryReadPolicyRule() privacy.QueryRule {
	return privacy.DocumentCategoryQueryRuleFunc(func(ctx context.Context, q *ent.DocumentCategoryQuery) error {
		dcPredicate := DocumentCategoryReadRule(ctx)
		if dcPredicate != nil {
			q.Where(dcPredicate)
		}
		return privacy.Skip
	})
}

func DocumentCategoryReadRule(ctx context.Context) predicate.DocumentCategory {
	var predicatesDc []predicate.DocumentCategory
	rule := FromContext(ctx).InventoryPolicy.DocumentCategory.Read
	switch rule.IsAllowed {
	case models.PermissionValueYes:
		return nil
	case models.PermissionValueNo:
		predicatesDc = append(predicatesDc, documentcategory.Or(documentcategory.Not(documentcategory.HasLocationType())))
	case models.PermissionValueByCondition:
		predicatesDc = append(predicatesDc, documentcategory.IDIn(rule.DocumentCategoryIds...))
	}
	return documentcategory.Or(predicatesDc...)
}
