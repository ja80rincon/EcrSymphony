// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package schema

import (
	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/authz"
)

// SurveyCellScan holds the schema definition for the SurveyCellScan entity.
type SurveyCellScan struct {
	schema
}

// Fields of the SurveyCellScan.
func (SurveyCellScan) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("network_type").
			Values("CDMA", "GSM", "LTE", "WCDMA").
			Comment("The type of the cellular network"),
		field.Int("signal_strength").
			Comment("The strength of the cellular network in dBm"),
		field.Time("timestamp").
			Comment("Time at which cellular network was scanned").
			Optional().
			Nillable(),
		field.String("base_station_id").
			Comment("Base Station Identity Code").
			Optional().
			Nillable(),
		field.String("network_id").
			Comment("CDMA Network ID").
			Optional().
			Nillable(),
		field.String("system_id").
			Comment("CDMA System ID").
			Optional().
			Nillable(),
		field.String("cell_id").
			Comment("The Cell Identity (cid) of the tower as described in TS 27.007").
			Optional().
			Nillable(),
		field.String("location_area_code").
			Comment("GSM 16-bit Location Area Code (lac)").
			Optional().
			Nillable(),
		field.String("mobile_country_code").
			Comment("3-digit Mobile Country Code (mcc)").
			Optional().
			Nillable(),
		field.String("mobile_network_code").
			Comment("2 or 3-digit Mobile Network Code (mnc)").
			Optional().
			Nillable(),
		field.String("primary_scrambling_code").
			Comment("UMTS Primary Scrambling Code described in TS 25.331").
			Optional().
			Nillable(),
		field.String("operator").
			Comment("Operator name of the cellular network").
			Optional().
			Nillable(),
		field.Int("arfcn").
			Comment("GSM Absolute RF Channel Number (arfcn)").
			Optional().
			Nillable(),
		field.String("physical_cell_id").
			Comment("LTE Physical Cell Id (pci)").
			Optional().
			Nillable(),
		field.String("tracking_area_code").
			Comment("LTE 16-bit Tracking Area Code (tac)").
			Optional().
			Nillable(),
		field.Int("timing_advance").
			Comment("LTE timing advance described in 3GPP 36.213 Sec 4.2.3").
			Optional().
			Nillable(),
		field.Int("earfcn").
			Comment("LTE Absolute RF Channel Number (earfcn)").
			Optional().
			Nillable(),
		field.Int("uarfcn").
			Comment("UMTS Absolute RF Channel Number described in TS 25.101 sec. 5.4.4 (uarfcn)s").
			Optional().
			Nillable(),
		field.Float("latitude").
			Comment("Latitude of where cell data was collected").
			Optional().
			Nillable(),
		field.Float("longitude").
			Comment("Longitude of where cell data was collected").
			Optional().
			Nillable(),
		field.Float("altitude").
			Comment("Altitude in meters of where cell data was collected.  Missing value implies ground level.").
			Optional().
			Nillable(),
		field.Float("heading").
			Comment("Heading in degrees of where directional antenna was pointing.  Missing value implies omni-directional antenna.").
			Optional().
			Nillable(),
		field.Float("rssi").
			Comment("Received Signal Strength Indicator in dBm.").
			Optional().
			Nillable(),
	}
}

// Edges returns SurveyCellScan edges.
func (SurveyCellScan) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("checklist_item", CheckListItem.Type).
			Unique(),
		edge.To("survey_question", SurveyQuestion.Type).
			Unique(),
		edge.To("location", Location.Type).
			Unique(),
	}
}

// Policy returns SurveyCellScan policy.
func (SurveyCellScan) Policy() ent.Policy {
	return authz.NewPolicy(
		authz.WithQueryRules(
			authz.SurveyCellScanReadPolicyRule(),
		),
		authz.WithMutationRules(
			authz.SurveyCellScanWritePolicyRule(),
			authz.SurveyCellScanCreatePolicyRule(),
		),
	)
}
