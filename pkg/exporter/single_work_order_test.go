// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/activity"
	"github.com/facebookincubator/symphony/pkg/ent/checklistitem"
	"github.com/facebookincubator/symphony/pkg/ent/comment"
	"github.com/facebookincubator/symphony/pkg/ent/file"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/surveycellscan"
	"github.com/facebookincubator/symphony/pkg/ent/workorder"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
	"gocloud.dev/blob"
	"gocloud.dev/blob/memblob"
)

type SingleWoTestSuite struct {
	suite.Suite
	client    *ent.Client
	ctx       context.Context
	bucket    *blob.Bucket
	workOrder *ent.WorkOrder
}

func (s *SingleWoTestSuite) SetupSuite() {
	s.client = viewertest.NewTestClient(s.T())
	s.ctx = viewertest.NewContext(context.Background(), s.client)
	s.bucket = memblob.OpenBucket(nil)
	s.workOrder = s.prepareSingleWOData()
}

func TestExports(t *testing.T) {
	suite.Run(t, &SingleWoTestSuite{})
}

func (s *SingleWoTestSuite) prepareSingleWOData() *ent.WorkOrder {
	PrepareData(s.ctx, s.T())
	client := ent.FromContext(s.ctx)

	// Create a Work Order Type
	wotype := client.WorkOrderType.Create().
		SetName("woTemplate1").
		SetDescription("woTemplate1 = desc").
		SaveX(s.ctx)

	// Create a Property Type
	client.PropertyType.Create().
		SetName(propStr).
		SetType(propertytype.TypeString).
		SetStringVal("t1").
		SetWorkOrderType(wotype).
		SaveX(s.ctx)

	// Create a Project Type
	projectType := client.ProjectType.Create().
		SetName("projTemplate").
		SaveX(s.ctx)

	// Create a Project
	user := viewer.FromContext(s.ctx).(*viewer.UserViewer).User()
	project := client.Project.Create().
		SetName("Project 1").
		SetCreator(user).
		SetType(projectType).
		SaveX(s.ctx)

	// Create a Work Order
	st := workorder.StatusClosed
	priority := workorder.PriorityHigh
	wo := client.WorkOrder.Create().
		SetName("WO1").
		SetDescription("WO1 - description").
		SetType(wotype).
		SetLocation(client.Location.Query().Where(location.Name(parentLocation)).OnlyX(s.ctx)).
		SetProject(project).
		SetAssignee(user).
		SetStatus(st).
		SetPriority(priority).
		SetOwner(user).
		SetCreationDate(time.Now()).
		SaveX(s.ctx)

	// Create a Work Order Property
	propStrEnt := wotype.QueryPropertyTypes().Where(propertytype.Name(propStr)).OnlyX(s.ctx)
	client.Property.Create().
		SetType(propStrEnt).
		SetStringVal("string1").
		SetWorkOrder(wo).
		SaveX(s.ctx)

	// Create two Activities
	client.Activity.Create().
		SetWorkOrder(wo).
		SetActivityType(activity.ActivityTypePriorityChanged).
		SetOldValue(workorder.PriorityLow.String()).
		SetNewValue(workorder.PriorityHigh.String()).
		SetAuthor(user).
		SaveX(s.ctx)

	client.Activity.Create().
		SetWorkOrder(wo).
		SetActivityType(activity.ActivityTypePriorityChanged).
		SetOldValue(workorder.PriorityHigh.String()).
		SetNewValue(workorder.PriorityLow.String()).
		SetAuthor(user).
		SaveX(s.ctx)

	// Create two Comments
	client.Comment.Create().
		SetWorkOrder(wo).
		SetAuthor(user).
		SetText("comment text 1").
		SaveX(s.ctx)

	client.Comment.Create().
		SetWorkOrder(wo).
		SetAuthor(user).
		SetText("comment text 2").
		SaveX(s.ctx)

	// Create Checklist Categories
	category1 := client.CheckListCategory.Create().
		SetTitle("First Category").
		SetWorkOrder(wo).
		SaveX(s.ctx)
	category2 := client.CheckListCategory.Create().
		SetTitle("Second Category").
		SetWorkOrder(wo).
		SaveX(s.ctx)

	// Create Checklist Item for First Category
	client.CheckListItem.Create().
		SetCheckListCategory(category1).
		SetTitle("Simple Item").
		SetType(enum.CheckListItemTypeSimple).
		SetIndex(0).
		SetIsMandatory(true).
		SetChecked(true).
		SaveX(s.ctx)

	// Create Checklist Item for Second Category
	client.CheckListItem.Create().
		SetTitle("Simple Item").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeSimple).
		SetIndex(0).
		SetIsMandatory(true).
		SetChecked(true).
		SaveX(s.ctx)

	client.CheckListItem.Create().
		SetTitle("Enum Item").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeEnum).
		SetIndex(1).
		SetIsMandatory(true).
		SetEnumValues("blue, green, yellow").
		SaveX(s.ctx)

	client.CheckListItem.Create().
		SetTitle("String Item").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeString).
		SetIndex(2).
		SetIsMandatory(false).
		SetStringVal("Here is the string").
		SaveX(s.ctx)

	client.CheckListItem.Create().
		SetTitle("Yes/No Item - Yes").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeYesNo).
		SetIndex(3).
		SetIsMandatory(false).
		SetYesNoVal(checklistitem.YesNoValYes).
		SaveX(s.ctx)

	client.CheckListItem.Create().
		SetTitle("Yes/No Item - Empty").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeYesNo).
		SetIndex(4).
		SetIsMandatory(false).
		SaveX(s.ctx)

	cellScanItem := client.CheckListItem.Create().
		SetTitle("Cell Scan").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeCellScan).
		SetIndex(5).
		SetIsMandatory(false).
		SaveX(s.ctx)

	client.SurveyCellScan.Create().
		SetChecklistItem(cellScanItem).
		SetNetworkType(surveycellscan.NetworkTypeCDMA).
		SetSignalStrength(4).
		SetTimestamp(time.Now()).
		SetLatitude(37.1234).
		SetLongitude(-122.1234).
		SaveX(s.ctx)

	wifiScanItem := client.CheckListItem.Create().
		SetTitle("WiFi Scan").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeWifiScan).
		SetIndex(6).
		SetIsMandatory(false).
		SaveX(s.ctx)

	client.SurveyWiFiScan.Create().
		SetChecklistItem(wifiScanItem).
		SetStrength(4).
		SetBand("N").
		SetBssid("00:11:22:33:44:55").
		SetSsid("WiFi AP").
		SetCapabilities("WEP").
		SetChannel(11).
		SetChannelWidth(60).
		SetFrequency(60).
		SetRssi(1.1).
		SetStrength(4).
		SetTimestamp(time.Now()).
		SetLatitude(37.1234).
		SetLongitude(-122.1234).
		SaveX(s.ctx)

	fileItem := client.CheckListItem.Create().
		SetTitle("Files").
		SetCheckListCategory(category2).
		SetType(enum.CheckListItemTypeFiles).
		SetIndex(7).
		SetIsMandatory(false).
		SetHelpText("Help Text").
		SaveX(s.ctx)

	client.File.Create().
		SetChecklistItem(fileItem).
		SetStoreKey("StoreKeyAlreadyIn").
		SetName("image.jpg").
		SetSize(1024).
		SetType(file.TypeImage).
		SetContentType("image/jpg").
		SaveX(s.ctx)

	return wo
}

