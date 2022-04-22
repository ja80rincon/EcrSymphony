// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	"strconv"
	"strings"

	"github.com/AlekSi/pointer"

	"github.com/facebookincubator/symphony/pkg/viewer"

	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"

	"github.com/facebookincubator/symphony/pkg/ent/workorder"

	// Imports required for excelize to decode images
	_ "image/jpeg"
	_ "image/png"

	"github.com/360EntSecGroup-Skylar/excelize/v2"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/log"
	"go.uber.org/zap"
	"gocloud.dev/blob"
)

type SingleWo struct {
	Log    log.Logger
	Bucket *blob.Bucket
}

var (
	Columns            = []string{"A", "B", "C", "D", "E"}
	SingleWoDataHeader = []string{"ID", "Name", "Description", "Project", "Type", "Priority", "Status", "Created", "Closed", "Location", "Assignee", "Owner"}
	ChecklistHeader    = []string{"Checklist Item", "Is Mandatory", "Response", "Additional instructions"}
	CellScanHeader     = []string{"Created at", "Updated at", "Network Type", "Signal Strength", "Timestamp", "Latitude", "Longitude"}
	WifiScanHeader     = []string{"Created at", "Updated at", "Band", "BSSID", "SSID", "Capabilities", "Channel", "Channel Width", "Frequency", "RSSI", "Strength", "Latitude", "Longitude"}
	ActivityHeader     = []string{"Author", "Activity/Comment", "Created", "Updated"}
)

const (
	TimeLayout       = "Mon, 02 Jan 2006 15:04:05"
	SummarySheetName = "Summary"
	CRLSheetName     = "Cable Run List"
	MaxImageWidth    = 300.0
	BOMSheetName     = "Bill Of Material"
)

func (er SingleWo) CreateExcelFile(ctx context.Context, id int) (*excelize.File, error) {
	logger := er.Log.For(ctx)
	f := excelize.NewFile()
	client := ent.FromContext(ctx)
	wo, err := client.WorkOrder.Get(ctx, id)
	if err != nil {
		logger.Error("cannot query work order", zap.Error(err))
		return nil, fmt.Errorf("cannot query work order: %w", err)
	}
	if err := generateWoSummary(ctx, f, wo); err != nil {
		logger.Error("cannot generate work order", zap.Error(err))
		return nil, fmt.Errorf("cannot generate work order: %w", err)
	}
	checklists, err := wo.QueryCheckListCategories().All(ctx)
	if err != nil {
		logger.Error("cannot query checklist categories", zap.Error(err))
		return nil, fmt.Errorf("cannot query checklist categories: %w", err)
	}
	for _, checklist := range checklists {
		sheetName := checklist.Title
		f.NewSheet(sheetName)
		items, err := checklist.QueryCheckListItems().All(ctx)
		if err != nil {
			logger.Error("cannot query checklist items", zap.Error(err))
			return nil, fmt.Errorf("cannot query checklist items: %w", err)
		}

		if err := er.generateChecklistItems(ctx, items, sheetName, f); err != nil {
			logger.Error("cannot generate checklist items", zap.Error(err))
			return nil, fmt.Errorf("cannot generate checklist items: %w", err)
		}
	}
	if err := er.generateBOM(ctx, f, wo); err != nil {
		logger.Error("cannot generate bill of material", zap.Error(err))
		return nil, fmt.Errorf("cannot generate bill of material: %w", err)
	}
	if err := er.generateCRL(ctx, f, wo); err != nil {
		logger.Error("cannot generate cable run list", zap.Error(err))
		return nil, fmt.Errorf("cannot generate cable run list: %w", err)
	}
	return f, nil
}

func (er SingleWo) generateCRL(ctx context.Context, f *excelize.File, wo *ent.WorkOrder) error {
	crlRows, err := generateCRLRows(ctx, er.Log.For(ctx), wo)
	if err != nil {
		return err
	}
	if len(crlRows) == 0 {
		return errors.New("unable to generate CRL")
	}
	f.NewSheet(CRLSheetName)
	columnNames := getSheetColumnNames(len(crlRows[0]))
	_ = f.SetColWidth(CRLSheetName, columnNames[0], columnNames[len(columnNames)-1], 25)
	for i, row := range crlRows {
		for x, rowVal := range row {
			columnName := columnNames[x]
			cell := fmt.Sprintf("%s%d", columnName, i+1)
			_ = f.SetCellValue(CRLSheetName, cell, rowVal)
		}
	}
	return nil
}

