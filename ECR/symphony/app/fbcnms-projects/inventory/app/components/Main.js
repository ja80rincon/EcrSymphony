/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import DeactivatedPage, {DEACTIVATED_PAGE_PATH} from './DeactivatedPage';
import FilesUploadContextProvider from './context/FilesUploadContextProvider';
import InventorySuspense from '../common/InventorySuspense';
import MainContext, {MainContextProvider} from './MainContext';
import React from 'react';
import SymphonyFilesUploadSnackbar from './SymphonyFilesUploadSnackbar';
import {AppContextProvider} from '@fbcnms/ui/context/AppContext';

import LoadingIndicator from '../common/LoadingIndicator';
import {Route, Switch} from 'react-router-dom';

const Admin = React.lazy(() => import('./admin/Admin'));
const IDToolMain = React.lazy(() => import('./id/IDToolMain'));
const Automation = React.lazy(() => import('./automation/Automation'));
const Inventory = React.lazy(() => import('./Inventory'));
const Settings = React.lazy(() => import('./settings/Settings'));
const WorkOrdersMain = React.lazy(() => import('./work_orders/WorkOrdersMain'));
const Assurance = React.lazy(() => import('./assurance/AssuranceMain'));
const Fulfillment = React.lazy(() => import('./fulfillment/FulfillmentMain'));

export default () => (
  <AppContextProvider>
    <MainContextProvider>
      <MainContext.Consumer>
        {mainContext =>
          mainContext.initializing ? (
            <LoadingIndicator />
          ) : (
            <FilesUploadContextProvider>
              <InventorySuspense>
                <Switch>
                  <Route
                    path={DEACTIVATED_PAGE_PATH}
                    component={DeactivatedPage}
                  />
                  <Route path="/inventory" component={Inventory} />
                  <Route path="/workorders" component={WorkOrdersMain} />
                  <Route path="/admin/settings" component={Settings} />
                  {mainContext.userHasAdminPermissions ? (
                    <Route path="/admin" component={Admin} />
                  ) : null}
                  <Route path="/automation" component={Automation} />
                  <Route path="/id" component={IDToolMain} />
                  <Route path="/assurance" component={Assurance} />
                  <Route path="/fulfillment" component={Fulfillment} />
                </Switch>
              </InventorySuspense>
              <SymphonyFilesUploadSnackbar />
            </FilesUploadContextProvider>
          )
        }
      </MainContext.Consumer>
    </MainContextProvider>
  </AppContextProvider>
);
