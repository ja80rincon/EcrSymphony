/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
import type {TabProps} from '@symphony/design-system/components/Tabs/TabsBar';

import InventoryErrorBoundary from '../../common/InventoryErrorBoundary';
import InventorySuspense from '../../common/InventorySuspense';
import React, {useEffect, useState} from 'react';
import ServicesTypeCardDetails from './ServicesTypeCardDetails';
import ServicesTypes from './ServicesTypes';
// import TabsBar from '@symphony/design-system/components/Tabs/TabsBar';
import fbt from 'fbt';
// import {LogEvents, ServerLogger} from '../../common/LoggingUtils';
import {Redirect, Route, Switch} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import {useHistory, useLocation} from 'react-router';
import {useRelativeUrl} from '@fbcnms/ui/hooks/useRouter';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    transform: 'translateZ(0)',
  },
  tabs: {
    backgroundColor: 'white',
    borderBottom: `1px ${theme.palette.grey[200]} solid`,
    minHeight: '60px',
    overflow: 'visible',
  },
  tabContainer: {
    width: '250px',
  },
  tabsRoot: {
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
  },
}));

type RouteTab = {
  id: string,
  tab: TabProps,
  path: string,
};

export default function FulfillmentCatalog() {
  const relativeUrl = useRelativeUrl();
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const tabBars: Array<RouteTab> = [
    {
      id: 'services',
      tab: {
        label: fbt('SERVICES', 'Services'),
      },
      path: 'services',
    },
  ];

  const tabMatch = location.pathname.match(/([^\/]*)\/*$/);
  const tabIndex =
    tabMatch == null ? -1 : tabBars.findIndex(el => el.id === tabMatch[1]);
  const [activeTabBar] = useState<number>(tabIndex !== -1 ? tabIndex : 0);
  useEffect(() => {
    history.push(
      `/fulfillment/fulfillmentCatalog/${tabBars[activeTabBar].path}`,
    );
  }, [activeTabBar, history]);

  return (
    <div className={classes.root}>
      <InventoryErrorBoundary>
        <InventorySuspense>
          <Switch>
            <Route
              exact
              path={relativeUrl('/services')}
              component={ServicesTypes}
            />
            <Route
              exact
              path={relativeUrl('/servicesDetails')}
              component={ServicesTypeCardDetails}
            />
            <Redirect
              from={relativeUrl('/fulfillment/fulfillmentCatalog')}
              to={relativeUrl('/services')}
            />
          </Switch>
        </InventorySuspense>
      </InventoryErrorBoundary>
    </div>
  );
}
