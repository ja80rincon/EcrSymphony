/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {Organization} from '../data/Organization';

import * as React from 'react';
import Button from '@symphony/design-system/components/Button';
import OrganizationMembersList from '../utils/OrganizationMembersList';
import Text from '@symphony/design-system/components/Text';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {TOGGLE_BUTTON_DISPLAY} from '../utils/ListItem';
import {makeStyles} from '@material-ui/styles';
import {useMemo} from 'react';
import {useUserSearchContext} from '../utils/search/UserSearchContext';

const useStyles = makeStyles(() => ({
  root: {},
  noMembers: {
    width: '124px',
    paddingTop: '50%',
    alignSelf: 'center',
  },
  noSearchResults: {
    paddingTop: '50%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  clearSearchWrapper: {
    marginTop: '16px',
  },
  clearSearch: {
    ...symphony.typography.subtitle1,
  },
}));

type Props = $ReadOnly<{|
  organization: Organization,
  onChange: Organization => void,
|}>;

export default function OrganizationsMembersList(props: Props) {
  const {organization, onChange} = props;
  const classes = useStyles();
  const userSearch = useUserSearchContext();

  const organizationsMembersEmptyState = useMemo(
    () => (
      <img
        className={classes.noMembers}
        src="/inventory/static/images/noMembers.png"
      />
    ),
    [classes.noMembers],
  );

  const emptyState = useMemo(() => {
    if (userSearch.isEmptySearchTerm) {
      return organizationsMembersEmptyState;
    }

    if (userSearch.isSearchInProgress) {
      return null;
    }

    return (
      <div className={classes.noSearchResults}>
        <Text variant="h6" color="gray">
          <fbt desc="">
            No users found for '<fbt:param name="given search term">
              {userSearch.searchTerm}
            </fbt:param>'
          </fbt>
        </Text>
        <div className={classes.clearSearchWrapper}>
          <Button variant="text" skin="gray" onClick={userSearch.clearSearch}>
            <span className={classes.clearSearch}>
              <fbt desc="">Clear Search</fbt>
            </span>
          </Button>
        </div>
      </div>
    );
  }, [
    classes.clearSearch,
    classes.clearSearchWrapper,
    classes.noSearchResults,
    organizationsMembersEmptyState,
    userSearch.clearSearch,
    userSearch.isEmptySearchTerm,
    userSearch.isSearchInProgress,
    userSearch.searchTerm,
  ]);
  return (
    <OrganizationMembersList
      users={
        userSearch.isEmptySearchTerm ? organization.members : userSearch.results
      }
      organization={organization}
      onChange={onChange}
      emptyState={emptyState}
    />
  );
}
