// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"flag"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentportdefinition"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentpositiondefinition"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/serviceendpointdefinition"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

const (
	equipmentTypeName          = "equipmentType"
	equipmentType2Name         = "equipmentType2"
	parentEquip                = "parentEquipmentName"
	currEquip                  = "currEquipmentName"
	currEquip2                 = "currEquipmentName2"
	positionName               = "Position"
	portName1                  = "port1"
	portName2                  = "port2"
	portName3                  = "port3"
	portName4                  = "port4"
	propNameStr                = "propNameStr"
	propNameDate               = "propNameDate"
	propNameBool               = "propNameBool"
	propNameInt                = "propNameInt"
	externalIDL                = "11"
	externalIDM                = "22"
	lat                        = 32.109
	long                       = 34.855
	newPropNameStr             = "newPropNameStr"
	propDefValue               = "defaultVal"
	propDefValue2              = "defaultVal2"
	propDevValInt              = 15
	propInstanceValue          = "newVal"
	locTypeNameL               = "locTypeLarge"
	locTypeNameM               = "locTypeMedium"
	locTypeNameS               = "locTypeSmall"
	grandParentLocation        = "grandParentLocation"
	parentLocation             = "parentLocation"
	childLocation              = "childLocation"
	firstServiceName           = "S1"
	secondServiceName          = "S2"
	propStr                    = "propStr"
	propStr2                   = "propStr2"
	methodAdd           Method = "ADD"
	methodEdit          Method = "EDIT"
)

type Method string

const Admin = "admin"
const RoleAdmin = "ADMIN"

func TestMain(m *testing.M) {
	flag.Parse()
	os.Exit(m.Run())
}

