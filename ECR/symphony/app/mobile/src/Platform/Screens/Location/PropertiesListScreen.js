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
import type {PropertiesListScreenQueryResponse} from './__generated__/PropertiesListScreenQuery.graphql';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import PropertiesPane from 'Platform/Components/PropertiesPane';
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

const propertiesQuery = graphql`
  query PropertiesListScreenQuery($locationId: ID!) {
    node(id: $locationId) {
      ... on Location {
        locationType {
          propertyTypes {
            ...PropertiesPane_propertyTypes
          }
        }
        properties {
          ...PropertiesPane_properties
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {locationId: string}}>;

const PropertiesListScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const locationId = nullthrows(navigation.getParam('locationId'));
  return (
    <ScrollView style={styles.root}>
      <Text style={ApplicationStyles.screenTitle}>
        <fbt desc="Title of a screen that discusses attributes or characteristics of a type of equipment">
          Properties
        </fbt>
      </Text>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{locationId}}
        query={propertiesQuery}
        render={response => {
          const {
            props,
            error,
            retry,
            _cached,
          }: {
            props: ?PropertiesListScreenQueryResponse,
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
                  'Loading message while loading properties',
                )}
              />
            );
          }

          const {node} = props;
          return (
            <PropertiesPane
              properties={node.properties}
              propertyTypes={node.locationType?.propertyTypes}
            />
          );
        }}
      />
    </ScrollView>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

PropertiesListScreen.navigationOptions = options;

export default PropertiesListScreen;
