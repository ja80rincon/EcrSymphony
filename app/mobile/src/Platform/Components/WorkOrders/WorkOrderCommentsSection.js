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

import type {WorkOrderCommentsSection_workOrder} from './__generated__/WorkOrderCommentsSection_workOrder.graphql';

import * as React from 'react';
import ChevronIcon from '@fbcmobile/ui/Components/ChevronIcon';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import Text from '@fbcmobile/ui/Components/Core/Text';
import WorkOrderAddCommentView from 'Platform/Components/WorkOrders/WorkOrderAddCommentView';
import WorkOrderCommentListItem from 'Platform/Components/WorkOrders/WorkOrderCommentListItem';
import fbt from 'fbt';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

const NUM_COMMENTS_TO_DISPLAY = 3;

type Props = $ReadOnly<{|
  +workOrder: WorkOrderCommentsSection_workOrder,
  +onUserSubmittedComment: () => void,
|}>;

const WorkOrderCommentsSection = ({
  workOrder,
  onUserSubmittedComment,
}: Props) => {
  return (
    <ListItem fullWidth={true}>
      <View>
        <Text variant="h2" weight="bold">
          <fbt desc="Comments section title">Comments</fbt>
        </Text>
      </View>
      {workOrder.comments.filter(Boolean).length > 0 ? (
        <TouchableOpacity
          style={styles.viewAllCommentsContainer}
          onPress={() =>
            NavigationService.push(Screens.WorkOrderCommentsScreen, {
              workOrderId: workOrder.id,
            })
          }>
          <Text variant="h3" weight="bold" style={styles.viewAllCommentsText}>
            <fbt desc="Button to go to a screen where you can view all the work order comments">
              View all comments
            </fbt>
          </Text>
          <ChevronIcon />
        </TouchableOpacity>
      ) : null}
      <View style={styles.comments}>
        {workOrder.comments
          .filter(Boolean)
          .slice(-NUM_COMMENTS_TO_DISPLAY)
          .map(comment => (
            <WorkOrderCommentListItem key={comment.id} comment={comment} />
          ))}
      </View>
      <View>
        <WorkOrderAddCommentView
          workOrderId={workOrder.id}
          onUserSubmittedComment={onUserSubmittedComment}
        />
      </View>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  viewAllCommentsContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 11,
    paddingBottom: 7,
  },
  viewAllCommentsText: {
    flexGrow: 1,
  },
  comments: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default createFragmentContainer(WorkOrderCommentsSection, {
  workOrder: graphql`
    fragment WorkOrderCommentsSection_workOrder on WorkOrder {
      id
      comments {
        id
        ...WorkOrderCommentListItem_comment
      }
    }
  `,
});
