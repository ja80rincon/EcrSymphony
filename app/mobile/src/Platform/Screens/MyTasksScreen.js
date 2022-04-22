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

import type {MyTasksScreenLocationsNeedSiteSurveyQueryResponse} from 'Platform/Screens/__generated__/MyTasksScreenLocationsNeedSiteSurveyQuery.graphql';
import type {NavigationDrawerProp} from 'react-navigation-drawer';
import type {NavigationScreenConfig} from 'react-navigation';
import type {ReactRelayOfflineResponse} from 'Platform/Relay/RelayOfflineTypes';

import * as React from 'react';
import AppContext from 'Platform/Context/AppContext';
import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import TasksList from 'Platform/Components/MyTasks/TasksList';
import Toolbar from '@fbcmobile/ui/Components/Toolbar';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import moment from 'moment';
import {ERROR} from 'Platform/Consts/UserActionEvents';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer, useRestore} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {StyleSheet, UIManager, View, findNodeHandle} from 'react-native';
import {getClosestFutureDayToToday} from '@fbcmobile/ui/Utils/DateUtils';
import {
  preFetchMyTasks,
  preFetchMyWorkOrders,
} from 'Platform/Relay/RelayStoreUtils';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';

const graphql = require('babel-plugin-relay/macro');

const locationsNeedSiteSurveyQuery = graphql`
  query MyTasksScreenLocationsNeedSiteSurveyQuery(
    $filters: [WorkOrderFilterInput!]!
  ) {
    locations(needsSiteSurvey: true) {
      edges {
        ...TasksList_locations
      }
    }
    workOrders(first: 50, filterBy: $filters) {
      totalCount
      edges {
        node {
          id
          installDate
          workOrderTemplate {
            name
          }
          ...TasksList_workOrders
          name
          status
          location {
            id
            name
            locationHierarchy {
              id
              name
            }
          }
          ...WorkOrderDetailsSection_workOrder
          ...WorkOrderTechnicianActionBottomBar_workOrder
          ...WorkOrderCommentsSection_workOrder
        }
      }
    }
  }
`;

type Props = {+navigation: NavigationDrawerProp<{params: {}}>};

type Response = {|
  ...ReactRelayOfflineResponse,
  props: ?MyTasksScreenLocationsNeedSiteSurveyQueryResponse,
|};

const MyTasksScreen = (props: Props) => {
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);
  const {jsLocale, user} = useContext(AppContext);
  const [isClosestDateRendered, setIsClosestDateRendered] = useState(false);
  const scrollViewRef = useRef(null);
  const closestTasksRef = useRef(null);
  const onRefreshTasksRef = useRef(null);

  const scrollToToday = useCallback(() => {
    if (
      scrollViewRef == null ||
      scrollViewRef.current == null ||
      closestTasksRef == null ||
      closestTasksRef.current == null
    ) {
      return;
    }

    // $FlowFixMe - T72031710
    const scrollResponder = scrollViewRef.current.getScrollResponder();
    requestAnimationFrame(() => {
      UIManager.measureLayout(
        findNodeHandle(closestTasksRef.current),
        findNodeHandle(scrollResponder),
        e => {
          UserActionLogger.logError({
            key: ERROR.ERROR_MY_TASKS_SCROLL_TO_TODAY,
            errorMessage: `Scrolling failed: ${e.toString()}`,
          });
        },
        (left, top) => {
          scrollResponder.scrollTo({x: left, y: top, animated: true});
        },
      );
    });
  }, [scrollViewRef, closestTasksRef]);

  useEffect(scrollToToday, [isClosestDateRendered]);

  const onRefresh = () => {
    // toggling refreshToggle to trigger a query refetch
    setRefreshToggle(!refreshToggle);
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
        stringSet: ['PLANNED', 'IN_PROGRESS', 'SUBMITTED', 'BLOCKED'],
      },
    ];
  };

  useEffect(() => {
    if (user != null) {
      preFetchMyTasks(getFiltersWithUserId(user.id));
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
      title={fbt('Work Orders', 'Work orders page title').toString()}
      onSearchClicked={() => {
        NavigationService.push(Screens.WorkOrdersSearchScreen);
      }}
      onRefreshClicked={() => {
        onRefresh();
      }}
      extraRightElement={{node: 'today', onClick: scrollToToday}}
      ref={ref => {
        scrollViewRef.current = ref;
      }}>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{
          refresh: refreshToggle,
          filters: getFiltersWithUserId(user.id),
        }}
        query={locationsNeedSiteSurveyQuery}
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
                  'Loading tasks...',
                  'Loading message while loading tasks',
                )}
              />
            );
          }

          const {locations, workOrders} = props;
          if (!locations || !locations.edges || !workOrders) {
            return null;
          }

          const today = moment()
            .locale(jsLocale)
            .startOf('day')
            .toISOString(true);
          const workOrdersByDate = workOrders.edges
            .slice()
            .map(edge => edge.node)
            .filter(Boolean)
            .reduce((workOrdersByDate, workOrder) => {
              // Work Orders without an install date should be done today.
              const installDate = workOrder.installDate
                ? moment(workOrder.installDate)
                    .locale(jsLocale)
                    .startOf('day')
                    .toISOString(true)
                : today;
              workOrdersByDate[installDate] = [
                ...(workOrdersByDate[installDate] ?? []),
                workOrder,
              ];
              return workOrdersByDate;
            }, {});

          let dates: Array<string> = Object.keys(workOrdersByDate) ?? [];
          if (!dates.includes(today)) {
            dates = [...dates, today];
          }

          const closestDate = getClosestFutureDayToToday(
            dates.map(date => moment(date)),
            jsLocale,
          );

          return (
            <View>
              <View style={styles.tasks}>
                {dates
                  .sort((dateA, dateB) => moment(dateA).diff(dateB, 'days'))
                  .map((date, i) => {
                    const isClosestDateOrLast = closestDate
                      ? moment(date).isSame(closestDate, 'day')
                      : i === dates.length - 1;
                    return (
                      <TasksList
                        style={styles.tasksList}
                        ref={ref => {
                          if (isClosestDateOrLast) {
                            closestTasksRef.current = ref;
                            setIsClosestDateRendered(true);
                          }
                        }}
                        key={date}
                        date={moment(date)}
                        workOrders={workOrdersByDate[date] ?? []}
                        locations={date === today ? locations.edges : []}
                        isHeaderShown={true}
                      />
                    );
                  })}
              </View>
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

MyTasksScreen.navigationOptions = options;

export default MyTasksScreen;
