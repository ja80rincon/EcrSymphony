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

import type {EquipmentScreenQueryResponse} from './__generated__/EquipmentScreenQuery.graphql';
import type {
  NavigationNavigatorProps,
  NavigationScreenConfig,
} from 'react-navigation';

import Breadcrumbs from '@fbcmobile/ui/Components/Breadcrumbs';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import NavigationListItem from '@fbcmobile/ui/Components/NavigationListItem';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {ApplicationStyles, Colors} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {Text} from '@99xt/first-born';
import {Toolbar} from 'react-native-material-ui';
import {View} from 'react-native';

const graphql = require('babel-plugin-relay/macro');

const equipmentQuery = graphql`
  query EquipmentScreenQuery($equipmentId: ID!) {
    node(id: $equipmentId) {
      ... on Equipment {
        id
        name
        equipmentType {
          id
          name
        }
        locationHierarchy {
          id
          name
        }
        positionHierarchy {
          id
          parentEquipment {
            id
            name
          }
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {id: string}}>;

const EquipmentScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const id = nullthrows(navigation.getParam('id'));
  return (
    <QueryRenderer
      fetchPolicy="store-or-network"
      ttl={QUERY_TTL_MS}
      environment={RelayEnvironment}
      query={equipmentQuery}
      variables={{
        equipmentId: id,
      }}
      render={response => {
        const {
          props,
          error,
          retry,
          _cached,
        }: {
          props: ?EquipmentScreenQueryResponse,
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

        if (!props) {
          return (
            <SplashScreen
              text={fbt(
                'Loading equipment...',
                'Loading message while searching for list of equipment',
              ).toString()}
            />
          );
        }

        const {node} = props;
        if (!node) {
          return null;
        }
        const locationHierarchy = node.locationHierarchy
          ? node.locationHierarchy.map(l => ({
              name: l.name,
              id: l.id,
              type: 'location',
            }))
          : null;
        const positionHierarchy = node.positionHierarchy
          ? node.positionHierarchy.map(p => ({
              name: p.parentEquipment.name,
              id: p.parentEquipment.id,
              type: 'equipment',
            }))
          : null;

        const breadcrumbs = [];

        if (locationHierarchy) {
          breadcrumbs.concat(locationHierarchy);
        }

        if (positionHierarchy) {
          breadcrumbs.concat(positionHierarchy);
        }

        return (
          <View style={styles.root}>
            <Toolbar
              style={ApplicationStyles.screen.toolbar}
              leftElement="arrow-back"
              onLeftElementPress={() => navigation.goBack()}
            />
            <View style={styles.headerContainer}>
              {breadcrumbs ? (
                <Breadcrumbs
                  breadcrumbs={breadcrumbs}
                  onClick={b =>
                    navigation.navigate(
                      b.type === 'location'
                        ? Screens.LocationScreen
                        : Screens.EquipmentScreen,
                      {
                        id: b.id,
                      },
                    )
                  }
                />
              ) : null}
              <Text bold size="h4">
                {node.name}
              </Text>
              <View style={styles.detailsContainer}>
                <Text size="callout" style={styles.detailsText}>
                  <fbt desc="Label for an internal identification number that the user assigns to the equipment">
                    ID:<fbt:param name="Equipment ID">{node.id}</fbt:param>
                  </fbt>
                </Text>
              </View>
            </View>
            <View style={styles.navigationItems}>
              <NavigationListItem
                title={fbt(
                  'Properties',
                  'Item on navigation menu. Tapping it leads to a screen that discusses attributes or characteristics of a type of equipment',
                ).toString()}
                onClick={() =>
                  navigation.navigate(Screens.EquipmentPropertiesListScreen, {
                    equipmentId: node.id,
                  })
                }
              />
              <NavigationListItem
                title={fbt(
                  'Slots',
                  'This is a title on a navigation menu. A slot is a place on a piece of equipment where other equipment can be inserted (i.e. a memory card can be placed into a slot on a motherboard)',
                ).toString()}
                onClick={() =>
                  navigation.navigate(Screens.EquipmentPositionsListScreen, {
                    equipmentId: node.id,
                  })
                }
              />
            </View>
          </View>
        );
      }}
    />
  );
};

const styles = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.BackgroundWhite,
  },
  headerContainer: {
    padding: 20,
  },
  detailsContainer: {
    paddingVertical: 10,
  },
  detailsText: {
    letterSpacing: 0.5,
    color: Colors.Gray70,
  },
  navigationItems: {
    paddingLeft: 20,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: false,
};

EquipmentScreen.navigationOptions = options;

export default EquipmentScreen;
