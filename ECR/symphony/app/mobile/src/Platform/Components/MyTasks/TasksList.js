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

import type {Coords} from '@fbcmobile/ui/Utils/MapUtils';
import type {Location} from 'react-native-geolocation-service';
import type {TRefFor} from '@fbcmobile/ui/Components/Core/TRefFor.flow';
import type {TasksList_locations} from './__generated__/TasksList_locations.graphql';
import type {TasksList_workOrders} from './__generated__/TasksList_workOrders.graphql';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import * as React from 'react';
import Geolocation from 'react-native-geolocation-service';
import List from '@fbcmobile/ui/Components/List';
import MyTaskListItem from 'Platform/Components/MyTasks/MyTaskListItem';
import MyTasksHeader from 'Platform/Components/MyTasks/MyTasksHeader';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import WorkOrderListItem from 'Platform/Components/MyTasks/WorkOrderListItem';
import fbt from 'fbt';
import useMountedState from '@fbcmobile/ui/Hooks/useMountedState';
import usePermissions from '@fbcmobile/ui/Hooks/usePermissions';
import {ERROR, METRIC} from 'Platform/Consts/UserActionEvents';
import {
  LOCATION_MAXIMUM_AGE_MS,
  LOCATION_REQUEST_TIMEOUT_MS,
} from 'Platform/Consts/Constants';
import {PermissionsAndroid} from 'react-native';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {StyleSheet, View} from 'react-native';
import {Text} from '@99xt/first-born';
import {createFragmentContainer} from 'react-relay-offline';
import {getDistanceBetweenLocations} from '@fbcmobile/ui/Utils/MapUtils';
import {useCallback, useEffect, useMemo, useState} from 'react';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +style?: ViewStyleProp,
  +date: moment$Moment,
  +workOrders: TasksList_workOrders,
  +locations: TasksList_locations,
  +isHeaderShown: boolean,
};

const TasksList = (
  {date, workOrders, locations, style, isHeaderShown}: Props,
  forwardedRef: TRefFor<typeof View>,
) => {
  const isMounted = useMountedState();
  const [userLocation, setUserLocation] = useState<?Coords>(null);

  const {permissionsGranted} = usePermissions([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);

  useEffect(() => {
    const startTime = Date.now();
    Geolocation.getCurrentPosition(
      (position: Location) => {
        UserActionLogger.logMetric({
          key: METRIC.GPS_LOCK_LOW_ACCURACY,
          metric: Date.now() - startTime,
        });
        if (!isMounted()) {
          return;
        }
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        UserActionLogger.logError({
          key: ERROR.ERROR_GETTING_GEOLOCATION,
          errorMessage: error.message,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: LOCATION_REQUEST_TIMEOUT_MS,
        maximumAge: LOCATION_MAXIMUM_AGE_MS,
      },
    );
  }, [isMounted]);

  const sortLocations = useCallback(
    (locations: TasksList_locations) => {
      if (locations == null) {
        return [];
      }
      if (userLocation == null) {
        return locations;
      }

      return locations.slice(0).sort((location1, location2) => {
        const loc1distance = getDistanceBetweenLocations(userLocation, {
          latitude: location1.node?.latitude,
          longitude: location1.node?.longitude,
        });
        const loc2distance = getDistanceBetweenLocations(userLocation, {
          latitude: location2.node?.latitude,
          longitude: location2.node?.longitude,
        });

        if (loc1distance == null || loc2distance == null) {
          return 0;
        }
        return loc1distance - loc2distance;
      });
    },
    [userLocation],
  );

  const locationTasks = useMemo(
    () =>
      sortLocations(locations).map(edge => {
        if (edge.node == null) {
          return null;
        }
        const location = edge.node;
        return (
          <MyTaskListItem
            key={location.id}
            name={<fbt desc="Site survey task title">Site Survey</fbt>}
            location={location}
            userLocation={userLocation}
            onClick={() =>
              NavigationService.push(Screens.SiteSurveyListScreen, {
                locationId: location.id,
              })
            }
            numCategories={
              location.locationType.surveyTemplateCategories?.length
            }
          />
        );
      }),
    [locations, sortLocations, userLocation],
  );

  const workOrderTasks = useMemo(
    () =>
      workOrders.map(wo => <WorkOrderListItem key={wo.id} workOrder={wo} />),
    [workOrders],
  );

  return (
    <View
      // $FlowFixMe - T72031710
      ref={forwardedRef}
      style={style}>
      {isHeaderShown && (
        <MyTasksHeader
          date={date}
          numSiteSurveys={locations.length}
          numWorkOrders={workOrders.length}
        />
      )}

      {permissionsGranted === false && (
        <Text>
          <fbt desc="Text explaining why a permission is needed.">
            Allow the app to access this phone's location so the list can be
            sorted by proximity.
          </fbt>
        </Text>
      )}
      <List
        style={styles.tasksList}
        emptyLabel={fbt(
          'No work orders are assigned to you for today.',
          'Empty state placeholder text showing that there are no work orders to see right now',
        ).toString()}>
        {locationTasks}
        {workOrderTasks}
      </List>
    </View>
  );
};

const styles = StyleSheet.create({
  tasksList: {
    marginLeft: 19,
  },
});

export default createFragmentContainer(
  // $FlowFixMe - T72031710
  React.forwardRef<Props, TRefFor<typeof View>>(TasksList),
  {
    locations: graphql`
      fragment TasksList_locations on LocationEdge @relay(plural: true) {
        node {
          id
          name
          latitude
          longitude
          locationType {
            surveyTemplateCategories {
              id
            }
          }
          ...MyTaskListItem_location
        }
      }
    `,
    workOrders: graphql`
      fragment TasksList_workOrders on WorkOrder @relay(plural: true) {
        id
        ...WorkOrderListItem_workOrder
      }
    `,
  },
);
