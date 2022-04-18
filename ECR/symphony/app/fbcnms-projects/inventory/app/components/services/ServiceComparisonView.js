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

import AddServiceDialog from './AddServiceDialog';
import Button from '@symphony/design-system/components/Button';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import PowerSearchBar from '../power_search/PowerSearchBar';
import React, {useCallback, useState} from 'react';
import ServiceComparisonViewQueryRenderer from './ServiceComparisonViewQueryRenderer';
import ViewHeader from '@symphony/design-system/components/View/ViewHeader';
import fbt from 'fbt';
import useFilterBookmarks from '../comparison_view/hooks/filterBookmarksHook';
import useLocationTypes from '../comparison_view/hooks/locationTypesHook';
import usePropertyFilters from '../comparison_view/hooks/propertiesHook';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import {FormContextProvider} from '../../common/FormContext';
import {ServiceSearchConfig} from './ServiceSearchConfig';
import {
  buildPropertyFilterConfigs,
  getSelectedFilter,
} from '../comparison_view/FilterUtils';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(_ => ({
  cardRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '0px',
    paddingRight: '0px',
  },
  cardContent: {
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '0px',
    flexGrow: 1,
    width: '100%',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  searchResults: {
    flexGrow: 1,
  },
  bar: {
    display: 'flex',
    flexDirection: 'row',
    boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.1)',
  },
  searchBar: {
    flexGrow: 1,
  },
  footer: {
    '&:empty': {
      display: 'none',
    },
  },
  searchArea: {
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
}));

const QUERY_LIMIT = 100;

const ServiceComparisonView = () => {
  const {match, history} = useRouter();
  const [dialogKey, setDialogKey] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceKey, setServiceKey] = useState(1);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState([]);
  const classes = useStyles();

  const possibleProperties = usePropertyFilters('service');
  const servicePropertiesFilterConfigs = buildPropertyFilterConfigs(
    possibleProperties,
  );

  const locationTypesFilterConfigs = useLocationTypes();
  const filterBookmarksFilterConfig = useFilterBookmarks('SERVICE');

  const filterConfigs = ServiceSearchConfig.map(ent => ent.filters)
    .reduce((allFilters, currentFilter) => allFilters.concat(currentFilter), [])
    .concat(servicePropertiesFilterConfigs ?? [])
    .concat(locationTypesFilterConfigs ?? []);

  const navigateToService = (selectedServiceId: ?string) => {
    history.push(
      match.url + (selectedServiceId ? `?service=${selectedServiceId}` : ''),
    );
  };

  const showDialog = useCallback(() => {
    setDialogOpen(true);
    setDialogKey(dialogKey + 1);
    setServiceKey(serviceKey + 1);
  }, [setDialogOpen, dialogKey, setDialogKey, serviceKey, setServiceKey]);

  const hideDialog = useCallback(() => setDialogOpen(false), [setDialogOpen]);

  return (
    <FormContextProvider
      permissions={{
        entity: 'service',
      }}>
      <div className={classes.root}>
        <ViewHeader
          title={fbt('Services', 'Services header')}
          subtitle={fbt(
            'Add and visualize service topology and link services to equipment in your inventory.',
            'Services subheader',
          )}
          actionButtons={[
            <FormActionWithPermissions
              permissions={{entity: 'service', action: 'create'}}>
              <Button onClick={showDialog}>Add Service</Button>
            </FormActionWithPermissions>,
          ]}
        />
        <div className={classes.searchArea}>
          <div className={classes.bar}>
            <div className={classes.searchBar}>
              <PowerSearchBar
                placeholder="Filter services"
                filterConfigs={filterConfigs}
                searchConfig={ServiceSearchConfig}
                getSelectedFilter={(filterConfig: FilterConfig) =>
                  getSelectedFilter(filterConfig, possibleProperties ?? [])
                }
                onFiltersChanged={filters => setFilters(filters)}
                filterValues={filters}
                savedSearches={filterBookmarksFilterConfig}
                exportPath={'/services'}
                footer={
                  count != null
                    ? count > QUERY_LIMIT
                      ? `1 to ${QUERY_LIMIT} of ${count}`
                      : `1 to ${count}`
                    : null
                }
                entity={'SERVICE'}
              />
            </div>
          </div>
          <div className={classes.searchResults}>
            <ServiceComparisonViewQueryRenderer
              limit={50}
              filters={filters}
              onServiceSelected={selectedServiceCardId =>
                navigateToService(selectedServiceCardId)
              }
              serviceKey={serviceKey}
              onQueryReturn={x => setCount(x)}
            />
          </div>
        </div>
      </div>
      <AddServiceDialog
        key={`new_service_${dialogKey}`}
        open={dialogOpen}
        onClose={hideDialog}
        onServiceCreated={serviceId => {
          navigateToService(serviceId);
          setDialogOpen(false);
        }}
      />
    </FormContextProvider>
  );
};

export default ServiceComparisonView;
