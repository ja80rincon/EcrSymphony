/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react';
import AdminContextProvider from './AdminContextProvider';
import AdminMain from './AdminMain';
import AppContext from '@fbcnms/ui/context/AppContext';
import ApplicationMain from '@fbcnms/ui/components/ApplicationMain';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AuditLog from './AuditLog';
import NavListItem from '@fbcnms/ui/components/NavListItem';
import Paper from '@material-ui/core/Paper';
import PeopleIcon from '@material-ui/icons/People';
import ViewListIcon from '@material-ui/icons/ViewList';

import SecuritySettings from '../SecuritySettings';
import UserManaementView from './userManagement/UserManaementView';
import ParametersCatalog from './parametersCatalog/ParametersCatalog';
import {Redirect, Route, Switch} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import {useContext} from 'react';
import {useRelativeUrl} from '@fbcnms/ui/hooks/useRouter';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(),
  },
}));

function NavItems() {
  const relativeUrl = useRelativeUrl();
  const {isFeatureEnabled} = useContext(AppContext);
  const auditLogEnabled = isFeatureEnabled('audit_log_view');

  return (
    <>
      <NavListItem
        label="User Management"
        path={relativeUrl('/user_management')}
        icon={<PeopleIcon />}
      />
      <NavListItem
        label="Parameters Catalog"
        path={relativeUrl('/parameters_catalog')}
        icon={<ViewListIcon />}
      />
      {auditLogEnabled && (
        <NavListItem
          label="Audit Log"
          path={relativeUrl('/audit_log')}
          icon={<AssignmentIcon />}
        />
      )}
    </>
  );
}

function NavRoutes() {
  const classes = useStyles();
  const relativeUrl = useRelativeUrl();
  return (
    <Switch>
      <Route
        path={relativeUrl('/user_management')}
        component={UserManaementView}
      />
      <Route
        path={relativeUrl('/parameters_catalog')}
        component={ParametersCatalog}
      />
      <Route path={relativeUrl('/audit_log')} component={AuditLog} />
      <Route
        path={relativeUrl('/settings')}
        render={() => (
          <Paper className={classes.paper}>
            <SecuritySettings />
          </Paper>
        )}
      />
      <Redirect to={relativeUrl('/user_management')} />
    </Switch>
  );
}

export default () => (
  <ApplicationMain>
    <AdminContextProvider>
      <AdminMain
        navRoutes={() => <NavRoutes />}
        navItems={() => <NavItems />}
      />
    </AdminContextProvider>
  </ApplicationMain>
);
