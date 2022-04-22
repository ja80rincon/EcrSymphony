/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {GenericActivityText_activity$key} from './__generated__/GenericActivityText_activity.graphql';

import React from 'react';
import classNames from 'classnames';
import fbt from 'fbt';
import {graphql, useFragment} from 'react-relay/hooks';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  capitalize: {
    textTransform: 'capitalize',
  },
}));

type Props = $ReadOnly<{|
  activity: GenericActivityText_activity$key,
|}>;

const GenericActivityText = (props: Props) => {
  const {activity} = props;
  const classes = useStyles();
  const data = useFragment(
    graphql`
      fragment GenericActivityText_activity on Activity {
        activityType
        newRelatedNode {
          __typename
          ... on User {
            email
          }
        }
        oldRelatedNode {
          __typename
          ... on User {
            email
          }
        }
        oldValue
        newValue
      }
    `,
    activity,
  );

  const genActivityValueComponent = (val: string) => (
    <strong
      className={classNames({
        [classes.capitalize]:
          data.activityType === 'STATUS' || data.activityType === 'PRIORITY',
      })}>
      {val}
    </strong>
  );

  let oldVal = (data.oldValue ?? '').toLowerCase();
  let newVal = (data.newValue ?? '').toLowerCase();
  const oldValNode = data.oldRelatedNode;
  if (oldValNode && oldValNode?.__typename === 'User') {
    oldVal = oldValNode.email;
  }
  const newValNode = data.newRelatedNode;
  if (newValNode && newValNode?.__typename === 'User') {
    newVal = newValNode.email;
  }
  if (oldVal === '') {
    return (
      <fbt desc="">
        set the{' '}
        <fbt:param name="changed field">
          <span>{data.activityType.toLowerCase()}</span>
        </fbt:param>
        to{' '}
        <fbt:param name="new value">
          {genActivityValueComponent(newVal)}
        </fbt:param>
      </fbt>
    );
  }
  if (newVal === '') {
    if (oldValNode && oldValNode?.__typename === 'User') {
      return (
        <fbt desc="">
          removed{' '}
          <fbt:param name="old value">
            {genActivityValueComponent(oldVal)}
          </fbt:param>
          as an
          <fbt:param name="changed field">
            <span>{data.activityType.toLowerCase()}</span>
          </fbt:param>
        </fbt>
      );
    }
    return (
      <fbt desc="">
        removed{' '}
        <fbt:param name="changed field">
          <span>{data.activityType.toLowerCase()}</span>
        </fbt:param>
        value
      </fbt>
    );
  }

  return (
    <fbt desc="">
      changed the{' '}
      <fbt:param name="changed field">
        <span>{data.activityType.toLowerCase()}</span>
      </fbt:param>
      from{' '}
      <fbt:param name="old value">
        {genActivityValueComponent(oldVal)}
      </fbt:param>
      to{' '}
      <fbt:param name="new value">
        {genActivityValueComponent(newVal)}
      </fbt:param>
    </fbt>
  );
};

export default GenericActivityText;
