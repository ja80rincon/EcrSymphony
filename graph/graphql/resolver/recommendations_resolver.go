// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/recommendations"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type recommendationsResolver struct{}

func (recommendationsResolver) RecommendationsSources(ctx context.Context, recommendations *ent.Recommendations) (*ent.RecommendationsSources, error) {
	variable, err := recommendations.RecomendationSources(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (recommendationsResolver) RecommendationsCategory(ctx context.Context, recommendations *ent.Recommendations) (*ent.RecommendationsCategory, error) {
	variable, err := recommendations.RecomendationCategory(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (recommendationsResolver) Vendor(ctx context.Context, recommendations *ent.Recommendations) (*ent.Vendor, error) {
	variable, err := recommendations.VendorsRecomendations(ctx)
	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddRecommendations(ctx context.Context, input models.AddRecommendationsInput) (*ent.Recommendations, error) {
	client := r.ClientFrom(ctx)
	typ, err := client.
		Recommendations.Create().
		SetExternalId(input.ExternalID).
		SetResource(input.Resource).
		SetAlarmType(input.AlarmType).
		SetShortDescription(input.ShortDescription).
		SetLongDescription(input.LongDescription).
		SetNillableCommand(input.Command).
		SetPriority(input.Priority).
		SetStatus(input.Status).
		SetNillableUsed(input.Used).
		SetNillableRunbook(input.Runbook).
		SetRecomendationSourcesID(input.RecommendationsSources).
		SetRecomendationCategoryID(input.RecommendationsCategory).
		SetUserCreateID(input.UserCreate).
		SetNillableUserApprobedID(input.UserApprobed).
		SetVendorsRecomendationsID(input.Vendor).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) AddRecommendationsList(ctx context.Context, input models.AddRecommendationsListInput) ([]*ent.Recommendations, error) {
	var list []*ent.Recommendations
	logger := r.logger.For(ctx)
	for _, recommendation := range input.Recommendations {
		recommend, err := r.AddRecommendations(ctx, *recommendation)
		if err != nil {
			for _, deleting := range list {
				_, e := r.RemoveRecommendations(ctx, deleting.ID)
				logger.Info("recommendation removed " + fmt.Sprint(e))
			}
			return nil, fmt.Errorf("has occurred error on process: %w", err)
		}
		list = append(list, recommend)
	}
	return list, nil
}

func (r mutationResolver) RemoveRecommendations(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.Recommendations.Query().
		Where(
			recommendations.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados
	if err := client.Recommendations.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

// nolint: funlen
func (r mutationResolver) EditRecommendations(ctx context.Context, input models.EditRecommendationsInput) (*ent.Recommendations, error) {
	client := r.ClientFrom(ctx)
	et, err := client.Recommendations.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	var vendorid, categoryid, sourceid int
	var approvedid *int
	var external, resource, alarm, short, long, priority, command, status, rumbook, used = et.ExternalId,
		et.Resource, et.AlarmType, et.ShortDescription, et.LongDescription,
		et.Priority, et.Command, et.Status, et.Runbook, et.Used
	var vendor, err1 = et.VendorsRecomendations(ctx)
	if err1 != nil {
		return nil, errors.Wrap(err1, "has occurred error on process: %w")
	} else if vendor != nil {
		vendorid = vendor.ID
	}
	var userApprobed, err2 = et.UserApprobed(ctx)
	if err2 != nil {
		return nil, errors.Wrap(err2, "has occurred error on process: %w")
	} else if userApprobed != nil {
		approvedid = &userApprobed.ID
	}
	var recommendationsCategory, err3 = et.RecomendationCategory(ctx)
	if err3 != nil {
		return nil, errors.Wrap(err3, "has occurred error on process: %w")
	} else if recommendationsCategory != nil {
		categoryid = recommendationsCategory.ID
	}
	var recommendationsSources, err4 = et.RecomendationSources(ctx)
	if err3 != nil {
		return nil, errors.Wrap(err4, "has occurred error on process: %w")
	} else if recommendationsSources != nil {
		sourceid = recommendationsSources.ID
	}

	var change = false
	if external != input.ExternalID {
		external = input.ExternalID
		change = true
	}
	if resource != input.Resource {
		resource = input.Resource
		change = true
	}
	if alarm != input.AlarmType {
		alarm = input.AlarmType
		change = true
	}
	if short != input.ShortDescription {
		short = input.ShortDescription
		change = true
	}
	if long != input.LongDescription {
		long = input.LongDescription
		change = true
	}
	if priority != input.Priority {
		priority = input.Priority
		change = true
	}
	if command != input.Command {
		command = input.Command
		change = true
	}
	if input.Used != nil && ((used != nil && *used != *input.Used) || used == nil) {
		*used = *input.Used
		change = true
	}
	if input.Runbook != nil && ((rumbook != nil && *rumbook != *input.Runbook) || rumbook == nil) {
		*rumbook = *input.Runbook
		change = true
	}
	if input.Status != status {
		status = input.Status
		change = true
	}
	if (vendor != nil && vendor.ID != input.Vendor) || vendor == nil {
		vendorid = input.Vendor
		change = true
	}
	if input.UserApprobed != nil && (userApprobed == nil || (userApprobed != nil && userApprobed.ID != *input.UserApprobed)) {
		*approvedid = *input.UserApprobed
		change = true
	}
	if (recommendationsCategory != nil && recommendationsCategory.ID != input.RecommendationsCategory) || recommendationsCategory == nil {
		categoryid = input.RecommendationsCategory
		change = true
	}
	if (recommendationsSources != nil && recommendationsSources.ID != input.RecommendationsSources) || recommendationsSources == nil {
		sourceid = input.RecommendationsSources
		change = true
	}

	if change {
		if et, err = client.Recommendations.
			UpdateOne(et).
			SetExternalId(external).
			SetResource(resource).
			SetAlarmType(alarm).
			SetShortDescription(short).
			SetLongDescription(long).
			SetNillableCommand(command).
			SetPriority(priority).
			SetStatus(status).
			SetNillableUsed(used).
			SetNillableRunbook(rumbook).
			SetRecomendationSourcesID(sourceid).
			SetRecomendationCategoryID(categoryid).
			SetNillableUserApprobedID(approvedid).
			SetVendorsRecomendationsID(vendorid).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}

	// TODO: editar los edges relacionados

	return et, nil
}
