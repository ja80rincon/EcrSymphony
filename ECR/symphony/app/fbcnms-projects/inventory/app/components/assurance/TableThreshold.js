/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React from 'react';

// DESIGN SYSTEM //
import type {EditRuleMutationVariables} from '../../mutations/__generated__/EditRuleMutation.graphql';
import type {RemoveRuleMutationVariables} from '../../mutations/__generated__/RemoveRuleMutation.graphql';

import EditRuleMutation from '../../mutations/EditRuleMutation';

import Button from '@material-ui/core/Button';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@symphony/design-system/components/IconButton';
import Paper from '@material-ui/core/Paper';
import RemoveRuleMutation from '../../mutations/RemoveRuleMutation';
import Switch from '@symphony/design-system/components/switch/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import symphony from '@symphony/design-system/theme/symphony';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';
import {types} from './ThresholdReducer';
import {useDispatch} from './ThresholdProvider';
import {withStyles} from '@material-ui/core/styles';

const StyledTableCell = withStyles(() => ({
  head: {
    color: symphony.palette.D600,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: symphony.palette.D50,
    },
  },
}))(TableRow);

const useStyles = makeStyles(() => ({
  table: {
    minWidth: '100%',
  },
  headerTitle: {
    height: '50px',
    '& .MuiTableCell-stickyHeader': {
      backgroundColor: '#fff',
    },
  },
  title: {
    color: symphony.palette.D300,
  },
  delete: {
    color: symphony.palette.D300,
  },
}));

type RuleLimit = {
  id: string,
  name: string,
  limitType: string,
  comparator: {
    id: string,
    name: string,
  },
};

type Rule = {
  id: string,
  name: string,
  gracePeriod: string,
  additionalInfo: string,
  specificProblem: string,
  eventTypeName: string,
  startDateTime: string,
  endDateTime: string,
  threshold: {
    id: string,
    name: string,
  },
  ruleLimit: Array<RuleLimit>,
  ruleType: {
    name: string,
  },
  eventSeverity: {
    id: string,
    name: string,
  },
  status: boolean,
};

type Props = $ReadOnly<{|
  rule: Array<Rule>,
  editRule: void => void,
  isCompleted: void => void,
|}>;

export default function DenseTable(props: Props) {
  const {rule, editRule, isCompleted} = props;
  const classes = useStyles();

  const dispatch = useDispatch();

  const handleRemove = id => {
    const variables: RemoveRuleMutationVariables = {
      id: id,
    };
    RemoveRuleMutation(variables, {onCompleted: () => isCompleted()});
  };

  const handleClickSwitch = row => {
    const variables: EditRuleMutationVariables = {
      input: {
        id: row.id,
        name: row.name,
        gracePeriod: Number(row.gracePeriod),
        startDateTime: row.startDateTime,
        endDateTime: row.endDateTime,
        ruleType: row.ruleType.id,
        eventTypeName: row.eventTypeName,
        specificProblem: row.specificProblem,
        additionalInfo: row.additionalInfo,
        status: !row.status,
        eventSeverity: row.eventSeverity.id,
        threshold: row.threshold.id,
      },
    };
    EditRuleMutation(variables, {
      onCompleted: () => isCompleted(),
    });
  };

  const handleClick = row => {
    dispatch({
      type: types.sendEditRule,
      payload: {
        id: row.id,
        name: row.name,
        status: row.status,
        gracePeriod: row.gracePeriod,
        additionalInfo: row.additionalInfo,
        specificProblem: row.specificProblem,
        eventTypeName: row.eventTypeName,
        startDateTime: row.startDateTime,
        endDateTime: row.endDateTime,
        thresholdId: row.threshold.id,
        thresholdName: row.threshold.name,
        eventSeverityId: row.eventSeverity.id,
        ruleLimit: row.ruleLimit,
      },
    });
    editRule();
  };

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table stickyHeader className={classes.table} size="small">
          <TableHead>
            <TableRow className={classes.headerTitle}>
              <StyledTableCell>Enable</StyledTableCell>
              <StyledTableCell>Rule Name</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Type of Rule</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rule.map(row => (
              <StyledTableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Switch
                    title={''}
                    checked={row.status}
                    onClick={() => handleClickSwitch(row)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.ruleType.name}</TableCell>
                <TableCell>
                  <Button>
                    <DeleteOutlinedIcon
                      style={{color: symphony.palette.D300}}
                      onClick={() => {
                        handleRemove(row?.id);
                      }}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton
                    icon={EditIcon}
                    onClick={() => {
                      handleClick(row);
                    }}
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
