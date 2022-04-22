/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {NavigatableView} from '@symphony/design-system/components/View/NavigatableViews';

import * as React from 'react';
import Button from '@symphony/design-system/components/Button';
import InventorySuspense from '../../../common/InventorySuspense';
import NavigatableViews from '@symphony/design-system/components/View/NavigatableViews';
import NewUserDialog from './users/NewUserDialog';
import OrganizationsCard from './organizations/OrganizationsCard';
import OrganizationsView, {
  ORGANIZATION_HEADER,
  ORGANIZATION_SUBHEADER,
} from './organizations/OrganizationsView';
import PermissionsGroupCard from './groups/PermissionsGroupCard';
import PermissionsGroupsView, {
  PERMISSION_GROUPS_VIEW_NAME,
  PERMISSION_GROUPS_VIEW_SUBHEADER,
} from './groups/PermissionsGroupsView';
import PermissionsPoliciesView, {
  PERMISSION_POLICIES_VIEW_NAME,
} from './policies/PermissionsPoliciesView';
import PermissionsPolicyCard from './policies/PermissionsPolicyCard';
import PopoverMenu from '@symphony/design-system/components/Select/PopoverMenu';
import Strings from '@fbcnms/strings/Strings';
import UsersView from './users/UsersView';
import fbt from 'fbt';
import useFeatureFlag from '@fbcnms/ui/context/useFeatureFlag';
import {ALL_USERS_PATH_PARAM, USER_PATH_PARAM} from './users/UsersTable';
import {DialogShowingContextProvider} from '@symphony/design-system/components/Dialog/DialogShowingContext';
import {FormContextProvider} from '../../../common/FormContext';
import {NEW_DIALOG_PARAM, POLICY_TYPES} from './utils/UserManagementUtils';
import {useCallback, useMemo, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';

const USERS_HEADER = fbt(
  'Users & Roles',
  'Header for view showing system users settings',
);

const USERS_SUBHEADER = fbt(
  "Add and manage your organization's users by entering their details and selecting a role.",
  'Subheader for view showing system users settings',
);

const UserManaementForm = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const basePath = match.path;
  const [addingNewUser, setAddingNewUser] = useState(false);

  const gotoOrganizationsPage = useCallback(
    () => history.push(`${basePath}/organizations`),
    [history, basePath],
  );
  const gotoGroupsPage = useCallback(() => history.push(`${basePath}/groups`), [
    history,
    basePath,
  ]);
  const gotoPoliciesPage = useCallback(
    () => history.push(`${basePath}/policies`),
    [history, basePath],
  );

  const multicontractorFlag = useFeatureFlag('multicontractor');

  const VIEWS: Array<NavigatableView> = useMemo(
    () => [
      {
        routingPath: `users/${USER_PATH_PARAM}`,
        targetPath: `users/${ALL_USERS_PATH_PARAM}`,
        menuItem: {
          label: USERS_HEADER,
          tooltip: `${USERS_HEADER}`,
        },
        component: {
          header: {
            title: `${USERS_HEADER}`,
            subtitle: `${USERS_SUBHEADER}`,
            actionButtons: [
              <Button onClick={() => setAddingNewUser(true)}>
                <fbt desc="">Add User</fbt>
              </Button>,
            ],
          },
          children: <UsersView />,
        },
      },
      {
        routingPath: 'groups',
        menuItem: {
          label: PERMISSION_GROUPS_VIEW_NAME,
          tooltip: `${PERMISSION_GROUPS_VIEW_NAME}`,
        },
        component: {
          header: {
            title: `${PERMISSION_GROUPS_VIEW_NAME}`,
            subtitle: `${PERMISSION_GROUPS_VIEW_SUBHEADER}`,
            actionButtons: [
              <Button onClick={() => history.push(`group/${NEW_DIALOG_PARAM}`)}>
                <fbt desc="">Create Group</fbt>
              </Button>,
            ],
          },
          children: <PermissionsGroupsView />,
        },
      },
      {
        routingPath: 'group/:id',
        component: {
          children: (
            <PermissionsGroupCard
              redirectToGroupsView={gotoGroupsPage}
              onClose={gotoGroupsPage}
            />
          ),
        },
        relatedMenuItemIndex: 1,
      },
      {
        routingPath: 'policies',
        menuItem: {
          label: PERMISSION_POLICIES_VIEW_NAME,
          tooltip: `${PERMISSION_POLICIES_VIEW_NAME}`,
        },
        component: {
          header: {
            title: `${PERMISSION_POLICIES_VIEW_NAME}`,
            subtitle: 'Manage policies and apply them to groups.',
            actionButtons: [
              <PopoverMenu
                options={[
                  POLICY_TYPES.InventoryPolicy,
                  POLICY_TYPES.WorkforcePolicy,
                ].map(type => ({
                  key: type.key,
                  value: type.key,
                  label: fbt(
                    fbt.param('policy type', type.value) + ' Policy',
                    'create policy of given type',
                  ),
                }))}
                skin="primary"
                onChange={typeKey => {
                  history.push(`policy/${NEW_DIALOG_PARAM}?type=${typeKey}`);
                }}>
                <fbt desc="">Create Policy</fbt>
              </PopoverMenu>,
            ],
          },
          children: <PermissionsPoliciesView />,
        },
      },
      {
        routingPath: 'policy/:id',
        component: {
          children: (
            <PermissionsPolicyCard
              redirectToPoliciesView={gotoPoliciesPage}
              onClose={gotoPoliciesPage}
            />
          ),
        },
        relatedMenuItemIndex: 3,
      },
      ...(multicontractorFlag
        ? [
            {
              routingPath: 'organizations',
              menuItem: {
                label: ORGANIZATION_HEADER,
                tooltip: `${ORGANIZATION_HEADER}`,
              },
              component: {
                header: {
                  title: `${ORGANIZATION_HEADER}`,
                  subtitle: `${ORGANIZATION_SUBHEADER}`,
                  actionButtons: [
                    <Button
                      onClick={() =>
                        history.push(`organization/${NEW_DIALOG_PARAM}`)
                      }>
                      <fbt desc="">Create organization</fbt>
                    </Button>,
                  ],
                },
                children: <OrganizationsView />,
              },
            },
            {
              routingPath: 'organization/:id',
              component: {
                children: (
                  <OrganizationsCard
                    redirectToOrganizationsView={gotoOrganizationsPage}
                    onClose={gotoOrganizationsPage}
                  />
                ),
              },
              relatedMenuItemIndex: 5,
            },
          ]
        : []),
    ],
    [gotoGroupsPage, gotoPoliciesPage, gotoOrganizationsPage, history],
  );

  return (
    <>
      <FormContextProvider permissions={{adminRightsRequired: true}}>
        <NavigatableViews
          header={Strings.admin.users.viewHeader}
          views={VIEWS}
          routingBasePath={basePath}
        />
      </FormContextProvider>
      {addingNewUser && (
        <NewUserDialog onClose={() => setAddingNewUser(false)} />
      )}
    </>
  );
};

const UserManaementView = () => (
  <InventorySuspense isTopLevel={true}>
    <DialogShowingContextProvider>
      <UserManaementForm />
    </DialogShowingContextProvider>
  </InventorySuspense>
);

export default UserManaementView;
