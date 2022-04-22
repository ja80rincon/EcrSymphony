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

import type {LocationsScreenSitesAroundMeQueryResponse} from './__generated__/LocationsScreenSitesAroundMeQuery.graphql';
import type {NavigationDrawerProp} from 'react-navigation-drawer';
import type {NavigationScreenConfig} from 'react-navigation';

import AppContext, {distUnitOptions} from 'Platform/Context/AppContext';
import ChevronIcon from '@fbcmobile/ui/Components/ChevronIcon';
import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import Geolocation from 'react-native-geolocation-service';
import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import LocationListItem from 'Platform/Components/LocationListItem';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useContext, useEffect, useRef, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import Toolbar from '@fbcmobile/ui/Components/Toolbar';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import useMountedState from '@fbcmobile/ui/Hooks/useMountedState';
import usePermissions from '@fbcmobile/ui/Hooks/usePermissions';
import {Button, Text} from '@99xt/first-born';
import {ERROR, METRIC} from 'Platform/Consts/UserActionEvents';
import {
  LOCATION_MAXIMUM_AGE_MS,
  LOCATION_REQUEST_TIMEOUT_MS,
  QUERY_TTL_MS,
} from 'Platform/Consts/Constants';
import {PermissionsAndroid, View} from 'react-native';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {convertKmtoMiles} from '@fbcmobile/ui/Utils/MapUtils';

const graphql = require('babel-plugin-relay/macro');

const sitesNearMeQuery = graphql`
  query LocationsScreenSitesAroundMeQuery(
    $latitude: Float!
    $longitude: Float!
  ) {
    nearestSites(latitude: $latitude, longitude: $longitude, first: 20) {
      id
      name
      locationType {
        id
        name
      }
      distanceKm(latitude: $latitude, longitude: $longitude)
      ...LocationListItem_location
    }
  }
`;

type Props = {+navigation: NavigationDrawerProp<{params: {}}>};

type UserLocation = {
  latitude: number,
  longitude: number,
};

