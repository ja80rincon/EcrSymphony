// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentcategory"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/file"
	"github.com/facebookincubator/symphony/pkg/ent/link"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpoint"
	"github.com/facebookincubator/symphony/pkg/exporter"
)

type equipmentPortTypeResolver struct{}

func (equipmentPortTypeResolver) NumberOfPortDefinitions(ctx context.Context, ept *ent.EquipmentPortType) (int, error) {
	if pds, err := ept.Edges.PortDefinitionsOrErr(); !ent.IsNotLoaded(err) {
		return len(pds), nil
	}
	return ept.QueryPortDefinitions().Count(ctx)
}

type equipmentTypeResolver struct{}

func (equipmentTypeResolver) Category(ctx context.Context, typ *ent.EquipmentType) (*string, error) {
	c, err := typ.Edges.CategoryOrErr()
	if err == nil {
		return &c.Name, nil
	} else if ent.IsNotLoaded(err) {
		var name string
		if name, err = typ.QueryCategory().
			Select(equipmentcategory.FieldName).
			String(ctx); err == nil {
			return &name, nil
		}
	}
	return nil, ent.MaskNotFound(err)
}

func (equipmentTypeResolver) NumberOfEquipment(ctx context.Context, typ *ent.EquipmentType) (int, error) {
	if es, err := typ.Edges.EquipmentOrErr(); !ent.IsNotLoaded(err) {
		return len(es), err
	}
	return typ.QueryEquipment().Count(ctx)
}

type equipmentResolver struct{ resolver }

func (r equipmentResolver) DescendentsIncludingSelf(ctx context.Context, obj *ent.Equipment) ([]*ent.Equipment, error) {
	equip := *obj
	var err error
	var ret []*ent.Equipment
	children, err := equip.QueryPositions().QueryAttachment().All(ctx)
	if err == nil {
		for _, child := range children {
			grandChildren, err := r.DescendentsIncludingSelf(ctx, child)
			if err == nil {
				ret = append(ret, grandChildren...)
			}
		}
	}
	ret = append(ret, obj)
	return ret, err
}

func (equipmentResolver) Ports(ctx context.Context, e *ent.Equipment, availableOnly *bool) ([]*ent.EquipmentPort, error) {
	if !pointer.GetBool(availableOnly) {
		if ports, err := e.Edges.PortsOrErr(); !ent.IsNotLoaded(err) {
			return ports, err
		}
	}
	query := e.QueryPorts()
	if pointer.GetBool(availableOnly) {
		query.Where(equipmentport.Not(equipmentport.HasLink()))
	}
	return query.All(ctx)
}

func (equipmentResolver) filesOfType(ctx context.Context, e *ent.Equipment, typ file.Type) ([]*ent.File, error) {
	fds, err := e.Edges.FilesOrErr()
	if ent.IsNotLoaded(err) {
		return e.QueryFiles().
			Where(file.TypeEQ(typ)).
			All(ctx)
	}
	files := make([]*ent.File, 0, len(fds))
	for _, f := range fds {
		if f.Type == typ {
			files = append(files, f)
		}
	}
	return files, nil
}

func (r equipmentResolver) Images(ctx context.Context, e *ent.Equipment) ([]*ent.File, error) {
	return r.filesOfType(ctx, e, file.TypeImage)
}

func (r equipmentResolver) Files(ctx context.Context, e *ent.Equipment) ([]*ent.File, error) {
	return r.filesOfType(ctx, e, file.TypeFile)
}

func (equipmentResolver) PositionHierarchy(ctx context.Context, e *ent.Equipment) ([]*ent.EquipmentPosition, error) {
	var positions []*ent.EquipmentPosition
	ppos, err := e.QueryParentPosition().Only(ctx)
	if err != nil && !ent.IsNotFound(err) {
		return nil, fmt.Errorf("querying parent position: %w", err)
	}
	for ppos != nil {
		positions = append([]*ent.EquipmentPosition{ppos}, positions...)
		p, err := ppos.QueryParent().QueryParentPosition().Only(ctx)
		if err != nil && !ent.IsNotFound(err) {
			return nil, fmt.Errorf("querying parent position: %w", err)
		}

		ppos = p
	}
	return positions, nil
}

func (r equipmentResolver) FirstLocation(ctx context.Context, e *ent.Equipment) (*ent.Location, error) {
	positions, err := r.PositionHierarchy(ctx, e)
	if err != nil {
		return nil, err
	}
	var query *ent.LocationQuery
	if len(positions) > 0 {
		query = positions[0].QueryParent().QueryLocation()
	} else {
		query = e.QueryLocation()
	}
	return query.Only(ctx)
}

func (r equipmentResolver) LocationHierarchy(ctx context.Context, e *ent.Equipment) ([]*ent.Location, error) {
	positions, err := r.PositionHierarchy(ctx, e)
	if err != nil {
		return nil, err
	}
	var (
		locations []*ent.Location
		query     *ent.LocationQuery
	)
	if len(positions) > 0 {
		query = positions[0].QueryParent().QueryLocation()
	} else {
		query = e.QueryLocation()
	}
	for parent, err := query.WithParent().Only(ctx); ; {
		if err != nil {
			return nil, err
		}
		if parent == nil {
			break
		}
		locations = append([]*ent.Location{parent}, locations...)
		grandparent, err := parent.Edges.ParentOrErr()
		if ent.IsNotLoaded(err) {
			grandparent, err = parent.QueryParent().WithParent().Only(ctx)
		}
		if err != nil && !ent.IsNotFound(err) {
			return nil, err
		}
		parent = grandparent
	}
	return locations, nil
}

func (r equipmentResolver) Services(ctx context.Context, e *ent.Equipment) ([]*ent.Service, error) {
	eqPred := exporter.BuildGeneralEquipmentAncestorFilter(equipment.ID(e.ID), 1, 4)
	eids, err := r.ClientFrom(ctx).ServiceEndpoint.Query().
		Where(serviceendpoint.HasPortWith(
			equipmentport.HasParentWith(eqPred),
		)).
		IDs(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying service endpoint ids: %w", err)
	}

	services, err := r.ClientFrom(ctx).Service.Query().
		Where(service.HasEndpointsWith(
			serviceendpoint.IDIn(eids...),
		),
		).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying services where equipment port is an endpoint: %w", err)
	}
	ids := make([]int, len(services))
	for i, svc := range services {
		ids[i] = svc.ID
	}

	linkServices, err := r.ClientFrom(ctx).Service.Query().Where(
		service.HasLinksWith(link.HasPortsWith(equipmentport.HasParentWith(
			exporter.BuildGeneralEquipmentAncestorFilter(equipment.ID(e.ID), 1, 3)))),
		service.Not(service.IDIn(ids...))).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying services where equipment connected to link of service: %w", err)
	}
	return append(services, linkServices...), nil
}
