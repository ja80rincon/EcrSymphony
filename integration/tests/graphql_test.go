// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// +build integration

package tests

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/AlekSi/pointer"
	"github.com/cenkalti/backoff/v4"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/google/uuid"
	"github.com/shurcooL/graphql"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest"
)

type client struct {
	admin      *graphql.Client
	graph      *graphql.Client
	log        *zap.Logger
	tenant     string
	user       string
	automation bool
}

func TestMain(m *testing.M) {
	if err := waitFor("admin", "graph"); err != nil {
		fmt.Printf("FAIL\n%v\n", err)
		os.Exit(2)
	}
	os.Exit(m.Run())
}

func waitFor(services ...string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	g := ctxgroup.WithContext(ctx)
	for _, service := range services {
		service := service
		target := fmt.Sprintf("http://%s/healthz", service)
		g.Go(func(ctx context.Context) error {
			return backoff.Retry(func() error {
				req, _ := http.NewRequestWithContext(ctx, http.MethodGet, target, nil)
				rsp, err := http.DefaultClient.Do(req)
				if err != nil {
					return err
				}
				rsp.Body.Close()
				if rsp.StatusCode != http.StatusOK {
					return fmt.Errorf("service %q not ready: status=%q", service, rsp.Status)
				}
				return nil
			}, backoff.WithContext(
				backoff.NewConstantBackOff(200*time.Millisecond), ctx),
			)
		})
	}
	return g.Wait()
}

type option func(*client)

func withAutomation() option {
	return func(c *client) {
		c.automation = true
	}
}

func newClient(t *testing.T, tenant, user string, opts ...option) *client {
	c := client{
		log: zaptest.NewLogger(t).With(
			zap.String("tenant", tenant),
		),
		tenant: tenant,
		user:   user,
	}
	c.admin = graphql.NewClient(
		"http://admin/query",
		nil,
	)
	c.graph = graphql.NewClient(
		"http://graph/query",
		&http.Client{Transport: &c},
	)
	for _, opt := range opts {
		opt(&c)
	}
	tenantID, err := c.createTenant()
	require.NoError(t, err)
	_, err = c.createUser(tenantID)
	require.NoError(t, err)
	return &c
}

func (c *client) RoundTrip(req *http.Request) (*http.Response, error) {
	req.Header.Set("x-auth-organization", c.tenant)
	if !c.automation {
		req.Header.Set("x-auth-user-email", c.user)
	} else {
		req.Header.Set("x-auth-automation-name", c.user)
	}
	req.Header.Set("x-auth-user-role", "ADMIN")
	return http.DefaultTransport.RoundTrip(req)
}

func (c *client) createTenant() (graphql.ID, error) {
	ctx := context.Background()
	var m struct {
		CreateTenant struct {
			Tenant struct {
				ID string
			}
		} `graphql:"createTenant(input: {name: $name})"`
	}
	vars := map[string]interface{}{
		"name": graphql.String(c.tenant),
	}
	err := c.admin.Mutate(ctx, &m, vars)
	if err == nil {
		return m.CreateTenant.Tenant.ID, nil
	}
	if err.Error() != fmt.Sprintf("Tenant '%s' exists", c.tenant) {
		return nil, err
	}
	var q struct {
		Tenant struct {
			ID string
		} `graphql:"tenant(name: $name)"`
	}
	err = c.admin.Query(ctx, &q, vars)
	return q.Tenant.ID, err
}

func (c *client) createUser(tenant graphql.ID) (graphql.ID, error) {
	var m struct {
		UpsertUser struct {
			User struct {
				ID string
			}
		} `graphql:"upsertUser(input: {tenantId: $tenant, authId: $user, role: ADMIN})"`
	}
	vars := map[string]interface{}{
		"tenant": tenant,
		"user":   graphql.String(c.user),
	}
	err := c.admin.Mutate(context.Background(), &m, vars)
	return m.UpsertUser.User.ID, err
}

type locationTypeResponse struct {
	ID            graphql.ID
	Name          graphql.String
	PropertyTypes []struct {
		ID graphql.ID
	}
}

func (c *client) addLocationType(name string, properties ...*pkgmodels.PropertyTypeInput) (*locationTypeResponse, error) {
	var m struct {
		Response locationTypeResponse `graphql:"addLocationType(input: $input)"`
	}
	vars := map[string]interface{}{
		"input": models.AddLocationTypeInput{
			Name:       name,
			Properties: properties,
		},
	}
	if err := c.graph.Mutate(context.Background(), &m, vars); err != nil {
		return nil, err
	}
	return &m.Response, nil
}

type addLocationResponse struct {
	ID   graphql.ID
	Name graphql.String
}

