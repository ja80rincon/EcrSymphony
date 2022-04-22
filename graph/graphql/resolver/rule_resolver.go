// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/rule"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type ruleResolver struct{}

func (ruleResolver) RuleLimit(ctx context.Context, rule *ent.Rule) ([]*ent.RuleLimit, error) {
	variable, err := rule.Rulelimitrule(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}
func (ruleResolver) RuleType(ctx context.Context, rule *ent.Rule) (*ent.RuleType, error) {
	variable, err := rule.Ruletype(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (ruleResolver) EventSeverity(ctx context.Context, rule *ent.Rule) (*ent.EventSeverity, error) {
	variable, err := rule.Eventseverity(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddRule(ctx context.Context, input models.AddRuleInput) (*ent.Rule, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		Rule.Create().
		SetName(input.Name).
		SetGracePeriod(input.GracePeriod).
		SetStartDateTime(input.StartDateTime).
		SetEndDateTime(input.EndDateTime).
		SetThresholdID(input.Threshold).
		SetRuletypeID(input.RuleType).
		SetStatus(input.Status).
		SetNillableEventTypeName(input.EventTypeName).
		SetNillableSpecificProblem(input.SpecificProblem).
		SetNillableAdditionalInfo(input.AdditionalInfo).
		SetEventseverityID(input.EventSeverity).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveRule(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.Rule.Query().
		Where(
			rule.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados

	if err := client.Rule.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditRule(ctx context.Context, input models.EditRuleInput) (*ent.Rule, error) {
	client := r.ClientFrom(ctx)
	et, err := client.Rule.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	var eventSeverityid, rtypeid, thresholdid int
	var name, start, end, grace, tpe, problem, info, status = et.Name, et.StartDateTime, et.EndDateTime, et.GracePeriod,
		et.EventTypeName, et.SpecificProblem, et.AdditionalInfo, et.Status
	var event, err1 = et.Eventseverity(ctx)
	if err1 != nil {
		return nil, errors.Wrap(err1, "has occurred error on process: %w")
	} else if event != nil {
		eventSeverityid = event.ID
	}
	var rtype, err2 = et.Ruletype(ctx)
	if err2 != nil {
		return nil, errors.Wrap(err2, "has occurred error on process: %w")
	} else if rtype != nil {
		rtypeid = rtype.ID
	}
	var threshold, err3 = et.Threshold(ctx)
	if err3 != nil {
		return nil, errors.Wrap(err3, "has occurred error on process: %w")
	} else if threshold != nil {
		thresholdid = threshold.ID
	}

	var change = false
	if name != input.Name {
		name = input.Name
		change = true
	}
	if start != *input.StartDateTime {
		start = *input.StartDateTime
		change = true
	}
	if end != *input.EndDateTime {
		end = *input.EndDateTime
		change = true
	}
	if grace != *input.GracePeriod {
		grace = *input.GracePeriod
		change = true
	}
	if (event != nil && event.ID != input.EventSeverity) || event == nil {
		eventSeverityid = input.EventSeverity
		change = true
	}
	if (rtype != nil && rtype.ID != input.RuleType) || rtype == nil {
		rtypeid = input.RuleType
		change = true
	}
	if (threshold != nil && threshold.ID != input.Threshold) || threshold == nil {
		thresholdid = input.Threshold
		change = true
	}
	if input.Status != status {
		status = input.Status
		change = true
	}
	if input.EventTypeName != nil && ((tpe != nil && *tpe != *input.EventTypeName) || tpe == nil) {
		*tpe = *input.EventTypeName
		change = true
	}
	if input.SpecificProblem != nil && ((problem != nil && *problem != *input.SpecificProblem) || problem == nil) {
		*problem = *input.SpecificProblem
		change = true
	}
	if input.AdditionalInfo != nil && ((info != nil && *info != *input.AdditionalInfo) || info == nil) {
		*info = *input.AdditionalInfo
		change = true
	}

	if change {
		if et, err = client.Rule.
			UpdateOne(et).
			SetName(name).
			SetGracePeriod(grace).
			SetStartDateTime(start).
			SetEndDateTime(end).
			SetThresholdID(thresholdid).
			SetRuletypeID(rtypeid).
			SetStatus(status).
			SetNillableEventTypeName(tpe).
			SetNillableSpecificProblem(problem).
			SetNillableAdditionalInfo(info).
			SetEventseverityID(eventSeverityid).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
