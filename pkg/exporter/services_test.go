// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpointdefinition"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

const (
	serviceNameTitle        = "Service Name"
	serviceTypeTitle        = "Service Type"
	discoveryMethodTitle    = "Discovery Method"
	serviceExternalIDTitle  = "Service External ID"
	customerNameTitle       = "Customer Name"
	customerExternalIDTitle = "Customer External ID"
	statusTitle             = "Status"
	strPropTitle            = "service_str_prop"
	intPropTitle            = "service_int_prop"
	boolPropTitle           = "service_bool_prop"
	floatPropTitle          = "service_float_prop"
)

var endpointHeader = [...]string{"Endpoint Definition 1", "Location 1", "Equipment 1",
	"Endpoint Definition 2", "Location 2", "Equipment 2", "Endpoint Definition 3", "Location 3", "Equipment 3",
	"Endpoint Definition 4", "Location 4", "Equipment 4", "Endpoint Definition 5", "Location 5", "Equipment 5",
}

func prepareServiceData(ctx context.Context) {
	client := ent.FromContext(ctx)

	serviceType1 := client.ServiceType.Create().
		SetName("L2 Service").
		SetHasCustomer(false).
		SaveX(ctx)

	locType := client.LocationType.Create().
		SetName("locType1").
		SaveX(ctx)

	loc1 := client.Location.Create().
		SetName("loc1").
		SetType(locType).
		SaveX(ctx)

	equipType1 := client.EquipmentType.Create().
		SetName("etype1").
		SaveX(ctx)

	client.EquipmentPortDefinition.Create().
		SetName("p1").
		SetEquipmentType(equipType1).
		SaveX(ctx)

	client.EquipmentPortDefinition.Create().
		SetName("p2").
		SetEquipmentType(equipType1).
		SaveX(ctx)

	equipType2 := client.EquipmentType.Create().
		SetName("etype2").
		SaveX(ctx)

	client.EquipmentPortDefinition.Create().
		SetName("p1").
		SetEquipmentType(equipType2).
		SaveX(ctx)

	client.EquipmentPortDefinition.Create().
		SetName("p2").
		SetEquipmentType(equipType2).
		SaveX(ctx)

	serviceType2 := client.ServiceType.Create().
		SetName("L3 Service").
		SetHasCustomer(true).
		SaveX(ctx)

	client.ServiceEndpointDefinition.Create().
		SetName("endpoint type1").
		SetRole("CONSUMER").
		SetIndex(0).
		SetEquipmentType(equipType1).
		SetServiceType(serviceType2).
		SaveX(ctx)

	client.ServiceEndpointDefinition.Create().
		SetName("endpoint type2").
		SetRole("PROVIDER").
		SetIndex(1).
		SetEquipmentType(equipType2).
		SetServiceType(serviceType2).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(strPropTitle).
		SetType(propertytype.TypeString).
		SetServiceType(serviceType2).
		SetStringVal("Foo is the best").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(intPropTitle).
		SetType(propertytype.TypeInt).
		SetServiceType(serviceType2).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(boolPropTitle).
		SetType(propertytype.TypeBool).
		SetServiceType(serviceType2).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(floatPropTitle).
		SetType(propertytype.TypeFloat).
		SetServiceType(serviceType2).
		SaveX(ctx)

	strType := serviceType2.QueryPropertyTypes().Where(propertytype.Name(strPropTitle)).OnlyX(ctx)
	intType := serviceType2.QueryPropertyTypes().Where(propertytype.Name(intPropTitle)).OnlyX(ctx)
	boolType := serviceType2.QueryPropertyTypes().Where(propertytype.Name(boolPropTitle)).OnlyX(ctx)
	floatType := serviceType2.QueryPropertyTypes().Where(propertytype.Name(floatPropTitle)).OnlyX(ctx)

	customer1 := client.Customer.Create().
		SetName("Customer 1").
		SetExternalID("AD123").
		SaveX(ctx)
	customer2 := client.Customer.Create().
		SetName("Customer 2").
		SaveX(ctx)

	client.Service.Create().
		SetName("L2 S1").
		SetExternalID("XS542").
		SetTypeID(serviceType1.ID).
		SetStatus(service.StatusInService).
		SaveX(ctx)

	service1 := client.Service.Create().
		SetName("L3 S1").
		SetTypeID(serviceType2.ID).
		AddCustomer(customer1).
		SetStatus(service.StatusMaintenance).
		SaveX(ctx)
	client.Property.Create().
		SetType(strType).
		SetStringVal("Foo").
		SetService(service1).
		SaveX(ctx)
	client.Property.Create().
		SetType(intType).
		SetIntVal(10).
		SetService(service1).
		SaveX(ctx)
	client.Property.Create().
		SetType(boolType).
		SetBoolVal(false).
		SetService(service1).
		SaveX(ctx)

	service2 := client.Service.Create().
		SetName("L3 S2").
		SetType(serviceType2).
		AddCustomer(customer2).
		SetStatus(service.StatusDisconnected).
		SaveX(ctx)
	client.Property.Create().
		SetType(floatType).
		SetFloatVal(3.5).
		SetService(service2).
		SaveX(ctx)

	e1 := client.Equipment.Create().
		SetName("e1").
		SetType(equipType1).
		SetLocation(loc1).
		SaveX(ctx)
	e2 := client.Equipment.Create().
		SetName("e2").
		SetType(equipType2).
		SetLocation(loc1).
		SaveX(ctx)

	client.ServiceEndpoint.Create().
		SetService(service2).
		SetEquipment(e1).
		SetDefinition(serviceType2.QueryEndpointDefinitions().Where(serviceendpointdefinition.Index(0)).OnlyX(ctx)).
		SaveX(ctx)
	client.ServiceEndpoint.Create().
		SetService(service2).
		SetEquipment(e2).
		SetDefinition(serviceType2.QueryEndpointDefinitions().Where(serviceendpointdefinition.Index(1)).OnlyX(ctx)).
		SaveX(ctx)
}

func TestEmptyServicesDataExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(context.Background(), client)

	e := &Exporter{Log: log, Rower: ServicesRower{Log: log}}

	head := append([]string{"\ufeffService ID",
		serviceNameTitle,
		serviceTypeTitle,
		discoveryMethodTitle,
		serviceExternalIDTitle,
		customerNameTitle,
		customerExternalIDTitle,
		statusTitle,
	},
		endpointHeader[:]...)
	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		require.EqualValues(t, head, ln)
	}
}

func TestServicesExport(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)

	e := &Exporter{Log: log, Rower: ServicesRower{Log: log}}

	ctx := viewertest.NewContext(context.Background(), client)
	prepareServiceData(ctx)

	head := append([]string{"\ufeffService ID",
		serviceNameTitle,
		serviceTypeTitle,
		discoveryMethodTitle,
		serviceExternalIDTitle,
		customerNameTitle,
		customerExternalIDTitle,
		statusTitle,
	},
		endpointHeader[:]...)

	rows, err := e.Rower.Rows(ctx, "")
	require.NoError(t, err, "error getting rows")
	for _, ln := range rows {
		switch {
		case ln[1] == serviceNameTitle:
			require.EqualValues(t, append(head, []string{
				strPropTitle,
				intPropTitle,
				boolPropTitle,
				floatPropTitle,
			}...), ln)
		case ln[1] == "L2 S1":
			require.EqualValues(t, ln[1:8], []string{
				"L2 S1",
				"L2 Service",
				"MANUAL",
				"XS542",
				"",
				"",
				service.StatusInService.String(),
			})
		case ln[1] == "L3 S1":
			require.EqualValues(t, ln[1:], []string{
				"L3 S1",
				"L3 Service",
				"MANUAL",
				"",
				"Customer 1",
				"AD123",
				service.StatusMaintenance.String(),
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"Foo",
				"10",
				"false",
				"",
			})
		case ln[1] == "L3 S2":
			require.EqualValues(t, ln[1:], []string{
				"L3 S2",
				"L3 Service",
				"MANUAL",
				"",
				"Customer 2",
				"",
				service.StatusDisconnected.String(),
				"endpoint type1",
				"loc1",
				"e1",
				"endpoint type2",
				"loc1",
				"e2",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"Foo is the best",
				"",
				"",
				"3.500",
			})
		default:
			require.Fail(t, "line does not match")
		}
	}
}

func TestServiceWithFilters(t *testing.T) {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)

	e := &Exporter{Log: log, Rower: ServicesRower{Log: log}}
	ctx := viewertest.NewContext(context.Background(), client)
	prepareServiceData(ctx)

	f1, err := json.Marshal([]servicesFilterInput{
		{
			Name:        enum.ServiceFilterTypeServiceInstCustomerName,
			Operator:    enum.FilterOperatorContains,
			StringValue: "Customer 1",
		},
	})
	require.NoError(t, err)
	f2, err := json.Marshal([]servicesFilterInput{
		{
			Name:        enum.ServiceFilterTypeServiceInstExternalID,
			Operator:    enum.FilterOperatorIs,
			StringValue: "XS542",
		},
	})
	require.NoError(t, err)

	for i, filter := range [][]byte{f1, f2} {
		rows, err := e.Rower.Rows(ctx, string(filter))
		require.NoError(t, err, "error getting rows")
		linesCount := 0
		for _, ln := range rows {
			linesCount++
			require.NoError(t, err, "error reading row")
			if i == 0 {
				if ln[1] != serviceNameTitle {
					require.EqualValues(t, ln[1:], []string{
						"L3 S1",
						"L3 Service",
						"MANUAL",
						"",
						"Customer 1",
						"AD123",
						service.StatusMaintenance.String(),
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"Foo",
						"10",
						"false",
						"",
					})
				}
			}
			if i == 1 {
				if ln[1] != serviceNameTitle {
					require.EqualValues(t, ln[1:], []string{
						"L2 S1",
						"L2 Service",
						"MANUAL",
						"XS542",
						"",
						"",
						service.StatusInService.String(),
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
					})
				}
			}
		}
	}
}

func TestServicesAsyncExport(t *testing.T) {
	testAsyncExport(t, exporttask.TypeService)
}