func IDToInt(id graphql.ID) int {
	i, err := strconv.Atoi(id.(string))
	if err != nil {
		panic(err)
	}
	return i
}

func IDToIntOrNil(id graphql.ID) *int {
	if id == nil {
		return nil
	}
	i := IDToInt(id)
	return &i
}

func (c *client) addLocation(name string, parent graphql.ID) (*addLocationResponse, error) {
	typ, err := c.addLocationType("location_type_" + uuid.New().String())
	if err != nil {
		return nil, err
	}
	var m struct {
		Response addLocationResponse `graphql:"addLocation(input: $input)"`
	}
	vars := map[string]interface{}{
		"input": models.AddLocationInput{
			Name:      name,
			Type:      IDToInt(typ.ID),
			Latitude:  pointer.ToFloat64(14.45),
			Longitude: pointer.ToFloat64(45.14),
			Parent:    IDToIntOrNil(parent),
		},
	}
	if err := c.graph.Mutate(context.Background(), &m, vars); err != nil {
		return nil, err
	}
	return &m.Response, nil
}

type queryLocationResponse struct {
	ID       graphql.ID
	Name     graphql.String
	Children []struct {
		ID   graphql.ID
		Name graphql.String
		Type struct {
			ID   graphql.ID
			Name graphql.String
		} `graphql:"locationType"`
	}
}

func (c *client) queryLocationType(id graphql.ID) (*locationTypeResponse, error) {
	var q struct {
		Node struct {
			Response locationTypeResponse `graphql:"... on LocationType"`
		} `graphql:"node(id: $id)"`
	}
	vars := map[string]interface{}{
		"id": id,
	}
	switch err := c.graph.Query(context.Background(), &q, vars); {
	case err != nil:
		return nil, err
	case q.Node.Response.ID == nil:
		return nil, errors.New("location type not found")
	}
	return &q.Node.Response, nil
}

func (c *client) queryLocation(id graphql.ID) (*queryLocationResponse, error) {
	var q struct {
		Node struct {
			Response queryLocationResponse `graphql:"... on Location"`
		} `graphql:"node(id: $id)"`
	}
	vars := map[string]interface{}{
		"id": id,
	}
	switch err := c.graph.Query(context.Background(), &q, vars); {
	case err != nil:
		return nil, err
	case q.Node.Response.ID == nil:
		return nil, errors.New("location not found")
	}
	return &q.Node.Response, nil
}

type queryLocationsResponse struct {
	Edges []struct {
		Node struct {
			Name   graphql.String
			Parent struct {
				Name graphql.String
			} `graphql:"parentLocation"`
			Properties []struct {
				Type struct {
					Name graphql.String
				} `graphql:"propertyType"`
				Value graphql.String `graphql:"stringValue"`
			}
			Children []struct {
				Name graphql.String
			}
			ExternalID graphql.String
			Longitude  graphql.Float
			Latitude   graphql.Float
		}
	}
}

func (c *client) QueryLocations() (*queryLocationsResponse, error) {
	var q struct {
		Response queryLocationsResponse `graphql:"locations(first: null)"`
	}
	if err := c.graph.Query(context.Background(), &q, nil); err != nil {
		return nil, err
	}
	return &q.Response, nil
}

type addEquipmentTypeResponse struct {
	ID         graphql.ID
	Name       graphql.String
	Properties []struct {
		ID   graphql.ID
		Name graphql.String
		Kind propertytype.Type `graphql:"type"`
	} `graphql:"propertyTypes"`
}

func (c *client) addEquipmentType(name string, properties ...*pkgmodels.PropertyTypeInput) (*addEquipmentTypeResponse, error) {
	var m struct {
		Response addEquipmentTypeResponse `graphql:"addEquipmentType(input: $input)"`
	}
	vars := map[string]interface{}{
		"input": models.AddEquipmentTypeInput{
			Name:       name,
			Properties: properties,
		},
	}
	if err := c.graph.Mutate(context.Background(), &m, vars); err != nil {
		return nil, err
	}
	return &m.Response, nil
}

type addEquipmentResponse struct {
	ID graphql.ID
}

func (c *client) addEquipment(name string, typ, location, workOrder graphql.ID) (*addEquipmentResponse, error) {
	var m struct {
		Response addEquipmentResponse `graphql:"addEquipment(input: $input)"`
	}
	vars := map[string]interface{}{
		"input": models.AddEquipmentInput{
			Name:      name,
			Type:      IDToInt(typ),
			Location:  IDToIntOrNil(location),
			WorkOrder: IDToIntOrNil(workOrder),
		},
	}
	if err := c.graph.Mutate(context.Background(), &m, vars); err != nil {
		return nil, err
	}
	return &m.Response, nil
}

