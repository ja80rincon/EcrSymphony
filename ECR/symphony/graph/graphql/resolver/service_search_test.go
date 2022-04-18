// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentportdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/servicetype"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/AlekSi/pointer"
	"github.com/stretchr/testify/require"
)

type serviceSearchDataModels struct {
	st1         int
	st2         int
	strType     int
	intType     int
	boolType    int
	floatType   int
	locRoom     int
	locBuilding int
	eqt         int
	eqpd1       int
	eqpd2       int
}

func preparePropertyTypes() []*pkgmodels.PropertyTypeInput {
	serviceStrPropType := pkgmodels.PropertyTypeInput{
		Name:        "service_str_prop",
		Type:        "string",
		StringValue: pointer.ToString("Foo is the best"),
	}
	serviceIntPropType := pkgmodels.PropertyTypeInput{
		Name: "service_int_prop",
		Type: "int",
	}
	serviceBoolPropType := pkgmodels.PropertyTypeInput{
		Name: "service_bool_prop",
		Type: "bool",
	}
	serviceFloatPropType := pkgmodels.PropertyTypeInput{
		Name: "service_float_prop",
		Type: "float",
	}

	return []*pkgmodels.PropertyTypeInput{
		&serviceStrPropType,
		&serviceIntPropType,
		&serviceBoolPropType,
		&serviceFloatPropType,
	}
}

func prepareServiceData(ctx context.Context, r *TestResolver) serviceSearchDataModels {
	mr := r.Mutation()

	props := preparePropertyTypes()
	eqt, _ := mr.AddEquipmentType(ctx, models.AddEquipmentTypeInput{
		Name: "eq_type",
		Ports: []*models.EquipmentPortInput{
			{Name: "typ1_p1"},
			{Name: "typ1_p2"},
		},
	})

	dm := servicetype.DiscoveryMethodInventory
	st1, _ := mr.AddServiceType(ctx, models.ServiceTypeCreateData{
		Name:            "Internet Access",
		HasCustomer:     false,
		Properties:      props,
		DiscoveryMethod: &dm,
		Endpoints: []*models.ServiceEndpointDefinitionInput{
			{
				Name:            "endpoint type1",
				Role:            pointer.ToString("CONSUMER"),
				Index:           0,
				EquipmentTypeID: eqt.ID,
			},
		}})

	st2, _ := mr.AddServiceType(ctx, models.ServiceTypeCreateData{
		Name: "Internet Access 2", HasCustomer: false, Properties: []*pkgmodels.PropertyTypeInput{}})

	strType, _ := st1.QueryPropertyTypes().Where(propertytype.Name("service_str_prop")).Only(ctx)
	intType, _ := st1.QueryPropertyTypes().Where(propertytype.Name("service_int_prop")).Only(ctx)
	boolType, _ := st1.QueryPropertyTypes().Where(propertytype.Name("service_bool_prop")).Only(ctx)
	floatType, _ := st1.QueryPropertyTypes().Where(propertytype.Name("service_float_prop")).Only(ctx)

	locBuilding, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "building",
	})

	locRoom, _ := mr.AddLocationType(ctx, models.AddLocationTypeInput{
		Name: "room",
	})

	defs := eqt.QueryPortDefinitions().AllX(ctx)

	return serviceSearchDataModels{
		st1.ID,
		st2.ID,
		strType.ID,
		intType.ID,
		boolType.ID,
		floatType.ID,
		locRoom.ID,
		locBuilding.ID,
		eqt.ID,
		defs[0].ID,
		defs[1].ID,
	}
}

func TestSearchServicesByName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareServiceData(ctx, r)

	_, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 2010",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	limit := 100
	f1 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeServiceInstName,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("Room"),
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 3)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeServiceInstName,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("Room 201"),
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 2)
}

func TestSearchServicesByStatus(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareServiceData(ctx, r)

	_, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		Status:        service.StatusMaintenance,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st1,
		Status:        service.StatusInService,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 2010",
		ServiceTypeID: data.st1,
		Status:        service.StatusInService,
	})
	require.NoError(t, err)

	limit := 100
	f1 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceStatus,
		Operator:   enum.FilterOperatorIsOneOf,
		StringSet:  []string{service.StatusMaintenance.String()},
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 1)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceStatus,
		Operator:   enum.FilterOperatorIsOneOf,
		StringSet:  []string{service.StatusInService.String()},
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 2)

	f3 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceStatus,
		Operator:   enum.FilterOperatorIsOneOf,
		StringSet:  []string{service.StatusPending.String()},
	}
	res3, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f3})
	require.NoError(t, err)
	require.Len(t, res3.Edges, 0)
}

func TestSearchServicesByType(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareServiceData(ctx, r)

	s1, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	s2, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st2,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	limit := 100
	f1 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceType,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.st1},
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 1)
	require.Equal(t, res1.Edges[0].Node.ID, s1.ID)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceType,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.st2},
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 1)
	require.Equal(t, res2.Edges[0].Node.ID, s2.ID)

	f3 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceType,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{data.st1, data.st2},
	}
	res3, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f3})
	require.NoError(t, err)
	require.Len(t, res3.Edges, 2)
}

