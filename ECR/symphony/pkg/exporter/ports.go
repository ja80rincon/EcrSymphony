// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log"

	"github.com/AlekSi/pointer"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type portFilterInput struct {
	Name          enum.EquipmentFilterType `json:"name"`
	Operator      enum.FilterOperator      `jsons:"operator"`
	StringValue   string                   `json:"stringValue"`
	IDSet         []string                 `json:"idSet"`
	StringSet     []string                 `json:"stringSet"`
	PropertyValue models.PropertyTypeInput `json:"propertyValue"`
	BoolValue     bool                     `json:"boolValue"`
}

type PortsRower struct {
	Log log.Logger
}

func (er PortsRower) Rows(ctx context.Context, filtersParam string) ([][]string, error) {
	var (
		logger         = er.Log.For(ctx)
		err            error
		filterInput    []*models.PortFilterInput
		portDataHeader = [...]string{bom + "Port ID", "Port Name", "Port Type", "Equipment Name", "Equipment Type"}
		parentsHeader  = [...]string{"Parent Equipment (3)", "Parent Equipment (2)", "Parent Equipment", "Equipment Position"}
		linkHeader     = [...]string{"Linked Port ID", "Linked Port Name", "Linked Equipment ID", "Linked Equipment"}
		serviceHeader  = [...]string{"Service Names"}
	)
	if filtersParam != "" {
		filterInput, err = paramToPortFilterInput(filtersParam)
		if err != nil {
			logger.Error("cannot filter ports", zap.Error(err))
			return nil, errors.Wrap(err, "cannot filter ports")
		}
	}
	client := ent.FromContext(ctx)

	ports, err := PortSearch(ctx, client, filterInput, nil)
	if err != nil {
		logger.Error("cannot query ports", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query ports")
	}
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))

	portsList := ports.Ports
	allrows := make([][]string, len(portsList)+1)

	var orderedLocTypes, propertyTypes []string
	cg.Go(func(ctx context.Context) (err error) {
		orderedLocTypes, err = LocationTypeHierarchy(ctx, client)
		if err != nil {
			logger.Error("cannot query location types", zap.Error(err))
			return errors.Wrap(err, "cannot query location types")
		}
		return nil
	})
	cg.Go(func(ctx context.Context) (err error) {
		portIDs := make([]int, len(portsList))
		for i, p := range portsList {
			portIDs[i] = p.ID
		}
		propertyTypes, err = PropertyTypesSlice(ctx, portIDs, client, enum.PropertyEntityPort)
		if err != nil {
			logger.Error("cannot query property types", zap.Error(err))
			return errors.Wrap(err, "cannot query property types")
		}
		return nil
	})
	if err := cg.Wait(); err != nil {
		return nil, err
	}

	title := append(portDataHeader[:], orderedLocTypes...)
	title = append(title, parentsHeader[:]...)
	title = append(title, linkHeader[:]...)
	title = append(title, serviceHeader[:]...)
	title = append(title, propertyTypes...)

	allrows[0] = title
	cg = ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, value := range portsList {
		value, i := value, i
		cg.Go(func(ctx context.Context) error {
			row, err := portToSlice(ctx, value, orderedLocTypes, propertyTypes)
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

// nolint: ineffassign, funlen
func portToSlice(ctx context.Context, port *ent.EquipmentPort, orderedLocTypes []string, propertyTypes []string) ([]string, error) {
	var (
		posName              string
		lParents, properties []string
		linkData             = make([]string, 4)
		eParents             = make([]string, MaxEquipmentParents)
		serviceData          = make([]string, 2)
	)
	parentEquip, err := port.QueryParent().Only(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "querying equipment for port (id=%d)", port.ID)
	}
	portDefinition, err := port.QueryDefinition().Only(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "querying definition for port (id=%d)", port.ID)
	}
	g := ctxgroup.WithContext(ctx)

	g.Go(func(ctx context.Context) (err error) {
		lParents, err = LocationHierarchyForEquipment(ctx, parentEquip, orderedLocTypes)
		return err
	})
	g.Go(func(ctx context.Context) (err error) {
		properties, err = PropertiesSlice(ctx, port, propertyTypes, enum.PropertyEntityPort)
		return err
	})
	g.Go(func(ctx context.Context) error {
		pos, err := parentEquip.QueryParentPosition().Only(ctx)
		if err != nil && !ent.IsNotFound(err) {
			return err
		}
		err = nil
		if pos != nil {
			def, err := pos.QueryDefinition().Only(ctx)
			if err != nil {
				return err
			}
			posName = def.Name
			eParents = ParentHierarchy(ctx, *parentEquip)
		}
		return nil
	})
	g.Go(func(ctx context.Context) error {
		link, err := port.QueryLink().Only(ctx)
		if err != nil && !ent.IsNotFound(err) {
			return err
		}
		if ent.IsNotFound(err) {
			err = nil
			return nil
		}
		err = nil

		if link != nil {
			otherPort, err := link.QueryPorts().Where(equipmentport.Not(equipmentport.ID(port.ID))).Only(ctx)
			if err != nil {
				return err
			}
			otherEquip, err := otherPort.QueryParent().Only(ctx)
			if err != nil {
				return err
			}
			otherDefinition, err := otherPort.QueryDefinition().Only(ctx)
			if err != nil {
				return err
			}
			linkData = []string{
				strconv.Itoa(otherPort.ID),
				otherDefinition.Name,
				strconv.Itoa(otherEquip.ID),
				otherEquip.Name,
			}
		}
		return nil
	})
	g.Go(func(ctx context.Context) error {
		servicesStr, err := getServicesOfPortAsEndpoint(ctx, port)
		if err != nil {
			return err
		}
		// TODO T64283840: support editing services for ports (by endpoint type role)
		serviceData = []string{servicesStr}
		return nil
	})
	if err := g.Wait(); err != nil {
		return nil, err
	}

	portType := ""
	pt, err := portDefinition.QueryEquipmentPortType().Only(ctx)
	if err == nil {
		portType = pt.Name
	}
	parentType, err := parentEquip.QueryType().Only(ctx)
	if err != nil {
		return nil, err
	}

	row := []string{strconv.Itoa(port.ID), portDefinition.Name, portType, parentEquip.Name, parentType.Name}
	row = append(row, lParents...)
	row = append(row, eParents...)
	row = append(row, posName)
	row = append(row, linkData...)
	row = append(row, serviceData...)
	row = append(row, properties...)

	return row, nil
}

func getServicesOfPortAsEndpoint(ctx context.Context, port *ent.EquipmentPort) (string, error) {
	services, err := port.
		QueryEndpoints().
		QueryService().
		All(ctx)
	if err != nil {
		return "", errors.Wrapf(err, "querying port for services (id=%d)", port.ID)
	}
	var servicesList []string
	for _, service := range services {
		servicesList = append(servicesList, service.Name)
	}
	return strings.Join(servicesList, ";"), nil
}

func paramToPortFilterInput(params string) ([]*models.PortFilterInput, error) {
	var inputs []portFilterInput
	err := json.Unmarshal([]byte(params), &inputs)
	if err != nil {
		return nil, err
	}

	ret := make([]*models.PortFilterInput, 0, len(inputs))
	for _, f := range inputs {
		upperName := strings.ToUpper(f.Name.String())
		upperOp := strings.ToUpper(f.Operator.String())
		propertyValue := f.PropertyValue
		intIDSet, err := ToIntSlice(f.IDSet)
		if err != nil {
			return nil, fmt.Errorf("wrong id set %v: %w", f.IDSet, err)
		}
		inp := models.PortFilterInput{
			FilterType:    enum.PortFilterType(upperName),
			Operator:      enum.FilterOperator(upperOp),
			StringValue:   pointer.ToString(f.StringValue),
			PropertyValue: &propertyValue,
			BoolValue:     pointer.ToBool(f.BoolValue),
			IDSet:         intIDSet,
			StringSet:     f.StringSet,
			MaxDepth:      pointer.ToInt(5),
		}
		ret = append(ret, &inp)
	}
	return ret, nil
}

func PortFilter(query *ent.EquipmentPortQuery, filters []*models.PortFilterInput) (*ent.EquipmentPortQuery, error) {
	var err error
	for _, f := range filters {
		switch {
		case strings.HasPrefix(f.FilterType.String(), "PORT_INST"):
			if query, err = handlePortFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "LOCATION_INST"):
			if query, err = handlePortLocationFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "PORT_DEF"):
			if query, err = handlePortDefinitionFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "PROPERTY"):
			if query, err = handlePortPropertyFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "SERVICE_INST"):
			if query, err = handlePortServiceFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func PortSearch(ctx context.Context, client *ent.Client, filters []*models.PortFilterInput, limit *int) (*models.PortSearchResult, error) {
	var (
		query = client.EquipmentPort.Query()
		err   error
	)
	query, err = PortFilter(query, filters)
	if err != nil {
		return nil, err
	}
	count, err := query.Clone().Count(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Count query failed")
	}
	if limit != nil {
		query.Limit(*limit)
	}
	ports, err := query.All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying links failed")
	}
	return &models.PortSearchResult{
		Ports: ports,
		Count: count,
	}, nil
}
