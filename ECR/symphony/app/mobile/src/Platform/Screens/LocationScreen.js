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

import type {LocationScreenQueryResponse} from './__generated__/LocationScreenQuery.graphql';
import type {
  NavigationNavigatorProps,
  NavigationScreenConfig,
} from 'react-navigation';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import LocationHeader from 'Platform/Components/LocationHeader';
import NavigationListItem from '@fbcmobile/ui/Components/NavigationListItem';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {ScrollView, View} from 'react-native';
import {Toolbar} from 'react-native-material-ui';

const graphql = require('babel-plugin-relay/macro');

const locationQuery = graphql`
  query LocationScreenQuery($locationId: ID!) {
    node(id: $locationId) {
      ... on Location {
        id
        name
        latitude
        longitude
        locationHierarchy {
          id
          name
        }
        children {
          id
          name
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {id: string}}>;

const LocationScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const id = nullthrows(navigation.getParam('id'));
  return (
    <QueryRenderer
      fetchPolicy="store-or-network"
      ttl={QUERY_TTL_MS}
      environment={RelayEnvironment}
      variables={{locationId: id}}
      query={locationQuery}
      render={response => {
        const {
          props,
          error,
          retry,
          _cached,
        }: {
          props: ?LocationScreenQueryResponse,
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

        if (!props || !props.node) {
          return (
            <SplashScreen
              text={fbt(
                'Loading location...',
                'Label shown while loading information on a location',
              ).toString()}
            />
          );
        }

        const {node} = props;
        return (
          <View style={styles.root}>
            <View>
              <Toolbar
                style={ApplicationStyles.screen.toolbar}
                leftElement="arrow-back"
                onLeftElementPress={() => navigation.goBack()}
              />
              <LocationHeader location={node} showExtraDetails={true} />
            </View>
            <ScrollView style={styles.navigationItems}>
              <NavigationListItem
                title={fbt(
                  'Properties',
                  'Item on navigation menu. Tapping it leads to a screen that discusses attributes or characteristics of a type of equipment',
                ).toString()}
                onClick={() =>
                  navigation.navigate(Screens.LocationPropertiesListScreen, {
                    locationId: id,
                  })
                }
              />
              <NavigationListItem
                title={fbt(
                  'Equipment',
                  'Navigation list item title. Equipment is physical equipment such as routers, antennas and cables.',
                ).toString()}
                onClick={() =>
                  navigation.navigate(Screens.EquipmentListScreen, {
                    locationId: id,
                  })
                }
              />
              <NavigationListItem
                title={fbt(
                  'Attachments',
                  'Item on a navigation menu, tapping it takes user to page where attachments can be found',
                ).toString()}
                onClick={() =>
                  navigation.navigate(Screens.LocationDocumentsScreen, {
                    locationId: id,
                  })
                }
              />
              <NavigationListItem
                title={fbt(
                  'Site Survey',
                  'Title on a navigation menu',
                ).toString()}
                onClick={() =>
                  navigation.navigate(Screens.SiteSurveyListScreen, {
                    locationId: id,
                  })
                }
              />
              <NavigationListItem
                title={fbt(
                  'Cell Scan',
                  'Item on a navigation screen. A cell scan is a process where the phone scans for the cellular signals from different providers (AT&T, Vodaphone, etc)',
                ).toString()}
                onClick={() =>
                  navigation.navigate(Screens.CellScanScreen, {
                    locationId: id,
                  })
                }
              />
            </ScrollView>
          </View>
        );
      }}
    />
  );
};

const styles = {
  root: {
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  navigationItems: {
    paddingLeft: 20,
  },
};
const options: NavigationScreenConfig<*> = {
  headerShown: false,
};

LocationScreen.navigationOptions = options;

export default LocationScreen;
