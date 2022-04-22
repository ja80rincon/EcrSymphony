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
import type {WorkOrderChecklistCategoryScreenQueryResponse} from './__generated__/WorkOrderChecklistCategoryScreenQuery.graphql';

import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import Text from '@fbcmobile/ui/Components/Core/Text';
import WorkOrderChecklistCategoryPane from 'Platform/Screens/WorkOrder/WorkOrderChecklistCategoryPane';
import fbt from 'fbt';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

const checklistCategoryQuery = graphql`
  query WorkOrderChecklistCategoryScreenQuery(
    $workOrderId: ID!
    $categoryId: ID!
  ) {
    workOrder: node(id: $workOrderId) {
      ... on WorkOrder {
        __typename
        ...WorkOrderChecklistCategoryPane_workOrder
      }
    }
    category: node(id: $categoryId) {
      ... on CheckListCategory {
        __typename
        ...WorkOrderChecklistCategoryPane_category
      }
    }
  }
`;

type Props = NavigationNavigatorProps<
  {},
  {params: {categoryId: string, workOrderId: string}},
>;

const WorkOrderChecklistCategoryScreen = ({navigation}: Props) => {
  const retryRef = useRef(null);
  const categoryId = nullthrows(navigation.getParam('categoryId'));
  const workOrderId = nullthrows(navigation.getParam('workOrderId'));

  return (
    <QueryRenderer
      fetchPolicy="store-or-network"
      ttl={QUERY_TTL_MS}
      environment={RelayEnvironment}
      variables={{workOrderId, categoryId}}
      query={checklistCategoryQuery}
      render={response => {
        const {
          props,
          error,
          retry,
          _cached,
        }: {
          props: ?WorkOrderChecklistCategoryScreenQueryResponse,
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

        if (!props || !props.workOrder || !props.category) {
          return (
            <SplashScreen
              text={fbt(
                'Loading categories...',
                'Loading message while loading the work order checklist categories',
              )}
            />
          );
        }

        const {category, workOrder} = props;
        if (
          category?.__typename !== 'CheckListCategory' ||
          workOrder?.__typename !== 'WorkOrder'
        ) {
          return (
            <Text>
              <fbt desc="error message">Error fetching category</fbt>
            </Text>
          );
        }

        return (
          <WorkOrderChecklistCategoryPane
            workOrder={workOrder}
            category={category}
            navigation={navigation}
          />
        );
      }}
    />
  );
};

const options: NavigationScreenConfig<*> = {
  headerShown: false,
  headerTitle: '',
};

WorkOrderChecklistCategoryScreen.navigationOptions = options;

export default WorkOrderChecklistCategoryScreen;
