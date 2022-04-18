// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sort"
	"strconv"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertycategory"

	"github.com/facebookincubator/symphony/pkg/ent/documentcategory"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/graph/resolverutil"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/appointment"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/equipmentport"
	"github.com/facebookincubator/symphony/pkg/ent/link"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"github.com/facebookincubator/symphony/pkg/ent/locationtype"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/reportfilter"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/facebookincubator/symphony/pkg/ent/service"
	"github.com/facebookincubator/symphony/pkg/ent/servicetype"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	pkgmodels "github.com/facebookincubator/symphony/pkg/exporter/models"
	actions2 "github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/flowschema"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"
	"github.com/facebookincubator/symphony/pkg/viewer"
	pgkerrors "github.com/pkg/errors"
)

type queryResolver struct{ resolver }

func (r queryResolver) ParametersCatalog(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.ParameterCatalogConnection, error) {
	return r.ClientFrom(ctx).
		ParameterCatalog.
		Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) PropertyCategories(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int,
	orderBy *ent.PropertyCategoryOrder,
) (*ent.PropertyCategoryConnection, error) {
	return r.ClientFrom(ctx).
		PropertyCategory.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithPropertyCategoryOrder(orderBy),
		)
}

func (r queryResolver) DocumentCategories(ctx context.Context, locationTypeID *int, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.DocumentCategoryConnection, error) {
	filter := func(query *ent.DocumentCategoryQuery) (*ent.DocumentCategoryQuery, error) {
		if locationTypeID != nil {
			query = query.Where(
				documentcategory.HasLocationTypeWith(locationtype.ID(*locationTypeID)),
			)
		}
		return query, nil
	}
	return r.ClientFrom(ctx).
		DocumentCategory.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithDocumentCategoryFilter(filter),
		)
}

func (queryResolver) Me(ctx context.Context) (viewer.Viewer, error) {
	return viewer.FromContext(ctx), nil
}

func (r queryResolver) Node(ctx context.Context, id int) (ent.Noder, error) {
	return r.ClientFrom(ctx).Noder(ctx, id)
}

func (r queryResolver) ActionType(_ context.Context, id flowschema.ActionTypeID) (actions2.ActionType, error) {
	return r.flow.actionFactory.GetType(id)
}

func (r queryResolver) TriggerType(_ context.Context, id flowschema.TriggerTypeID) (triggers.TriggerType, error) {
	return r.flow.triggerFactory.GetType(id)
}

func (r queryResolver) LocationTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.LocationTypeConnection, error) {
	return r.ClientFrom(ctx).LocationType.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) Locations(
	ctx context.Context, onlyTopLevel *bool,
	types []int, name *string, needsSiteSurvey *bool,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.LocationOrder,
	filterBy []*pkgmodels.LocationFilterInput,
) (*ent.LocationConnection, error) {
	filter := func(query *ent.LocationQuery) (*ent.LocationQuery, error) {
		query, err := pkgexporter.LocationFilter(query, filterBy)
		if err != nil {
			return nil, err
		}
		if pointer.GetBool(onlyTopLevel) {
			query = query.Where(
				location.Not(
					location.HasParent(),
				),
			)
		}
		if name != nil {
			query = query.Where(
				location.NameContainsFold(*name),
			)
		}
		if len(types) > 0 {
			query = query.Where(
				location.HasTypeWith(
					locationtype.IDIn(types...),
				),
			)
		}
		if needsSiteSurvey != nil {
			query = query.Where(
				location.SiteSurveyNeeded(*needsSiteSurvey),
			)
		}
		return query, nil
	}
	return r.ClientFrom(ctx).
		Location.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithLocationOrder(orderBy),
			ent.WithLocationFilter(filter),
		)
}

func (r queryResolver) NearestSites(ctx context.Context, latitude, longitude float64, first int) ([]*ent.Location, error) {
	sites := r.ClientFrom(ctx).Location.Query().Where(location.HasTypeWith(locationtype.Site(true))).AllX(ctx)
	var lr locationResolver
	sort.Slice(sites, func(i, j int) bool {
		d1, _ := lr.DistanceKm(ctx, sites[i], latitude, longitude)
		d2, _ := lr.DistanceKm(ctx, sites[j], latitude, longitude)
		return d1 < d2
	})
	if len(sites) < first {
		return sites, nil
	}
	return sites[:first], nil
}

