/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import EducationNote from '@symphony/design-system/illustrations/EducationNote';
import Text from '@symphony/design-system/components/Text';
import fbt from 'fbt';
import {CreateNewFlowButton} from './AutomationFlowsView';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(_theme => ({
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyHeader: {
    paddingTop: '28px',
    paddingBottom: '6px',
  },
  text: {
    paddingBottom: '32px',
  },
  centeredItemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '80vh',
  },
}));

const AutomationFlowsEmptyState = () => {
  const classes = useStyles();
  return (
    <div className={classes.centeredItemContainer}>
      <div className={classes.emptyState}>
        <EducationNote />
        <Text variant="h6" color="regular" className={classes.emptyHeader}>
          <fbt desc="">Start Creating Automation Flows</fbt>
        </Text>
        <Text variant="body2" color="regular">
          <fbt desc="">
            Create automation flows to automatically trigger workflows and
            processes
          </fbt>
        </Text>
        <Text variant="body2" color="regular" className={classes.text}>
          <fbt desc="">like updating Inventory and creating work orders.</fbt>
        </Text>
        {CreateNewFlowButton}
      </div>
    </div>
  );
};

export default AutomationFlowsEmptyState;
