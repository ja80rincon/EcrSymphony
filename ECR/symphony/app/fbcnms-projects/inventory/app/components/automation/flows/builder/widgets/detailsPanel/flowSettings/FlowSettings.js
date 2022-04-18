/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import FlowDescription from './FlowDescription';
import FlowRunningInstances from './FlowRunningInstances';
import FlowStatus from './FlowStatus';
import React from 'react';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  section: {
    '&:not(:last-child)': {
      paddingBottom: '27px',
      marginBottom: '22px',
      borderBottom: `1px solid ${symphony.palette.D50}`,
    },
  },
}));

export default function FlowSettings() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FlowStatus className={classes.section} />
      <FlowDescription className={classes.section} />
      <FlowRunningInstances className={classes.section} />
    </div>
  );
}
