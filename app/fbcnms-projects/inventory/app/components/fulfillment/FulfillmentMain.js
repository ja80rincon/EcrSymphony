/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import React, {useContext} from 'react';
import RelayEnvironment from '../../common/RelayEnvironment';

import AppContent from '@fbcnms/ui/components/layout/AppContent';
import AppContext from '@fbcnms/ui/context/AppContext';
import AppSideBar from '@fbcnms/ui/components/layout/AppSideBar';
import ApplicationMain from '@fbcnms/ui/components/ApplicationMain';
import FulfillmentCatalog from './FulfillmentCatalog';
import InventorySuspense from '../../common/InventorySuspense';
import {DialogShowingContextProvider} from '@symphony/design-system/components/Dialog/DialogShowingContext';
import {FulfillmentNavListItems} from './FulfillmentNavListItems';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {getProjectLinks} from '@fbcnms/projects/projects';
import {makeStyles} from '@material-ui/styles';
import {useMainContext} from '../MainContext';
import {useRelativeUrl} from '@fbcnms/ui/hooks/useRouter';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(),
  },
}));

function AssuranceMain() {
  const classes = useStyles();
  const {tabs} = useContext(AppContext);
  const relativeUrl = useRelativeUrl();
  const {integrationUserDefinition} = useMainContext();

  return (
    <InventorySuspense isTopLevel={true}>
      <DialogShowingContextProvider>
        <div className={classes.root}>
          <AppSideBar
            mainItems={<FulfillmentNavListItems />}
            projects={getProjectLinks(tabs, integrationUserDefinition)}
            showSettings={true}
            user={integrationUserDefinition}
          />
          <AppContent>
            <RelayEnvironmentProvider environment={RelayEnvironment}>
              <Switch>
                <Route
                  path={relativeUrl('/fulfillmentCatalog')}
                  component={FulfillmentCatalog}
                />
                <Redirect
                  from="/fulfillment"
                  to={relativeUrl('/fulfillmentCatalog/services')}
                />
              </Switch>
            </RelayEnvironmentProvider>
          </AppContent>
        </div>
      </DialogShowingContextProvider>
    </InventorySuspense>
  );
}

export default () => {
  return (
    <ApplicationMain>
      <AssuranceMain />
    </ApplicationMain>
  );
};