func (er SingleWo) generateBOM(ctx context.Context, f *excelize.File, wo *ent.WorkOrder) error {
	bomRows, err := generateWoBOMRows(ctx, er.Log.For(ctx), wo)
	if err != nil {
		return err
	}
	if len(bomRows) == 0 {
		return errors.New("unable to generate BOM")
	}
	f.NewSheet(BOMSheetName)
	columnNames := getSheetColumnNames(len(bomRows[0]))
	_ = f.SetColWidth(BOMSheetName, columnNames[0], columnNames[len(columnNames)-1], 25)
	for i, row := range bomRows {
		for x, rowVal := range row {
			columnName := columnNames[x]
			cell := fmt.Sprintf("%s%d", columnName, i+1)
			_ = f.SetCellValue(BOMSheetName, cell, rowVal)
		}
	}
	return nil
}

func generateWoSummary(ctx context.Context, f *excelize.File, wo *ent.WorkOrder) error {
	f.SetSheetName("Sheet1", SummarySheetName)
	_ = f.SetColWidth(SummarySheetName, "A", "D", 40)
	currRow := 1
	data, err := getSummaryData(ctx, wo)
	if err != nil {
		return err
	}
	for i, value := range data {
		headerCell := "A" + strconv.Itoa(currRow)
		valueCell := "B" + strconv.Itoa(currRow)
		_ = f.SetCellValue(SummarySheetName, headerCell, SingleWoDataHeader[i])
		_ = f.SetCellValue(SummarySheetName, valueCell, value)
		setHeaderStyle(f, SummarySheetName, headerCell)
		currRow++
	}

	comments, err := wo.QueryComments().All(ctx)
	if err != nil {
		return err
	}
	activities, err := wo.QueryActivities().All(ctx)
	if err != nil {
		return err
	}
	currRow++

	for i, header := range ActivityHeader {
		cell := Columns[i] + strconv.Itoa(currRow)
		_ = f.SetCellValue(SummarySheetName, cell, header)
		setHeaderStyle(f, SummarySheetName, cell)
	}

	for _, comment := range comments {
		currRow++
		row := strconv.Itoa(currRow)
		author, err := comment.QueryAuthor().Only(ctx)
		if err != nil {
			return err
		}
		for j, data := range []string{author.Email, comment.Text, comment.CreateTime.Format(TimeLayout), comment.UpdateTime.Format(TimeLayout)} {
			cell := Columns[j] + row
			_ = f.SetCellValue(SummarySheetName, cell, data)
		}
	}
	for _, activity := range activities {
		currRow++
		author, err := activity.QueryAuthor().Only(ctx)
		if err != nil && !ent.IsNotFound(err) {
			return err
		}
		authorEmail := ""
		if author != nil {
			authorEmail = author.Email
		}
		row := strconv.Itoa(currRow)
		activityVal := "changed " + activity.ActivityType.String() + " from " + activity.OldValue + " to " + activity.NewValue
		if activity.IsCreate {
			activityVal = activity.ActivityType.String() + " set to " + activity.NewValue
		}
		for j, data := range []string{authorEmail, activityVal, activity.CreateTime.Format(TimeLayout), activity.UpdateTime.Format(TimeLayout)} {
			cell := Columns[j] + row
			_ = f.SetCellValue(SummarySheetName, cell, data)
		}
	}
	return nil
}

