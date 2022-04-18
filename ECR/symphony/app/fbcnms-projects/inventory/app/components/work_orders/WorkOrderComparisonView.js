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
import type {WorkOrderOrder} from './__generated__/WorkOrderComparisonViewQueryRendererSearchQuery.graphql';

import AddWorkOrderCard from './AddWorkOrderCard';
import AddWorkOrderDialog from './AddWorkOrderDialog';
import Button from '@symphony/design-system/components/Button';
import ErrorBoundary from '@fbcnms/ui/components/ErrorBoundary/ErrorBoundary';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import InventorySuspense from '../../common/InventorySuspense';
import InventoryView, {DisplayOptions} from '../InventoryViewContainer';
import PowerSearchBar from '../power_search/PowerSearchBar';
import React, {useCallback, useMemo, useState} from 'react';
import WorkOrderCard from './WorkOrderCard';
import WorkOrderComparisonViewQueryRenderer from './WorkOrderComparisonViewQueryRenderer';
import fbt from 'fbt';
import useFilterBookmarks from '../comparison_view/hooks/filterBookmarksHook';
import useLocationTypes from '../comparison_view/hooks/locationTypesHook';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import {InventoryAPIUrls} from '../../common/InventoryAPI';
import {
  WORK_ORDER_FILTERS,
  WorkOrderSearchConfig,
} from './WorkOrderSearchConfig';
import {extractEntityIdFromUrl} from '../../common/RouterUtils';
import {
  getInitialFilterValue,
  getPredefinedFilterSetWithValues,
} from '../comparison_view/FilterUtils';
import {makeStyles} from '@material-ui/styles';
import {useStatusValues} from '../../common/FilterTypes';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  workOrderComparisonView: {
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

const WorkOrderComparisonView = () => {
  const {statusValues, closedStatus, canceledStatus} = useStatusValues();
  const selectedStatusValues = statusValues
    .filter(status => status.key !== closedStatus.key)
    .filter(status => status.key !== canceledStatus.key)
    .map(status => status.value);
  // For additional default filters, just create another variable
  // and add it to the initial state array
  const defaultStatusFilter = getPredefinedFilterSetWithValues(
    WORK_ORDER_FILTERS.STATUS,
    WorkOrderSearchConfig,
    selectedStatusValues,
  );

  const [filters, setFilters] = useState([defaultStatusFilter]);
  const [orderBy, setOrderBy] = useState<WorkOrderOrder>({
    direction: 'DESC',
    field: 'UPDATED_AT',
  });
  const [dialogKey, setDialogKey] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resultsDisplayMode, setResultsDisplayMode] = useState(
    DisplayOptions.table,
  );
  const {match, history, location} = useRouter();
  const classes = useStyles();

  const selectedWorkOrderTypeId = useMemo(
    () => extractEntityIdFromUrl('workorderType', location.search),
    [location.search],
  );

  const selectedWorkOrderCardId = useMemo(
    () => extractEntityIdFromUrl('workorder', location.search),
    [location],
  );

  const locationTypesFilterConfigs = useLocationTypes();
  const filterBookmarksFilterConfig = useFilterBookmarks('WORK_ORDER');

  const filterConfigs = useMemo(
    () =>
      WorkOrderSearchConfig.map(ent => ent.filters)
        .reduce(
          (allFilters, currentFilter) => allFilters.concat(currentFilter),
          [],
        )
        .concat(locationTypesFilterConfigs ?? []),
    [locationTypesFilterConfigs],
  );

  const navigateToAddWorkOrder = useCallback(
    (selectedWorkOrderTypeId: ?string) => {
      history.push(
        match.url +
          (selectedWorkOrderTypeId
            ? `?workorderType=${selectedWorkOrderTypeId}`
            : ''),
      );
    },
    [history, match.url],
  );

  const navigateToWorkOrder = useCallback(
    (selectedWorkOrderCardId: ?string) => {
      history.push(InventoryAPIUrls.workorder(selectedWorkOrderCardId));
    },
    [history],
  );

  const showDialog = () => {
    setDialogOpen(true);
    setDialogKey(dialogKey + 1);
  };

  const hideDialog = () => setDialogOpen(false);

  const shouldRenderTable =
    selectedWorkOrderCardId == null && selectedWorkOrderTypeId == null;

  const createWorkOrderButton = (
    <FormActionWithPermissions
      permissions={{
        entity: 'workorder',
        action: 'create',
        ignoreTypes: true,
      }}>
      <Button onClick={showDialog}>
        <fbt desc="">Create Work Order</fbt>
      </Button>
    </FormActionWithPermissions>
  );

  const workOrdersTable = useMemo(
    () =>
      shouldRenderTable === false ? null : (
        <WorkOrderComparisonViewQueryRenderer
          filters={filters}
          orderBy={orderBy}
          onOrderChanged={setOrderBy}
          onWorkOrderSelected={selectedWorkOrderCardId =>
            navigateToWorkOrder(selectedWorkOrderCardId)
          }
          displayMode={
            resultsDisplayMode === DisplayOptions.map
              ? DisplayOptions.map
              : DisplayOptions.table
          }
          createWorkOrderButton={createWorkOrderButton}
          defaultStatusFilter={defaultStatusFilter}
        />
      ),
    [
      filters,
      navigateToWorkOrder,
      orderBy,
      resultsDisplayMode,
      shouldRenderTable,
      createWorkOrderButton,
      defaultStatusFilter,
    ],
  );

  if (selectedWorkOrderTypeId != null) {
    return (
      <ErrorBoundary>
        <InventorySuspense>
          <AddWorkOrderCard workOrderTypeId={selectedWorkOrderTypeId} />
        </InventorySuspense>
      </ErrorBoundary>
    );
  }

  if (selectedWorkOrderCardId != null) {
    return (
      <ErrorBoundary>
        <WorkOrderCard
          workOrderId={selectedWorkOrderCardId}
          onWorkOrderRemoved={() => navigateToWorkOrder(null)}
        />
      </ErrorBoundary>
    );
  }

  const header = {
    title: fbt('Work Orders', 'Work order header'),
    subtitle: fbt(
      'Find and create work orders, assign them to team members and track their status.',
      'Work order subheader',
    ),
    searchBar: (
      <div className={classes.powerSearchBarWrapper}>
        <PowerSearchBar
          placeholder="Filter work orders"
          className={classes.powerSearchBar}
          filterConfigs={filterConfigs}
          searchConfig={WorkOrderSearchConfig}
          filterValues={filters}
          savedSearches={filterBookmarksFilterConfig}
          getSelectedFilter={(filterConfig: FilterConfig) =>
            getInitialFilterValue(
              filterConfig.key,
              filterConfig.name,
              filterConfig.defaultOperator,
              null,
            )
          }
          onFiltersChanged={filters => setFilters(filters)}
          exportPath={'/work_orders'}
          entity={'WORK_ORDER'}
        />
      </div>
    ),
    actionButtons: [createWorkOrderButton],
  };

  return (
    <ErrorBoundary>
      <InventorySuspense>
        <InventoryView
          permissions={{entity: 'workorder'}}
          header={header}
          className={classes.workOrderComparisonView}
          onViewToggleClicked={setResultsDisplayMode}>
          {workOrdersTable}
          <AddWorkOrderDialog
            key={`new_work_order_${dialogKey}`}
            open={dialogOpen}
            onClose={hideDialog}
            onWorkOrderTypeSelected={typeId => {
              navigateToAddWorkOrder(typeId);
              setDialogOpen(false);
            }}
          />
        </InventoryView>
      </InventorySuspense>
    </ErrorBoundary>
  );
};

export default WorkOrderComparisonView;
