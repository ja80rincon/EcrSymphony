/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import DetailsPanelSection from '../DetailsPanelSection';
import React from 'react';
import StatusTag from '../../../../view/StatusTag';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {FLOW_STATUSES} from '../../../../view/AutomationFlowCard';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {},
  topWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  title: {
    marginBottom: '18px',
  },
  largeStatus: {
    padding: '6px 12px',
  },
  lastSaved: {
    marginTop: '18px',
    padding: '18px',
    backgroundColor: symphony.palette.D50,
  },
}));

type Props = $ReadOnly<{|
  className?: string,
|}>;

export default function FlowStatus(props: Props) {
  const classes = useStyles();
  const {className} = props;
  // TODO: when available get these from the AutomationFlowCard_flowDraft
  const status = FLOW_STATUSES.UNPUBLISHED.key;
  const body = (
    <div className={classes.lastSaved}>Last saved on Oct 21, 4:32 PM</div>
  );

  return (
    <DetailsPanelSection
      title={fbt('Status', '')}
      body={body}
      actionItems={[
        <StatusTag className={classes.largeStatus} status={status} />,
      ]}
      variant="fullWidth"
      className={className}
    />
  );
}
