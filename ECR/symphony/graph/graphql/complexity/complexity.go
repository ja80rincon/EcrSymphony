// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package complexity

import (
	"math"
	"math/bits"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ent"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
)

// Infinite is the maximum possible complexity value.
const Infinite = 1<<(bits.UintSize-1) - 1

// New creates a graphql complexity root.
// nolint: funlen
func New() (complexity generated.ComplexityRoot) {
	complexity.Location.Topology = func(childComplexity int, depth int) int {
		return childComplexity * int(math.Pow10(depth)) / 2
	}
	complexity.Query.Customers = PaginationComplexity
	complexity.Query.EquipmentPortDefinitions = PaginationComplexity
	complexity.Query.EquipmentPortTypes = PaginationComplexity
	complexity.Query.EquipmentPorts = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ []*pkgmodels.PortFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.EquipmentTypes = PaginationComplexity
	complexity.Query.Equipments = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.EquipmentOrder, _ []*pkgmodels.EquipmentFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Links = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ []*pkgmodels.LinkFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.LocationTypes = PaginationComplexity
	complexity.Query.Locations = func(childComplexity int, _ *bool, _ []int, _ *string, _ *bool, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.LocationOrder, _ []*pkgmodels.LocationFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.PermissionsPolicies = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ []*models.PermissionsPolicyFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.ProjectTypes = PaginationComplexity
	complexity.Query.Projects = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.ProjectOrder, _ []*models.ProjectFilterInput, _ *string, _ *string) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.SearchForNode = func(childComplexity int, _ string, after *ent.Cursor, first *int, before *ent.Cursor, last *int) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Services = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ []*pkgmodels.ServiceFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.ServiceTypes = PaginationComplexity
	complexity.Query.Users = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ []*models.UserFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.UsersGroups = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ []*models.UsersGroupFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.WorkOrderTypes = PaginationComplexity
	complexity.Query.WorkOrders = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.WorkOrderOrder, _ []*pkgmodels.WorkOrderFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.FlowDrafts = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *string) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Flows = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *string) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.FlowInstances = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.FlowInstanceOrder, _ []*models.FlowInstanceFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.AlarmFilters = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.AlarmFilterOrder, _ []*models.AlarmFilterFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.AlarmStatus = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.AlarmStatusOrder, _ []*models.AlarmStatusFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Comparators = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.ComparatorOrder, _ []*models.ComparatorFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.CounterFamilies = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.CounterFamilyOrder, _ []*models.CounterFamilyFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Counters = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.CounterOrder, _ []*models.CounterFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Kpis = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KpiOrder, _ []*models.KpiFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.KpiCategories = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KpiCategoryOrder, _ []*models.KpiCategoryFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Thresholds = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.ThresholdOrder, _ []*models.ThresholdFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Domains = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.DomainOrder, _ []*models.DomainFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Vendors = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.VendorOrder, _ []*models.VendorFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.RuleTypes = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.RuleTypeOrder, _ []*models.RuleTypeFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.EventSeverities = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.EventSeverityOrder, _ []*models.EventSeverityFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Comparators = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.ComparatorOrder, _ []*models.ComparatorFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Organizations = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.OrganizationOrder, _ []*models.OrganizationFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Formulas = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.FormulaOrder, _ []*models.FormulaFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Techs = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.TechOrder, _ []*models.TechFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.NetworkTypes = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.NetworkTypeOrder, _ []*models.NetworkTypeFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.RecommendationsSources = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.RecommendationsSourcesOrder, _ []*models.RecommendationsSourcesFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.RecommendationsCategories = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.RecommendationsCategoryOrder, _ []*models.RecommendationsCategoryFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Recommendations = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.RecommendationsOrder, _ []*models.RecommendationsFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Kqis = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KqiOrder, _ []*models.KqiFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.KqiCategories = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KqiCategoryOrder, _ []*models.KqiCategoryFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.KqiPerspectives = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KqiPerspectiveOrder, _ []*models.KqiPerspectiveFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.KqiTemporalFrequencies = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KqiTemporalFrequencyOrder, _ []*models.KqiTemporalFrequencyFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.KqiSources = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KqiSourceOrder, _ []*models.KqiSourceFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.KqiTargets = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *ent.KqiTargetOrder, _ []*models.KqiTargetFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.Appointments = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, _ *models.SlotFilterInput) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.Query.UsersAvailability = func(childComplexity int, _ []*models.UserFilterInput, _ models.SlotFilterInput, _ float64, _ models.RegularHoursInput) int {
		return SearchComplexity(childComplexity, nil)
	}
	complexity.Query.DocumentCategories = func(childComplexity int, locationTypeID *int, after *ent.Cursor, first *int, before *ent.Cursor, last *int) int {
		return PaginationComplexity(childComplexity, after, first, before, last)
	}
	complexity.DocumentCategory.FilesByEntity = func(childComplexity int, _ models.ImageEntity, _ *int) int {
		return SearchComplexity(childComplexity, nil)
	}
	complexity.DocumentCategory.HyperlinksByEntity = func(childComplexity int, _ models.ImageEntity, _ *int) int {
		return SearchComplexity(childComplexity, nil)
	}
	complexity.Query.ParametersCatalog = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int) int {
		return SearchComplexity(childComplexity, nil)
	}
	complexity.Query.PropertiesByCategories = func(childComplexity int, input []*pkgmodels.PropertiesByCategoryFilterInput) int {
		return SearchComplexity(childComplexity, nil)
	}
	complexity.Query.PropertyCategories = func(childComplexity int, after *ent.Cursor, first *int, before *ent.Cursor, last *int, orderBy *ent.PropertyCategoryOrder) int {
		return SearchComplexity(childComplexity, nil)
	}

	complexity.WorkOrder.Activities = func(childComplexity int, filter *models.ActivityFilterInput) int {
		var limit *int
		if filter != nil {
			limit = &filter.Limit
		}
		return SearchComplexity(childComplexity, limit)
	}
	complexity.Query.WorkerTypes = PaginationComplexity
	return complexity
}

// SearchComplexity returns the complexity function of searching queries.
func SearchComplexity(childComplexity int, limit *int) int {
	if limit != nil {
		return *limit * childComplexity
	}
	return Infinite
}

// PaginationComplexity returns the complexity function of paginating queries.
func PaginationComplexity(childComplexity int, _ *ent.Cursor, first *int, _ *ent.Cursor, last *int) int {
	switch {
	case first != nil:
		if last == nil || *first < *last {
			return *first * childComplexity
		}
		fallthrough
	case last != nil:
		return *last * childComplexity
	default:
		return Infinite
	}
}
