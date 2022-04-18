/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {ActivityPost_activity} from './__generated__/ActivityPost_activity.graphql.js';

import ActivityIcon from './ActivityIcon';
import DateTimeFormat from '../../common/DateTimeFormat.js';
import GenericActivityText from './GenericActivityText';
import React from 'react';
import Text from '@symphony/design-system/components/Text';
import WorkOrderCheckInActivityText from './WorkOrderCheckInActivityText';
import WorkOrderCheckOutActivityText from './WorkOrderCheckOutActivityText';
import fbt from 'fbt';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';

type Props = $ReadOnly<{|
  activity: ActivityPost_activity,
|}>;

const useStyles = makeStyles(() => ({
  textActivityPost: {
    minHeight: '20px',
    padding: '4px 40px 12px 16px',
    display: 'flex',
    flexDirection: 'row',
  },
  activityBody: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
}));

const ActivityPost = (props: Props) => {
  const classes = useStyles();
  const {activity} = props;

  const getActivityMessage = () => {
    switch (activity.activityType) {
      case 'CREATION_DATE':
        return <fbt desc="">created this work order</fbt>;
      case 'DESCRIPTION':
        return <fbt desc="">changed the description</fbt>;
      case 'NAME':
        return (
          <fbt desc="">
            changed work order name to{' '}
            <fbt:param name="new value">
              <strong>{activity.newValue}</strong>
            </fbt:param>
          </fbt>
        );
      case 'CLOCK_IN':
        return <WorkOrderCheckInActivityText activity={activity} />;
      case 'CLOCK_OUT':
        return <WorkOrderCheckOutActivityText activity={activity} />;
      default:
        return <GenericActivityText activity={activity} />;
    }
  };

  return (
    <div className={classes.textActivityPost}>
      <ActivityIcon field={activity.activityType} />
      <div className={classes.activityBody}>
        <Text variant="body2">
          <strong>{activity.author?.email}</strong> {getActivityMessage()}
        </Text>
        <Text color="gray" variant="body2">
          {DateTimeFormat.commentTime(activity.createTime)}
        </Text>
      </div>
    </div>
  );
};

export default createFragmentContainer(ActivityPost, {
  activity: graphql`
    fragment ActivityPost_activity on Activity {
      id
      author {
        email
      }
      newValue
      activityType
      createTime
      ...GenericActivityText_activity
      ...WorkOrderCheckInActivityText_activity
      ...WorkOrderCheckOutActivityText_activity
    }
  `,
});