func (s *SingleWoTestSuite) TestSingleWorkOrderExport() {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &ExcelExporter{Log: log, ExcelFile: SingleWo{Log: log, Bucket: s.bucket}}

	file, err := e.CreateExcelFile(s.ctx, s.workOrder.ID)
	s.Require().NoError(err)

	// Verify all the Work Order summary data is correct.
	// The Work Order summary is displayed in columns A and B in the first 12 rows:
	//   Column A      Column B
	//   ------------  -----------------
	//   ID            123456789
	//   Name          Work Order 1
	//   Description   WO1 - description
	//   ....          ....
	for i := 1; i <= 12; i++ {
		header, _ := file.GetCellValue(SummarySheetName, "A"+strconv.Itoa(i))
		value, _ := file.GetCellValue(SummarySheetName, "B"+strconv.Itoa(i))
		s.Require().Equal(SingleWoDataHeader[i-1], header)
		switch header {
		case "ID":
			s.Require().Equal(value, strconv.Itoa(s.workOrder.ID))
		case "Name":
			s.Require().Equal(value, s.workOrder.Name)
		case "Description":
			s.Require().Equal(value, *s.workOrder.Description)
		case "Project":
			project, err := s.workOrder.QueryProject().Only(s.ctx)
			s.Require().NoError(err)
			s.Require().Equal(value, project.Name)
		case "Type":
			workOrderType, err := s.workOrder.QueryType().Only(s.ctx)
			s.Require().NoError(err)
			s.Require().Equal(value, workOrderType.Name)
		case "Priority":
			s.Require().Equal(value, s.workOrder.Priority.String())
		case "Status":
			s.Require().Equal(value, s.workOrder.Status.String())
		case "Created":
			s.Require().Equal(value, s.workOrder.CreationDate.Format(TimeLayout))
		case "Closed":
			s.Require().Equal(value, s.workOrder.CloseDate.Format(TimeLayout))
		case "Location":
			location, err := s.workOrder.QueryLocation().Only(s.ctx)
			s.Require().NoError(err)
			s.Require().Equal(value, location.Name)
		case "Assignee":
			assignee, err := s.workOrder.QueryAssignee().Only(s.ctx)
			s.Require().NoError(err)
			s.Require().Equal(value, assignee.Email)
		case "Owner":
			owner, err := s.workOrder.QueryOwner().Only(s.ctx)
			s.Require().NoError(err)
			s.Require().Equal(value, owner.Email)
		}
	}
}

