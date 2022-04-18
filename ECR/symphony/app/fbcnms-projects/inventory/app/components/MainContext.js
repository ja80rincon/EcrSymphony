/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {
  MainContextMeQuery,
  MainContextMeQueryResponse,
} from './__generated__/MainContextMeQuery.graphql';
import type {SessionUser} from '../common/UserModel';

import * as React from 'react';
import RelayEnvironment from '../common/RelayEnvironment';
import {DEACTIVATED_PAGE_PATH} from './DeactivatedPage';
import {PermissionValues} from './admin/userManagement/utils/UserManagementUtils';
import {fetchQuery, graphql} from 'relay-runtime';
import {useContext, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

export type Me = $ElementType<MainContextMeQueryResponse, 'me'>;
export type UserPermissions = $ElementType<$NonMaybeType<Me>, 'permissions'>;

const isUserHasAdminPermissions: (
  ?MainContextMeQueryResponse,
) => boolean = queryResponse =>
  queryResponse?.me?.permissions.adminPolicy.access.isAllowed ===
  PermissionValues.YES;

export type MainContextValue = {
  initializing: boolean,
  integrationUserDefinition: SessionUser,
  userHasAdminPermissions: boolean,
  ...MainContextMeQueryResponse,
};

const integrationUserDefinitionBuilder: (
  ?MainContextMeQueryResponse,
  ?boolean,
) => SessionUser = (queryResponse, ignorePermissions) => ({
  email: queryResponse?.me?.user?.email || '',
  isSuperUser:
    ignorePermissions === true || isUserHasAdminPermissions(queryResponse),
});

const DEFUALT_VALUE = {
  initializing: true,
  integrationUserDefinition: integrationUserDefinitionBuilder(),
  userHasAdminPermissions: false,
  me: null,
};

const MainContext = React.createContext<MainContextValue>(DEFUALT_VALUE);

export function useMainContext() {
  return useContext(MainContext);
}

const meQuery = graphql`
  query MainContextMeQuery {
    me {
      user {
        id
        authID
        email
        firstName
        lastName
        organizationFk {
          id
          name
          description
        }
      }
      permissions {
        adminPolicy {
          access {
            isAllowed
          }
        }
        inventoryPolicy {
          read {
            isAllowed
          }
          location {
            create {
              isAllowed
              locationTypeIds
            }
            update {
              isAllowed
              locationTypeIds
            }
            delete {
              isAllowed
              locationTypeIds
            }
          }
          documentCategory {
            read {
              isAllowed
              documentCategoryIds
            }
            create {
              isAllowed
              documentCategoryIds
            }
            update {
              isAllowed
              documentCategoryIds 
            }
            delete {
              isAllowed
              documentCategoryIds
            }
          }
          equipment {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          equipmentType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          locationType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          portType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          serviceType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
        }
        workforcePolicy {
          read {
            isAllowed
            projectTypeIds
            workOrderTypeIds
            organizationIds
          }
          templates {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          data {
            create {
              isAllowed
              projectTypeIds
              workOrderTypeIds
            }
            update {
              isAllowed
              projectTypeIds
              workOrderTypeIds
            }
            delete {
              isAllowed
              projectTypeIds
              workOrderTypeIds
            }
            assign {
              isAllowed
              projectTypeIds
              workOrderTypeIds
            }
            transferOwnership {
              isAllowed
              projectTypeIds
              workOrderTypeIds
            }
          }
        }
        automationPolicy {
          read {
            isAllowed
          }
          templates {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
        }
      }
    }
  }
`;

const getLoggedUserSettings = () => {
  return fetchQuery<MainContextMeQuery>(RelayEnvironment, meQuery, {});
};
type Props = $ReadOnly<{|
  children: React.Node,
|}>;

export function MainContextProvider(props: Props) {
  const [value, setValue] = useState(DEFUALT_VALUE);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === DEACTIVATED_PAGE_PATH) {
      setValue(currentValue => ({
        ...currentValue,
        initializing: false,
      }));
      return;
    }

    getLoggedUserSettings()
      .then(meValue =>
        setValue(currentValue => ({
          ...currentValue,
          integrationUserDefinition: integrationUserDefinitionBuilder(meValue),
          userHasAdminPermissions: isUserHasAdminPermissions(meValue),
          ...meValue,
        })),
      )
      .finally(() =>
        setValue(currentValue => ({
          ...currentValue,
          initializing: false,
        })),
      );
  }, [location.pathname]);
  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  );
}

export default MainContext;
