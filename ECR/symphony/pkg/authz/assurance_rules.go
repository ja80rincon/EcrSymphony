// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package authz

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
)

// AssuranceTemplatesWritePolicyRule grants write permission to Flow, FlowDraft, Block, Worker based on Template policy.
func AssuranceTemplatesWritePolicyRule() privacy.MutationRule {
	return privacy.MutationRuleFunc(func(ctx context.Context, m ent.Mutation) error {
		return cudBasedRule(FromContext(ctx).AssurancePolicy.Templates, m)
	})
}

/*// AssuranceTemplatesReadPolicyRule grants read permission to activity based on policy.
func AssuranceTemplatesReadPolicyRule(a interface{}) privacy.QueryRule {
	return privacy.QueryRuleFunc(func(ctx context.Context, q ent.Query) error {
		var predicates []predicate.Item
		woPredicate := workOrderReadPredicate(ctx)
		if woPredicate != nil {
			predicates = append(predicates,
				a.Or(
					a.Not(a.HasWorkOrder()),
					a.HasWorkOrderWith(woPredicate)))
		}

		q.Where(predicates...)
		return privacy.Skip
	})
}*/
