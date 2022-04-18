/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {
  NavigationNavigatorProps,
  NavigationScreenConfig,
} from 'react-navigation';
import type {
  WorkOrderPriority,
  WorkOrderStatus,
} from 'Platform/Relay/__generated__/RelayStoreUtilsWorkOrderNodeQuery.graphql.js';
import type {WorkOrdersSearchScreenSearchQueryResponse} from './__generated__/WorkOrdersSearchScreenSearchQuery.graphql';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import List from '@fbcmobile/ui/Components/List';
import MyTaskListItem from 'Platform/Components/MyTasks/MyTaskListItem';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import NetInfo from '@react-native-community/netinfo';
import React, {useCallback, useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-material-ui';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {SearchBar} from 'react-native-elements';
import {useState} from 'react';

const graphql = require('babel-plugin-relay/macro');

const workOrdersSearchQuery = graphql`
  query WorkOrdersSearchScreenSearchQuery($filters: [WorkOrderFilterInput!]!) {
    workOrders(filterBy: $filters, first: 50) {
      edges {
        node {
          id
          name
          priority
          status
          creationDate
          location {
            ...MyTaskListItem_location
          }
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<
  {},
  {
    params: {
      status: Array<string>,
      priority: Array<string>,
      sortOption: string,
    },
  },
>;

export const WorkOrderStatuses: {[status: WorkOrderStatus]: WorkOrderStatus} = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  CLOSED: 'CLOSED',
  BLOCKED: 'BLOCKED',
};

export const WorkOrderPriorities: {
  [priority: WorkOrderPriority]: WorkOrderPriority,
} = {
  URGENT: 'URGENT',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  NONE: 'NONE',
};

const WorkOrdersSearchScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const defaultStatus = Object.values(WorkOrderStatuses);
  const defaultPriority = Object.values(WorkOrderPriorities);
  const [searchText, setSearchText] = useState(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const status = navigation.state.params
    ? navigation.state.params.status
    : defaultStatus;
  const priority = navigation.state.params
    ? navigation.state.params.priority
    : defaultPriority;
  const sortOption = navigation.state.params
    ? navigation.state.params.sortOption
    : 'name';
  const stopSearching = useCallback(() => setSearchText(null), []);
  NetInfo.fetch().then(state => setIsConnected(state.isConnected));

  const sortWorkOrders = (workOrders, sortOption) => {
    if (sortOption.toLowerCase() === 'status')
      return workOrders.sort((wo1, wo2) => {
        if (
          defaultStatus.indexOf(wo1.status) >= defaultStatus.indexOf(wo2.status)
        )
          return 1;
        else return -1;
      });
    else if (sortOption.toLowerCase() === 'priority')
      return workOrders.sort((wo1, wo2) => {
        if (
          defaultPriority.indexOf(wo1.priority) >=
          defaultPriority.indexOf(wo2.priority)
        )
          return 1;
        else return -1;
      });
    else return workOrders.sort((wo1, wo2) => (wo1.name >= wo2.name ? 1 : -1));
  };

  const getFilters = (searchText, status, priority) => {
    return [
      {
        filterType: 'WORK_ORDER_NAME',
        operator: 'CONTAINS',
        stringValue: searchText ? searchText : '',
      },
      {
        filterType: 'WORK_ORDER_STATUS',
        operator: 'IS_ONE_OF',
        stringSet: status,
      },
      {
        filterType: 'WORK_ORDER_PRIORITY',
        operator: 'IS_ONE_OF',
        stringSet: priority,
      },
    ];
  };

  return (
    <View style={styles.root}>
      <SearchBar
        autoFocus
        clearButtonMode="always"
        platform="android"
        placeholder={fbt(
          'Search work orders...',
          'Search bar placeholder text',
        ).toString()}
        cancelIcon={
          <TouchableOpacity onPress={stopSearching}>
            <Icon
              name="clear"
              iconSet="MaterialIcons"
              backgroundColor={Colors.Gray10}
            />
          </TouchableOpacity>
        }
        clearIcon={null}
        value={searchText}
        onChangeText={text => {
          setSearchText(text);
        }}
      />
      <Button
        title={fbt(
          'Advanced Filter',
          'Advanced filter button label',
        ).toString()}
        onPress={() => {
          navigation.navigate(Screens.WorkOrdersFilterScreen, {
            filters: getFilters(searchText, status, priority),
            sortOption: sortOption,
          });
        }}
      />

      <ScrollView>
        {!searchText ? (
          <Text style={styles.placeholder}>
            <fbt desc="Search field label">
              Start typing to search work orders by name
            </fbt>
          </Text>
        ) : null}
        <QueryRenderer
          fetchPolicy="store-or-network"
          ttl={QUERY_TTL_MS}
          environment={RelayEnvironment}
          variables={{
            filters: getFilters(searchText, status, priority),
          }}
          query={workOrdersSearchQuery}
          render={response => {
            const {
              props,
              error,
              retry,
              _cached,
            }: {
              props: ?WorkOrdersSearchScreenSearchQueryResponse,
              error: Error,
              retry: () => void,
              _cached: boolean,
            } = response;
            retryRef.current = retry;
            if (error) {
              return (
                <DataLoadingErrorPane
                  retry={() => {
                    retryRef.current && retryRef.current();
                  }}
                />
              );
            }

            let validWorkOrders;
            if (isConnected) {
              if (!props) {
                return (
                  <SplashScreen
                    text={fbt(
                      'Loading work orders...',
                      'Loading message while loading the locations',
                    )}
                  />
                );
              }

              const {workOrders} = props;
              if (!workOrders) {
                return null;
              }

              validWorkOrders = workOrders.edges
                .map(edge => edge.node)
                .slice()
                .filter(Boolean);
            } else {
              const records = RelayEnvironment.getStore().getSource();

              validWorkOrders = records
                .getRecordIDs()
                .filter(id => records.get(id).__typename == 'WorkOrder')
                .map(id => records.get(id))
                .filter(
                  wo =>
                    wo.name
                      .toLowerCase()
                      .includes(searchText ? searchText.toLowerCase() : '') &&
                    status.includes(wo.status) &&
                    priority.includes(wo.priority),
                );
            }

            const searchResults = sortWorkOrders(
              validWorkOrders,
              sortOption,
            ).map(wo => (
              <MyTaskListItem
                key={wo.id}
                name={wo.name}
                location={isConnected ? wo.location : null}
                onClick={() =>
                  NavigationService.push(Screens.WorkOrderScreen, {
                    workOrderId: wo.id,
                  })
                }
                priority={wo.priority === 'NONE' ? null : wo.priority}
                status={wo.status}
                isUploadRequired={false}
              />
            ));

            return (
              <List
                style={styles.searchResultsList}
                emptyLabel={fbt(
                  'No search results',
                  'Label shown when no search results where found',
                ).toString()}>
                {searchResults}
              </List>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  searchResultsList: {
    paddingLeft: 20,
  },
  placeholder: {
    marginLeft: 16,
  },
});

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: fbt(
    'Work Order Search',
    'Work Order Search screen title',
  ).toString(),
};

WorkOrdersSearchScreen.navigationOptions = options;

export default WorkOrdersSearchScreen;
