/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AccountSettings_UserQuery} from './__generated__/AccountSettings_UserQuery.graphql';

import * as React from 'react';
import InventorySuspense from '../../common/InventorySuspense';
import UserAccountPane from '../admin/userManagement/users/UserAccountPane';
import ViewContainer from '@symphony/design-system/components/View/ViewContainer';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {graphql, useLazyLoadQuery} from 'react-relay/hooks';
import {makeStyles} from '@material-ui/styles';
import {useMainContext} from '../MainContext';

const userQuery = graphql`
  query AccountSettings_UserQuery($id: ID!) {
    node(id: $id) {
      ... on User {
        ...UserManagementUtils_user @relay(mask: false)
      }
    }
  }
`;

const useStyles = makeStyles(() => ({
  settingsPage: {
    borderRadius: '4px',
    boxShadow: symphony.shadows.DP1,
    background: symphony.palette.white,
    flexGrow: 1,
    padding: '32px',
    maxWidth: '1024px',
  },
}));

function UserAccountWrapper() {
  const classes = useStyles();
  const mainContext = useMainContext();

  const loggedInUserID = mainContext.me?.user?.id;

  const userData = useLazyLoadQuery<AccountSettings_UserQuery>(userQuery, {
    id: loggedInUserID ?? '',
  });

  const loggedInUser = userData?.node;

  if (loggedInUserID == null || loggedInUser == null) {
    return <fbt desc="">Failed to identify logged in user account</fbt>;
  }

  return (
    <ViewContainer
      header={{
        title: <fbt desc="">User Settings</fbt>,
        subtitle: <fbt desc="">Manage your own private settings.</fbt>,
      }}>
      <div className={classes.settingsPage}>
        {/* $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay
         * types */}
        <UserAccountPane user={loggedInUser} isForCurrentUserSettings={true} />
      </div>
    </ViewContainer>
  );
}

export default function AccountSettings() {
  return (
    <InventorySuspense isTopLevel={true}>
      <UserAccountWrapper />
    </InventorySuspense>
  );
}