// nolint: funlen
func PrepareData(ctx context.Context, t *testing.T) {
	client := ent.FromContext(ctx)

	locTypeL := client.LocationType.Create().
		SetName(locTypeNameL).
		SaveX(ctx)
	locTypeM := client.LocationType.Create().
		SetName(locTypeNameM).
		SaveX(ctx)

	locTypeS := client.LocationType.Create().
		SetName(locTypeNameS).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propNameStr).
		SetType(propertytype.TypeString).
		SetLocationType(locTypeS).
		SetStringVal("default").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameBool).
		SetType(propertytype.TypeBool).
		SetLocationType(locTypeS).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameDate).
		SetType(propertytype.TypeDate).
		SetLocationType(locTypeS).
		SetStringVal("1988-03-29").
		SaveX(ctx)

	client.LocationType.UpdateOneID(locTypeL.ID).
		SetIndex(0).
		SaveX(ctx)
	client.LocationType.UpdateOneID(locTypeM.ID).
		SetIndex(1).
		SaveX(ctx)
	client.LocationType.UpdateOneID(locTypeS.ID).
		SetIndex(2).
		SaveX(ctx)

	gpLocation := client.Location.Create().
		SetName(grandParentLocation).
		SetType(locTypeL).
		SetExternalID(externalIDL).
		SetLatitude(lat).
		SetLongitude(long).
		SaveX(ctx)
	pLocation := client.Location.Create().
		SetName(parentLocation).
		SetType(locTypeM).
		SetParent(gpLocation).
		SetExternalID(externalIDM).
		SetLatitude(lat).
		SetLongitude(long).
		SaveX(ctx)

	strProp := locTypeS.QueryPropertyTypes().Where(propertytype.TypeEQ(propertytype.TypeString)).OnlyX(ctx)
	boolProp := locTypeS.QueryPropertyTypes().Where(propertytype.TypeEQ(propertytype.TypeBool)).OnlyX(ctx)

	clocation := client.Location.Create().
		SetName(childLocation).
		SetType(locTypeS).
		SetParent(pLocation).
		SaveX(ctx)

	client.Property.Create().
		SetType(strProp).
		SetLocation(clocation).
		SetStringVal("override").
		SaveX(ctx)
	client.Property.Create().
		SetType(boolProp).
		SetLocation(clocation).
		SetBoolVal(true).
		SaveX(ctx)

	position1 := client.EquipmentPositionDefinition.Create().
		SetName(positionName).
		SaveX(ctx)

	ptyp := client.EquipmentPortType.Create().
		SetName("portType1").
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propStr).
		SetType(propertytype.TypeString).
		SetEquipmentPortType(ptyp).
		SetStringVal("t1").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propStr2).
		SetType(propertytype.TypeString).
		SetEquipmentPortType(ptyp).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propStr).
		SetType(propertytype.TypeString).
		SetLinkEquipmentPortType(ptyp).
		SetStringVal("t1").
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameBool).
		SetType(propertytype.TypeBool).
		SetLinkEquipmentPortType(ptyp).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameInt).
		SetType(propertytype.TypeInt).
		SetLinkEquipmentPortType(ptyp).
		SetIntVal(100).
		SaveX(ctx)

	port1 := client.EquipmentPortDefinition.Create().
		SetName(portName1).
		SetEquipmentPortTypeID(ptyp.ID).
		SaveX(ctx)

	equipmentType := client.EquipmentType.Create().
		SetName(equipmentTypeName).
		AddPositionDefinitions(position1).
		AddPortDefinitions(port1).
		SaveX(ctx)

	port2 := client.EquipmentPortDefinition.Create().
		SetName(portName2).
		SaveX(ctx)

	equipmentType2 := client.EquipmentType.Create().
		SetName(equipmentType2Name).
		AddPortDefinitions(port2).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(propNameStr).
		SetType(propertytype.TypeString).
		SetEquipmentType(equipmentType2).
		SetStringVal(propDefValue).
		SaveX(ctx)
	client.PropertyType.Create().
		SetName(propNameInt).
		SetType(propertytype.TypeInt).
		SetEquipmentType(equipmentType2).
		SetIntVal(propDevValInt).
		SaveX(ctx)

	posDef1 := equipmentType.QueryPositionDefinitions().Where(equipmentpositiondefinition.Name(positionName)).OnlyX(ctx)
	propDef1 := equipmentType2.QueryPropertyTypes().Where(propertytype.Name(propNameStr)).OnlyX(ctx)

	parentEquipment := client.Equipment.Create().
		SetName(parentEquip).
		SetType(equipmentType).
		SetLocation(clocation).
		SaveX(ctx)

	parentPos := client.EquipmentPosition.Create().
		SetDefinitionID(posDef1.ID).
		SetNillableParentID(&parentEquipment.ID).
		SaveX(ctx)

	childEquip := client.Equipment.Create().
		SetName(currEquip).
		SetType(equipmentType2).
		SetParentPosition(parentPos).
		SetExternalID(externalIDM).
		SaveX(ctx)

	client.Property.Create().
		SetStringVal(propInstanceValue).
		SetEquipment(childEquip).
		SetType(propDef1).
		SaveX(ctx)

	portDef1 := equipmentType.QueryPortDefinitions().Where(equipmentportdefinition.Name(portName1)).OnlyX(ctx)
	portDef2 := equipmentType2.QueryPortDefinitions().Where(equipmentportdefinition.Name(portName2)).OnlyX(ctx)

	ep1 := client.EquipmentPort.Create().
		SetDefinitionID(portDef1.ID).
		SetParentID(parentEquipment.ID).
		SaveX(ctx)
	ep2 := client.EquipmentPort.Create().
		SetDefinitionID(portDef2.ID).
		SetParentID(childEquip.ID).
		SaveX(ctx)

	client.Link.Create().
		AddPorts(ep1, ep2).
		SaveX(ctx)

	client.PropertyType.Create().
		SetName(newPropNameStr).
		SetStringVal(propDefValue2).
		SetType(propertytype.TypeString).
		SetEquipmentType(equipmentType2).
		SaveX(ctx)

	portID1, err := parentEquipment.QueryPorts().Where(equipmentport.HasDefinitionWith(equipmentportdefinition.ID(portDef1.ID))).OnlyID(ctx)
	require.NoError(t, err)
	portID2, err := childEquip.QueryPorts().Where(equipmentport.HasDefinitionWith(equipmentportdefinition.ID(portDef2.ID))).OnlyID(ctx)
	require.NoError(t, err)

	endp1 := client.ServiceEndpointDefinition.Create().
		SetName("endpoint type1").
		SetRole("CONSUMER").
		SetIndex(0).
		SetEquipmentType(equipmentType).
		SaveX(ctx)
	endp2 := client.ServiceEndpointDefinition.Create().
		SetName("endpoint type2").
		SetRole("PROVIDER").
		SetIndex(1).
		SetEquipmentType(equipmentType2).
		SaveX(ctx)
	serviceType := client.ServiceType.Create().
		SetName("L2 Service").
		SetHasCustomer(false).
		AddEndpointDefinitions(endp1, endp2).
		SaveX(ctx)

	s1 := client.Service.Create().
		SetName(firstServiceName).
		SetTypeID(serviceType.ID).
		SetStatus(service.StatusPending).
		SaveX(ctx)
	s2 := client.Service.Create().
		SetName(secondServiceName).
		SetTypeID(serviceType.ID).
		SetStatus(service.StatusPending).
		SaveX(ctx)

	ept0 := serviceType.QueryEndpointDefinitions().Where(serviceendpointdefinition.Index(0)).OnlyX(ctx)

	client.ServiceEndpoint.Create().
		SetEquipment(parentEquipment).
		SetPortID(portID1).
		SetDefinition(ept0).
		SetService(s1).
		SaveX(ctx)
	client.ServiceEndpoint.Create().
		SetEquipment(parentEquipment).
		SetPortID(portID1).
		SetDefinition(ept0).
		SetService(s2).
		SaveX(ctx)

	ept1 := serviceType.QueryEndpointDefinitions().Where(serviceendpointdefinition.Index(1)).OnlyX(ctx)

	client.ServiceEndpoint.Create().
		SetEquipment(childEquip).
		SetPortID(portID2).
		SetDefinition(ept1).
		SetService(s1).
		SaveX(ctx)
	/*
		helper: data now is of type:
		loc(grandParent):
			loc(parent):
				loc(child):
						parentEquipment(equipmentType): with portType1 (has 2 string props)
						childEquipment(equipmentType2): (no props props)
						these ports are linked together
		services:
			firstService:
					endpoints: parentEquipment consumer, childEquipment provider
			secondService:
					endpoints: parentEquipment consumer
	*/
}

