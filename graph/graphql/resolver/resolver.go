// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/facebookincubator/symphony/pkg/flowengine/actions"
	"github.com/facebookincubator/symphony/pkg/flowengine/triggers"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/log"
)

type (
	// Config add configuration for flow resolvers.
	FlowConfig struct {
		TriggerFactory triggers.Factory
		ActionFactory  actions.Factory
	}
	// Config configures resolver.
	Config struct {
		Logger          log.Logger
		ReceiverFactory ev.ReceiverFactory
		Flow            FlowConfig
	}

	// Option allows for managing resolver configuration using functional options.
	Option func(*resolver)

	resolver struct {
		logger log.Logger
		event  struct{ ev.ReceiverFactory }
		flow   struct {
			triggerFactory triggers.Factory
			actionFactory  actions.Factory
		}
	}
)

// New creates a graphql resolver.
func New(cfg Config, opts ...Option) generated.ResolverRoot {
	r := &resolver{logger: cfg.Logger}
	r.event.ReceiverFactory = cfg.ReceiverFactory
	r.flow.triggerFactory = cfg.Flow.TriggerFactory
	r.flow.actionFactory = cfg.Flow.ActionFactory
	for _, opt := range opts {
		opt(r)
	}
	return r
}

func (resolver) ClientFrom(ctx context.Context) *ent.Client {
	client := ent.FromContext(ctx)
	if client == nil {
		panic("no ClientFrom attached to context")
	}
	return client
}

func (r resolver) Equipment() generated.EquipmentResolver {
	return equipmentResolver{r}
}

func (resolver) EquipmentPortType() generated.EquipmentPortTypeResolver {
	return equipmentPortTypeResolver{}
}

func (resolver) EquipmentType() generated.EquipmentTypeResolver {
	return equipmentTypeResolver{}
}

func (resolver) User() generated.UserResolver {
	return userResolver{}
}

func (resolver) Location() generated.LocationResolver {
	return locationResolver{}
}

func (resolver) LocationType() generated.LocationTypeResolver {
	return locationTypeResolver{}
}

func (resolver) DocumentCategory() generated.DocumentCategoryResolver {
	return documentCategoryResolver{}
}

func (resolver) FloorPlan() generated.FloorPlanResolver {
	return floorPlanResolver{}
}

func (r resolver) Mutation() generated.MutationResolver {
	return mutationResolver{r}
}

func (r resolver) Query() generated.QueryResolver {
	return queryResolver{r}
}

func (r resolver) Subscription() generated.SubscriptionResolver {
	return subscriptionResolver{r}
}

func (resolver) WorkOrder() generated.WorkOrderResolver {
	return workOrderResolver{}
}

func (resolver) WorkOrderType() generated.WorkOrderTypeResolver {
	return workOrderTypeResolver{}
}

func (r resolver) Survey() generated.SurveyResolver {
	return surveyResolver{}
}

func (r resolver) SurveyQuestion() generated.SurveyQuestionResolver {
	return surveyQuestionResolver{}
}

func (r resolver) SurveyTemplateQuestion() generated.SurveyTemplateQuestionResolver {
	return surveyTemplateQuestionResolver{}
}

func (r resolver) SurveyCellScan() generated.SurveyCellScanResolver {
	return surveyCellScanResolver{}
}

func (r resolver) SurveyWiFiScan() generated.SurveyWiFiScanResolver {
	return surveyWiFiScanResolver{}
}

func (r resolver) PropertyType() generated.PropertyTypeResolver {
	return propertyTypeResolver{}
}

func (r resolver) Property() generated.PropertyResolver {
	return propertyResolver{}
}

func (resolver) Service() generated.ServiceResolver {
	return serviceResolver{}
}

func (r resolver) ServiceType() generated.ServiceTypeResolver {
	return serviceTypeResolver{}
}

func (resolver) Project() generated.ProjectResolver {
	return projectResolver{}
}

