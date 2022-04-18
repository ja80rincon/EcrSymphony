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

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpoint"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpointdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/servicetype"
	"github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type servicesFilterInput struct {
	Name          enum.ServiceFilterType   `json:"name"`
	Operator      enum.FilterOperator      `jsons:"operator"`
	StringValue   string                   `json:"stringValue"`
	IDSet         []string                 `json:"idSet"`
	StringSet     []string                 `json:"stringSet"`
	PropertyValue models.PropertyTypeInput `json:"propertyValue"`
}

const MaxEndpoints = 5

type ServicesRower struct {
	Log log.Logger
}

func (er ServicesRower) Rows(ctx context.Context, filtersParam string) ([][]string, error) {
	var (
		logger      = er.Log.For(ctx)
		err         error
		filterInput []*models.ServiceFilterInput
		dataHeader  = [...]string{bom + "Service ID", "Service Name", "Service Type", "Discovery Method", "Service External ID", "Customer Name", "Customer External ID", "Status"}
	)
	if filtersParam != "" {
		filterInput, err = paramToServiceFilterInput(filtersParam)
		if err != nil {
			logger.Error("cannot filter services", zap.Error(err))
			return nil, errors.Wrap(err, "cannot filter services")
		}
	}
	client := ent.FromContext(ctx)

	services, err := ServiceSearch(ctx, client, filterInput, nil)
	if err != nil {
		logger.Error("cannot query services", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query services")
	}
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))

	servicesList := services.Services
	allRows := make([][]string, len(servicesList)+1)

	var propertyTypes []string
	cg.Go(func(ctx context.Context) error {
		serviceIDs := make([]int, len(servicesList))
		for i, l := range servicesList {
			serviceIDs[i] = l.ID
		}
		propertyTypes, err = PropertyTypesSlice(ctx, serviceIDs, client, enum.PropertyEntityService)
		if err != nil {
			logger.Error("cannot query property types", zap.Error(err))
			return errors.Wrap(err, "cannot query property types")
		}
		return nil
	})
	if err := cg.Wait(); err != nil {
		return nil, err
	}

	endpointHeader := make([]string, MaxEndpoints*3)
	iter := 0
	for i := 0; i < len(endpointHeader); i += 3 {
		iter++
		endpointHeader[i] = "Endpoint Definition " + strconv.Itoa(iter)
		endpointHeader[i+1] = "Location " + strconv.Itoa(iter)
		endpointHeader[i+2] = "Equipment " + strconv.Itoa(iter)
	}
	title := append(dataHeader[:], endpointHeader...)
	title = append(title, propertyTypes...)

	allRows[0] = title
	cg = ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, value := range servicesList {
		value, i := value, i
		cg.Go(func(ctx context.Context) error {
			row, err := serviceToSlice(ctx, value, propertyTypes)
			if err != nil {
				return err
			}
			allRows[i+1] = row
			return nil
		})
	}
	if err := cg.Wait(); err != nil {
		logger.Error("error in wait", zap.Error(err))
		return nil, errors.WithMessage(err, "error in wait")
	}
	return allRows, nil
}

func serviceToSlice(ctx context.Context, service *ent.Service, propertyTypes []string) ([]string, error) {
	st, err := service.QueryType().Only(ctx)
	if err != nil {
		return nil, err
	}
	serviceType := st.Name

	var customerName, customerExternalID, externalID string
	customer, err := service.QueryCustomer().Only(ctx)
	if err == nil {
		customerName = customer.Name
		if customer.ExternalID != nil {
			customerExternalID = *customer.ExternalID
		}
	}

	if service.ExternalID != nil {
		externalID = *service.ExternalID
	}

	discoveryMethod := st.DiscoveryMethod
	if st.DiscoveryMethod == "" {
		discoveryMethod = servicetype.DiscoveryMethodManual
	}

	properties, err := PropertiesSlice(ctx, service, propertyTypes, enum.PropertyEntityService)
	if err != nil {
		return nil, err
	}
	endpoints, err := endpointsToSlice(ctx, service, st)
	if err != nil {
		return nil, err
	}

	row := []string{strconv.Itoa(service.ID), service.Name, serviceType, discoveryMethod.String(), externalID, customerName, customerExternalID, service.Status.String()}
	row = append(row, endpoints...)
	row = append(row, properties...)

	return row, nil
}

