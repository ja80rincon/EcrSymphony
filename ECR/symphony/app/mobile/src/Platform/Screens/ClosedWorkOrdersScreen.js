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

import type {ClosedWorkOrdersScreenQueryResponse} from './__generated__/ClosedWorkOrdersScreenQuery.graphql';
import type {NavigationDrawerProp} from 'react-navigation-drawer';
import type {NavigationScreenConfig} from 'react-navigation';
import type {ReactRelayOfflineResponse} from 'Platform/Relay/RelayOfflineTypes';

import * as React from 'react';
import AppContext from 'Platform/Context/AppContext';
import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import TasksList from 'Platform/Components/MyTasks/TasksList';
import Toolbar from '@fbcmobile/ui/Components/Toolbar';
import fbt from 'fbt';
import moment from 'moment';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer, useRestore} from 'react-relay-offline';
import {StyleSheet, View} from 'react-native';
import {preFetchMyWorkOrders} from 'Platform/Relay/RelayStoreUtils';
import {useContext, useEffect, useRef, useState} from 'react';

const graphql = require('babel-plugin-relay/macro');

const closedWorkOrdersScreenResponseQuery = graphql`
  query ClosedWorkOrdersScreenQuery($filters: [WorkOrderFilterInput!]!) {
    workOrders(first: 50, filterBy: $filters) {
      totalCount
      edges {
        node {
          id
          ...TasksList_workOrders
        }
      }
    }
  }
`;

type Props = {+navigation: NavigationDrawerProp<{params: {}}>};

type Response = {|
  ...ReactRelayOfflineResponse,
  props: ?ClosedWorkOrdersScreenQueryResponse,
|};

const ClosedWorkOrdersScreen = (props: Props) => {
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);
  const {user} = useContext(AppContext);
  const onRefreshTasksRef = useRef(null);

  const onRefresh = () => {
    // toggling refreshToggle to trigger a query refetch
    setRefreshToggle(!refreshToggle);
    onRefreshTasksRef.current && onRefreshTasksRef.current();
  };

  const getFiltersWithUserId = userId => {
    return [
      {
        filterType: 'WORK_ORDER_ASSIGNED_TO',
        operator: 'IS_ONE_OF',
        idSet: [userId],
      },
      {
        filterType: 'WORK_ORDER_STATUS',
        operator: 'IS_ONE_OF',
        stringSet: ['CLOSED'],
      },
    ];
  };

  useEffect(() => {
    if (user != null) {
      preFetchMyWorkOrders(getFiltersWithUserId(user.id));
    }
  }, [refreshToggle, user]);

  const isRehydrated = useRestore(RelayEnvironment);
  if (!isRehydrated) {
    return <SplashScreen />;
  }

  if (!user || !user.id) {
    return <SplashScreen />;
  }

  return (
    <Toolbar
      onIconClicked={() => {
        if (props.navigation.openDrawer) {
          props.navigation.openDrawer();
          return;
        }
        throw new Error(
          fbt(
            'Menu not available',
            "Error message that appears when a user tries to navigate to the app's main menu and it's not available",
          ),
        );
      }}
      title={fbt(
        'Closed Work Orders',
        'Closed Work Orders page title',
      ).toString()}
      searchable={false}
      onRefreshClicked={() => {
        onRefresh();
      }}>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{
          refresh: refreshToggle,
          filters: getFiltersWithUserId(user.id),
        }}
        query={closedWorkOrdersScreenResponseQuery}
        render={(response: Response) => {
          const {props, error, retry} = response;
          onRefreshTasksRef.current = retry;
          if (error) {
            return (
              <DataLoadingErrorPane
                retry={() => {
                  onRefreshTasksRef.current && onRefreshTasksRef.current();
                  onRefresh();
                }}
              />
            );
          }

          if (!props) {
            return (
              <SplashScreen
                text={fbt(
                  'Loading closed work orders...',
                  'Loading message while loading closed work orders',
                )}
              />
            );
          }

          const {workOrders} = props;
          if (!workOrders) {
            return null;
          }

          const workOrdersArray = workOrders.edges
            .slice()
            .map(edge => edge.node);

          return (
            <View style={styles.tasks}>
              <TasksList
                style={styles.tasksList}
                date={moment()}
                workOrders={workOrdersArray ?? []}
                locations={[]}
              />
            </View>
          );
        }}
      />
    </Toolbar>
  );
};

const styles = StyleSheet.create({
  tasksList: {
    marginBottom: 16,
  },
  tasks: {
    paddingBottom: 20,
    backgroundColor: Colors.BackgroundWhite,
  },
});

const options: NavigationScreenConfig<*> = {
  headerShown: false,
  headerTitle: '',
};

ClosedWorkOrdersScreen.navigationOptions = options;

export default ClosedWorkOrdersScreen;
