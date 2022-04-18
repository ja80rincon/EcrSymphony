/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {ShortUser} from '../../common/EntUtils';
import type {User} from '../admin/userManagement/utils/UserManagementUtils';

import * as React from 'react';
import Typeahead from '@fbcnms/ui/components/Typeahead';
import UserViewer from '../admin/userManagement/users/UserViewer';
import {useUserSearchByAppointment} from '../admin/userManagement/utils/search/UserSearchByAppointmentContext';

type Props = $ReadOnly<{|
  onUserSelection: (?ShortUser) => void,
  slotEndDate: Date,
  slotEndDate: Date,
  duration: string,
  className?: string,
  required?: boolean,
  headline?: ?string,
  selectedUser?: ?ShortUser,
  margin?: ?string,
|}>;

const UserByAppointmentTypeahead = (props: Props) => {
  const {
    onUserSelection,
    slotStartDate,
    slotEndDate,
    duration,
    selectedUser,
    headline,
    required,
    className,
    margin,
  } = props;

  const userSearch = useUserSearchByAppointment({
    duration,
    slotStartDate,
    slotEndDate,
  });

  return (
    <div className={className}>
      <Typeahead
        margin={margin}
        required={!!required}
        suggestions={userSearch.results.map(result => {
          const user: User = result;
          return {
            entityId: user.id,
            entityType: 'user',
            name: user.authID,
            type: 'user',
            render: () => (
              <UserViewer user={user} showPhoto={true} showRole={true} />
            ),
          };
        })}
        onSuggestionsFetchRequested={userSearch.setSearchTerm}
        onEntitySelected={suggestion =>
          onUserSelection({
            id: suggestion.entityId,
            email: suggestion.name,
          })
        }
        onEntriesRequested={() => {}}
        onSuggestionsClearRequested={() => onUserSelection(null)}
        placeholder={headline}
        value={
          selectedUser
            ? {
                name: selectedUser.email,
                entityId: selectedUser.id,
                entityType: '',
                type: 'user',
              }
            : null
        }
      />
    </div>
  );
};

export default UserByAppointmentTypeahead;