func (r queryResolver) EquipmentTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.EquipmentTypeConnection, error) {
	return r.ClientFrom(ctx).EquipmentType.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) EquipmentPortTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.EquipmentPortTypeConnection, error) {
	return r.ClientFrom(ctx).EquipmentPortType.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) EquipmentPortDefinitions(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.EquipmentPortDefinitionConnection, error) {
	return r.ClientFrom(ctx).EquipmentPortDefinition.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) EquipmentPorts(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	filters []*pkgmodels.PortFilterInput,
) (*ent.EquipmentPortConnection, error) {
	query := r.ClientFrom(ctx).EquipmentPort.Query()
	query, err := pkgexporter.PortFilter(query, filters)
	if err != nil {
		return nil, err
	}
	return query.Paginate(ctx, after, first, before, last)
}

func (r queryResolver) Equipments(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.EquipmentOrder,
	filterBy []*pkgmodels.EquipmentFilterInput,
) (*ent.EquipmentConnection, error) {
	return r.ClientFrom(ctx).
		Equipment.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithEquipmentOrder(orderBy),
			ent.WithEquipmentFilter(func(query *ent.EquipmentQuery) (*ent.EquipmentQuery, error) {
				return pkgexporter.EquipmentFilter(query, filterBy)
			}),
		)
}

