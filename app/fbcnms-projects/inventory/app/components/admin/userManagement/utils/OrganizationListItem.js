/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {OptionalRefTypeWrapper} from '../../../../common/EntUtils';
import type {ToggleButtonDisplay} from './ListItem';
import type {UserManagementUtils_user_base} from './__generated__/UserManagementUtils_user_base.graphql';
import type {Organization} from '../data/Organizations';

import * as React from 'react';
import MemberListItem from './MemberListItem';
import UserViewer from '../users/UserViewer';
import {useCallback, useEffect, useState} from 'react';

export type AssignmentButtonProp = $ReadOnly<{|
  assigmentButton?: ?ToggleButtonDisplay,
|}>;

type Props = $ReadOnly<{|
  user: OptionalRefTypeWrapper<UserManagementUtils_user_base>,
  organization?: ?Organization,
  onChange: Organization => void,
  className?: ?string,
  ...AssignmentButtonProp,
|}>;

const checkIsMember = (
  user: OptionalRefTypeWrapper<UserManagementUtils_user_base>,
  organization?: ?Organization,
) =>
  organization == null || organization.members.find(member => member.id == user.id) != null;

export default function OrganizationListItem(props: Props) {
  const {user, organization, onChange, assigmentButton, className} = props;
  const [isMember, setIsMember] = useState(false);
  useEffect(() => setIsMember(checkIsMember(user, organization)), [organization, user]);

  const toggleAssigment = useCallback(
    (user, shouldAssign) => {
      if (organization == null) {
        return;
      }
      const {id, authID, firstName, lastName, email, status, role} = user;
      const newMembers = shouldAssign
        ? [
            ...organization.members,
            {
              id,
              authID,
              firstName,
              lastName,
              email,
              status,
              role,
            },
          ]
        : organization.members.filter(m => m.id != user.id);
      onChange({
        ...organization,
        members: newMembers,
      });
    },
    [organization, onChange],
  );

  return (
    <MemberListItem
      member={{
        item: user,
        isMember,
      }}
      readonly
      className={className}
      assigmentButton={assigmentButton}
      onAssignToggle={() => toggleAssigment(user, !isMember)}>
      <UserViewer user={user} showPhoto={true} showRole={true} />
    </MemberListItem>
  );
}