func testAsyncExport(t *testing.T, typ exporttask.Type) {
	core, _ := observer.New(zap.DebugLevel)
	logger := log.NewDefaultLogger(zap.New(core))
	client := viewertest.NewTestClient(t)
	ctx := viewertest.NewContext(
		context.Background(), client,
		viewertest.WithUser(Admin), viewertest.WithRole(RoleAdmin))

	var (
		e          Exporter
		exportPath string
	)
	switch typ {
	case exporttask.TypeLocation:
		e = Exporter{Log: logger, Rower: LocationsRower{
			Log: logger,
		}}
		exportPath = "/locations"
	case exporttask.TypeEquipment:
		e = Exporter{Log: logger, Rower: EquipmentRower{
			Log: logger,
		}}
		exportPath = "/equipment"
	case exporttask.TypePort:
		e = Exporter{Log: logger, Rower: PortsRower{
			Log: logger,
		}}
		exportPath = "/ports"
	case exporttask.TypeLink:
		e = Exporter{Log: logger, Rower: LinksRower{
			Log: logger,
		}}
		exportPath = "/links"
	case exporttask.TypeService:
		e = Exporter{Log: logger, Rower: ServicesRower{
			Log: logger,
		}}
		exportPath = "/services"
	case exporttask.TypeWorkOrder:
		e = Exporter{Log: logger, Rower: WoRower{
			Log: logger,
		}}
		exportPath = "/work_orders"
	case exporttask.TypeProject:
		e = Exporter{Log: logger, Rower: ProjectRower{
			Log: logger,
		}}
		exportPath = "/projects"
	}

	th := viewertest.TestHandler(t, &e, client)
	server := httptest.NewServer(th)
	defer server.Close()

	req, err := http.NewRequest(http.MethodGet, server.URL+exportPath, nil)
	require.NoError(t, err)
	viewertest.SetDefaultViewerHeaders(req)
	req.Header.Set(viewer.FeaturesHeader, "async_export")

	PrepareData(ctx, t)
	require.NoError(t, err)

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	defer res.Body.Close()

	type resStruct struct {
		TaskID string
	}
	var response resStruct
	err = json.NewDecoder(res.Body).Decode(&response)
	require.NoError(t, err)
	taskID := response.TaskID
	require.NotEmpty(t, taskID)
	require.True(t, len(response.TaskID) > 1)
}