func (s *SingleWoTestSuite) TestSingleWorkOrderExportActivitiesAndComments() {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &ExcelExporter{Log: log, ExcelFile: SingleWo{Log: log, Bucket: s.bucket}}

	file, err := e.CreateExcelFile(s.ctx, s.workOrder.ID)
	s.Require().NoError(err)

	// The activity log beings on row 14 and is tabular
	//   Author         Activity/Comment                Created                    Updated
	//   fbuser@fb.com  CREATION_DATE set to 123456789  Fri, 25 Sep 2020:01:10:49  Fri, 25 Sep 2020:01:10:49

	// Check the activity log headers are as expected
	const activityLogHeaderRow = "14"
	for i, activityHeader := range ActivityHeader {
		cell := Columns[i] + activityLogHeaderRow
		header, _ := file.GetCellValue(SummarySheetName, cell)
		s.Require().Equal(activityHeader, header)
	}

	// Check the comments log in row 15-16
	const commentsLogStartingRow = 15
	comments, err := s.workOrder.QueryComments().Order(ent.Asc(comment.FieldCreateTime)).All(s.ctx)
	s.Require().NoError(err)

	for j, comment := range comments {
		for i, header := range ActivityHeader {
			cell := Columns[i] + strconv.Itoa(commentsLogStartingRow+j)
			value, _ := file.GetCellValue(SummarySheetName, cell)
			switch header {
			case "Author":
				author, err := comment.QueryAuthor().Only(s.ctx)
				s.Require().NoError(err)
				s.Require().Equal(author.Email, value)
			case "Activity/Comment":
				s.Require().Equal(comment.Text, value)
			case "Created":
				s.Require().Equal(comment.CreateTime.Format(TimeLayout), value)
			case "Updated":
				s.Require().Equal(comment.UpdateTime.Format(TimeLayout), value)
			}
		}
	}
	// Check the activities log in row 17-18
	const activitiesLogStartingRow = 17
	activities, err := s.workOrder.QueryActivities().Order(ent.Asc(activity.FieldCreateTime)).All(s.ctx)
	s.Require().NoError(err)
	for j, activity := range activities {
		for i, header := range ActivityHeader {
			cell := Columns[i] + strconv.Itoa(activitiesLogStartingRow+j)
			value, _ := file.GetCellValue(SummarySheetName, cell)
			switch header {
			case "Author":
				author, err := activity.QueryAuthor().Only(s.ctx)
				s.Require().NoError(err)
				s.Require().Equal(author.Email, value)
			case "Activity/Comment":
				activityVal := "changed " + activity.ActivityType.String() + " from " + activity.OldValue + " to " + activity.NewValue
				s.Require().Equal(activityVal, value)
			case "Created":
				s.Require().Equal(activity.CreateTime.Format(TimeLayout), value)
			case "Updated":
				s.Require().Equal(activity.UpdateTime.Format(TimeLayout), value)
			}
		}
	}
}