func (c *client) removeEquipment(id, workOrder graphql.ID) error {
	var m struct {
		ID graphql.ID `graphql:"removeEquipment(id: $id, workOrderId: $workOrder)"`
	}
	vars := map[string]interface{}{
		"id":        id,
		"workOrder": workOrder,
	}
	return c.graph.Mutate(context.Background(), &m, vars)
}

type queryEquipmentResponse struct {
	ID    graphql.ID
	Name  graphql.String
	State enum.FutureState `graphql:"futureState"`
}

func (c *client) queryEquipment(id graphql.ID) (*queryEquipmentResponse, error) {
	var q struct {
		Node struct {
			Response queryEquipmentResponse `graphql:"... on Equipment"`
		} `graphql:"node(id: $id)"`
	}
	vars := map[string]interface{}{
		"id": id,
	}
	switch err := c.graph.Query(context.Background(), &q, vars); {
	case err != nil:
		return nil, err
	case q.Node.Response.ID == nil:
		return nil, errors.New("equipment not found")
	}
	return &q.Node.Response, nil
}

type addWorkOrderTypeResponse struct {
	ID         graphql.ID
	Name       graphql.String
	Properties []struct {
		ID   graphql.ID
		Name graphql.String
		Kind propertytype.Type `graphql:"type"`
	} `graphql:"propertyTypes"`
}

func (c *client) addWorkOrderType(name string, properties ...*pkgmodels.PropertyTypeInput) (*addWorkOrderTypeResponse, error) {
	var m struct {
		Response addWorkOrderTypeResponse `graphql:"addWorkOrderType(input: $input)"`
	}
	if properties == nil {
		properties = []*pkgmodels.PropertyTypeInput{}
	}
	vars := map[string]interface{}{
		"input": models.AddWorkOrderTypeInput{
			Name:       name,
			Properties: properties,
		},
	}
	if err := c.graph.Mutate(context.Background(), &m, vars); err != nil {
		return nil, err
	}
	return &m.Response, nil
}

type User struct {
	ID    graphql.ID
	Email graphql.String
}

type addWorkOrderResponse struct {
	ID    graphql.ID
	Name  graphql.String
	Owner User
}

func (c *client) addWorkOrder(name string, typ graphql.ID) (*addWorkOrderResponse, error) {
	var m struct {
		Response addWorkOrderResponse `graphql:"addWorkOrder(input: $input)"`
	}
	vars := map[string]interface{}{
		"input": models.AddWorkOrderInput{
			Name:            name,
			WorkOrderTypeID: IDToInt(typ),
		},
	}
	if err := c.graph.Mutate(context.Background(), &m, vars); err != nil {
		return nil, err
	}
	return &m.Response, nil
}

func (c *client) executeWorkOrder(workOrder *addWorkOrderResponse) error {
	var em struct {
		Response struct {
			ID graphql.ID
		} `graphql:"editWorkOrder(input: $input)"`
	}
	ownerID := IDToInt(workOrder.Owner.ID)
	st := workorder.StatusClosed
	vars := map[string]interface{}{
		"input": models.EditWorkOrderInput{
			ID:      IDToInt(workOrder.ID),
			Name:    string(workOrder.Name),
			OwnerID: &ownerID,
			Status:  &st,
		},
	}
	if err := c.graph.Mutate(context.Background(), &em, vars); err != nil {
		return fmt.Errorf("editing work order: %w", err)
	}

	var m struct {
		Response struct {
			ID graphql.ID
		} `graphql:"executeWorkOrder(id: $id)"`
	}
	vars = map[string]interface{}{
		"id": workOrder.ID,
	}
	if err := c.graph.Mutate(context.Background(), &m, vars); err != nil {
		return fmt.Errorf("executing work order: %w", err)
	}
	return nil
}

const (
	testTenant = "integration-test"
	testUser   = "user@test.com"
)

func TestAddLocation(t *testing.T) {
	c := newClient(t, testTenant, testUser)
	name := "location_" + uuid.New().String()
	rsp, err := c.addLocation(name, nil)
	require.NoError(t, err)
	require.NotNil(t, rsp.ID)
	require.EqualValues(t, name, rsp.Name)
}

func TestAddLocationType(t *testing.T) {
	c := newClient(t, testTenant, testUser)
	name := "location_type_" + uuid.New().String()
	typ, err := c.addLocationType(name)
	require.NoError(t, err)
	require.NotNil(t, typ.ID)
	require.EqualValues(t, name, typ.Name)
}

func TestAddLocationWithAutomation(t *testing.T) {
	c := newClient(t, testTenant, testUser, withAutomation())
	name := "location_type_" + uuid.New().String()
	typ, err := c.addLocationType(name)
	require.NoError(t, err)
	require.NotNil(t, typ.ID)
	require.EqualValues(t, name, typ.Name)
}

