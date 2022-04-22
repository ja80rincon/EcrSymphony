/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';

import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Table from '@symphony/design-system/components/Table/Table';
import Text from '@symphony/design-system/components/Text';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import withSuspense from '../../../../common/withSuspense';
import {
  Organization,
  deleteOrganization,
  useOrganizations,
} from '../data/Organizations';
import {makeStyles} from '@material-ui/core';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';
import {useHistory} from 'react-router-dom';
import {useUsersOrganization} from '../data/Users';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    backgroundColor: symphony.palette.white,
    borderRadius: '4px',
  },
  table: {
    height: '100%',
  },
  field: {
    margin: '2px',
  },
  nameColumn: {
    width: '200%',
  },
}));

type OrganizationTableRow = TableRowDataType<{|data: Organization|}>;

const org2OrganizationTableRow: Organization => OrganizationTableRow = organization => ({
  key: organization.id,
  data: organization,
});

function OrganizationsTable(props) {
  const classes = useStyles();
  const organizations = useOrganizations();
  const organizationsWithMembers = useUsersOrganization(organizations || []);
  const history = useHistory();
  const enqueueSnackbar = useEnqueueSnackbar();

  const organizationsTableData = React.useMemo(
    () => organizationsWithMembers.map(org2OrganizationTableRow),
    [organizationsWithMembers],
  );
  const onClose = React.useCallback(() => {
    history.go(0);
  }, [history]);

  const handleOnEdit = React.useCallback(orgId => {
    if (orgId != null) {
      history.push(`organization/${orgId}`);
    }
  });
  const handleError = React.useCallback(
    (error: string) => {
      enqueueSnackbar(error, {variant: 'error'});
    },
    [enqueueSnackbar],
  );
  const handleOnDelete = orgId => {
    if (orgId == null) {
      return;
    }
    props
      .confirm(
        <fbt desc="">Are you sure you want to delete this organization?</fbt>,
      )
      .then(confirm => {
        if (!confirm) {
          return;
        }
        deleteOrganization(orgId).then(onClose).catch(handleError);
      });
  };

  const columns = React.useMemo(() => {
    const returnCols = [
      {
        key: 'organization',
        title: (
          <fbt desc="Organization column header in organization table">
            Organization
          </fbt>
        ),
        titleClassName: classes.nameColumn,
        className: classes.nameColumn,
        render: orgRow => <Text useEllipsis={true}>{orgRow.data.name}</Text>,
      },
      {
        key: 'description',
        title: (
          <fbt desc="Description column header in organization table">
            Description
          </fbt>
        ),
        render: orgRow => (
          <Text useEllipsis={true}>{orgRow.data.description}</Text>
        ),
      },
      {
        key: 'members',
        title: <fbt desc="Members column header in users table">Members</fbt>,
        render: orgRow => (
          <Text useEllipsis={true}>{orgRow.data.members.length}</Text>
        ),
      },
      {
        key: 'edit',
        title: <fbt desc="Edit column header in organizations table">Edit</fbt>,
        render: orgRow => (
          <IconButton
            color="primary"
            onClick={() => handleOnEdit(orgRow.data.id)}>
            <EditIcon />
          </IconButton>
        ),
      },
      {
        key: 'delete',
        title: (
          <fbt desc="Delete column header in organizations table">Delete</fbt>
        ),
        render: orgRow => (
          <IconButton
            color="primary"
            onClick={() => handleOnDelete(orgRow.data.id)}>
            <DeleteIcon />
          </IconButton>
        ),
      },
    ];
    return returnCols;
  }, [classes.nameColumn, classes.field]);
  return (
    <div className={classes.root}>
      <Table
        className={classes.table}
        dataRowsSeparator="border"
        data={organizationsTableData}
        columns={columns}
      />
    </div>
  );
}

export default withSuspense(withAlert(OrganizationsTable));