func endpointsToSlice(ctx context.Context, service *ent.Service, st *ent.ServiceType) ([]string, error) {
	endpointsData := make([]string, MaxEndpoints*3)
	endpointDefs, err := st.QueryEndpointDefinitions().
		Order(ent.Asc(serviceendpointdefinition.FieldIndex)).All(ctx)
	if err != nil {
		return nil, err
	}

	if (len(endpointDefs) < 2 && len(endpointDefs) != 0) || len(endpointDefs) > MaxEndpoints {
		return nil, errors.New("[SKIPPING SERVICE TYPE] either too many or not enough endpoint types ")
	}
	for i, endpointDef := range endpointDefs {
		ind := i * 3
		e, err := service.QueryEndpoints().
			Where(serviceendpoint.HasDefinitionWith(serviceendpointdefinition.ID(endpointDef.ID))).
			QueryEquipment().Only(ctx)
		if ent.MaskNotFound(err) != nil {
			return nil, err
		}
		if ent.IsNotFound(err) {
			continue
		}

		loc, err := GetLastLocations(ctx, e, 3)
		if err != nil || loc == nil {
			return nil, errors.Wrap(err, "error while getting first location of equipment")
		}
		endpointsData[ind] = endpointDef.Name
		endpointsData[ind+1] = *loc
		endpointsData[ind+2] = e.Name
	}
	return endpointsData, nil
}

func paramToServiceFilterInput(params string) ([]*models.ServiceFilterInput, error) {
	var inputs []servicesFilterInput
	if err := json.Unmarshal([]byte(params), &inputs); err != nil {
		return nil, err
	}
	ret := make([]*models.ServiceFilterInput, 0, len(inputs))
	for _, f := range inputs {
		upperName := strings.ToUpper(f.Name.String())
		upperOp := strings.ToUpper(f.Operator.String())
		propertyValue := f.PropertyValue
		intIDSet, err := ToIntSlice(f.IDSet)
		if err != nil {
			return nil, fmt.Errorf("wrong id set %v: %w", f.IDSet, err)
		}
		inp := models.ServiceFilterInput{
			FilterType:    enum.ServiceFilterType(upperName),
			Operator:      enum.FilterOperator(upperOp),
			StringValue:   pointer.ToString(f.StringValue),
			PropertyValue: &propertyValue,
			IDSet:         intIDSet,
			StringSet:     f.StringSet,
			MaxDepth:      pointer.ToInt(5),
		}
		ret = append(ret, &inp)
	}
	return ret, nil
}

func ServiceFilter(query *ent.ServiceQuery, filters []*models.ServiceFilterInput) (*ent.ServiceQuery, error) {
	var err error
	for _, f := range filters {
		switch {
		case strings.HasPrefix(f.FilterType.String(), "SERVICE_"):
			if query, err = handleServiceFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "PROPERTY"):
			if query, err = handleServicePropertyFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "LOCATION_INST"):
			if query, err = handleServiceLocationFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "EQUIPMENT_IN_SERVICE"):
			if query, err = handleEquipmentInServiceFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func ServiceSearch(ctx context.Context, client *ent.Client, filters []*models.ServiceFilterInput, limit *int) (*models.ServiceSearchResult, error) {
	var (
		query = client.Service.Query().Where(service.HasTypeWith(servicetype.IsDeleted(false)))
		err   error
	)
	query, err = ServiceFilter(query, filters)
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
	services, err := query.All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying services failed")
	}
	return &models.ServiceSearchResult{
		Services: services,
		Count:    count,
	}, nil
}
