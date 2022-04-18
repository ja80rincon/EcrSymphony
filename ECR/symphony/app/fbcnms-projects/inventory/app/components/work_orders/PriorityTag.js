/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrderPriority} from './__generated__/WorkOrderDetails_workOrder.graphql.js';

import React from 'react';
import Text from '@symphony/design-system/components/Text';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';
import {priorityValues} from '../../common/FilterTypes';

type Props = $ReadOnly<{|
  priority: WorkOrderPriority,
|}>;

const useStyles = makeStyles(() => ({
  root: {
    border: `solid 1px ${symphony.palette.D100}`,
    borderRadius: '4px',
    padding: '1px 7px',
    display: 'inline-block',
    background: symphony.palette.white,
  },
}));

const PriorityTag = (props: Props) => {
  const {priority} = props;
  const label = priorityValues.find(
    priorityValue => priorityValue.value === priority,
  )?.label;
  const classes = useStyles();

  return label != null && priority !== 'NONE' ? (
    <div className={classes.root}>
      <Text variant="body2">{label}</Text>
    </div>
  ) : null;
};

export default PriorityTag;