func (s *SingleWoTestSuite) TestSingleWorkOrderExportChecklist() {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &ExcelExporter{Log: log, ExcelFile: SingleWo{Log: log, Bucket: s.bucket}}

	file, err := e.CreateExcelFile(s.ctx, s.workOrder.ID)
	s.Require().NoError(err)

	checklists, err := s.workOrder.QueryCheckListCategories().All(s.ctx)
	s.Require().NoError(err)

	// Each checklist will be a different tab in the spreadsheet
	for _, checklist := range checklists {
		// Test that the first row contains the checklist column headers
		const checklistHeaderRow = "1"
		for i, checklistHeader := range ChecklistHeader {
			cell := Columns[i] + checklistHeaderRow
			header, _ := file.GetCellValue(checklist.Title, cell)
			s.Require().Equal(checklistHeader, header)
		}

		// Test the checklist items data
		items, err := checklist.QueryCheckListItems().All(s.ctx)
		s.Require().NoError(err)
		const checklistItemStartingRow = 2
		for j, item := range items {
			for i, checklistHeader := range ChecklistHeader {
				cell := Columns[i] + strconv.Itoa(checklistItemStartingRow+j)
				value, _ := file.GetCellValue(checklist.Title, cell)
				switch checklistHeader {
				case "Checklist Item":
					s.Require().Equal(item.Title, value)
				case "Is Mandatory":
					s.Require().Equal(strconv.FormatBool(item.IsMandatory), value)
				case "Response":
					s.checkItemType(item, value)
				case "Additional Instructions":
					if item.HelpText != nil {
						s.Require().Equal(*item.HelpText, value)
					}
				}
			}
		}
	}
}

func (s *SingleWoTestSuite) TestSingleWorkOrderExportBOM() {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &ExcelExporter{Log: log, ExcelFile: SingleWo{Log: log, Bucket: s.bucket}}

	file, err := e.CreateExcelFile(s.ctx, s.workOrder.ID)
	s.Require().NoError(err)

	rows, err := file.GetRows(BOMSheetName)
	s.Require().NoError(err)
	for _, ln := range rows {
		s.Require().EqualValues([]string{
			"Equipment Name",
			"Equipment Type",
			"State",
			fmt.Sprintf("Location (%s)", locTypeNameL),
			fmt.Sprintf("Location (%s)", locTypeNameM),
			fmt.Sprintf("Location (%s)", locTypeNameS),
		}, ln)
	}
}