func (resolver) ProjectType() generated.ProjectTypeResolver {
	return projectTypeResolver{}
}

func (resolver) Viewer() generated.ViewerResolver {
	return viewerResolver{}
}

func (r resolver) ReportFilter() generated.ReportFilterResolver {
	return reportFilterResolver{}
}

func (r resolver) ExportTask() generated.ExportTaskResolver {
	return exportTaskResolver{}
}

func (r resolver) PermissionsPolicy() generated.PermissionsPolicyResolver {
	return permissionsPolicyResolver{}
}

func (r resolver) Activity() generated.ActivityResolver {
	return activityResolver{}
}

func (r resolver) Flow() generated.FlowResolver {
	return flowResolver{}
}

func (r resolver) FlowDraft() generated.FlowDraftResolver {
	return flowDraftResolver{}
}

func (r resolver) FlowExecutionTemplate() generated.FlowExecutionTemplateResolver {
	return flowExecutionTemplate{}
}

func (r resolver) Block() generated.BlockResolver {
	return blockResolver{triggerFactory: r.flow.triggerFactory, actionFactory: r.flow.actionFactory}
}

func (r resolver) VariableDefinition() generated.VariableDefinitionResolver {
	return variableDefinitionResolver{}
}

func (r resolver) VariableExpression() generated.VariableExpressionResolver {
	return variableExpressionResolver{triggerFactory: r.flow.triggerFactory, actionFactory: r.flow.actionFactory}
}

func (r resolver) BlockVariable() generated.BlockVariableResolver {
	return blockVariableResolver{triggerFactory: r.flow.triggerFactory, actionFactory: r.flow.actionFactory}
}

func (r resolver) Vendor() generated.VendorResolver {
	return vendorResolver{}
}

func (r resolver) Tech() generated.TechResolver {
	return techResolver{}
}

func (r resolver) Kpi() generated.KpiResolver {
	return kpiResolver{}
}

func (r resolver) CounterFormula() generated.CounterFormulaResolver {
	return counterFormulaResolver{}
}

func (r resolver) Counter() generated.CounterResolver {
	return counterResolver{}
}

func (r resolver) Formula() generated.FormulaResolver {
	return formulaResolver{}
}

func (r resolver) AlarmFilter() generated.AlarmFilterResolver {
	return alarmFilterResolver{}
}

func (r resolver) AlarmStatus() generated.AlarmStatusResolver {
	return alarmStatusResolver{}
}

func (r resolver) Comparator() generated.ComparatorResolver {
	return comparatorResolver{}
}

func (r resolver) Threshold() generated.ThresholdResolver {
	return thresholdResolver{}
}

func (r resolver) Rule() generated.RuleResolver {
	return ruleResolver{}
}

func (r resolver) RuleType() generated.RuleTypeResolver {
	return ruleTypeResolver{}
}

func (r resolver) EventSeverity() generated.EventSeverityResolver {
	return eventSeverityResolver{}
}

func (r resolver) KqiCategory() generated.KqiCategoryResolver {
	return kqiCategoryResolver{}
}

func (r resolver) KqiPerspective() generated.KqiPerspectiveResolver {
	return kqiPerspectiveResolver{}
}

func (r resolver) KqiTemporalFrequency() generated.KqiTemporalFrequencyResolver {
	return kqiTemporalFrequencyResolver{}
}

func (r resolver) KqiSource() generated.KqiSourceResolver {
	return kqiSourceResolver{}
}

func (r resolver) Kqi() generated.KqiResolver {
	return kqiResolver{}
}
func (r resolver) KqiTarget() generated.KqiTargetResolver {
	return kqiTargetResolver{}
}

func (r resolver) KqiComparator() generated.KqiComparatorResolver {
	return kqiComparatorResolver{}
}

func (r resolver) Recommendations() generated.RecommendationsResolver {
	return recommendationsResolver{}
}

func (r resolver) PropertyCategory() generated.PropertyCategoryResolver {
	return propertyCategoryResolver{}
}
