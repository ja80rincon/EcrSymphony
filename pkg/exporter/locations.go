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
	"github.com/facebookincubator/symphony/pkg/exporter/models"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type locationsFilterInput struct {
	Name          enum.LocationFilterType  `json:"name"`
	Operator      enum.FilterOperator      `jsons:"operator"`
	StringValue   string                   `json:"stringValue"`
	IDSet         []string                 `json:"idSet"`
	StringSet     []string                 `json:"stringSet"`
	PropertyValue models.PropertyTypeInput `json:"propertyValue"`
	MaxDepth      *int                     `json:"maxDepth"`
	BoolValue     *bool                    `json:"boolValue"`
}

type LocationsRower struct {
	Log log.Logger
}

func getFilterInput(filtersParam string, logger *zap.Logger) ([]*models.LocationFilterInput, error) {
	var (
		filterInput []*models.LocationFilterInput
		err         error
	)
	if filtersParam != "" {
		filterInput, err = paramToLocationFilterInput(filtersParam)
		if err != nil {
			logger.Error("cannot filter location", zap.Error(err))
			return nil, errors.Wrap(err, "cannot filter location")
		}
	}
	return filterInput, nil
}

func (lr LocationsRower) Rows(ctx context.Context, filtersParam string) ([][]string, error) {
	var (
		logger           = lr.Log.For(ctx)
		filterInput      []*models.LocationFilterInput
		locationIDHeader = [...]string{bom + "Location ID"}
		fixedHeaders     = [...]string{"External ID", "Latitude", "Longitude"}
	)
	filterInput, err := getFilterInput(filtersParam, logger)
	if err != nil {
		logger.Error("cannot filter location", zap.Error(err))
		return nil, errors.Wrap(err, "cannot filter location")
	}

	client := ent.FromContext(ctx)

	locations, err := LocationSearch(ctx, client, filterInput, nil)
	if err != nil {
		logger.Error("cannot query location", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query location")
	}

	locationsList := locations.Locations
	allRows := make([][]string, len(locationsList)+1)
	locationIDs := make([]int, len(locationsList))
	for i, l := range locationsList {
		locationIDs[i] = l.ID
	}

	var orderedLocTypes, propertyTypes []string
	orderedLocTypes, err = LocationTypeHierarchy(ctx, client)
	if err != nil {
		logger.Error("cannot query location types", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query location types")
	}

	for i, l := range locationsList {
		locationIDs[i] = l.ID
	}
	propertyTypes, err = PropertyTypesSlice(ctx, locationIDs, client, enum.PropertyEntityLocation)
	if err != nil {
		logger.Error("cannot query property types", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query property types")
	}

	title := append(locationIDHeader[:], orderedLocTypes...)
	title = append(title, fixedHeaders[:]...)
	title = append(title, propertyTypes...)

	allRows[0] = title

	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, value := range locationsList {
		value, i := value, i
		cg.Go(func(ctx context.Context) error {
			row, err := locationToSlice(ctx, value, orderedLocTypes, propertyTypes)
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

func locationToSlice(ctx context.Context, location *ent.Location, orderedLocTypes, propertyTypes []string) ([]string, error) {
	var (
		lParents, properties []string
		err                  error
	)

	g := ctxgroup.WithContext(ctx)
	g.Go(func(ctx context.Context) (err error) {
		lParents, err = locationHierarchy(ctx, location, orderedLocTypes)
		return err
	})
	g.Go(func(ctx context.Context) (err error) {
		properties, err = PropertiesSlice(ctx, location, propertyTypes, enum.PropertyEntityLocation)
		return err
	})
	if err = g.Wait(); err != nil {
		return nil, err
	}

	lat := fmt.Sprintf("%f", location.Latitude)
	long := fmt.Sprintf("%f", location.Longitude)

	fixedData := []string{location.ExternalID, lat, long}

	row := []string{strconv.Itoa(location.ID)}
	row = append(row, lParents...)
	row = append(row, fixedData...)
	row = append(row, properties...)

	return row, nil
}

func paramToLocationFilterInput(params string) ([]*models.LocationFilterInput, error) {
	var inputs []locationsFilterInput
	err := json.Unmarshal([]byte(params), &inputs)
	if err != nil {
		return nil, err
	}

	ret := make([]*models.LocationFilterInput, 0, len(inputs))
	for _, f := range inputs {
		upperName := strings.ToUpper(f.Name.String())
		upperOp := strings.ToUpper(f.Operator.String())
		propertyValue := f.PropertyValue
		maxDepth := 5
		if f.MaxDepth != nil {
			maxDepth = *f.MaxDepth
		}
		intIDSet, err := ToIntSlice(f.IDSet)
		if err != nil {
			return nil, fmt.Errorf("wrong id set %v: %w", f.IDSet, err)
		}
		inp := models.LocationFilterInput{
			FilterType:    enum.LocationFilterType(upperName),
			Operator:      enum.FilterOperator(upperOp),
			StringValue:   pointer.ToString(f.StringValue),
			PropertyValue: &propertyValue,
			IDSet:         intIDSet,
			StringSet:     f.StringSet,
			MaxDepth:      &maxDepth,
			BoolValue:     f.BoolValue,
		}
		ret = append(ret, &inp)
	}
	return ret, nil
}

func LocationFilter(query *ent.LocationQuery, filters []*models.LocationFilterInput) (*ent.LocationQuery, error) {
	var err error
	for _, f := range filters {
		switch {
		case strings.HasPrefix(f.FilterType.String(), "LOCATION_INST"):
			if query, err = handleLocationFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "LOCATION_TYPE"):
			if query, err = handleLocationTypeFilter(query, f); err != nil {
				return nil, err
			}
		case strings.HasPrefix(f.FilterType.String(), "PROPERTY"):
			if query, err = handleLocationPropertyFilter(query, f); err != nil {
				return nil, err
			}
		}
	}
	return query, nil
}

func LocationSearch(ctx context.Context, client *ent.Client, filters []*models.LocationFilterInput, limit *int) (*models.LocationSearchResult, error) {
	var (
		query = client.Location.Query()
		err   error
	)
	query, err = LocationFilter(query, filters)
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
	locs, err := query.All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "Querying locations failed")
	}
	return &models.LocationSearchResult{
		Locations: locs,
		Count:     count,
	}, nil
}
