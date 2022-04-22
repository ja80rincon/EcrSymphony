/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import InventorySuspense from '../../common/InventorySuspense';
import NavigatableViews from '@symphony/design-system/components/View/NavigatableViews';
import React, {useMemo} from 'react';
import RelayEnvironment from '../../common/RelayEnvironment';
import Text from '@symphony/design-system/components/Text';
import WorkOrderProjectTypes from '../configure/WorkOrderProjectTypes';
import WorkOrderTypes from '../configure/WorkOrderTypes';
import fbt from 'fbt';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
    transform: 'translateZ(0)',
  },
  subtitle: {
    color: theme.palette.gray13,
  },
  title: {
    display: 'block',
  },
}));

export default function WorkOrderConfigure() {
  const menuItems = useMemo(
    () => [
      {
        menuItem: {
          label: `${fbt('Work Orders', '')}`,
          tooltip: '',
        },
        component: {
          children: <WorkOrderTypes />,
        },
        routingPath: 'work_order_types',
      },
      {
        menuItem: {
          label: `${fbt('Projects', '')}`,
          tooltip: '',
        },
        component: {
          children: <WorkOrderProjectTypes />,
        },
        routingPath: 'project_types',
      },
    ],
    [],
  );

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <InventorySuspense>
          <NavigatableViews
            header={
              <Text className={classes.title}>
                {<fbt desc="">Templates</fbt>}
              </Text>
            }
            views={menuItems}
            routingBasePath="/workorders/configure"
          />
        </InventorySuspense>
      </RelayEnvironmentProvider>
    </div>
  );
}
