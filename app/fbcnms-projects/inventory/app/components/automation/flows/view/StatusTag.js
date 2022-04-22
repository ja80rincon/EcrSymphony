/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {FlowStatus} from './__generated__/AutomationFlowCard_flow.graphql';

import * as React from 'react';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import {FLOW_STATUSES} from './AutomationFlowCard';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  statusTag: {
    borderRadius: '4px',
    display: 'inline-block',
    padding: '2px 8px',
  },
}));

type StatusTagProps = $ReadOnly<{|
  status: FlowStatus,
  className?: string,
|}>;

const StatusTag = (props: StatusTagProps) => {
  const {status, className} = props;
  const classes = useStyles();

  return (
    <Text
      variant="body2"
      className={classNames(classes.statusTag, className)}
      style={{
        backgroundColor: FLOW_STATUSES[status].backgroundColor,
        color: FLOW_STATUSES[status].color,
      }}>
      {FLOW_STATUSES[status].label}
    </Text>
  );
};

export default StatusTag;
