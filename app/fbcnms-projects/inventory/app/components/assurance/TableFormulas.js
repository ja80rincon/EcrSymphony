/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React, {useState} from 'react';

import type {RemoveFormulaMutationVariables} from '../../mutations/__generated__/RemoveFormulaMutation.graphql';
import type {EditFormulaMutationVariables} from '../../mutations/__generated__/EditFormulaMutation.graphql';
import EditFormulaMutation from '../../mutations/EditFormulaMutation';

import type {Formula} from './KpiTypes';

import Button from '@material-ui/core/Button';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@symphony/design-system/components/IconButton';
import Paper from '@material-ui/core/Paper';
import RemoveFormulaMutation from '../../mutations/RemoveFormulaMutation';
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

type Props = $ReadOnly<{|
  formulas: Array<Formula>,
  parentEditCallback: ({}) => void,
  handleEditFormulaClick: void => void,
  isCompleted: void => void,
|}>;

const DenseTable = (props: Props) => {
  const {
    formulas,
    handleEditFormulaClick,
    parentEditCallback,
    isCompleted,
  } = props;
  const classes = useStyles();
  const [checked, setChecked] = useState(true);

  const handleRemove = id => {
    const variables: RemoveFormulaMutationVariables = {
      id: id,
    };
    RemoveFormulaMutation(variables, {onCompleted: () => isCompleted()});
  };

  function handleEditCallback(editFormula: {}) {
    parentEditCallback(editFormula);
  }
  
  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table stickyHeader className={classes.table} size="small">
          <TableHead>
            <TableRow className={classes.headerTitle}>
              <StyledTableCell>Enable</StyledTableCell>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Technology</StyledTableCell>
              <StyledTableCell>Network</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formulas?.map(row => (
              <StyledTableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Switch
                    title={''}
                    checked={row.status}
                    onChange={setChecked}
                    onClick={() => {
                      const variables: EditFormulaMutationVariables = {
                        input: {
                          id: row.id,
                          textFormula: row.textFormula,
                          status: checked,
                          techFk: row.techFk.id,
                          kpiFk: row.kpiFk.id,
                          networkTypeFk: row.networkTypeFk.id,
                        },
                      };
                      EditFormulaMutation(variables, {
                        onCompleted: () => isCompleted(),
                      });
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.techFk.name}</TableCell>
                <TableCell>{row.networkTypeFk.name}</TableCell>
                <TableCell>
                  <Button>
                    <DeleteOutlinedIcon
                      style={{color: symphony.palette.D300}}
                      onClick={() => {
                        handleRemove(row.id);
                      }}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton
                    icon={EditIcon}
                    onClick={() => {
                      handleEditCallback({
                        formula: row.id,
                        status: row.status,
                        textFormula: row.textFormula,
                        tech: row.techFk.id,
                        kpiId: row.kpiFk.id,
                        kpiFk: row.kpiFk.name,
                        networkTypes: row.networkTypeFk.id,
                      });
                      handleEditFormulaClick();
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
};
export default DenseTable;
