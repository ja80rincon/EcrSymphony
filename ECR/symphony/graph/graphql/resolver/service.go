// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpoint"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/pkg/errors"
)

type serviceTypeResolver struct{}

func (serviceTypeResolver) NumberOfServices(ctx context.Context, obj *ent.ServiceType) (int, error) {
	services, err := obj.Edges.ServicesOrErr()
	if !ent.IsNotLoaded(err) {
		return len(services), err
	}
	return obj.QueryServices().Count(ctx)
}

type serviceResolver struct{}

func (serviceResolver) Customer(ctx context.Context, obj *ent.Service) (*ent.Customer, error) {
	customers, err := obj.Customer(ctx)
	if err != nil || len(customers) == 0 {
		return nil, err
	}
	return customers[0], nil
}

func (serviceResolver) rootNode(ctx context.Context, eq *ent.Equipment) *ent.Equipment {
	parent := eq
	for parent != nil {
		p, err := parent.QueryParentPosition().QueryParent().Only(ctx)
		if err != nil {
			break
		}

		parent = p
	}

	return parent
}

func (r serviceResolver) Topology(ctx context.Context, obj *ent.Service) (*models.NetworkTopology, error) {
	eqs, err := obj.QueryLinks().QueryPorts().QueryParent().All(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "querying links equipments")
	}
	portEquipments, err := obj.QueryPorts().QueryParent().All(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "querying port equipments")
	}
	eqs = append(eqs, portEquipments...)
	var nodes []ent.Noder
	eqsMap := make(map[int]*ent.Equipment)
	for _, eq := range eqs {
		node := r.rootNode(ctx, eq)
		if _, ok := eqsMap[node.ID]; !ok {
			eqsMap[node.ID] = node
			nodes = append(nodes, node)
		}
	}

	eps, err := obj.QueryEndpoints().All(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "querying termination points")
	}

	for _, ep := range eps {
		equipment, err := ep.QueryPort().QueryParent().Only(ctx)
		if err != nil {
			if !ent.IsNotFound(err) {
				return nil, errors.Wrap(err, "querying equipment of endpoint")
			}
		} else {
			node := r.rootNode(ctx, equipment)
			if _, ok := eqsMap[node.ID]; !ok {
				nodes = append(nodes, node)
				eqsMap[node.ID] = node
			}
		}
	}

	lnks, err := obj.QueryLinks().All(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "querying service links")
	}

	var links []*models.TopologyLink

	for _, lnk := range lnks {
		leqs, err := lnk.
			QueryPorts().
			QueryParent().
			All(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "querying link equipments")
		}
		node0 := r.rootNode(ctx, leqs[0])
		node1 := r.rootNode(ctx, leqs[1])
		links = append(links, &models.TopologyLink{Type: models.TopologyLinkTypePhysical, Source: node0, Target: node1})
	}

	return &models.NetworkTopology{Nodes: nodes, Links: links}, nil
}

func (r mutationResolver) RemoveService(ctx context.Context, id int) (int, error) {
	client := r.ClientFrom(ctx)
	endpointIDs, err := client.ServiceEndpoint.Query().
		Where(serviceendpoint.HasServiceWith(service.ID(id))).
		IDs(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "querying service endpoints: id=%q", id)
	}
	for _, endpointID := range endpointIDs {
		if err := client.ServiceEndpoint.DeleteOneID(endpointID).
			Exec(ctx); err != nil {
			return id, errors.Wrapf(err, "deleting service endpoint: id=%q", endpointID)
		}
	}
	propIDs, err := client.Property.Query().
		Where(property.HasServiceWith(service.ID(id))).
		IDs(ctx)
	if err != nil {
		return id, errors.Wrapf(err, "querying service properties: id=%q", id)
	}
	for _, propID := range propIDs {
		if err := client.Property.DeleteOneID(propID).
			Exec(ctx); err != nil {
			return id, errors.Wrapf(err, "deleting service property: id=%q", propID)
		}
	}
	if err := client.Service.DeleteOneID(id).Exec(ctx); err != nil {
		return id, errors.Wrapf(err, "deleting service: id=%q", id)
	}
	return id, nil
}

func (r mutationResolver) verifyEquipmentTypeMatch(ctx context.Context, equipmentID, serviceEndpointTypeID int) error {
	client := r.ClientFrom(ctx)
	equip, err := client.Equipment.Get(ctx, equipmentID)
	if err != nil {
		return errors.Wrapf(err, "querying equipment: id=%v", equip)
	}

	sept, err := client.ServiceEndpointDefinition.Get(ctx, serviceEndpointTypeID)
	if err != nil {
		return errors.Wrapf(err, "querying service endpoint definition: id=%v", serviceEndpointTypeID)
	}
	serviceEquipmentTypeID, err := sept.QueryEquipmentType().OnlyID(ctx)
	if err != nil {
		return errors.Wrapf(err, "querying equipment type from service endpoint definition: id=%v", serviceEndpointTypeID)
	}
	portEquipmentTypeID, err := equip.QueryType().OnlyID(ctx)
	if err != nil {
		return errors.Wrapf(err, "querying equipment type from equipment: id=%v", equipmentID)
	}
	if serviceEquipmentTypeID != portEquipmentTypeID {
		return errors.Errorf("equipment type from service type (%v) and from equipment (%v) does not match", serviceEquipmentTypeID, portEquipmentTypeID)
	}
	return nil
}

