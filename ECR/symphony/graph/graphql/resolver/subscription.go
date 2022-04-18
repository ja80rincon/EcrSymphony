// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"
	"reflect"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/event"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"go.uber.org/zap"
)

type subscriptionResolver struct{ resolver }

func (r subscriptionResolver) subscribe(ctx context.Context, event string, object ev.EventObject) (interface{}, error) {
	v := viewer.FromContext(ctx)
	ptr := reflect.TypeOf(object)
	elem := ptr.Elem()
	logger := r.logger.For(ctx).With(
		zap.Object("viewer", v),
		zap.String("event", event),
		zap.String("type", elem.Name()),
	)

	receiver, err := r.event.NewReceiver(ctx, object)
	if err != nil {
		r.logger.For(ctx).Error("cannot create event receiver",
			zap.Error(err),
		)
		return nil, err
	}

	events := reflect.MakeChan(
		reflect.ChanOf(reflect.BothDir, ptr), 1,
	)
	instantiate := reflect.ValueOf(r.ClientFrom(ctx)).
		Elem().FieldByName(elem.Name()).
		MethodByName("Instantiate")
	id, _ := elem.FieldByName("ID")

	svc, err := ev.NewService(
		ev.Config{
			Receiver: receiver,
			Handler: ev.EventHandlerFunc(func(_ context.Context, evt *ev.Event) error {
				value := reflect.ValueOf(evt.Object)
				if value.Type() != ptr {
					value := value.Elem()
					logger.Error("unexpected event object type",
						zap.String("object", value.Type().Name()),
					)
					return fmt.Errorf("event object %s must be %s",
						value.Type().Name(), elem.Name(),
					)
				}
				value = instantiate.Call([]reflect.Value{value})[0]
				events.Send(value)
				logger.Debug("wrote to subscription",
					zap.Int64("id", value.Elem().FieldByIndex(id.Index).Int()),
				)
				return nil
			}),
		},
		ev.WithTenant(v.Tenant()),
		ev.WithEvent(event),
		ev.WithMaxConcurrency(1),
	)
	if err != nil {
		logger.Error("cannot create event service",
			zap.Error(err),
		)
		return nil, err
	}

	go func() {
		defer func() {
			events.Close()
			ctx, cancel := context.WithTimeout(
				context.Background(), 5*time.Second,
			)
			defer cancel()
			if err := svc.Stop(ctx); err != nil {
				logger.Error("cannot stop event service",
					zap.Error(err),
				)
			}
		}()
		err := svc.Run(ctx)
		logger.Debug("subscription terminated",
			zap.Error(err),
		)
	}()

	return events.Interface(), nil
}

func (r subscriptionResolver) WorkOrderAdded(ctx context.Context) (<-chan *ent.WorkOrder, error) {
	events, err := r.subscribe(ctx, event.WorkOrderAdded, &ent.WorkOrder{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.WorkOrder), nil
}

func (r subscriptionResolver) WorkOrderDone(ctx context.Context) (<-chan *ent.WorkOrder, error) {
	events, err := r.subscribe(ctx, event.WorkOrderDone, &ent.WorkOrder{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.WorkOrder), nil
}

func (r subscriptionResolver) WorkOrderStatusChanged(ctx context.Context) (<-chan *event.WorkOrderStatusChangedPayload, error) {
	v := viewer.FromContext(ctx)
	logger := r.logger.For(ctx).With(
		zap.Object("viewer", v),
		zap.String("event", event.WorkOrderStatusChanged),
	)
	receiver, err := r.event.NewReceiver(ctx, &event.WorkOrderStatusChangedPayload{})
	if err != nil {
		logger.Error("cannot create event receiver",
			zap.Error(err),
		)
		return nil, err
	}

	instantiate := r.ClientFrom(ctx).WorkOrder.Instantiate
	events := make(chan *event.WorkOrderStatusChangedPayload, 1)
	svc, err := ev.NewService(
		ev.Config{
			Receiver: receiver,
			Handler: ev.EventHandlerFunc(func(_ context.Context, evt *ev.Event) error {
				payload := evt.Object.(*event.WorkOrderStatusChangedPayload)
				payload.WorkOrder = instantiate(payload.WorkOrder)
				events <- payload
				logger.Debug("wrote to subscription",
					zap.Int("id", payload.WorkOrder.ID),
				)
				return nil
			}),
		},
		ev.WithTenant(v.Tenant()),
		ev.WithEvent(event.WorkOrderStatusChanged),
		ev.WithMaxConcurrency(1),
	)
	if err != nil {
		logger.Error("cannot create event service",
			zap.Error(err),
		)
		return nil, err
	}

	go func() {
		defer func() {
			close(events)
			ctx, cancel := context.WithTimeout(
				context.Background(), 5*time.Second,
			)
			defer cancel()
			if err := svc.Stop(ctx); err != nil {
				logger.Error("cannot stop event service",
					zap.Error(err),
				)
			}
		}()
		err := svc.Run(ctx)
		logger.Debug("subscription terminated",
			zap.Error(err),
		)
	}()

	return events, nil
}

func (r subscriptionResolver) FlowInstanceDone(ctx context.Context) (<-chan *ent.FlowInstance, error) {
	events, err := r.subscribe(ctx, event.FlowInstanceDone, &ent.FlowInstance{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.FlowInstance), nil
}

func (r subscriptionResolver) ProjectAdded(ctx context.Context) (<-chan *ent.Project, error) {
	events, err := r.subscribe(ctx, event.ProjectAdded, &ent.Project{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.Project), nil
}

func (r subscriptionResolver) AddImage(ctx context.Context) (<-chan *ent.File, error) {
	events, err := r.subscribe(ctx, event.AddImage, &ent.File{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.File), nil
}

func (r subscriptionResolver) ProjectChanged(ctx context.Context) (<-chan *ent.Project, error) {
	events, err := r.subscribe(ctx, event.ProjectChanged, &ent.Project{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.Project), nil
}

func (r subscriptionResolver) LocationAdded(ctx context.Context) (<-chan *ent.Location, error) {
	events, err := r.subscribe(ctx, event.LocationAdded, &ent.Location{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.Location), nil
}

func (r subscriptionResolver) LocationChanged(ctx context.Context) (<-chan *ent.Location, error) {
	events, err := r.subscribe(ctx, event.LocationChanged, &ent.Location{})
	if err != nil {
		return nil, err
	}
	return events.(chan *ent.Location), nil
}