func (er SingleWo) generateChecklistItems(ctx context.Context, items []*ent.CheckListItem, sheetName string, f *excelize.File) error {
	_ = f.SetColWidth(sheetName, "A", "D", 40)
	_ = f.SetColWidth(sheetName, "B", "B", 11) // Is Mandatory column
	currRow := 1
	logger := er.Log.For(ctx)

	for i, header := range ChecklistHeader {
		cell := Columns[i] + strconv.Itoa(currRow)
		_ = f.SetCellValue(sheetName, cell, header)
		setHeaderStyle(f, sheetName, cell)
	}
	currRow++
	for _, item := range items {
		// Handle Photos
		if item.Type == enum.CheckListItemTypeFiles {
			_ = f.SetCellValue(sheetName, Columns[0]+strconv.Itoa(currRow), item.Title)
			_ = f.SetCellValue(sheetName, Columns[1]+strconv.Itoa(currRow), strconv.FormatBool(item.IsMandatory))
			err := er.addFilesToSheet(ctx, sheetName, item, f, &currRow)
			if err != nil {
				logger.Error("error adding files to spreadsheet", zap.Error(err))
			}
		} else {
			// Handle Everything else
			for j, data := range []string{item.Title, strconv.FormatBool(item.IsMandatory), getItemString(ctx, item)} {
				_ = f.SetCellValue(sheetName, Columns[j]+strconv.Itoa(currRow), data)
			}
		}
		if item.HelpText != nil {
			_ = f.SetCellValue(sheetName, Columns[3]+strconv.Itoa(currRow), *item.HelpText)
		}
		currRow++
	}
	return nil
}

func getItemString(ctx context.Context, item *ent.CheckListItem) string {
	switch item.Type {
	case enum.CheckListItemTypeEnum:
		return item.SelectedEnumValues
	case enum.CheckListItemTypeSimple:
		return strconv.FormatBool(item.Checked)
	case enum.CheckListItemTypeString:
		return item.StringVal
	case enum.CheckListItemTypeYesNo:
		if item.YesNoVal != nil {
			return item.YesNoVal.String()
		}
		return "N/A"
	case enum.CheckListItemTypeCellScan:
		data, err := getCellScanData(ctx, item)
		if err != nil {
			return ""
		}
		return data
	case enum.CheckListItemTypeWifiScan:
		data, err := getWifiScanData(ctx, item)
		if err != nil {
			return ""
		}
		return data
	}
	return ""
}

func getCellScanData(ctx context.Context, item *ent.CheckListItem) (string, error) {
	cellScans, err := item.QueryCellScan().All(ctx)
	if err != nil {
		return "", err
	}
	var data strings.Builder
	data.WriteString(strings.Join(CellScanHeader, ", "))
	data.WriteString("\n\r")
	for _, cellScan := range cellScans {
		fields := []string{cellScan.CreateTime.Format(TimeLayout), cellScan.UpdateTime.Format(TimeLayout), cellScan.NetworkType.String(), strconv.Itoa(cellScan.SignalStrength), cellScan.Timestamp.Format(TimeLayout), fmt.Sprintf("%f", *cellScan.Latitude), fmt.Sprintf("%f", *cellScan.Longitude)}
		data.WriteString(strings.Join(fields, ", "))
		data.WriteString("\n\r")
	}
	return data.String(), nil
}

func getWifiScanData(ctx context.Context, item *ent.CheckListItem) (string, error) {
	scans, err := item.QueryWifiScan().All(ctx)
	if err != nil {
		return "", err
	}

	var b strings.Builder
	join := func(strs []string) {
		for i, str := range strs {
			if i > 0 {
				b.WriteString(", ")
			}
			b.WriteString(str)
		}
		b.WriteString("\n\r")
	}
	join(WifiScanHeader)

	for _, scan := range scans {
		join([]string{
			scan.CreateTime.Format(TimeLayout),
			scan.UpdateTime.Format(TimeLayout),
			scan.Band, scan.Bssid,
			scan.Ssid, scan.Capabilities,
			strconv.Itoa(scan.Channel),
			strconv.Itoa(scan.ChannelWidth),
			strconv.Itoa(scan.Frequency),
			strconv.FormatFloat(
				pointer.GetFloat64(scan.Rssi),
				'f', -1, 64,
			),
			strconv.Itoa(scan.Strength),
			strconv.FormatFloat(
				scan.Latitude, 'f', -1, 64,
			),
			strconv.FormatFloat(
				scan.Longitude, 'f', -1, 64,
			),
		})
	}
	return b.String(), nil
}