func (s *SingleWoTestSuite) checkItemType(item *ent.CheckListItem, value string) {
	switch item.Type {
	case enum.CheckListItemTypeEnum:
		s.Require().Equal(item.SelectedEnumValues, value)
	case enum.CheckListItemTypeSimple:
		s.Require().Equal(strconv.FormatBool(item.Checked), value)
	case enum.CheckListItemTypeString:
		s.Require().Equal(item.StringVal, value)
	case enum.CheckListItemTypeYesNo:
		if item.YesNoVal != nil {
			s.Require().Equal(item.YesNoVal.String(), value)
		} else {
			s.Require().Equal("N/A", value)
		}
	case enum.CheckListItemTypeCellScan:
		var data strings.Builder
		data.WriteString(strings.Join(CellScanHeader, ", "))
		data.WriteString("\n\r")
		cellScans, err := item.QueryCellScan().All(s.ctx)
		s.Require().NoError(err)
		for _, cellScan := range cellScans {
			fields := []string{cellScan.CreateTime.Format(TimeLayout), cellScan.UpdateTime.Format(TimeLayout), cellScan.NetworkType.String(), strconv.Itoa(cellScan.SignalStrength), cellScan.Timestamp.Format(TimeLayout), fmt.Sprintf("%f", *cellScan.Latitude), fmt.Sprintf("%f", *cellScan.Longitude)}
			data.WriteString(strings.Join(fields, ", "))
			data.WriteString("\n\r")
		}
		s.Require().Equal(data.String(), value)
	case enum.CheckListItemTypeFiles:
		// TODO: figure out how to check for a photo in a cell.
		// excelize GetCellValue() does not return a string value for photos
	case enum.CheckListItemTypeWifiScan:
		var data strings.Builder
		data.WriteString(strings.Join(WifiScanHeader, ", "))
		data.WriteString("\n\r")
		wifiScans, err := item.QueryWifiScan().All(s.ctx)
		s.Require().NoError(err)
		for _, wifiScan := range wifiScans {
			fields := []string{
				wifiScan.CreateTime.Format(TimeLayout),
				wifiScan.UpdateTime.Format(TimeLayout),
				wifiScan.Band, wifiScan.Bssid,
				wifiScan.Ssid, wifiScan.Capabilities,
				strconv.Itoa(wifiScan.Channel),
				strconv.Itoa(wifiScan.ChannelWidth),
				strconv.Itoa(wifiScan.Frequency),
				strconv.FormatFloat(
					pointer.GetFloat64(wifiScan.Rssi),
					'f', -1, 64,
				),
				strconv.Itoa(wifiScan.Strength),
				strconv.FormatFloat(
					wifiScan.Latitude, 'f', -1, 64,
				),
				strconv.FormatFloat(
					wifiScan.Longitude, 'f', -1, 64,
				),
			}
			data.WriteString(strings.Join(fields, ", "))
			data.WriteString("\n\r")
		}
		s.Require().Equal(data.String(), value)
	}
}

func (s *SingleWoTestSuite) TestSingleWOAsyncExport() {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &ExcelExporter{Log: log, ExcelFile: SingleWo{Log: log, Bucket: s.bucket}}
	th := viewertest.TestHandler(s.T(), e, s.client)
	server := httptest.NewServer(th)
	defer server.Close()

	req, err := http.NewRequest(http.MethodGet, server.URL+"/single_work_order", nil)
	s.Require().NoError(err)

	viewertest.SetDefaultViewerHeaders(req)
	q := req.URL.Query()
	q.Add("id", strconv.Itoa(s.workOrder.ID))
	req.URL.RawQuery = q.Encode()
	res, err := http.DefaultClient.Do(req)
	s.Require().NoError(err)
	defer res.Body.Close()

	type resStruct struct {
		TaskID string
	}

	var response resStruct
	err = json.NewDecoder(res.Body).Decode(&response)
	s.Require().NoError(err)
	taskID := response.TaskID
	s.Require().NotEmpty(taskID)
	s.Require().True(len(response.TaskID) > 1)
}

func (s *SingleWoTestSuite) TestSingleWorkOrderExportCRL() {
	core, _ := observer.New(zap.DebugLevel)
	log := log.NewDefaultLogger(zap.New(core))

	e := &ExcelExporter{Log: log, ExcelFile: SingleWo{Log: log, Bucket: s.bucket}}

	file, err := e.CreateExcelFile(s.ctx, s.workOrder.ID)
	s.Require().NoError(err)

	rows, err := file.GetRows(CRLSheetName)
	s.Require().NoError(err)
	for _, ln := range rows {
		s.Require().EqualValues([]string{
			"Link State",
			"Equipment Name A",
			"Port Name A",
			"Port Type A",
			"Equipment Name B",
			"Port Name B",
			"Port Type B",
		}, ln)
	}
}
