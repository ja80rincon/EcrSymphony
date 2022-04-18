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

import type {NavigationNavigatorProps} from 'react-navigation';
import type {NavigationScreenConfig} from 'react-navigation';
import type {WorkOrderPropertiesListScreenQueryResponse} from './__generated__/WorkOrderPropertiesListScreenQuery.graphql';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import PropertiesPane from 'Platform/Components/PropertiesPane';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import nullthrows from 'nullthrows';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {ScrollView} from 'react-native';
import {Text} from '@99xt/first-born';

const propertiesQuery = graphql`
  query WorkOrderPropertiesListScreenQuery($workOrderId: ID!) {
    node(id: $workOrderId) {
      ... on WorkOrder {
        properties {
          ...PropertiesPane_properties
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {workOrderId: string}}>;

const WorkOrderPropertiesListScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const workOrderId = nullthrows(navigation.getParam('workOrderId'));
  return (
    <ScrollView style={styles.root}>
      <Text style={ApplicationStyles.screenTitle}>
        <fbt desc="Title of the Properties screen">Properties</fbt>
      </Text>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{workOrderId}}
        query={propertiesQuery}
        render={response => {
          const {
            props,
            error,
            retry,
            _cached,
          }: {
            props: ?WorkOrderPropertiesListScreenQueryResponse,
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
                  'Loading properties...',
                  'Loading message while loading the work order properties',
                )}
              />
            );
          }

          const {node} = props;
          return (
            <PropertiesPane properties={node.properties} propertyTypes={null} />
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

WorkOrderPropertiesListScreen.navigationOptions = options;

export default WorkOrderPropertiesListScreen;