func (r mutationResolver) verifyServiceMatch(ctx context.Context, serviceID, serviceEndpointTypeID int) error {
	client := r.ClientFrom(ctx)
	s, err := client.Service.Get(ctx, serviceID)
	if err != nil {
		return errors.Wrapf(err, "querying service: id=%v", serviceID)
	}

	sept, err := client.ServiceEndpointDefinition.Get(ctx, serviceEndpointTypeID)
	if err != nil {
		return errors.Wrapf(err, "querying service endpoint definition: id=%v", serviceEndpointTypeID)
	}

	serviceTypeIDFromEndpoint, err := sept.QueryServiceType().OnlyID(ctx)
	if err != nil {
		return errors.Wrapf(err, "querying service type from service endpoint definition: id=%v", serviceEndpointTypeID)
	}

	serviceTypeIDFromService, err := s.QueryType().OnlyID(ctx)
	if err != nil {
		return errors.Wrapf(err, "querying service type from service: id=%v", serviceID)
	}
	if serviceTypeIDFromEndpoint != serviceTypeIDFromService {
		return errors.Errorf("service type from service endpoint (%v) and from service (%v) does not match", serviceTypeIDFromEndpoint, serviceTypeIDFromService)
	}
	return nil
}

func (r mutationResolver) verifyEquipmentPortMatch(ctx context.Context, equipmentID, portID int) error {
	client := r.ClientFrom(ctx)
	port, err := client.EquipmentPort.Get(ctx, portID)
	if err != nil {
		return errors.Wrapf(err, "querying equipment port: id=%v", portID)
	}
	equFromPortID, err := port.QueryParent().OnlyID(ctx)
	if err != nil {
		return errors.Wrapf(err, "querying equipment from port: id=%v", portID)
	}
	if equFromPortID != equipmentID {
		return errors.Errorf("equipment input (%v) and port (%v) does not match", equipmentID, portID)
	}
	return nil
}

func (r mutationResolver) AddServiceEndpoint(ctx context.Context, input models.AddServiceEndpointInput) (*ent.Service, error) {
	client := r.ClientFrom(ctx)
	s, err := client.Service.Get(ctx, input.ID)
	if err != nil {
		return nil, errors.Wrapf(err, "querying service: id=%q", input.ID)
	}

	err = r.verifyEquipmentTypeMatch(ctx, input.EquipmentID, input.Definition)
	if err != nil {
		return nil, errors.Wrapf(err, "validating equipment type for equipment (id=%v) and service type (id=%v)", input.EquipmentID, input.Definition)
	}

	if input.PortID != nil {
		err = r.verifyEquipmentPortMatch(ctx, input.EquipmentID, *input.PortID)
		if err != nil {
			return nil, errors.Wrapf(err, "validating equipment and port match: id=%v , %v", input.EquipmentID, input.PortID)
		}
	}

	err = r.verifyServiceMatch(ctx, input.ID, input.Definition)
	if err != nil {
		return nil, errors.Wrapf(err, "validating equipment type for portZ: id=%v", input.PortID)
	}

	if _, err := client.ServiceEndpoint.
		Create().
		SetDefinitionID(input.Definition).
		SetServiceID(input.ID).
		SetEquipmentID(input.EquipmentID).
		SetNillablePortID(input.PortID).Save(ctx); err != nil {
		return nil, errors.Wrapf(err, "Creating service endpoint: service id=%q", input.ID)
	}

	return s, nil
}

func (r mutationResolver) RemoveServiceEndpoint(ctx context.Context, serviceEndpointID int) (*ent.Service, error) {
	client := r.ClientFrom(ctx)

	s, err := client.Service.Query().Where(service.HasEndpointsWith(serviceendpoint.ID(serviceEndpointID))).Only(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "query service")
	}

	if err := client.ServiceEndpoint.DeleteOneID(serviceEndpointID).Exec(ctx); err != nil {
		return nil, errors.Wrap(err, "query endpoint")
	}

	return s, nil
}

func (r mutationResolver) addServiceEndpointDefinition(ctx context.Context, input models.ServiceEndpointDefinitionInput, serviceTypeID int) (*ent.ServiceEndpointDefinition, error) {
	client := r.ClientFrom(ctx)
	ept, err := client.ServiceEndpointDefinition.
		Create().
		SetName(input.Name).
		SetIndex(input.Index).
		SetNillableRole(input.Role).
		SetEquipmentTypeID(input.EquipmentTypeID).
		SetServiceTypeID(serviceTypeID).
		Save(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "creating service endpoint definition %v: service definition id=%v", input.Name, serviceTypeID)
	}
	return ept, err
}

func (r mutationResolver) addServiceEndpointDefinitions(
	ctx context.Context, serviceTypeID int, inputs ...*models.ServiceEndpointDefinitionInput,
) error {
	var (
		client = r.ClientFrom(ctx).ServiceEndpointDefinition
		err    error
	)
	for _, input := range inputs {
		if _, err = client.Create().
			SetName(input.Name).
			SetNillableRole(input.Role).
			SetIndex(input.Index).
			SetEquipmentTypeID(input.EquipmentTypeID).
			SetServiceTypeID(serviceTypeID).
			Save(ctx); err != nil {
			return errors.Wrapf(err, "creating service endpoint definition: %v", input.Name)
		}
	}
	return nil
}