func (er SingleWo) addFilesToSheet(ctx context.Context, sheetName string, item *ent.CheckListItem, f *excelize.File, currRow *int) error {
	logger := er.Log.For(ctx)
	tenant := viewer.FromContext(ctx).Tenant()

	files, err := item.QueryFiles().
		All(ctx)
	if err != nil {
		logger.Error("error getting files for item ID",
			zap.String("tenant", tenant),
			zap.Int("item.ID", item.ID),
		)
		return err
	}
	for _, file := range files {
		data, err := er.Bucket.ReadAll(ctx, tenant+"/"+file.StoreKey)
		if err != nil {
			logger.Error("cannot read blob",
				zap.String("tenant", tenant),
				zap.String("key", file.StoreKey),
			)
			return err
		}
		attributes, err := er.Bucket.Attributes(ctx, tenant+"/"+file.StoreKey)
		if err != nil {
			logger.Error("cannot get file attributes",
				zap.String("tenant", tenant),
				zap.String("key", file.StoreKey),
			)
			return err
		}
		fileExtension := ""
		switch attributes.ContentType {
		case "image/jpeg":
			fileExtension = ".jpg"
		case "image/jpg":
			fileExtension = ".jpg"
		case "image/png":
			fileExtension = ".png"
		}
		config, format, err := image.DecodeConfig(bytes.NewReader(data))
		if err != nil {
			logger.Error("issue decoding image", zap.Error(err))
			return err
		}
		logger.Debug("format",
			zap.String("format", format),
			zap.Int("width", config.Width),
			zap.Int("height", config.Height))

		logger.Debug("content type",
			zap.String("type", attributes.ContentType),
			zap.String("disposition", attributes.ContentDisposition),
			zap.String("encoding", attributes.ContentEncoding),
			zap.String("language", attributes.ContentLanguage),
			zap.Int64("size", attributes.Size),
			zap.Any("metadata", attributes.Metadata))

		scale := fmt.Sprintf("%f", MaxImageWidth/float32(config.Width))
		cellFormat := `{"x_scale": ` + scale + `, "y_scale": ` + scale + `,"positioning": "oneCell"}`
		logger.Debug("cell format", zap.String("format", cellFormat))
		err = f.AddPictureFromBytes(sheetName, Columns[2]+strconv.Itoa(*currRow), cellFormat, item.Title, fileExtension, data)
		if err != nil {
			logger.Error("issue adding image to spreadsheet", zap.Error(err))
			return err
		}
		_ = f.SetColWidth(sheetName, Columns[2], Columns[2], MaxImageWidth/6)
		*currRow++
	}

	return nil
}

func getSummaryData(ctx context.Context, wo *ent.WorkOrder) ([]string, error) {
	var (
		projName, woType, woDescription, locName, assigneeEmail, ownerEmail, closedDate string
		err                                                                             error
	)

	assignee, err := wo.QueryAssignee().Only(ctx)
	if err != nil && !ent.IsNotFound(err) {
		return nil, err
	}
	if assignee != nil {
		assigneeEmail = assignee.Email
	}
	owner, err := wo.QueryOwner().Only(ctx)
	if err != nil {
		return nil, err
	}
	ownerEmail = owner.Email
	project, err := wo.QueryProject().Only(ctx)
	if err != nil && !ent.IsNotFound(err) {
		return nil, err
	}
	if project != nil {
		projName = project.Name
	}
	location, err := wo.QueryLocation().Only(ctx)
	if err != nil && !ent.IsNotFound(err) {
		return nil, err
	}
	if location != nil {
		locName = location.Name
	}
	wType, err := wo.QueryType().Only(ctx)
	if err != nil {
		return nil, err
	}
	woType = wType.Name
	if wo.Status == workorder.StatusDone || wo.Status == workorder.StatusClosed {
		closedDate = wo.CloseDate.Format(TimeLayout)
	}
	if wo.Description != nil {
		woDescription = *wo.Description
	}

	return []string{strconv.Itoa(wo.ID), wo.Name, woDescription, projName, woType, wo.Priority.String(), wo.Status.String(), wo.CreationDate.Format(TimeLayout), closedDate, locName, assigneeEmail, ownerEmail}, err
}

func setHeaderStyle(f *excelize.File, sheetName string, cell string) {
	headerStyle, _ := f.NewStyle(`{
		"font":
		{
			"bold": true
		},
		"alignment":
		{
			"wrap_text": true
		}
	}`)
	_ = f.SetCellStyle(sheetName, cell, cell, headerStyle)
}

func getSheetColumnNames(columnLength int) []string {
	characters := "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	columns := make([]string, columnLength)
	for i := 0; i < columnLength; i++ {
		st := 0
		if i >= len(characters) {
			st = i / (len(characters))
		}
		columns[i] = fmt.Sprintf("%s%s", characters[:st], string(characters[i%26]))
	}
	return columns
}
