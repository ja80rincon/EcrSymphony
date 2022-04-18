/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FilterConfig} from '../comparison_view/ComparisonViewTypes';
import type {FlowInstanceOrder} from './__generated__/AutomationFlowInstancesQueryRendererQuery.graphql';

import AutomationFlowInstancesQueryRenderer from './AutomationFlowInstancesQueryRenderer';
import ErrorBoundary from '@fbcnms/ui/components/ErrorBoundary/ErrorBoundary';
import FlowInstanceCard from './FlowInstanceCard';
import InventorySuspense from '../../common/InventorySuspense';
import InventoryView, {DisplayOptions} from '../InventoryViewContainer';
import PowerSearchBar from '../power_search/PowerSearchBar';
import React, {useCallback, useMemo, useState} from 'react';
import fbt from 'fbt';
import useLocationTypes from '../comparison_view/hooks/locationTypesHook';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import {
  FLOW_INSTANCE_FILTERS,
  FlowInstanceSearchConfig,
} from './FlowInstanceSearchConfig';
import {InventoryAPIUrls} from '../../common/InventoryAPI';
import {extractEntityIdFromUrl} from '../../common/RouterUtils';
import {
  getInitialFilterValue,
  getPredefinedFilterSetWithValues,
} from '../comparison_view/FilterUtils';
import {makeStyles} from '@material-ui/styles';
import {useStatusValues} from '../../common/FilterTypesFlow';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  flowInstanceView: {
    height: '100%',
  },
  powerSearchBarWrapper: {
    paddingRight: '8px',
  },
  powerSearchBar: {
    borderRadius: '8px',
  },
  searchResults: {
    flexGrow: 1,
    paddingTop: '8px',
  },
}));

const AutomationFlowInstances = () => {
  const {statusValues, completedStatus} = useStatusValues();
  const selectedStatusValues = statusValues
    .filter(status => status.key !== completedStatus.key)
    .map(status => status.value);

  // For additional default filters, just create another variable
  // and add it to the initial state array
  const defaultStatusFilter = getPredefinedFilterSetWithValues(
    FLOW_INSTANCE_FILTERS.STATUS,
    FlowInstanceSearchConfig,
    selectedStatusValues,
  );

  const [filters, setFilters] = useState([defaultStatusFilter]);
  const [orderBy, setOrderBy] = useState<FlowInstanceOrder>({
    direction: 'DESC',
    field: 'UPDATED_AT',
  });
  const {history, location} = useRouter();
  const classes = useStyles();

  const selectedFlowInstanceCardId = useMemo(
    () => extractEntityIdFromUrl('flowinstance', location.search),
    [location],
  );

  const locationTypesFilterConfigs = useLocationTypes();

  const filterConfigs = useMemo(
    () =>
      FlowInstanceSearchConfig.map(ent => ent.filters)
        .reduce(
          (allFilters, currentFilter) => allFilters.concat(currentFilter),
          [],
        )
        .concat(locationTypesFilterConfigs ?? []),
    [locationTypesFilterConfigs],
  );

  const navigateToFlowInstance = useCallback(
    (selectedFlowInstanceCardId: ?string) => {
      history.push(InventoryAPIUrls.flowinstance(selectedFlowInstanceCardId));
    },
    [history],
  );

  const shouldRenderTable = selectedFlowInstanceCardId == null;

  const flowInstancesTable = useMemo(
    () =>
      shouldRenderTable === false ? null : (
        <AutomationFlowInstancesQueryRenderer
          filters={filters}
          orderBy={orderBy}
          onOrderChanged={setOrderBy}
          onFlowInstanceSelected={selectedFlowInstanceCardId =>
            navigateToFlowInstance(selectedFlowInstanceCardId)
          }
          displayMode={DisplayOptions.table}
          defaultStatusFilter={defaultStatusFilter}
        />
      ),
    [
      filters,
      navigateToFlowInstance,
      orderBy,
      shouldRenderTable,
      defaultStatusFilter,
    ],
  );

  if (selectedFlowInstanceCardId != null) {
    return (
      <ErrorBoundary>
        <FlowInstanceCard
          flowInstanceId={selectedFlowInstanceCardId}
        />
      </ErrorBoundary>
    );
  }

  const header = {
    title: fbt('Flow Instances', 'Flow instances header'),
    subtitle: fbt(
      'Find flow instances and track their status.',
      'Flow instances subheader',
    ),
    searchBar: (
      <div className={classes.powerSearchBarWrapper}>
        <PowerSearchBar
          placeholder="Filter flow instances"
          className={classes.powerSearchBar}
          filterConfigs={filterConfigs}
          searchConfig={FlowInstanceSearchConfig}
          filterValues={filters}
          getSelectedFilter={(filterConfig: FilterConfig) =>
            getInitialFilterValue(
              filterConfig.key,
              filterConfig.name,
              filterConfig.defaultOperator,
              null,
            )
          }
          onFiltersChanged={filters => setFilters(filters)}
        />
      </div>
    ),
  };

  return (
    <ErrorBoundary>
      <InventorySuspense>
        <InventoryView
          permissions={{entity: 'workorder'}}
          header={header}
          className={classes.flowInstanceView}>
          {flowInstancesTable}
        </InventoryView>
      </InventorySuspense>
    </ErrorBoundary>
  );
};

export default AutomationFlowInstances;