const LocationsScreen = (props: Props) => {
  const isMounted = useMountedState();
  const context = useContext(AppContext);
  const [userLocation, setUserLocation] = useState<?UserLocation>(null);
  const [locationError, setLocationError] = useState<boolean>(false);
  const [tryGPSAgain, setTryGPSAgain] = useState<boolean>(false);
  const onRefreshTasksRef = useRef(null);
  const [distUnit, setDistUnit] = useState<?string>(null);

  const {permissionsGranted} = usePermissions([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);

  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);
  const onRefresh = () => {
    // toggling refreshToggle to trigger a query refetch
    setRefreshToggle(!refreshToggle);
  };

  useEffect(() => {
    setLocationError(false);
    const startTime = Date.now();
    Geolocation.getCurrentPosition(
      position => {
        UserActionLogger.logMetric({
          key: METRIC.GPS_LOCK_LOW_ACCURACY,
          metric: Date.now() - startTime,
        });
        if (!isMounted()) {
          return;
        }
        setLocationError(false);
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
        if (!isMounted()) {
          return;
        }
        setLocationError(true);
        setUserLocation(null);
      },
      {
        enableHighAccuracy: false,
        timeout: LOCATION_REQUEST_TIMEOUT_MS,
        maximumAge: LOCATION_MAXIMUM_AGE_MS,
      },
    );
    setDistUnit(context.userPreferences.distUnit);
  }, [permissionsGranted, tryGPSAgain, context, isMounted]);

  const navigateToLocation = (id: string) => {
    NavigationService.push(Screens.LocationScreen, {id});
  };

  if (permissionsGranted == null) {
    return <SplashScreen />;
  }

  if (!permissionsGranted) {
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
              "Error message that appears when a user tries to navigate to the app's main menu and it is not available",
            ),
          );
        }}
        title={fbt('Nearby Sites', 'Page title').toString()}
        onSearchClicked={() => {
          NavigationService.push(Screens.LocationsSearchScreen);
        }}>
        <View style={styles.root}>
          <Text>
            <fbt desc="Text explaining why a permission is needed.">
              Allow the app to access this phone's location in order to scan
              cellular networks.
            </fbt>
          </Text>
        </View>
      </Toolbar>
    );
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
            "Error message that appears when a user tries to navigate to the app's main menu and it is not available",
          ),
        );
      }}
      title={fbt('Nearby Sites', 'Page title').toString()}
      onSearchClicked={() => {
        NavigationService.push(Screens.LocationsSearchScreen);
      }}
      onRefreshClicked={() => {
        onRefreshTasksRef.current && onRefreshTasksRef.current();
        onRefresh();
      }}>
      {locationError ? (
        <View>
          <Text style={styles.error}>
            <fbt desc="Error message explaining an error ocurred while getting gps coordinates">
              An error occurred while getting GPS coordinates. Please try again.
            </fbt>
          </Text>
          <Button
            color={Colors.Blue}
            size="default"
            onPress={() => {
              setTryGPSAgain(!tryGPSAgain);
            }}>
            <Text bold>
              <fbt desc="Button label to try again to get GPS signal">
                Try Again
              </fbt>
            </Text>
          </Button>
        </View>
      ) : userLocation === null ? (
        <SplashScreen
          text={fbt(
            'Finding location...',
            'Text shown while getting a location',
          ).toString()}
        />
      ) : (
        <QueryRenderer
          fetchPolicy="store-or-network"
          ttl={QUERY_TTL_MS}
          environment={RelayEnvironment}
          variables={{
            refresh: refreshToggle,
            latitude: userLocation?.latitude ?? 0.0,
            longitude: userLocation?.longitude ?? 0.0,
          }}
          query={sitesNearMeQuery}
          render={response => {
            const {
              props,
              error,
              retry,
              _cached,
            }: {
              props: ?LocationsScreenSitesAroundMeQueryResponse,
              error: Error,
              retry: () => void,
              _cached: boolean,
            } = response;
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
                    'Loading locations...',
                    'Loading message while loading the locations',
                  )}
                />
              );
            }

            const {nearestSites} = props;
            if (!nearestSites) {
              return null;
            }

            return (
              <List
                style={styles.locationList}
                emptyLabel={fbt(
                  'There are no nearby sites',
                  'Empty state text showing there are no work sites near the user',
                ).toString()}>
                {nearestSites
                  .slice()
                  .sort((a, b) => a.distanceKm - b.distanceKm)
                  .map(location => (
                    <ListItem
                      key={location.id}
                      id={location.id}
                      onItemClicked={() => navigateToLocation(location.id)}>
                      <View style={styles.locationRow}>
                        <LocationListItem
                          location={location}
                          showSurveysCount={false}
                          rightElement={
                            distUnit === distUnitOptions.MILE ? (
                              <Text
                                style={styles.distanceLabel}
                                size="caption_big">
                                <fbt desc="This is a label showing distance to a location">
                                  <fbt:param name="Distance value in mi">
                                    {convertKmtoMiles(
                                      parseFloat(location.distanceKm),
                                    ).toFixed(2)}
                                  </fbt:param>
                                  mi
                                </fbt>
                              </Text>
                            ) : (
                              <Text
                                style={styles.distanceLabel}
                                size="caption_big">
                                <fbt desc="Abbreviation of kilometers. This is a label showing distance to a location">
                                  <fbt:param name="Distance value in km">
                                    {location.distanceKm.toFixed(2)}
                                  </fbt:param>
                                  km
                                </fbt>
                              </Text>
                            )
                          }
                        />
                        <ChevronIcon />
                      </View>
                    </ListItem>
                  ))}
              </List>
            );
          }}
        />
      )}
    </Toolbar>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  distanceLabel: {
    color: Colors.Gray60,
  },
  error: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  locationList: {
    paddingLeft: 20,
    backgroundColor: Colors.BackgroundWhite,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: false,
  headerTitle: '',
};
LocationsScreen.navigationOptions = options;

export default LocationsScreen;