func TestSearchServicesByExternalID(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)
	data := prepareServiceData(ctx, r)

	externalID1 := "S1111"
	externalID2 := "S2222"
	s1, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		ExternalID:    &externalID1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	s2, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st2,
		ExternalID:    &externalID2,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 203",
		ServiceTypeID: data.st2,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	limit := 100
	f1 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeServiceInstExternalID,
		Operator:    enum.FilterOperatorIs,
		StringValue: &externalID1,
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 1)
	require.Equal(t, res1.Edges[0].Node.ID, s1.ID)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeServiceInstExternalID,
		Operator:    enum.FilterOperatorIs,
		StringValue: &externalID2,
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 1)
	require.Equal(t, res2.Edges[0].Node.ID, s2.ID)
}

func TestSearchServicesByCustomerName(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)
	data := prepareServiceData(ctx, r)

	customerA, err := mr.AddCustomer(ctx, models.AddCustomerInput{Name: "Donald"})
	require.NoError(t, err)

	customerB, err := mr.AddCustomer(ctx, models.AddCustomerInput{Name: "Mia", ExternalID: pointer.ToString("4242")})
	require.NoError(t, err)

	s1, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		CustomerID:    &customerA.ID,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st2,
		CustomerID:    &customerB.ID,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Lobby",
		ServiceTypeID: data.st2,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	limit := 100
	f1 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeServiceInstCustomerName,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("Donald"),
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 1)
	require.Equal(t, res1.Edges[0].Node.ID, s1.ID)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeServiceInstCustomerName,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("a"),
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 2)
}

func TestSearchServicesByDiscoveryMethod(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)
	data := prepareServiceData(ctx, r)

	s1, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st2,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Lobby",
		ServiceTypeID: data.st2,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)
	limit := 100

	all, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{})
	require.NoError(t, err)
	require.Len(t, all.Edges, 3)

	f1 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceDiscoveryMethod,
		Operator:   enum.FilterOperatorIsOneOf,
		StringSet:  []string{servicetype.DiscoveryMethodInventory.String()},
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 1)
	require.Equal(t, res1.Edges[0].Node.ID, s1.ID)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeServiceDiscoveryMethod,
		Operator:   enum.FilterOperatorIsOneOf,
		StringSet:  []string{servicetype.DiscoveryMethodManual.String()},
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 2)

	res3, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1, &f2})
	require.NoError(t, err)
	require.Len(t, res3.Edges, 0)
}

func TestSearchServicesByProperties(t *testing.T) {
	r := newTestResolver(t)
	qr, mr := r.Query(), r.Mutation()
	defer r.Close()
	ctx := viewertest.NewContext(context.Background(), r.client)

	data := prepareServiceData(ctx, r)

	serviceStrProp := models.PropertyInput{
		PropertyTypeID: data.strType,
		StringValue:    pointer.ToString("Bar is the best"),
	}
	servicePropInput := []*models.PropertyInput{&serviceStrProp}

	_, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		Properties:    servicePropInput,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	limit := 100
	all, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{})
	require.NoError(t, err)
	require.Len(t, all.Edges, 2)
	f := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeProperty,
		Operator:   enum.FilterOperatorIs,
		PropertyValue: &pkgmodels.PropertyTypeInput{
			Name:        "service_str_prop",
			Type:        propertytype.TypeString,
			StringValue: pointer.ToString("Foo is the best"),
		},
	}
	res, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f})
	require.NoError(t, err)
	require.Len(t, res.Edges, 1)
}

