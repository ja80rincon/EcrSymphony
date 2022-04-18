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

import type {EquipmentPositionsListScreenQueryResponse} from './__generated__/EquipmentPositionsListScreenQuery.graphql';
import type {NavigationNavigatorProps} from 'react-navigation';
import type {NavigationScreenConfig} from 'react-navigation';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import PositionsPane from 'Platform/Components/PositionsPane';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {ScrollView} from 'react-native';
import {Text} from '@99xt/first-born';

const graphql = require('babel-plugin-relay/macro');

const positionsQuery = graphql`
  query EquipmentPositionsListScreenQuery($equipmentId: ID!) {
    node(id: $equipmentId) {
      ... on Equipment {
        equipmentType {
          positionDefinitions {
            ...PositionsPane_positionDefinitions
          }
        }
        positions {
          ...PositionsPane_positions
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {equipmentId: string}}>;

const EquipmentPositionsListScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const equipmentId = nullthrows(navigation.getParam('equipmentId'));
  return (
    <ScrollView style={styles.root}>
      <Text style={ApplicationStyles.screenTitle}>
        <fbt desc="Slots page title">Slots</fbt>
      </Text>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{equipmentId}}
        query={positionsQuery}
        render={response => {
          const {
            props,
            error,
            retry,
            _cached,
          }: {
            props: ?EquipmentPositionsListScreenQueryResponse,
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
                  'Loading positions...',
                  'Loading message while loading the equipment positions list',
                )}
              />
            );
          }

          const {node} = props;
          return (
            <PositionsPane
              positions={node.positions}
              positionDefinitions={node.equipmentType?.positionDefinitions}
            />
          );
        }}
      />
    </ScrollView>
  );
};

const styles = {
  root: {
    backgroundColor: Colors.BackgroundWhite,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

EquipmentPositionsListScreen.navigationOptions = options;

export default EquipmentPositionsListScreen;
