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

import type {EquipmentListScreenQueryResponse} from './__generated__/EquipmentListScreenQuery.graphql';
import type {NavigationNavigatorProps} from 'react-navigation';
import type {NavigationScreenConfig} from 'react-navigation';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import EquipmentPane from 'Platform/Components/EquipmentPane';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Text} from '@99xt/first-born';
import {View} from 'react-native';

const graphql = require('babel-plugin-relay/macro');

const equipmentQuery = graphql`
  query EquipmentListScreenQuery($locationId: ID!) {
    node(id: $locationId) {
      ... on Location {
        equipments {
          ...EquipmentPane_equipment
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {locationId: string}}>;

const EquipmentListScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const locationId = navigation.getParam('locationId');
  return (
    <View style={styles.root}>
      <Text style={ApplicationStyles.screenTitle}>
        <fbt desc="Title of the Equipment screen">Equipment</fbt>
      </Text>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{locationId}}
        query={equipmentQuery}
        render={response => {
          const {
            props,
            error,
            retry,
            _cached,
          }: {
            props: ?EquipmentListScreenQueryResponse,
            error: ?Error,
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
                  'Loading equipment...',
                  'Loading message while loading the equipment',
                )}
              />
            );
          }

          return <EquipmentPane equipment={props.node.equipments} />;
        }}
      />
    </View>
  );
};

const styles = {
  root: {
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

EquipmentListScreen.navigationOptions = options;

export default EquipmentListScreen;
