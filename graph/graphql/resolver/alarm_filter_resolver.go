// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/alarmfilter"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type alarmFilterResolver struct{}

func (alarmFilterResolver) AlarmStatus(ctx context.Context, alarmFilter *ent.AlarmFilter) (*ent.AlarmStatus, error) {
	variable, err := alarmFilter.AlarmStatusFk(ctx)

	if err != nil {
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return variable, nil
}

func (r mutationResolver) AddAlarmFilter(ctx context.Context, input models.AddAlarmFilterInput) (*ent.AlarmFilter, error) {
	client := r.ClientFrom(ctx)

	typ, err := client.
		AlarmFilter.Create().
		SetName(input.Name).
		SetNetworkResource(input.NetworkResource).
		SetEnable(input.Enable).
		SetBeginTime(input.BeginTime).
		SetCreationTime(input.CreationTime).
		SetEndTime(input.EndTime).
		SetReason(input.Reason).
		SetUser(input.User).
		SetNillableAlarmStatusFkID(input.AlarmStatus).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, fmt.Errorf("has occurred error on process: %w", err)
	}
	return typ, nil
}

func (r mutationResolver) RemoveAlarmFilter(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	t, err := client.AlarmFilter.Query().
		Where(
			alarmfilter.ID(id),
		).
		Only(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	// TODO: borrar o editar los edges relacionados

	if err := client.AlarmFilter.DeleteOne(t).Exec(ctx); err != nil {
		return id, errors.Wrap(err, "has occurred error on process: %v")
	}
	return id, nil
}

func (r mutationResolver) EditAlarmFilter(ctx context.Context, input models.EditAlarmFilterInput) (*ent.AlarmFilter, error) {
	client := r.ClientFrom(ctx)
	et, err := client.AlarmFilter.Get(ctx, input.ID)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, gqlerror.Errorf("has occurred error on process: %v", err)
		}
		return nil, errors.Wrapf(err, "has occurred error on process: %v", err)
	}
	var statusid *int
	var name, begin, end, network, enable, reason = et.Name, et.BeginTime, et.EndTime, et.NetworkResource, et.Enable, et.Reason
	var status, err1 = et.AlarmStatusFk(ctx)
	if err != nil {
		return nil, errors.Wrap(err1, "has occurred error on process: %v")
	} else if status != nil {
		statusid = &status.ID
	}

	var change = false
	if name != input.Name {
		name = input.Name
		change = true
	}
	if begin != input.BeginTime {
		begin = input.BeginTime
		change = true
	}
	if end != input.EndTime {
		end = input.EndTime
		change = true
	}
	if network != input.NetworkResource {
		network = input.NetworkResource
		change = true
	}
	if input.AlarmStatus != nil && (status == nil || (status != nil && status.ID != *input.AlarmStatus)) {
		*statusid = *input.AlarmStatus
		change = true
	}
	if enable != input.Enable {
		enable = input.Enable
		change = true
	}
	if reason != input.Reason {
		reason = input.Reason
		change = true
	}

	if change {
		if et, err = client.AlarmFilter.
			UpdateOne(et).
			SetName(name).
			SetNetworkResource(network).
			SetEnable(enable).
			SetBeginTime(begin).
			SetEndTime(end).
			SetReason(reason).
			SetNillableAlarmStatusFkID(statusid).
			Save(ctx); err != nil {
			if ent.IsConstraintError(err) {
				return nil, gqlerror.Errorf("has occurred error on process: %v", err)
			}
			return nil, errors.Wrap(err, "has occurred error on process: %v")
		}
	}
	return et, nil
}
