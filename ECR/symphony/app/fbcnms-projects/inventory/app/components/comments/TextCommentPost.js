/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {TextCommentPost_comment} from './__generated__/TextCommentPost_comment.graphql.js';

import ActivityIcon from './ActivityIcon';
import DateTimeFormat from '../../common/DateTimeFormat.js';
import React from 'react';
import Text from '@symphony/design-system/components/Text';

import symphony from '@symphony/design-system/theme/symphony';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';

type Props = $ReadOnly<{|
  comment: TextCommentPost_comment,
|}>;

const useStyles = makeStyles(() => ({
  textCommentPost: {
    minHeight: '24px',
    padding: '4px 40px 12px 16px',
    display: 'flex',
    flexDirection: 'row',
  },
  commentBody: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  commentContent: {
    flexGrow: 1,
    backgroundColor: symphony.palette.D50,
    borderRadius: '4px',
    padding: '4px 8px',
  },
}));

const TextCommentPost = (props: Props) => {
  const classes = useStyles();
  const {comment} = props;

  return (
    <div className={classes.textCommentPost}>
      <ActivityIcon field="COMMENT" />
      <div className={classes.commentBody}>
        <Text variant="body2" className={classes.commentContent}>
          <strong>{comment.author.email}</strong> <span>{comment.text}</span>
        </Text>
        <Text color="gray" variant="body2">
          {DateTimeFormat.commentTime(comment.createTime)}
        </Text>
      </div>
    </div>
  );
};

export default createFragmentContainer(TextCommentPost, {
  comment: graphql`
    fragment TextCommentPost_comment on Comment {
      id
      author {
        email
      }
      text
      createTime
    }
  `,
});
