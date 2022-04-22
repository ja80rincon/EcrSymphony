/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import Button from '@symphony/design-system/components/Button';
import {BLUE} from '@symphony/design-system/theme/symphony';

import IconButton from '@material-ui/core/IconButton';

import React, {useEffect, useState} from 'react';
import RelayEnvironment from '../../common/RelayEnvironment';
import {fetchQuery, graphql} from 'relay-runtime';

import AddButton from './common/AddButton';
import Switch from '@symphony/design-system/components/switch/Switch';
import {withStyles} from '@material-ui/core/styles';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import Text from '@symphony/design-system/components/Text';
import {DARK} from '@symphony/design-system/theme/symphony';

import {makeStyles} from '@material-ui/styles';

import Grid from '@material-ui/core/Grid';

import type {EditKqiTargetMutationVariables} from '../../mutations/__generated__/EditKqiTargetMutation.graphql';
import type {RemoveKqiTargetMutationVariables} from '../../mutations/__generated__/RemoveKqiTargetMutation.graphql';

import EditKqiTargetMutation from '../../mutations/EditKqiTargetMutation';
import Paper from '@material-ui/core/Paper';
import RemoveKqiTargetMutation from '../../mutations/RemoveKqiTargetMutation';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: 'white',
    color: BLUE.B600,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#EDF0F9',
    },
  },
}))(TableRow);

const useStyles = makeStyles(() => ({
  head: {
    padding: '24px',
    borderBottom: '2px solid #F5F7FC',
  },
  insideCenter: {
    textAlign: 'center',
  },
}));

type Props = $ReadOnly<{|
  create: () => void,
  edit: ({}) => void,
  tableTargets: any,
  isCompleted: void => void,
|}>;

const KqiTableAssociatedTarget = (props: Props) => {
  const {create, edit, tableTargets, isCompleted} = props;
  const classes = useStyles();
  const [checked, setChecked] = useState(true);

  const handleRemove = id => {
    const variables: RemoveKqiTargetMutationVariables = {
      id: id,
    };
    RemoveKqiTargetMutation(variables, {onCompleted: () => isCompleted()});
  };

  return (
    <Paper>
      <TableContainer>
        <Grid container alignItems="center" className={classes.head}>
          <Grid item xs>
            <Text variant="h6" weight="bold">
              Associated targets
            </Text>
          </Grid>
          <Grid>
            <AddButton
              onClick={create}
              textButton={'Add targert'}
              disabled={false}
            />
          </Grid>
        </Grid>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Enable</StyledTableCell>
              <StyledTableCell>Target name</StyledTableCell>
              <StyledTableCell>Comparator</StyledTableCell>
              <StyledTableCell className={classes.insideCenter}>
                Warning comparator
              </StyledTableCell>
              <StyledTableCell className={classes.insideCenter}>
                Periods
              </StyledTableCell>
              <StyledTableCell className={classes.insideCenter}>
                Allowed Variation
              </StyledTableCell>
              <StyledTableCell className={classes.insideCenter}>
                Active Hours
              </StyledTableCell>
              <StyledTableCell className={classes.insideCenter}>
                Delete
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableTargets?.map((item, index) => (
              <StyledTableRow key={index}>
                <TableCell>
                  <Switch
                    title={''}
                    checked={item.status}
                    onChange={setChecked}
                    onClick={() => {
                      const variables: EditKqiTargetMutationVariables = {
                        input: {
                          id: item.id,
                          name: item.name,
                          impact: item.impact,
                          period: item.period,
                          allowedVariation: item.allowedVariation,
                          initTime: moment(item.initTime, 'HH'),
                          endTime: moment(item.endTime, 'HH'),
                          status: checked,
                          kqi: item.kqi.id,
                        },
                      };
                      EditKqiTargetMutation(variables, {
                        onCompleted: () => isCompleted(),
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => edit({item})} variant="text">
                    <Text
                      variant={'subtitle1'}
                      weight={'medium'}
                      color={'primary'}>
                      {item.name}
                    </Text>
                  </Button>
                </TableCell>
                <TableCell>
                  {item.kqiComparator[0]?.comparatorFk?.name} -{' '}
                  {item.kqiComparator[0]?.number}
                </TableCell>
                <TableCell className={classes.insideCenter}>
                  {item.kqiComparator[1]?.number}
                </TableCell>
                <TableCell className={classes.insideCenter}>
                  {item.period}
                </TableCell>
                <TableCell className={classes.insideCenter}>
                  {item.allowedVariation}
                </TableCell>
                <TableCell className={classes.insideCenter}>
                  {moment(item.initTime).format('HH')} -{' '}
                  {moment(item.endTime).format('HH')}
                </TableCell>
                <TableCell className={classes.insideCenter}>
                  <IconButton onClick={() => handleRemove(item.id)}>
                    <DeleteOutlinedIcon style={{color: DARK.D300}}/>
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
export default KqiTableAssociatedTarget;
