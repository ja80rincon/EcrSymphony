/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {AssignmentButtonProp} from './OrganizationListItem';
import type {OptionalRefTypeWrapper} from '../../../../common/EntUtils';
import type {UserManagementUtils_user_base} from './__generated__/UserManagementUtils_user_base.graphql';
import type {Organization} from '../data/Organizations';

import * as React from 'react';
import OrganizationListItem from './OrganizationListItem';
import List from './List';

type Props = $ReadOnly<{|
  users: $ReadOnlyArray<OptionalRefTypeWrapper<UserManagementUtils_user_base>>,
  organization?: ?Organization,
  onChange: Organization => void,
  emptyState?: ?React.Node,
  className?: ?string,
  ...AssignmentButtonProp,
|}>;

export default function OrganizationMembersList(props: Props) {
  const {users, organization, assigmentButton, onChange, ...rest} = props;

  return (
    <List items={users} {...rest}>
      {user => (
        <OrganizationListItem
          user={user}
          assigmentButton={assigmentButton}
          organization={organization}
          onChange={onChange}
        />
      )}
    </List>
  );
}