func TestSearchServicesByLocations(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)
	data := prepareServiceData(ctx, r)

	loc1, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc_inst1",
		Type: data.locBuilding,
	})
	loc2, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name:       "loc_inst2",
		Type:       data.locRoom,
		Parent:     &loc1.ID,
		ExternalID: pointer.ToString("222"),
	})
	loc3, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name:   "loc_inst3",
		Type:   data.locRoom,
		Parent: &loc1.ID,
	})

	eq1, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "eq_inst2",
		Type:     data.eqt,
		Location: &loc2.ID,
	})
	eq2, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "eq_inst3",
		Type:     data.eqt,
		Location: &loc3.ID,
	})

	s1, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	st := r.client.ServiceType.GetX(ctx, data.st1)
	ept := st.QueryEndpointDefinitions().OnlyX(ctx)

	_, err = mr.AddServiceEndpoint(ctx, models.AddServiceEndpointInput{
		ID:          s1.ID,
		EquipmentID: eq1.ID,
		Definition:  ept.ID,
	})
	require.NoError(t, err)

	s2, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	ep2 := eq2.QueryPorts().Where(equipmentport.HasDefinitionWith(equipmentportdefinition.ID(data.eqpd1))).OnlyX(ctx)

	_, err = mr.AddServiceEndpoint(ctx, models.AddServiceEndpointInput{
		ID:          s2.ID,
		EquipmentID: eq2.ID,
		PortID:      pointer.ToInt(ep2.ID),
		Definition:  ept.ID,
	})
	require.NoError(t, err)

	s3, err := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 203",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	require.NoError(t, err)

	_, err = mr.AddServiceEndpoint(ctx, models.AddServiceEndpointInput{
		ID:          s3.ID,
		EquipmentID: eq1.ID,
		Definition:  ept.ID,
	})
	require.NoError(t, err)

	_, err = mr.AddServiceEndpoint(ctx, models.AddServiceEndpointInput{
		ID:          s3.ID,
		EquipmentID: eq2.ID,
		PortID:      pointer.ToInt(ep2.ID),
		Definition:  ept.ID,
	})
	require.NoError(t, err)

	maxDepth := 2
	limit := 100
	f1 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeLocationInst,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{loc1.ID},
		MaxDepth:   &maxDepth,
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 3)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeLocationInst,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{loc2.ID},
		MaxDepth:   &maxDepth,
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 2)

	f2ExternalID := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeLocationInstExternalID,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("22"),
	}
	res2, err = qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2ExternalID})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 2)

	f3 := pkgmodels.ServiceFilterInput{
		FilterType: enum.ServiceFilterTypeLocationInst,
		Operator:   enum.FilterOperatorIsOneOf,
		IDSet:      []int{loc2.ID, loc3.ID},
		MaxDepth:   &maxDepth,
	}
	res3, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f3})
	require.NoError(t, err)
	require.Len(t, res3.Edges, 3)
}

func TestSearchServicesByEquipmentInside(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	qr, mr := r.Query(), r.Mutation()
	ctx := viewertest.NewContext(context.Background(), r.client)
	data := prepareServiceData(ctx, r)

	loc, _ := mr.AddLocation(ctx, models.AddLocationInput{
		Name: "loc_inst",
		Type: data.locRoom,
	})

	eq1, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "eq_inst1",
		Type:     data.eqt,
		Location: &loc.ID,
	})

	eq2, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "eq_inst2",
		Type:     data.eqt,
		Location: &loc.ID,
	})

	eq3, _ := mr.AddEquipment(ctx, models.AddEquipmentInput{
		Name:     "eq_inst3",
		Type:     data.eqt,
		Location: &loc.ID,
	})

	l1, _ := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: eq1.ID, Port: data.eqpd1},
			{Equipment: eq2.ID, Port: data.eqpd1},
		},
	})
	l2, _ := mr.AddLink(ctx, models.AddLinkInput{
		Sides: []*models.LinkSide{
			{Equipment: eq2.ID, Port: data.eqpd2},
			{Equipment: eq3.ID, Port: data.eqpd2},
		},
	})

	s1, _ := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 201",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	_, _ = mr.AddServiceLink(ctx, s1.ID, l1.ID)
	_, _ = mr.AddServiceLink(ctx, s1.ID, l2.ID)

	ep1 := eq1.QueryPorts().Where(equipmentport.HasDefinitionWith(equipmentportdefinition.ID(data.eqpd1))).OnlyX(ctx)

	st := r.client.ServiceType.GetX(ctx, data.st1)
	ept := st.QueryEndpointDefinitions().OnlyX(ctx)

	_, err := mr.AddServiceEndpoint(ctx, models.AddServiceEndpointInput{
		ID:          s1.ID,
		EquipmentID: eq1.ID,
		PortID:      pointer.ToInt(ep1.ID),
		Definition:  ept.ID,
	})
	require.NoError(t, err)

	s2, _ := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 202",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	_, _ = mr.AddServiceLink(ctx, s2.ID, l1.ID)
	_, err = mr.AddServiceEndpoint(ctx, models.AddServiceEndpointInput{
		ID:          s2.ID,
		EquipmentID: eq1.ID,
		PortID:      pointer.ToInt(ep1.ID),
		Definition:  ept.ID,
	})
	require.NoError(t, err)

	s3, _ := mr.AddService(ctx, models.ServiceCreateData{
		Name:          "Room 203",
		ServiceTypeID: data.st1,
		Status:        service.StatusPending,
	})
	_, err = mr.AddServiceEndpoint(ctx, models.AddServiceEndpointInput{
		ID:          s3.ID,
		EquipmentID: eq1.ID,
		PortID:      pointer.ToInt(ep1.ID),
		Definition:  ept.ID,
	})
	require.NoError(t, err)

	limit := 100
	f1 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeEquipmentInService,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("eq_"),
	}
	res1, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f1})
	require.NoError(t, err)
	require.Len(t, res1.Edges, 3)

	f2 := pkgmodels.ServiceFilterInput{
		FilterType:  enum.ServiceFilterTypeEquipmentInService,
		Operator:    enum.FilterOperatorContains,
		StringValue: pointer.ToString("eq_inst3"),
	}
	res2, err := qr.Services(ctx, nil, &limit, nil, nil, []*pkgmodels.ServiceFilterInput{&f2})
	require.NoError(t, err)
	require.Len(t, res2.Edges, 1)
}
