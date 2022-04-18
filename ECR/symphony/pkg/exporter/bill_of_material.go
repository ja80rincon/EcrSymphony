// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"

	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func generateWoBOMRows(ctx context.Context, logger *zap.Logger, workOrder *ent.WorkOrder) ([][]string, error) {
	var (
		err    error
		header = [...]string{"Equipment Name", "Equipment Type", "State"}
	)
	client := ent.FromContext(ctx)
	equipments, err := client.Equipment.Query().
		Where(
			equipment.And(
				equipment.HasWorkOrderWith(workorder.IDEQ(workOrder.ID)),
				equipment.FutureStateNotNil()),
		).
		WithType().
		All(ctx)
	if err != nil {
		logger.Error("cannot find equipments", zap.Error(err))
		return nil, errors.Wrap(err, "cannot find equipments")
	}
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	var orderedLocTypes, locationHeaders, propertyTypes []string
	cg.Go(func(ctx context.Context) (err error) {
		orderedLocTypes, err = LocationTypeHierarchy(ctx, client)
		locationHeaders = make([]string, len(orderedLocTypes))
		if err != nil {
			logger.Error("cannot query location types", zap.Error(err))
			return errors.Wrap(err, "cannot query location types")
		}
		for i := range orderedLocTypes {
			locationHeaders[i] = fmt.Sprintf("Location (%s)", orderedLocTypes[i])
		}
		return nil
	})
	cg.Go(func(ctx context.Context) error {
		equipmentIds := make([]int, len(equipments))
		for i := range equipments {
			equipmentIds = append(equipmentIds, equipments[i].ID)
		}
		propertyTypes, err = PropertyTypesSlice(ctx, equipmentIds, client, enum.PropertyEntityEquipment)
		if err != nil {
			logger.Error("cannot query property types", zap.Error(err))
			return errors.Wrap(err, "cannot query property types")
		}
		return nil
	})
	if err = cg.Wait(); err != nil {
		return nil, err
	}
	title := append(header[:], locationHeaders...)
	title = append(title, propertyTypes...)
	allrows := make([][]string, len(equipments)+1)
	allrows[0] = title
	cg = ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, value := range equipments {
		value, i := value, i
		cg.Go(func(ctx context.Context) error {
			row, err := equipToBOMSlice(ctx, value, orderedLocTypes, propertyTypes)
			if err != nil {
				return err
			}
			allrows[i+1] = row
			return nil
		})
	}
	if err := cg.Wait(); err != nil {
		logger.Error("error in wait", zap.Error(err))
		return nil, errors.WithMessage(err, "error in wait")
	}
	return allrows, nil
}

func equipToBOMSlice(ctx context.Context, equipment *ent.Equipment, orderedLocTypes, propertyTypes []string) ([]string, error) {
	var (
		lParents          []string
		equipmentTypeName string
		propertyValues    []string
		futureState       string
	)
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	cg.Go(func(ctx context.Context) (err error) {
		lParents, err = LocationHierarchyForEquipment(ctx, equipment, orderedLocTypes)
		if err != nil {
			return err
		}
		return nil
	})
	cg.Go(func(ctx context.Context) (err error) {
		propertyValues, err = PropertiesSlice(ctx, equipment, propertyTypes, enum.PropertyEntityEquipment)
		return err
	})
	if err := cg.Wait(); err != nil {
		return nil, err
	}
	if equipment.Edges.Type != nil {
		equipmentTypeName = equipment.Edges.Type.Name
	}
	if equipment.FutureState != nil {
		futureState = string(*equipment.FutureState)
	}
	row := []string{equipment.Name, equipmentTypeName, futureState}
	row = append(row, lParents...)
	row = append(row, propertyValues...)
	return row, nil
}
