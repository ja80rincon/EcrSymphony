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
import type {WorkOrderCommentsScreenQueryResponse} from './__generated__/WorkOrderCommentsScreenQuery.graphql';

import BottomBar from '@fbcmobile/ui/Components/Core/BottomBar';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import React, {useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import ScrollViewWithBottomBar from '@fbcmobile/ui/Components/Core/ScrollViewWithBottomBar';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import WorkOrderAddCommentView from 'Platform/Components/WorkOrders/WorkOrderAddCommentView';
import WorkOrderCommentListItem from 'Platform/Components/WorkOrders/WorkOrderCommentListItem';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {StyleSheet, View} from 'react-native';

const commentsQuery = graphql`
  query WorkOrderCommentsScreenQuery($workOrderId: ID!) {
    node(id: $workOrderId) {
      ... on WorkOrder {
        id
        comments {
          id
          ...WorkOrderCommentListItem_comment
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {workOrderId: string}}>;

const WorkOrderCommentsScreen = (props: Props) => {
  const {navigation} = props;
  const workOrderId = nullthrows(navigation.getParam('workOrderId'));
  const scrollViewRef = useRef(null);
  const retryRef = useRef(null);

  return (
    <ScrollViewWithBottomBar
      ref={scrollViewRef}
      bottomBar={
        <BottomBar>
          <WorkOrderAddCommentView
            workOrderId={workOrderId}
            onUserSubmittedComment={() => {
              setTimeout(
                () =>
                  scrollViewRef.current != null &&
                  // $FlowFixMe - T72031710
                  scrollViewRef.current.scrollToEnd({animated: true}),
                100,
              );
            }}
          />
        </BottomBar>
      }>
      <View style={styles.root}>
        <QueryRenderer
          fetchPolicy="store-or-network"
          ttl={QUERY_TTL_MS}
          environment={RelayEnvironment}
          variables={{workOrderId}}
          query={commentsQuery}
          render={response => {
            const {
              props,
              error,
              retry,
              _cached,
            }: {
              props: ?WorkOrderCommentsScreenQueryResponse,
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
                    'Loading comments...',
                    'Loading message while loading the work order comments',
                  )}
                />
              );
            }

            const {node: workOrder} = props;
            if (error || !workOrder.comments) {
              return null;
            }

            return (
              <View>
                {workOrder.comments.filter(Boolean).map(comment => (
                  <WorkOrderCommentListItem
                    key={comment.id}
                    comment={comment}
                  />
                ))}
              </View>
            );
          }}
        />
      </View>
    </ScrollViewWithBottomBar>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
  },
});

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: fbt('Comments', 'Comments screen title').toString(),
};

WorkOrderCommentsScreen.navigationOptions = options;

export default WorkOrderCommentsScreen;
