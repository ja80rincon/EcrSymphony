// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/360EntSecGroup-Skylar/excelize/v2"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/exporttask"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/gorilla/mux"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

// Exporter encapsulates accessing db and logging
type Exporter struct {
	Log log.Logger
	Rower
}

type ExcelExporter struct {
	Log log.Logger
	ExcelFile
}

// Interface for creating an excel file
type ExcelFile interface {
	CreateExcelFile(context.Context, int) (*excelize.File, error)
}

type Rower interface {
	Rows(ctx context.Context, filters string) ([][]string, error)
}

func createExportTask(ctx context.Context, url *url.URL, log log.Logger) (*ent.ExportTask, error) {
	var (
		err        error
		etType     exporttask.Type
		singleWOId int
	)
	logger := log.For(ctx)
	logger.Debug("entered async export")
	filtersParam := url.Query().Get("filters")
	client := ent.FromContext(ctx)

	if err != nil {
		return nil, errors.Wrap(err, "cannot use filters")
	}
	switch url.Path {
	case "/locations":
		etType = exporttask.TypeLocation
	case "/equipment":
		etType = exporttask.TypeEquipment
	case "/ports":
		etType = exporttask.TypePort
	case "/links":
		etType = exporttask.TypeLink
	case "/services":
		etType = exporttask.TypeService
	case "/work_orders":
		etType = exporttask.TypeWorkOrder
	case "/projects":
		etType = exporttask.TypeProject
	case "/single_work_order":
		etType = exporttask.TypeSingleWorkOrder
		singleWOId, err = strconv.Atoi(url.Query().Get("id"))
		if err != nil {
			logger.Error("cannot query work order id", zap.Error(err))
			return nil, fmt.Errorf("cannot query work order id: %w", err)
		}
	default:
		return nil, errors.New("not supported entity for async export")
	}
	t, err := client.ExportTask.
		Create().
		SetType(etType).
		SetStatus(exporttask.StatusPending).
		SetNillableFilters(&filtersParam).
		SetNillableWoIDToExport(&singleWOId).
		Save(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "cannot create export task")
	}

	return t, nil
}

func writeExportTaskID(ctx context.Context, w http.ResponseWriter, id int, log log.Logger) {
	logger := log.For(ctx)
	taskID := struct {
		TaskID string
	}{
		strconv.Itoa(id),
	}

	output, err := json.Marshal(taskID)
	if err != nil {
		logger.Error("error in async export", zap.Error(err))
		http.Error(w, fmt.Sprintf("%q: error in async export", err), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(output)
	if err != nil {
		logger.Error("error in writing output", zap.Error(err))
		http.Error(w, fmt.Sprintf("%q: error in async export", err), http.StatusInternalServerError)
	}
}

// ServerHTTP handles requests to returns an export CSV file
func (m *Exporter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := m.Log.For(ctx)
	et, err := createExportTask(ctx, r.URL, m.Log)
	if err != nil {
		logger.Error("error in async export", zap.Error(err))
		http.Error(w, fmt.Sprintf("%q: error in async export", err), http.StatusInternalServerError)
	} else {
		writeExportTaskID(ctx, w, et.ID, m.Log)
	}
}

// ServerHTTP handles requests to returns an export Excel file with extension xlsx
func (m *ExcelExporter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	et, err := createExportTask(ctx, r.URL, m.Log)
	if err != nil {
		m.Log.For(ctx).Error("error in async export", zap.Error(err))
		http.Error(w, fmt.Sprintf("%q: error in async export", err), http.StatusInternalServerError)
		return
	}
	writeExportTaskID(ctx, w, et.ID, m.Log)
}

// NewHandler creates a upload http handler.
func NewHandler(log log.Logger) http.Handler {
	router := mux.NewRouter()
	routes := []struct {
		name    string
		handler Exporter
	}{
		{name: "equipment", handler: Exporter{Log: log, Rower: EquipmentRower{Log: log}}},
		{name: "ports", handler: Exporter{Log: log, Rower: PortsRower{Log: log}}},
		{name: "work_orders", handler: Exporter{Log: log, Rower: WoRower{Log: log}}},
		{name: "links", handler: Exporter{Log: log, Rower: LinksRower{Log: log}}},
		{name: "locations", handler: Exporter{Log: log, Rower: LocationsRower{Log: log}}},
		{name: "services", handler: Exporter{Log: log, Rower: ServicesRower{Log: log}}},
		{name: "projects", handler: Exporter{Log: log, Rower: ProjectRower{Log: log}}},
	}

	router.Path("/single_work_order").
		Methods(http.MethodGet).
		Handler(&ExcelExporter{Log: log, ExcelFile: SingleWo{Log: log}}).
		Name("single_work_order")

	for _, route := range routes {
		route := route
		router.Path("/" + route.name).
			Methods(http.MethodGet).
			Handler(&route.handler).
			Name(route.name)
	}
	return router
}
