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

import type {WorkOrderCommentListItem_comment} from './__generated__/WorkOrderCommentListItem_comment.graphql';

import AppContext from 'Platform/Context/AppContext';
import React, {useContext} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import moment from 'moment';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';
import {StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {timeSince} from '@fbcmobile/ui/Utils/DateUtils';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +comment: WorkOrderCommentListItem_comment,
};

const WorkOrderCommentListItem = ({comment}: Props) => {
  const {jsLocale} = useContext(AppContext);
  return (
    <View style={styles.root}>
      <View style={styles.personIcon}>
        <Icon name="person" iconSet="MaterialIcons" color={Colors.Gray50} />
      </View>
      <View style={styles.commentContent}>
        <View style={styles.authorName}>
          <Text variant="h7" weight="bold">
            {comment.author.email}
          </Text>
        </View>
        <Text variant="h7">
          {comment.text}{' '}
          <Text variant="h8">
            {timeSince(moment(comment.createTime).locale(jsLocale), jsLocale)}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 6,
    paddingBottom: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  authorName: {
    marginBottom: 3,
  },
  commentContent: {
    marginRight: 6,
    flex: 1,
  },
  personIcon: {
    backgroundColor: Colors.Gray5,
    borderRadius: 50,
    padding: 8,
    marginRight: 9,
  },
});

export default createFragmentContainer(WorkOrderCommentListItem, {
  comment: graphql`
    fragment WorkOrderCommentListItem_comment on Comment {
      id
      author {
        email
      }
      text
      createTime
    }
  `,
});
