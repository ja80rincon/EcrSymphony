/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Text from '@symphony/design-system/components/Text';

import CloseIcon from '@material-ui/icons/Close';
import DateTimeFormat from '../../common/DateTimeFormat.js';
import {Warning} from './common/Warnings';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    '& .MuiDialogTitle-root,  .MuiDialogActions-root': {
      padding: '0px !important',
    },
  },
  icon: {
    fontsize: '10px',
  },
  time: {
    marginTop: '2rem',
  },
  option: {
    width: '111px',
    height: '36px',
  },
}));

type Props = $ReadOnly<{|
  open: boolean,
  onClose: () => void,
  onAlarmSelected: () => void,
  alarmName: string,
  initDate: string,
  endDate: string,
|}>;

const AlarmFilteringAddDialog = (props: Props) => {
  const {onClose, onAlarmSelected, initDate, endDate, alarmName} = props;
  const classes = useStyles();
  return (
    <Dialog
      maxWidth="sm"
      open={true}
      onClose={onClose}
      fullWidth={true}
      className={classes.root}>
      <DialogActions>
        <Button onClick={onClose} skin="regular">
          <CloseIcon fontSize="large" color="action" />
        </Button>
      </DialogActions>
      <div style={{margin: '35px 49px 82px 49px'}}>
        <DialogTitle>
          <Warning />
        </DialogTitle>
        <DialogContent style={{margin: '10px 0 31px 0'}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Text>An alarm filter will be applied on the resource...</Text>
            </Grid>
            <Grid item xs={12}>
              <Text weight="bold"> {alarmName} </Text>
            </Grid>
          </Grid>
          <Grid container spacing={2} className={classes.time}>
            <Grid item xs={12}>
              <Text>During the period:</Text>
            </Grid>
            <Grid item xs={6}>
              <Text weight="bold">
                Start: {DateTimeFormat.dateTime(initDate)}
              </Text>
            </Grid>
            <Grid item xs={6}>
              <Text weight="bold">
                End: {DateTimeFormat.dateTime(endDate)}{' '}
              </Text>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.option}
            variant="outlined"
            color="primary"
            onClick={onClose}>
            Edit
          </Button>
          <Button
            onClick={() => onAlarmSelected()}
            className={classes.option}
            variant="contained"
            color="primary">
            Save
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default AlarmFilteringAddDialog;
