/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import Button from '@material-ui/core/Button';

import React, {useCallback, useRef, useState} from 'react';

import {withStyles} from '@material-ui/core/styles';

import {AlarmFilteringStatus} from './AlarmFilteringStatus';

import {makeStyles} from '@material-ui/styles';

import type {EditAlarmFilterMutationVariables} from '../../mutations/__generated__/EditAlarmFilterMutation.graphql';

import Card from '@symphony/design-system/components/Card/Card';
import DateTimeFormat from '../../common/DateTimeFormat.js';
import Switch from '@symphony/design-system/components/switch/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import EditAlarmFilterMutation from '../../mutations/EditAlarmFilterMutation';
import moment from 'moment';
import symphony from '@symphony/design-system/theme/symphony';

const StyledTableCell = withStyles(() => ({
  head: {
    color: '#3984FF',
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#F5F7FC',
    },
  },
}))(TableRow);

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    '&::-webkit-scrollbar': {
      width: '9px',
    },
  },
  container: {
    overflow: 'auto',
    maxHeight: 'calc(85vh - 156px)',
    '&::-webkit-scrollbar': {
      width: '9px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: symphony.palette.D300,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:active': {
      background: symphony.palette.D200,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: symphony.palette.D400,
    },
    '&::-webkit-scrollbar-track': {
      background: symphony.palette.D100,
      borderRadius: '4px',
    },
  },
  table: {
    minWidth: 750,
  },
}));

type Props = $ReadOnly<{|
  edit: ({}) => void,
  dataValues: any,
  isCompleted: void => void,
|}>;

const AlarmFilteringTable = (props: Props) => {
  const {dataValues, edit, isCompleted} = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [checked, setChecked] = useState(true);
  const toggleSwitch = useCallback(() => setChecked(!checked));

  const elementRef = useRef();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Card margins="0px" className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Enable</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Creation Time</StyledTableCell>
              <StyledTableCell>Network Resource</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Begin Time</StyledTableCell>
              <StyledTableCell>End Time</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataValues
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <StyledTableRow tabIndex={-1} key={index}>
                  <TableCell>
                    <Switch
                      title={''}
                      checked={item.enable}
                      onChange={toggleSwitch}
                      onClick={() => {
                        const variables: EditAlarmFilterMutationVariables = {
                          input: {
                            id: item.id,
                            name: item.name,
                            networkResource: item.networkResource,
                            enable: checked,
                            beginTime: moment(item.beginTime).format(),
                            endTime: moment(item.endTime).format(),
                            reason: item.reason,
                          },
                        };
                        EditAlarmFilterMutation(variables, {
                          onCompleted: () => isCompleted(),
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => edit({item})}>
                      {item.name}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {DateTimeFormat.dateTime(item.creationTime)}
                  </TableCell>
                  <TableCell>{item.networkResource}</TableCell>
                  <TableCell>
                    <AlarmFilteringStatus
                      creationDate={item.creationTime}
                      beginDate={item.beginTime}
                      endDate={item.endTime}
                      forwardedRef={elementRef}
                    />
                  </TableCell>
                  <TableCell>
                    {DateTimeFormat.dateTime(item.beginTime)}
                  </TableCell>
                  <TableCell>{DateTimeFormat.dateTime(item.endTime)}</TableCell>
                  <TableCell>{item.id}</TableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={!dataValues ? 0 : dataValues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Card>
  );
};
export default AlarmFilteringTable;