func WriteModifiedPortsCSV(t *testing.T, r *csv.Reader, skipLines, withVerify bool) (*bytes.Buffer, string) {
	var newLine []string
	var lines = make([][]string, 3)
	var buf bytes.Buffer
	bw := multipart.NewWriter(&buf)
	if skipLines {
		_ = bw.WriteField("skip_lines", "[2]")
	}
	if withVerify {
		_ = bw.WriteField("verify_before_commit", "true")
	}
	fileWriter, err := bw.CreateFormFile("file_0", "name1")
	require.Nil(t, err)
	for i := 0; ; i++ {
		line, err := r.Read()
		if err != nil {
			if err == io.EOF {
				break
			}
			require.Nil(t, err)
		}
		if i == 0 {
			lines[0] = line
		} else {
			newLine = line
			if line[1] == portName1 {
				newLine[17] = "new-prop-value"
				newLine[18] = "new-prop-value2"
			} else if line[1] == portName2 {
				newLine[16] = ""
			}
			lines[i] = newLine
		}
	}

	if withVerify {
		failLine := make([]string, len(lines[1]))
		copy(failLine, lines[1])
		lines = append(lines, failLine)
		lines[3][1] = "this"
		lines[3][2] = "should"
		lines[3][3] = "fail"
	}
	for _, l := range lines {
		stringLine := strings.Join(l, ",")
		fileWriter.Write([]byte(stringLine + "\n"))
	}
	ct := bw.FormDataContentType()
	require.NoError(t, bw.Close())
	return &buf, ct
}

func WriteModifiedLinksCSV(t *testing.T, r *csv.Reader, method Method, skipLines, withVerify bool) (*bytes.Buffer, string) {
	var newLine []string
	var lines = make([][]string, 2)
	var buf bytes.Buffer
	bw := multipart.NewWriter(&buf)
	if skipLines {
		_ = bw.WriteField("skip_lines", "[1]")
	}
	if withVerify {
		_ = bw.WriteField("verify_before_commit", "true")
	}
	fileWriter, err := bw.CreateFormFile("file_0", "name1")
	require.Nil(t, err)
	for i := 0; ; i++ {
		line, err := r.Read()
		if err != nil {
			if err == io.EOF {
				break
			}
			require.Nil(t, err)
		}
		if i == 0 {
			lines[0] = line
		} else {
			switch method {
			case methodAdd:
				newLine = append([]string{""}, line[1:]...)
			case methodEdit:
				newLine = line
				if line[2] == portName1 {
					newLine[26] = secondServiceName
					newLine[27] = "new-prop-value"
					newLine[28] = "true"
					newLine[29] = "10"
				}
			default:
				require.Fail(t, "method should be add or edit")
			}
			lines[i] = newLine
		}
	}
	if withVerify {
		failLine := make([]string, len(lines[1]))
		copy(failLine, lines[1])
		lines = append(lines, failLine)
		lines[2][2] = "this"
		lines[2][3] = "should"
		lines[2][4] = "fail"
	}
	for _, l := range lines {
		stringLine := strings.Join(l, ",")
		fileWriter.Write([]byte(stringLine + "\n"))
	}
	ct := bw.FormDataContentType()
	require.NoError(t, bw.Close())
	return &buf, ct
}
