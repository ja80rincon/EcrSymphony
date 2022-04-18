/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {Organization} from '../data/Organizations';

import * as React from 'react';
import Card from '@symphony/design-system/components/Card/Card';
import OrganizationsMembersList from './OrganizationsMembersList';
import Text from '@symphony/design-system/components/Text';
import UserSearchBox from '../utils/search/UserSearchBox';
import ViewContainer from '@symphony/design-system/components/View/ViewContainer';
import classNames from 'classnames';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {ProfileIcon} from '@symphony/design-system/icons';
import {
  UserSearchContextProvider,
  useUserSearchContext,
} from '../utils/search/UserSearchContext';
import {makeStyles} from '@material-ui/styles';
import {useMemo} from 'react';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  header: {
    paddingBottom: '5px',
  },
  text: {
    whiteSpace: 'normal',
  },
  title: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  subtitle: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleIcon: {
    marginRight: '4px',
  },
  userSearch: {
    marginTop: '8px',
  },
  usersListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
    marginBottom: '-3px',
  },
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
  className?: ?string,
|}>;

function SearchBar(
  props: $ReadOnly<{|
    organization: UsersGroup,
  |}>,
) {
  const {organization} = props;
  const classes = useStyles();
  const userSearch = useUserSearchContext();

  return (
    <>
      <div className={classes.userSearch}>
        <UserSearchBox />
      </div>
      {!userSearch.isEmptySearchTerm ? null : (
        <div className={classes.usersListHeader}>
          {organization.members.length > 0 ? (
            <Text
              className={classes.text}
              variant="subtitle2"
              useEllipsis={true}>
              <fbt desc="">
                <fbt:plural count={organization.members.length} showCount="yes">
                  Members
                </fbt:plural>
              </fbt>
            </Text>
          ) : null}
        </div>
      )}
    </>
  );
}

export default function OrganizationsMembersPane(props: Props) {
  const {organization, onChange, className} = props;
  const [members, setMembers] = React.useState([]);
  const classes = useStyles();

  const title = useMemo(
    () => (
      <div className={classes.title}>
        <ProfileIcon className={classes.titleIcon} />
        <fbt desc="">Organization Members</fbt>
      </div>
    ),
    [classes.title, classes.titleIcon],
  );

  const subtitle = useMemo(
    () => (
      <div className={classes.subtitle}>
        <Text variant="body2" color="gray">
          <fbt desc="">View users to organization</fbt>
        </Text>
      </div>
    ),
    [],
  );

  const searchBar = useMemo(
    () => <SearchBar organization={{...organization, members}} />,
    [organization],
  );

  const header = useMemo(
    () => ({
      title,
      subtitle,
      searchBar,
      className: classes.header,
    }),
    [classes.header, searchBar, subtitle, title],
  );

  return (
    <Card className={classNames(classes.root, className)} margins="none">
      <UserSearchContextProvider>
        <ViewContainer header={header}>
          <OrganizationsMembersList
            organization={{...organization, members}}
            onChange={onChange}
          />
        </ViewContainer>
      </UserSearchContextProvider>
    </Card>
  );
}
