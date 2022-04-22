/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @flow strict-local
 * @format
 */

import type {User} from '../UserManagementUtils';
import type {UserSearchByAppointmentContextQuery} from './__generated__/UserSearchByAppointmentContextQuery.graphql';

import RelayEnvironment from '../../../../../common/RelayEnvironment';
import createSearchWithFiltersContext from './SearchWithFiltersContext';
import {USER_STATUSES} from '../UserManagementUtils';
import {fetchQuery, graphql} from 'relay-runtime';

const userSearchByAppointmentQuery = graphql`
  query UserSearchByAppointmentContextQuery(
    $filterBy: [UserFilterInput!]!
    $slottedBy: SlotFilterInput!
    $workday: RegularHoursInput!
    $duration: Float!
  ) {
    usersAvailability(
      filterBy: $filterBy
      slotFilterBy: $slottedBy
      regularHours: $workday
      duration: $duration
    ) {
      user {
        id
        authID
        email
        role
        status
        firstName
        lastName
      }
      slotStartDate
      slotEndDate
    }
  }
`;

export type appointmentsFilters = {
  slotStartDate: Date,
  slotEndDate: Date,
  duration: string,
};

const searchCallback = (searchTerm: string, filters: appointmentsFilters) => {
  const {slotStartDate, slotEndDate, duration} = filters;
  return fetchQuery<UserSearchByAppointmentContextQuery>(
    RelayEnvironment,
    userSearchByAppointmentQuery,
    {
      filterBy: [
        {
          filterType: 'USER_NAME',
          operator: 'CONTAINS',
          stringValue: searchTerm,
        },
        {
          filterType: 'USER_STATUS',
          operator: 'IS',
          statusValue: USER_STATUSES.ACTIVE.key,
        },
      ],
      slottedBy: {
        slotStartDate,
        slotEndDate,
      },
      workday: {
        workdayStartHour: 8,
        workdayStartMinute: 0,
        workdayEndHour: 22,
        workdayEndMinute: 0,
      },
      duration: duration,
    },
  ).then(response => {
    if (response.usersAvailability.length < 1) {
      return [];
    }
    return response.usersAvailability.map(user => user.user).filter(Boolean);
  });
};

const {
  SearchContext: UserSearchByAppointmentContext,
  SearchContextProvider,
  useSearchContext,
  useSearchWithFilters,
} = createSearchWithFiltersContext<User>(searchCallback);

export const UserSearchByAppointmentContextProvider = SearchContextProvider;
export const useUserSearchByAppointmentContext = useSearchContext;
export const useUserSearchByAppointment = useSearchWithFilters;
export default UserSearchByAppointmentContext;
