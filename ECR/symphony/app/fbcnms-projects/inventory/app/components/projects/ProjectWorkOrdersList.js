/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrder} from '../../common/WorkOrder';

import Link from '@fbcnms/ui/components/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {createFragmentContainer, graphql} from 'react-relay';
import {formatMultiSelectValue} from '@symphony/design-system/utils/displayUtils';
import {makeStyles} from '@material-ui/styles';
import {priorityValues, useStatusValues} from '../../common/FilterTypes';

type Props = $ReadOnly<{|
  onNavigateToWorkOrder: (workOrderId: string) => void,
  workOrders: Array<WorkOrder>,
|}>;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minWidth: '200px',
  },
  button: {
    margin: theme.spacing(),
  },
  listItem: {
    paddingLeft: '30px',
  },
  listItemText: {
    color: theme.palette.dark,
  },
}));

const ProjectWorkOrdersList = (props: Props) => {
  const classes = useStyles();
  const {onNavigateToWorkOrder, workOrders} = props;
  const {statusValues} = useStatusValues();

  return workOrders.length > 0 ? (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell>Priority</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {workOrders.slice().map(row => {
          return (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <Link onClick={() => onNavigateToWorkOrder(row.id)}>
                  {row.name}
                </Link>
              </TableCell>
              <TableCell component="th" scope="row">
                {row.workOrderType && row.workOrderType.name}
              </TableCell>
              <TableCell>
                {formatMultiSelectValue(
                  statusValues.map(({value, label}) => ({value, label})),
                  row.status,
                )}
              </TableCell>
              <TableCell>{row.owner?.email}</TableCell>
              <TableCell>
                {formatMultiSelectValue(priorityValues, row.priority)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  ) : (
    <List component="nav" dense={true} className={classes.root}>
      <ListItem button key={'placeholder'} className={classes.listItem}>
        <ListItemText
          primary={'No work orders found'}
          classes={{primary: classes.listItemText}}
        />
      </ListItem>
    </List>
  );
};

export default createFragmentContainer(ProjectWorkOrdersList, {
  workOrders: graphql`
    fragment ProjectWorkOrdersList_workOrders on WorkOrder
      @relay(plural: true) {
      id
      workOrderType {
        name
        id
      }
      name
      description
      owner {
        id
        email
      }
      creationDate
      installDate
      status
      priority
    }
  `,
});
