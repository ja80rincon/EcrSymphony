/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrderStatus} from './__generated__/WorkOrderDetails_workOrder.graphql.js';

import React from 'react';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import symphony from '@symphony/design-system/theme/symphony';
import {
  blockedStatus,
  closedStatus,
  doneStatus,
  inProgressStatus,
  pendingStatus,
  plannedStatus,
  submittedStatus,
  useStatusValues,
} from '../../common/FilterTypes';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: '4px',
    padding: '1px 8px',
    display: 'inline-block',
  },
}));

type Props = $ReadOnly<{|
  className?: string,
  status: WorkOrderStatus,
|}>;

export const getStatusColor = (status: WorkOrderStatus) => {
  switch (status) {
    case plannedStatus.value:
      return symphony.palette.D700;
    case pendingStatus.value:
    case inProgressStatus.value:
      return symphony.palette.Y600;
    case submittedStatus.value:
    case doneStatus.value:
      return symphony.palette.G600;
    case blockedStatus.value:
      return symphony.palette.R600;
    case closedStatus.value:
      return symphony.palette.D300;
    default:
      return symphony.palette.D300;
  }
};

const StatusTag = (props: Props) => {
  const {status, className} = props;
  const {statusValues} = useStatusValues();
  const label = statusValues.find(statusValue => statusValue.value === status)
    ?.label;
  const classes = useStyles();

  return label != null ? (
    <div
      className={classNames(classes.root, className)}
      style={{backgroundColor: getStatusColor(status)}}>
      <Text variant="body2" color="light">
        {label}
      </Text>
    </div>
  ) : null;
};

export default StatusTag;
