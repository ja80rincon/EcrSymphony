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
import type {WorkOrderChecklistScreenQueryResponse} from './__generated__/WorkOrderChecklistScreenQuery.graphql';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import Text from '@fbcmobile/ui/Components/Core/Text';
import WorkOrderChecklistCategoryNavigationListItem from 'Platform/Screens/WorkOrder/WorkOrderChecklistCategoryNavigationListItem';
import fbt from 'fbt';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {ScrollView, StyleSheet, View} from 'react-native';

const graphql = require('babel-plugin-relay/macro');

const workOrderChecklistQuery = graphql`
  query WorkOrderChecklistScreenQuery($workOrderId: ID!) {
    node(id: $workOrderId) {
      ... on WorkOrder {
        checkListCategories {
          id
          ...WorkOrderChecklistCategoryNavigationListItem_category
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {workOrderId: string}}>;

const WorkOrderChecklistScreen = ({navigation}: Props) => {
  const retryRef = useRef(null);
  const workOrderId = nullthrows(navigation.getParam('workOrderId'));
  return (
    <ScrollView style={ApplicationStyles.screen.container}>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{workOrderId}}
        query={workOrderChecklistQuery}
        render={response => {
          const {
            props,
            error,
            retry,
            _cached,
          }: {
            props: ?WorkOrderChecklistScreenQueryResponse,
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
                  'Loading tasks...',
                  'Loading message while loading the work order checklist',
                )}
              />
            );
          }

          const {checkListCategories} = props.node;
          if (!checkListCategories) {
            return (
              <Text>
                <fbt desc="error message">Error fetching categories</fbt>
              </Text>
            );
          }

          return (
            <View style={styles.root}>
              {checkListCategories.map(category => (
                <WorkOrderChecklistCategoryNavigationListItem
                  key={category.id}
                  workOrderId={workOrderId}
                  category={category}
                  navigation={navigation}
                />
              ))}
            </View>
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingLeft: 20,
    backgroundColor: Colors.BackgroundWhite,
  },
});

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: fbt(
    'Checklist',
    'Title of the work order checklist screen',
  ).toString(),
};

WorkOrderChecklistScreen.navigationOptions = options;

export default WorkOrderChecklistScreen;
