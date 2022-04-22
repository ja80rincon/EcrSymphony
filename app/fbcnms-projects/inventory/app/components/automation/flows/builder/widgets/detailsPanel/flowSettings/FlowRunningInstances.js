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
import InfoTooltip from '@symphony/design-system/components/Tooltip/InfoTooltip';
import React from 'react';
import fbt from 'fbt';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  title: {
    display: 'flex',
  },
}));

type Props = $ReadOnly<{|
  className?: string,
|}>;

export default function FlowRunningInstances(props: Props) {
  const {className} = props;
  const classes = useStyles();
  const title = (
    <div className={classes.title}>
      <fbt desc="">Running instances</fbt>
      <InfoTooltip
        description={fbt(
          'Each time a flow is triggered, an instance of the flow starts running.',
          '',
        )}
      />
    </div>
  );

  return (
    <DetailsPanelSection
      title={title}
      body={fbt(
        `There are currently no active instances running in production,
        triggered of this flow. To have active instances in production, first
        Publish the flow.`,
        '',
      )}
      className={className}
    />
  );
}