func TestAddLocationsDifferentTenants(t *testing.T) {
	c1 := newClient(t, "integration-test-1", "user@test-1.com")
	c2 := newClient(t, "integration-test-2", "user@test-2.com")

	// makes sure tenant-2 does not have access to tenant-1 locations.
	name := "location_" + uuid.New().String()
	rsp, err := c1.addLocation(name, nil)
	require.NoError(t, err)
	l1, err := c1.queryLocation(rsp.ID)
	require.NoError(t, err)
	require.EqualValues(t, name, l1.Name)
	_, err = c2.queryLocation(rsp.ID)
	require.Error(t, err)

	name = "location_" + uuid.New().String()
	_, err = c2.addLocation(name, nil)
	require.NoError(t, err)
	locations, err := c1.QueryLocations()
	require.NoError(t, err)
	// make sure tenant-2 location does not exist in tenant-1.
	for i := range locations.Edges {
		require.NotEqual(t, name, string(locations.Edges[i].Node.Name))
	}
}

func TestAddLocationWithChildren(t *testing.T) {
	c := newClient(t, testTenant, testUser)

	parentName := "parent_location_" + uuid.New().String()
	parent, err := c.addLocation(parentName, nil)
	require.NoError(t, err)
	childName := "child_location_" + uuid.New().String()
	child, err := c.addLocation(childName, parent.ID)
	require.NoError(t, err)

	location, err := c.queryLocation(parent.ID)
	require.NoError(t, err)
	require.EqualValues(t, parentName, location.Name)
	require.Len(t, location.Children, 1)
	require.Equal(t, child.ID, location.Children[0].ID)
	require.EqualValues(t, childName, location.Children[0].Name)
}

func TestExecuteWorkOrder(t *testing.T) {
	c := newClient(t, testTenant, testUser)

	typ, err := c.addWorkOrderType("work_order_type_" + uuid.New().String())
	require.NoError(t, err)
	name := "work_order_" + uuid.New().String()
	wo, err := c.addWorkOrder(name, typ.ID)
	require.NoError(t, err)
	require.EqualValues(t, testUser, wo.Owner.Email)

	et, err := c.addEquipmentType("router_type_" + uuid.New().String())
	require.NoError(t, err)
	l, err := c.addLocation("location_"+uuid.New().String(), nil)
	require.NoError(t, err)
	e, err := c.addEquipment("router_"+uuid.New().String(), et.ID, l.ID, wo.ID)
	require.NoError(t, err)

	eq, err := c.queryEquipment(e.ID)
	require.NoError(t, err)
	require.Equal(t, enum.FutureStateInstall, eq.State)

	err = c.executeWorkOrder(wo)
	require.NoError(t, err)

	eq, err = c.queryEquipment(e.ID)
	require.NoError(t, err)
	require.Empty(t, eq.State)

	wo, err = c.addWorkOrder(name, typ.ID)
	require.NoError(t, err)
	err = c.removeEquipment(eq.ID, wo.ID)
	require.NoError(t, err)

	eq, err = c.queryEquipment(e.ID)
	require.NoError(t, err)
	require.Equal(t, enum.FutureStateRemove, eq.State)
	err = c.executeWorkOrder(wo)
	require.NoError(t, err)
}

func TestPossibleProperties(t *testing.T) {
	c := newClient(t, testTenant, testUser)

	_, err := c.addEquipmentType(
		"router_type_"+uuid.New().String(),
		&pkgmodels.PropertyTypeInput{
			Name: "Width",
			Type: propertytype.TypeInt,
		},
		&pkgmodels.PropertyTypeInput{
			Name: "Manufacturer",
			Type: propertytype.TypeString,
		},
	)
	require.NoError(t, err)

	_, err = c.addEquipmentType(
		"router_type_"+uuid.New().String(),
		&pkgmodels.PropertyTypeInput{
			Name: "Width",
			Type: propertytype.TypeInt,
		},
	)
	require.NoError(t, err)

	var q struct {
		Properties []struct {
			ID graphql.ID
		} `graphql:"possibleProperties(entityType: $entityType)"`
	}

	vars := map[string]interface{}{
		"entityType": enum.PropertyEntityEquipment,
	}
	err = c.graph.Query(context.Background(), &q, vars)
	require.NoError(t, err)
	require.Len(t, q.Properties, 2)
}

func TestViewer(t *testing.T) {
	c := newClient(t, testTenant, testUser)
	var q struct {
		Viewer struct {
			Tenant graphql.String
			User   User
		} `graphql:"me"`
	}
	err := c.graph.Query(context.Background(), &q, nil)
	require.NoError(t, err)
	require.EqualValues(t, testTenant, q.Viewer.Tenant)
	require.EqualValues(t, testUser, q.Viewer.User.Email)
}