func (r queryResolver) WorkOrders(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.WorkOrderOrder,
	filterBy []*pkgmodels.WorkOrderFilterInput,
) (*ent.WorkOrderConnection, error) {
	return r.ClientFrom(ctx).
		WorkOrder.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithWorkOrderOrder(orderBy),
			ent.WithWorkOrderFilter(
				func(query *ent.WorkOrderQuery) (*ent.WorkOrderQuery, error) {
					return pkgexporter.WorkOrderFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) WorkOrderTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.WorkOrderTypeConnection, error) {
	return r.ClientFrom(ctx).WorkOrderType.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) Links(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	filters []*pkgmodels.LinkFilterInput,
) (*ent.LinkConnection, error) {
	query := r.ClientFrom(ctx).Link.Query()
	query, err := pkgexporter.LinkFilter(query, filters)
	if err != nil {
		return nil, err
	}
	return query.Paginate(ctx, after, first, before, last)
}

func (r queryResolver) Projects(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.ProjectOrder,
	filterBy []*models.ProjectFilterInput,
	propertyValue *string,
	propertyOrder *string,
) (*ent.ProjectConnection, error) {
	if propertyValue != nil && len(*propertyValue) > 0 {
		var direction string
		if propertyOrder != nil {
			direction = *propertyOrder
		} else {
			direction = ent.OrderDirectionAsc.String()
		}

		var limit int
		if first != nil {
			limit = *first
		} else {
			limit = 1
		}

		return CustomPaginateProjects(ctx, r.ClientFrom(ctx), after, limit, direction, filterBy, *propertyValue)
	}
	return r.ClientFrom(ctx).
		Project.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithProjectOrder(orderBy),
			ent.WithProjectFilter(
				func(query *ent.ProjectQuery) (*ent.ProjectQuery, error) {
					return resolverutil.ProjectFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Counters(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.CounterOrder,
	filterBy []*models.CounterFilterInput,
) (*ent.CounterConnection, error) {
	return r.ClientFrom(ctx).
		Counter.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithCounterOrder(orderBy),
			ent.WithCounterFilter(
				func(query *ent.CounterQuery) (*ent.CounterQuery, error) {
					return resolverutil.CounterFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Kpis(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KpiOrder,
	filterBy []*models.KpiFilterInput,
) (*ent.KpiConnection, error) {
	return r.ClientFrom(ctx).
		Kpi.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKpiOrder(orderBy),
			ent.WithKpiFilter(
				func(query *ent.KpiQuery) (*ent.KpiQuery, error) {
					return resolverutil.KpiFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) KpiCategories(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KpiCategoryOrder,
	filterBy []*models.KpiCategoryFilterInput,
) (*ent.KpiCategoryConnection, error) {
	return r.ClientFrom(ctx).
		KpiCategory.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKpiCategoryOrder(orderBy),
			ent.WithKpiCategoryFilter(
				func(query *ent.KpiCategoryQuery) (*ent.KpiCategoryQuery, error) {
					return resolverutil.KpiCategoryFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) Thresholds(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.ThresholdOrder,
	filterBy []*models.ThresholdFilterInput,
) (*ent.ThresholdConnection, error) {
	return r.ClientFrom(ctx).
		Threshold.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithThresholdOrder(orderBy),
			ent.WithThresholdFilter(
				func(query *ent.ThresholdQuery) (*ent.ThresholdQuery, error) {
					return resolverutil.ThresholdFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) AlarmFilters(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.AlarmFilterOrder,
	filterBy []*models.AlarmFilterFilterInput,
) (*ent.AlarmFilterConnection, error) {
	return r.ClientFrom(ctx).
		AlarmFilter.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithAlarmFilterOrder(orderBy),
			ent.WithAlarmFilterFilter(
				func(query *ent.AlarmFilterQuery) (*ent.AlarmFilterQuery, error) {
					return resolverutil.AlarmFilterFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Domains(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.DomainOrder,
	filterBy []*models.DomainFilterInput,
) (*ent.DomainConnection, error) {
	return r.ClientFrom(ctx).
		Domain.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithDomainOrder(orderBy),
			ent.WithDomainFilter(
				func(query *ent.DomainQuery) (*ent.DomainQuery, error) {
					return resolverutil.DomainFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Vendors(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.VendorOrder,
	filterBy []*models.VendorFilterInput,
) (*ent.VendorConnection, error) {
	return r.ClientFrom(ctx).
		Vendor.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithVendorOrder(orderBy),
			ent.WithVendorFilter(
				func(query *ent.VendorQuery) (*ent.VendorQuery, error) {
					return resolverutil.VendorFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) CounterFamilies(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.CounterFamilyOrder,
	filterBy []*models.CounterFamilyFilterInput,
) (*ent.CounterFamilyConnection, error) {
	return r.ClientFrom(ctx).
		CounterFamily.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithCounterFamilyOrder(orderBy),
			ent.WithCounterFamilyFilter(
				func(query *ent.CounterFamilyQuery) (*ent.CounterFamilyQuery, error) {
					return resolverutil.CounterFamilyFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) RuleTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.RuleTypeOrder,
	filterBy []*models.RuleTypeFilterInput,
) (*ent.RuleTypeConnection, error) {
	return r.ClientFrom(ctx).
		RuleType.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithRuleTypeOrder(orderBy),
			ent.WithRuleTypeFilter(
				func(query *ent.RuleTypeQuery) (*ent.RuleTypeQuery, error) {
					return resolverutil.RuleTypeFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) EventSeverities(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.EventSeverityOrder,
	filterBy []*models.EventSeverityFilterInput,
) (*ent.EventSeverityConnection, error) {
	return r.ClientFrom(ctx).
		EventSeverity.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithEventSeverityOrder(orderBy),
			ent.WithEventSeverityFilter(
				func(query *ent.EventSeverityQuery) (*ent.EventSeverityQuery, error) {
					return resolverutil.EventSeverityFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Comparators(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.ComparatorOrder,
	filterBy []*models.ComparatorFilterInput,
) (*ent.ComparatorConnection, error) {
	return r.ClientFrom(ctx).
		Comparator.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithComparatorOrder(orderBy),
			ent.WithComparatorFilter(
				func(query *ent.ComparatorQuery) (*ent.ComparatorQuery, error) {
					return resolverutil.ComparatorFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) AlarmStatus(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.AlarmStatusOrder,
	filterBy []*models.AlarmStatusFilterInput,
) (*ent.AlarmStatusConnection, error) {
	return r.ClientFrom(ctx).
		AlarmStatus.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithAlarmStatusOrder(orderBy),
			ent.WithAlarmStatusFilter(
				func(query *ent.AlarmStatusQuery) (*ent.AlarmStatusQuery, error) {
					return resolverutil.AlarmStatusFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) Organizations(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.OrganizationOrder,
	filterBy []*models.OrganizationFilterInput,
) (*ent.OrganizationConnection, error) {
	return r.ClientFrom(ctx).
		Organization.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithOrganizationOrder(orderBy),
			ent.WithOrganizationFilter(
				func(query *ent.OrganizationQuery) (*ent.OrganizationQuery, error) {
					return resolverutil.OrganizationFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) Formulas(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.FormulaOrder,
	filterBy []*models.FormulaFilterInput,
) (*ent.FormulaConnection, error) {
	return r.ClientFrom(ctx).
		Formula.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithFormulaOrder(orderBy),
			ent.WithFormulaFilter(
				func(query *ent.FormulaQuery) (*ent.FormulaQuery, error) {
					return resolverutil.FormulaFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) Techs(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.TechOrder,
	filterBy []*models.TechFilterInput,
) (*ent.TechConnection, error) {
	return r.ClientFrom(ctx).
		Tech.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithTechOrder(orderBy),
			ent.WithTechFilter(
				func(query *ent.TechQuery) (*ent.TechQuery, error) {
					return resolverutil.TechFilter(query, filterBy)
				},
			),
		)
}
func (r queryResolver) NetworkTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.NetworkTypeOrder,
	filterBy []*models.NetworkTypeFilterInput,
) (*ent.NetworkTypeConnection, error) {
	return r.ClientFrom(ctx).
		NetworkType.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithNetworkTypeOrder(orderBy),
			ent.WithNetworkTypeFilter(
				func(query *ent.NetworkTypeQuery) (*ent.NetworkTypeQuery, error) {
					return resolverutil.NetworkTypeFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) RecommendationsSources(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.RecommendationsSourcesOrder,
	filterBy []*models.RecommendationsSourcesFilterInput,
) (*ent.RecommendationsSourcesConnection, error) {
	return r.ClientFrom(ctx).
		RecommendationsSources.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithRecommendationsSourcesOrder(orderBy),
			ent.WithRecommendationsSourcesFilter(
				func(query *ent.RecommendationsSourcesQuery) (*ent.RecommendationsSourcesQuery, error) {
					return resolverutil.RecommendationsSourcesFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) RecommendationsCategories(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.RecommendationsCategoryOrder,
	filterBy []*models.RecommendationsCategoryFilterInput,
) (*ent.RecommendationsCategoryConnection, error) {
	return r.ClientFrom(ctx).
		RecommendationsCategory.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithRecommendationsCategoryOrder(orderBy),
			ent.WithRecommendationsCategoryFilter(
				func(query *ent.RecommendationsCategoryQuery) (*ent.RecommendationsCategoryQuery, error) {
					return resolverutil.RecommendationsCategoryFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Recommendations(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.RecommendationsOrder,
	filterBy []*models.RecommendationsFilterInput,
) (*ent.RecommendationsConnection, error) {
	return r.ClientFrom(ctx).
		Recommendations.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithRecommendationsOrder(orderBy),
			ent.WithRecommendationsFilter(
				func(query *ent.RecommendationsQuery) (*ent.RecommendationsQuery, error) {
					return resolverutil.RecommendationsFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Services(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	filters []*pkgmodels.ServiceFilterInput) (*ent.ServiceConnection, error) {
	query := r.ClientFrom(ctx).Service.Query().Where(service.HasTypeWith(servicetype.IsDeleted(false)))
	query, err := pkgexporter.ServiceFilter(query, filters)
	if err != nil {
		return nil, err
	}
	return query.Paginate(ctx, after, first, before, last)
}

func (r queryResolver) Users(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	filters []*models.UserFilterInput) (*ent.UserConnection, error) {
	query := r.ClientFrom(ctx).User.Query()
	query, err := resolverutil.UserFilter(query, filters)
	if err != nil {
		return nil, err
	}
	return query.Paginate(ctx, after, first, before, last)
}

func (r queryResolver) UsersGroups(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	filters []*models.UsersGroupFilterInput) (*ent.UsersGroupConnection, error) {
	query := r.ClientFrom(ctx).UsersGroup.Query()
	query, err := resolverutil.UsersGroupFilter(query, filters)
	if err != nil {
		return nil, err
	}
	return query.Paginate(ctx, after, first, before, last)
}

func (r queryResolver) PermissionsPolicies(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	filters []*models.PermissionsPolicyFilterInput) (*ent.PermissionsPolicyConnection, error) {
	query := r.ClientFrom(ctx).PermissionsPolicy.Query()
	query, err := resolverutil.PermissionsPolicyFilter(query, filters)
	if err != nil {
		return nil, err
	}
	return query.Paginate(ctx, after, first, before, last)
}

func (r queryResolver) SearchForNode(
	ctx context.Context, name string,
	_ *ent.Cursor, limit *int,
	_ *ent.Cursor, _ *int,
) (*models.SearchNodesConnection, error) {
	if limit == nil {
		return nil, errors.New("first is a mandatory param")
	}
	client := r.ClientFrom(ctx)
	locations, err := client.Location.Query().
		Where(
			location.Or(
				location.NameContainsFold(name),
				location.ExternalIDContainsFold(name),
			),
		).
		Limit(*limit).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying locations: %w", err)
	}

	edges := make([]*models.SearchNodeEdge, len(locations))
	for i, l := range locations {
		edges[i] = &models.SearchNodeEdge{
			Node: l,
		}
	}
	if len(locations) == *limit {
		return &models.SearchNodesConnection{Edges: edges}, nil
	}

	equipments, err := client.Equipment.Query().
		Where(equipment.Or(
			equipment.NameContainsFold(name),
			equipment.ExternalIDContainsFold(name),
		)).
		Limit(*limit - len(locations)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying equipment: %w", err)
	}
	for _, e := range equipments {
		edges = append(edges, &models.SearchNodeEdge{
			Node: e,
		})
	}
	return &models.SearchNodesConnection{Edges: edges}, nil
}

func (r queryResolver) PossibleProperties(ctx context.Context, entityType enum.PropertyEntity) (pts []*ent.PropertyType, err error) {
	client := r.ClientFrom(ctx)
	switch entityType {
	case enum.PropertyEntityEquipment:
		pts, err = client.EquipmentType.Query().QueryPropertyTypes().All(ctx)
	case enum.PropertyEntityService:
		pts, err = client.ServiceType.Query().QueryPropertyTypes().All(ctx)
	case enum.PropertyEntityLink:
		pts, err = client.EquipmentPortType.Query().QueryLinkPropertyTypes().All(ctx)
	case enum.PropertyEntityPort:
		pts, err = client.EquipmentPortType.Query().QueryPropertyTypes().All(ctx)
	case enum.PropertyEntityLocation:
		pts, err = client.LocationType.Query().QueryPropertyTypes().All(ctx)
	case enum.PropertyEntityProject:
		pts, err = client.ProjectType.Query().QueryProperties().All(ctx)
	default:
		return nil, fmt.Errorf("unsupported entity type: %s", entityType)
	}
	if err != nil {
		return nil, fmt.Errorf("querying property types: %w", err)
	}

	type key struct {
		name string
		typ  propertytype.Type
	}
	var (
		groups = map[key]struct{}{}
		types  []*ent.PropertyType
	)
	for _, pt := range pts {
		k := key{pt.Name, pt.Type}
		if _, ok := groups[k]; !ok {
			groups[k] = struct{}{}
			types = append(types, pt)
		}
	}
	return types, nil
}

func (r queryResolver) Surveys(ctx context.Context) ([]*ent.Survey, error) {
	surveys, err := r.ClientFrom(ctx).Survey.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying all surveys: %w", err)
	}
	return surveys, nil
}

func (r queryResolver) ServiceTypes(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.ServiceTypeConnection, error) {
	return r.ClientFrom(ctx).ServiceType.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) Customers(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
) (*ent.CustomerConnection, error) {
	return r.ClientFrom(ctx).Customer.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) ReportFilters(ctx context.Context, entity models.FilterEntity) ([]*ent.ReportFilter, error) {
	rfs, err := r.ClientFrom(ctx).ReportFilter.Query().Where(reportfilter.EntityEQ(reportfilter.Entity(entity))).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("querying report filters for entity %v: %w", entity, err)
	}
	return rfs, nil
}

func (r queryResolver) LatestPythonPackage(ctx context.Context) (*models.LatestPythonPackageResult, error) {
	packages, err := r.PythonPackages(ctx)
	if err != nil {
		return nil, err
	}
	if len(packages) == 0 {
		return nil, nil
	}
	lastBreakingChange := len(packages) - 1
	for i, pkg := range packages {
		if pkg.HasBreakingChange {
			lastBreakingChange = i
			break
		}
	}
	return &models.LatestPythonPackageResult{
		LastPythonPackage:         packages[0],
		LastBreakingPythonPackage: packages[lastBreakingChange],
	}, nil
}

func (queryResolver) PythonPackages(context.Context) ([]*models.PythonPackage, error) {
	var (
		packages []models.PythonPackage
		res      []*models.PythonPackage
	)
	if err := json.Unmarshal([]byte(PyinventoryConsts), &packages); err != nil {
		return nil, fmt.Errorf("decoding python packages: %w", err)
	}
	for _, p := range packages {
		p := p
		res = append(res, &p)
	}
	return res, nil
}

func (r queryResolver) Vertex(ctx context.Context, id int) (*ent.Node, error) {
	return r.ClientFrom(ctx).Node(ctx, id)
}

var ErrMultipleEndToEndPath = errors.New("multiple paths found")

func (r queryResolver) EndToEndPath(ctx context.Context, linkID *int, portID *int) (*models.EndToEndPath, error) {
	client := r.ClientFrom(ctx)
	if portID != nil {
		currentPort, err := client.EquipmentPort.
			Query().
			WithLink().
			Where(equipmentport.ID(*portID)).
			First(ctx)
		if err != nil {
			return nil, fmt.Errorf("unable to find port: %w", err)
		}
		_, err = r.getNextConnectedPortWithLink(ctx, currentPort)
		switch {
		case ent.IsNotFound(err):
			return &models.EndToEndPath{Ports: []*ent.EquipmentPort{currentPort}}, nil
		case ent.IsNotSingular(err):
			return nil, ErrMultipleEndToEndPath
		case err != nil:
			return nil, fmt.Errorf("unable to find backplane port: %w", err)
		}
		currentLink, err := currentPort.Edges.LinkOrErr()
		if err != nil {
			return r.traverseEndToEndPath(ctx, nil, currentPort)
		}
		nextPort, err := currentLink.QueryPorts().
			Where(equipmentport.IDNotIn(currentPort.ID)).
			First(ctx)
		if err != nil {
			return nil, fmt.Errorf("unable to find next port: %w", err)
		}
		return r.traverseEndToEndPath(ctx, currentLink, currentPort, nextPort)
	}
	if linkID == nil {
		return nil, errors.New("a portId or linkId is required")
	}
	currentLink, err := client.Link.Query().WithPorts().Where(link.ID(*linkID)).First(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to find link for port: %w", err)
	}
	return r.traverseEndToEndPath(ctx, currentLink, currentLink.Edges.Ports...)
}

func (r queryResolver) traverseEndToEndPath(ctx context.Context, initialLink *ent.Link, ports ...*ent.EquipmentPort) (*models.EndToEndPath, error) {
	result := models.EndToEndPath{Links: []*ent.Link{}, Ports: []*ent.EquipmentPort{}}
	switch {
	case initialLink != nil:
		result.Links = append(result.Links, initialLink)
	case len(ports) == 1:
		result.Ports = append(result.Ports, ports[0])
	}
	for _, port := range ports {
		for {
			nextBackPlanePort, err := r.getNextConnectedPortWithLink(ctx, port)
			if err != nil {
				if ent.IsNotFound(err) {
					break
				}
				if ent.IsNotSingular(err) {
					return nil, ErrMultipleEndToEndPath
				}
				return nil, fmt.Errorf("unable to find backplane port %w", err)
			}
			if nextBackPlanePort.Edges.Link == nil {
				result.Ports = append(result.Ports, nextBackPlanePort)
				break
			}
			nextLink := nextBackPlanePort.Edges.Link
			result.Links = append(result.Links, nextLink)
			linkPorts, err := nextLink.Edges.PortsOrErr()
			if err != nil || len(linkPorts) < 1 {
				return nil, fmt.Errorf("unable to find port for link %d: %w", port.ID, err)
			}
			if nextBackPlanePort.ID != linkPorts[0].ID {
				port = linkPorts[0]
				continue
			}
			port = linkPorts[1]
		}
	}
	return &result, nil
}

func (r queryResolver) getNextConnectedPortWithLink(ctx context.Context, port *ent.EquipmentPort) (*ent.EquipmentPort, error) {
	portParentEquipmentID, err := port.QueryParent().FirstID(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to find port parent equipment: %w", err)
	}
	return port.QueryDefinition().
		QueryConnectedPorts().
		QueryPorts().
		Where(equipmentport.HasParentWith(equipment.ID(portParentEquipmentID))).
		WithLink(func(query *ent.LinkQuery) {
			query.WithPorts()
		}).
		Only(ctx)
}

func (r queryResolver) WorkerTypes(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.WorkerTypeConnection, error) {
	return r.ClientFrom(ctx).WorkerType.Query().
		Paginate(ctx, after, first, before, last)
}

func (r queryResolver) Kqis(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KqiOrder,
	filterBy []*models.KqiFilterInput,
) (*ent.KqiConnection, error) {
	return r.ClientFrom(ctx).
		Kqi.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKqiOrder(orderBy),
			ent.WithKqiFilter(
				func(query *ent.KqiQuery) (*ent.KqiQuery, error) {
					return resolverutil.KqiFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) KqiCategories(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KqiCategoryOrder,
	filterBy []*models.KqiCategoryFilterInput,
) (*ent.KqiCategoryConnection, error) {
	return r.ClientFrom(ctx).
		KqiCategory.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKqiCategoryOrder(orderBy),
			ent.WithKqiCategoryFilter(
				func(query *ent.KqiCategoryQuery) (*ent.KqiCategoryQuery, error) {
					return resolverutil.KqiCategoryFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) KqiPerspectives(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KqiPerspectiveOrder,
	filterBy []*models.KqiPerspectiveFilterInput,
) (*ent.KqiPerspectiveConnection, error) {
	return r.ClientFrom(ctx).
		KqiPerspective.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKqiPerspectiveOrder(orderBy),
			ent.WithKqiPerspectiveFilter(
				func(query *ent.KqiPerspectiveQuery) (*ent.KqiPerspectiveQuery, error) {
					return resolverutil.KqiPerspectiveFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) KqiTemporalFrequencies(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KqiTemporalFrequencyOrder,
	filterBy []*models.KqiTemporalFrequencyFilterInput,
) (*ent.KqiTemporalFrequencyConnection, error) {
	return r.ClientFrom(ctx).
		KqiTemporalFrequency.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKqiTemporalFrequencyOrder(orderBy),
			ent.WithKqiTemporalFrequencyFilter(
				func(query *ent.KqiTemporalFrequencyQuery) (*ent.KqiTemporalFrequencyQuery, error) {
					return resolverutil.KqiTemporalFrequencyFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) KqiSources(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KqiSourceOrder,
	filterBy []*models.KqiSourceFilterInput,
) (*ent.KqiSourceConnection, error) {
	return r.ClientFrom(ctx).
		KqiSource.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKqiSourceOrder(orderBy),
			ent.WithKqiSourceFilter(
				func(query *ent.KqiSourceQuery) (*ent.KqiSourceQuery, error) {
					return resolverutil.KqiSourceFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) KqiTargets(
	ctx context.Context,
	after *ent.Cursor, first *int,
	before *ent.Cursor, last *int,
	orderBy *ent.KqiTargetOrder,
	filterBy []*models.KqiTargetFilterInput,
) (*ent.KqiTargetConnection, error) {
	return r.ClientFrom(ctx).
		KqiTarget.
		Query().
		Paginate(ctx, after, first, before, last,
			ent.WithKqiTargetOrder(orderBy),
			ent.WithKqiTargetFilter(
				func(query *ent.KqiTargetQuery) (*ent.KqiTargetQuery, error) {
					return resolverutil.KqiTargetFilter(query, filterBy)
				},
			),
		)
}

func (r queryResolver) Appointments(
	ctx context.Context,
	after *ent.Cursor,
	first *int,
	before *ent.Cursor,
	last *int,
	slotFilterBy *models.SlotFilterInput) (*ent.AppointmentConnection, error) {
	return r.ClientFrom(ctx).Appointment.Query().
		Paginate(ctx, after, first, before, last,
			// ent.WithProjectOrder(orderBy),
			ent.WithAppointmentFilter(
				func(query *ent.AppointmentQuery) (*ent.AppointmentQuery, error) {
					return resolverutil.SlotFilter(query, slotFilterBy)
				},
			),
		)
}

// nolint: funlen
func (r queryResolver) UsersAvailability(
	ctx context.Context,
	filterBy []*models.UserFilterInput,
	slotFilterBy models.SlotFilterInput,
	duration float64,
	regularHours models.RegularHoursInput) ([]*models.UserAvailability, error) {
	query := r.ClientFrom(ctx).User.Query()
	query, err := resolverutil.UserFilter(query, filterBy)
	if err != nil {
		return nil, err
	}

	var (
		users []*models.UserAvailability
		prev  *ent.Appointment
	)

	SH := regularHours.WorkdayStartHour
	SM := regularHours.WorkdayStartMinute
	EH := regularHours.WorkdayEndHour
	EM := regularHours.WorkdayEndMinute

	TZ, err := time.LoadLocation("")
	if err != nil {
		return nil, fmt.Errorf("error loading timezone %w", err)
	}

	y, m, d := slotFilterBy.SlotStartDate.Date()
	dswt := time.Date(y, m, d, SH, SM, 0, 0, TZ)

	slotStart := slotFilterBy.SlotStartDate

	if dswt.After(slotStart) {
		slotStart = dswt
	}

	slotDuration, err := time.ParseDuration(strconv.FormatFloat(duration, 'f', -1, 64) + "h")

	if err != nil {
		return nil, fmt.Errorf("error parsing slot duration %w", err)
	}

	u := query.AllX(ctx)

	for _, us := range u {
		qaps := r.ClientFrom(ctx).User.QueryAppointment(us).
			Where(appointment.Or(
				appointment.And(
					appointment.StartLTE(slotFilterBy.SlotStartDate),
					appointment.EndGT(slotFilterBy.SlotStartDate)),
				appointment.And(
					appointment.StartGTE(slotFilterBy.SlotStartDate),
					appointment.StartLTE(slotFilterBy.SlotEndDate)))).Order(ent.Asc(appointment.FieldStart))

		aps := qaps.AllX(ctx)
		naps, err := qaps.Count(ctx)

		if err != nil {
			return nil, err
		}

		if naps == 0 {
			users = append(users, &models.UserAvailability{
				User:          us,
				SlotStartDate: slotStart,
				SlotEndDate:   slotStart.Add(slotDuration),
			})
		} else {
			i := 0
			for _, a := range aps {
				i++
				y, m, d := a.Start.Date()
				dswt := time.Date(y, m, d, SH, SM, 0, 0, TZ)
				ndswt := resolverutil.NextWorkDay(dswt, SH, SM, 0, 0)
				if dswt.After(slotStart) {
					slotStart = dswt
				}

				if i == 1 {
					if resolverutil.LE(slotStart.Add(slotDuration), a.Start) && resolverutil.IsWorkTime(slotStart, SH, SM, EH, EM) {
						users = append(users, &models.UserAvailability{
							User:          us,
							SlotStartDate: slotStart,
							SlotEndDate:   slotStart.Add(slotDuration),
						})
						break
					}
					prev = a
				} else {
					if resolverutil.GE(a.Start.Add(-slotDuration), prev.End) && resolverutil.IsWorkTime(prev.End.Add(slotDuration), SH, SM, EH, EM) {
						users = append(users, &models.UserAvailability{
							User:          us,
							SlotStartDate: prev.End,
							SlotEndDate:   prev.End.Add(slotDuration),
						})
						break
					}
					prev = a
				}

				if i == naps {
					if resolverutil.IsWorkTime(a.End.Add(slotDuration), SH, SM, EH, EM) {
						users = append(users, &models.UserAvailability{
							User:          us,
							SlotStartDate: a.End,
							SlotEndDate:   a.End.Add(slotDuration),
						})
						break
					} else if resolverutil.LE(ndswt.Add(slotDuration), slotFilterBy.SlotEndDate) {
						users = append(users, &models.UserAvailability{
							User:          us,
							SlotStartDate: ndswt,
							SlotEndDate:   ndswt.Add(slotDuration),
						})
					}
				}
			}
		}
	}
	return users, nil
}

func (r queryResolver) PropertiesByCategories(ctx context.Context, filterBy []*pkgmodels.PropertiesByCategoryFilterInput) ([]*models.PropertiesByCategories, error) {
	client := r.ClientFrom(ctx)
	var (
		propsByGroups  []*models.PropertiesByCategories
		propCategoryID []int
		locationID     *int
		nonCategory    *string
	)
	propCategoryID, locationID, nonCategory, err := resolverutil.HandlePropertyByCategoriesFilter(filterBy)
	if err != nil {
		return nil, err
	}
	if *nonCategory != "" {
		group := resolverutil.NewPropertiesByCategories()
		group.Name = nonCategory
		prop, err := client.Property.Query().Where(
			property.HasLocationWith(location.ID(*locationID)),
			property.HasTypeWith(propertytype.Not(propertytype.HasPropertyCategory())),
		).WithType().All(ctx)
		if err != nil {
			return nil, pgkerrors.Errorf("error query Property,  %s", err)
		}
		idsPropTypes := resolverutil.GetPropTypesIds(prop)
		propTypes, err := client.PropertyType.Query().Where(
			propertytype.Not(propertytype.IDIn(idsPropTypes...)),
			propertytype.HasLocationTypeWith(locationtype.HasLocationsWith(location.ID(*locationID))),
			propertytype.Not(propertytype.HasPropertyCategory()),
		).All(ctx)
		if err != nil {
			return nil, pgkerrors.Errorf("error query PropertyType, %s", err)
		}
		group.PropertyType = propTypes
		group.Properties = prop
		propsByGroups = append(propsByGroups, &group)
	}
	propCategories, err := client.PropertyCategory.Query().Where(propertycategory.IDIn(propCategoryID...)).Order(ent.Asc(propertycategory.FieldIndex)).All(ctx)
	if err != nil {
		return nil, pgkerrors.Errorf("error query PropertyCategory, %s", err)
	}
	for _, propCategory := range propCategories {
		group := resolverutil.NewPropertiesByCategories()
		group.ID = &propCategory.ID
		group.Name = &propCategory.Name
		prop, err := client.Property.Query().Where(
			property.HasLocationWith(location.ID(*locationID)),
			property.HasTypeWith(propertytype.HasPropertyCategoryWith(propertycategory.ID(propCategory.ID))),
		).WithType().All(ctx)
		if err != nil {
			return nil, pgkerrors.Errorf("error query Property, %s", err)
		}
		idsPropTypes := resolverutil.GetPropTypesIds(prop)
		propTypes, err := client.PropertyType.Query().Where(
			propertytype.Not(propertytype.IDIn(idsPropTypes...)),
			propertytype.HasLocationTypeWith(locationtype.HasLocationsWith(location.ID(*locationID))),
			propertytype.HasPropertyCategoryWith(propertycategory.ID(propCategory.ID)),
		).All(ctx)
		if err != nil {
			return nil, pgkerrors.Errorf("error query PropertyType, %s", err)
		}
		group.PropertyType = propTypes
		group.Properties = prop
		propsByGroups = append(propsByGroups, &group)
	}
	return propsByGroups, nil
}
