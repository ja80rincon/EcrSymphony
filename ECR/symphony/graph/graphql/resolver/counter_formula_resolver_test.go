// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/user"

	"github.com/facebookincubator/symphony/graph/graphql/generated"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/viewer/viewertest"

	"github.com/stretchr/testify/require"
)

func TestAddRemoveCounterFormula(t *testing.T) {
	r := newTestResolver(t)
	defer r.Close()
	// TODO(T66882071): Remove owner role
	ctx := viewertest.NewContext(context.Background(), r.client, viewertest.WithRole(user.RoleOwner))

	mr := r.Mutation()
	_, err := AddCounterFormulaListTest(ctx, t, mr)
	if err != nil {
		return
	}
	id1, id2, con, frm := AddCounterFormulaTest(ctx, t, mr)
	EditCounterFormulaTest(ctx, t, mr, id1, id2, con, frm)
	RemoveCounterFormulaTest(ctx, t, mr, id1, id2)
}

func AddCounterFormulaListTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) ([]*ent.CounterFormula, error) {
	networkType1, err := mr.AddNetworkType(ctx, models.AddNetworkTypeInput{
		Name: "network_type_test_2",
	})
	require.NoError(t, err)
	kpiCategory1, err := mr.AddKpiCategory(ctx, models.AddKpiCategoryInput{
		Name: "kpi_category_test_2",
	})
	require.NoError(t, err)
	domain1, err := mr.AddDomain(ctx, models.AddDomainInput{
		Name: "domain_test_2",
	})
	require.NoError(t, err)
	tech1, err := mr.AddTech(ctx, models.AddTechInput{
		Name:     "tech_test_2",
		DomainFk: domain1.ID,
	})
	require.NoError(t, err)
	kpi1, err := mr.AddKpi(ctx, models.AddKpiInput{
		DomainFk:      domain1.ID,
		Name:          "kpi_test_2",
		Description:   "kpi_description_test_2",
		Status:        false,
		KpiCategoryFk: kpiCategory1.ID,
	})
	require.NoError(t, err)

	formula1, err := mr.AddFormula(ctx, models.AddFormulaInput{
		KpiFk:         kpi1.ID,
		TechFk:        tech1.ID,
		TextFormula:   "text_formula_test_2",
		Status:        false,
		NetworkTypeFk: networkType1.ID,
	})
	require.NoError(t, err)

	vendor1, err := mr.AddVendor(ctx, models.AddVendorInput{
		Name: "vendor_test_2",
	})
	require.NoError(t, err)

	counterFamily1, err := mr.AddCounterFamily(ctx, models.AddCounterFamilyInput{
		Name: "counter_family_test_2",
	})
	require.NoError(t, err)

	counter1, err := mr.AddCounter(ctx, models.AddCounterInput{
		Name:                 "counter_test_2",
		ExternalID:           "external_id_test_2",
		NetworkManagerSystem: "network_test_2",
		CounterFamily:        counterFamily1.ID,
		VendorFk:             vendor1.ID,
	})
	require.NoError(t, err)

	counterFormula1, err := mr.AddCounterFormula(ctx, models.AddCounterFormulaInput{
		FormulaFk: formula1.ID,
		CounterFk: counter1.ID,
		Mandatory: false,
	})
	require.NoError(t, err)

	countersFormula1, err := mr.AddCounterFormulaList(ctx, models.AddCounterFormulaListInput{
		FormulaFk: formula1.ID,
		CounterList: []*models.CounterListInput{
			{
				CounterFk: counter1.ID,
				Mandatory: false,
			},
		},
	})
	require.NoError(t, err)
	countersF := append(countersFormula1, counterFormula1)
	_, err = mr.AddCounterFormulaList(ctx, models.AddCounterFormulaListInput{
		FormulaFk: formula1.ID,
		CounterList: []*models.CounterListInput{
			{
				Mandatory: false,
			},
		},
	})
	require.Error(t, err)
	return countersF, nil
}

func AddCounterFormulaTest(ctx context.Context, t *testing.T, mr generated.MutationResolver) (int, int, int, int) {
	networkType1, err := mr.AddNetworkType(ctx, models.AddNetworkTypeInput{
		Name: "network_type_test_1",
	})
	require.NoError(t, err)
	kpiCategory1, err := mr.AddKpiCategory(ctx, models.AddKpiCategoryInput{
		Name: "kpi_category_test_1",
	})
	require.NoError(t, err)
	domain1, err := mr.AddDomain(ctx, models.AddDomainInput{
		Name: "domain_test_1",
	})
	require.NoError(t, err)
	tech1, err := mr.AddTech(ctx, models.AddTechInput{
		Name:     "tech_test_1",
		DomainFk: domain1.ID,
	})
	require.NoError(t, err)
	kpi1, err := mr.AddKpi(ctx, models.AddKpiInput{
		DomainFk:      domain1.ID,
		Name:          "kpi_test_1",
		Description:   "kpi_description_test_1",
		Status:        false,
		KpiCategoryFk: kpiCategory1.ID,
	})
	require.NoError(t, err)

	formula1, err := mr.AddFormula(ctx, models.AddFormulaInput{
		KpiFk:         kpi1.ID,
		TechFk:        tech1.ID,
		TextFormula:   "text_formula_test_1",
		Status:        false,
		NetworkTypeFk: networkType1.ID,
	})
	require.NoError(t, err)

	vendor1, err := mr.AddVendor(ctx, models.AddVendorInput{
		Name: "vendor_test_1",
	})
	require.NoError(t, err)

	counterFamily1, err := mr.AddCounterFamily(ctx, models.AddCounterFamilyInput{
		Name: "counter_family_test_1",
	})
	require.NoError(t, err)

	counter1, err := mr.AddCounter(ctx, models.AddCounterInput{
		Name:                 "counter_test_1",
		ExternalID:           "external_id_test_1",
		NetworkManagerSystem: "network_test_1",
		CounterFamily:        counterFamily1.ID,
		VendorFk:             vendor1.ID,
	})
	require.NoError(t, err)

	counterFormula1, err := mr.AddCounterFormula(ctx, models.AddCounterFormulaInput{
		FormulaFk: formula1.ID,
		CounterFk: counter1.ID,
		Mandatory: false,
	})
	require.NoError(t, err)
	counterFormula2, err := mr.AddCounterFormula(ctx, models.AddCounterFormulaInput{
		FormulaFk: formula1.ID,
		CounterFk: counter1.ID,
		Mandatory: false,
	})
	require.NoError(t, err)
	id1, id2 := counterFormula1.ID, counterFormula2.ID
	_, err = mr.AddCounterFormula(ctx, models.AddCounterFormulaInput{
		FormulaFk: formula1.ID,
		CounterFk: counter1.ID,
		Mandatory: false,
	})
	require.NoError(t, err)
	return id1, id2, formula1.ID, counter1.ID
}

func EditCounterFormulaTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int, con int, frm int) {
	_, err := mr.EditCounterFormula(ctx, models.EditCounterFormulaInput{
		ID:        id1,
		CounterFk: con,
		FormulaFk: frm,
		Mandatory: true,
	})
	require.Error(t, err)
}

func RemoveCounterFormulaTest(ctx context.Context, t *testing.T, mr generated.MutationResolver, id1 int, id2 int) {
	_, err := mr.RemoveCounterFormula(ctx, id1)
	require.NoError(t, err)
	_, err = mr.RemoveCounterFormula(ctx, id2)
	require.NoError(t, err)
	_, err = mr.RemoveCounterFormula(ctx, id1)
	require.Error(t, err)
}
