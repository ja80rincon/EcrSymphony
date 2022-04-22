// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/ctxgroup"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"

	"github.com/facebookincubator/symphony/pkg/ent/link"

	"github.com/pkg/errors"

	"go.uber.org/zap"

	"github.com/facebookincubator/symphony/pkg/ent"
)

func generateCRLRows(ctx context.Context, logger *zap.Logger, workOrder *ent.WorkOrder) ([][]string, error) {
	var (
		err                error
		headerA            = []string{"Link State", "Equipment Name A", "Port Name A", "Port Type A"}
		headerB            = []string{"Equipment Name B", "Port Name B", "Port Type B"}
		portAPropertyTypes []string
		portBPropertyTypes []string
		linkPropertyTypes  []string
	)
	client := ent.FromContext(ctx)
	links, err := client.Link.Query().
		Where(link.And(
			link.HasWorkOrderWith(workorder.IDEQ(workOrder.ID)),
			link.FutureStateNotNil())).
		WithPorts().
		All(ctx)
	if err != nil {
		logger.Error("cannot find links", zap.Error(err))
		return nil, errors.Wrap(err, "cannot find links")
	}
	portAIds := make([]int, len(links))
	portBIds := make([]int, len(links))
	for i, currLink := range links {
		if len(currLink.Edges.Ports) != 2 {
			logger.Error(fmt.Sprintf("the link with id %d has invalid number of ports", currLink.ID))
			continue
		}
		portAIds[i] = currLink.Edges.Ports[0].ID
		portBIds[i] = currLink.Edges.Ports[1].ID
	}
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	cg.Go(func(ctx context.Context) (err error) {
		portAPropertyTypes, err = PropertyTypesSlice(ctx, portAIds, client, enum.PropertyEntityPort)
		if err != nil {
			logger.Error("cannot query property types", zap.Error(err))
			return errors.Wrap(err, "cannot query property types")
		}
		return nil
	})
	cg.Go(func(ctx context.Context) (err error) {
		portBPropertyTypes, err = PropertyTypesSlice(ctx, portBIds, client, enum.PropertyEntityPort)
		if err != nil {
			logger.Error("cannot query property types", zap.Error(err))
			return errors.Wrap(err, "cannot query property types")
		}
		return nil
	})
	cg.Go(func(ctx context.Context) (err error) {
		linkIds := make([]int, len(links))
		for i, linkItem := range links {
			linkIds[i] = linkItem.ID
		}
		linkPropertyTypes, err = PropertyTypesSlice(ctx, linkIds, client, enum.PropertyEntityLink)
		if err != nil {
			logger.Error("cannot query property types", zap.Error(err))
			return errors.Wrap(err, "cannot query property types")
		}

		return nil
	})
	if err := cg.Wait(); err != nil {
		return nil, err
	}
	headerA = append(headerA, portAPropertyTypes...)
	headerB = append(headerB, portBPropertyTypes...)
	allrows := make([][]string, len(links)+1)
	allrows[0] = []string{headerA[0]}
	allrows[0] = append(allrows[0], linkPropertyTypes...)
	allrows[0] = append(allrows[0], headerA[1:]...)
	allrows[0] = append(allrows[0], headerB...)
	cg = ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, value := range links {
		value, i := value, i
		cg.Go(func(ctx context.Context) error {
			row, err := linkToCRLSlice(ctx, value, linkPropertyTypes, portAPropertyTypes, portBPropertyTypes)
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

func linkToCRLSlice(ctx context.Context, link *ent.Link, linkPropertyTypes, portAPropertyTypes, portBPropertyTypes []string) ([]string, error) {
	var (
		portAPropertyValues []string
		portBPropertyValues []string
		linkPropertyValues  []string
		portAName           string
		portBName           string
		portAType           string
		portBType           string
		futureState         string
	)
	ports, err := link.QueryPorts().WithParent().
		WithDefinition(func(query *ent.EquipmentPortDefinitionQuery) { query.WithEquipmentPortType() }).
		WithParent().
		All(ctx)
	if len(ports) != 2 {
		return nil, errors.New("number of ports on link is invalid")
	}
	if err != nil {
		return nil, errors.Wrap(err, "unable to find ports")
	}
	portA, portB := ports[0], ports[1]
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	cg.Go(func(ctx context.Context) error {
		values, err := PropertiesSlice(ctx, portA, portAPropertyTypes, enum.PropertyEntityPort)
		portAPropertyValues = values
		return err
	})
	cg.Go(func(ctx context.Context) error {
		values, err := PropertiesSlice(ctx, portB, portBPropertyTypes, enum.PropertyEntityPort)
		portBPropertyValues = values
		return err
	})
	cg.Go(func(ctx context.Context) error {
		linkPropertyValues, err = PropertiesSlice(ctx, link, linkPropertyTypes, enum.PropertyEntityLink)
		return err
	})
	if err := cg.Wait(); err != nil {
		return nil, err
	}
	if portA.Edges.Definition != nil {
		portAName = portA.Edges.Definition.Name
		if portA.Edges.Definition.Edges.EquipmentPortType != nil {
			portAType = portA.Edges.Definition.Edges.EquipmentPortType.Name
		}
	}
	if portB.Edges.Definition != nil {
		portBName = portB.Edges.Definition.Name
		if portB.Edges.Definition.Edges.EquipmentPortType != nil {
			portBType = portB.Edges.Definition.Edges.EquipmentPortType.Name
		}
	}
	if link.FutureState != nil {
		futureState = string(*link.FutureState)
	}
	row := []string{futureState}
	row = append(row, linkPropertyValues...)
	row = append(row, portA.Edges.Parent.Name, portAName, portAType)
	row = append(row, portAPropertyValues...)
	row = append(row, portB.Edges.Parent.Name, portBName, portBType)
	row = append(row, portBPropertyValues...)
	return row, nil
}
