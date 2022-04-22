/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {AddAlarmFilterMutationVariables} from '../../mutations/__generated__/AddAlarmFilterMutation.graphql';

import React, {useRef, useState} from 'react';
import fbt from 'fbt';

import moment from 'moment';

import AlarmFilteringAddDialog from './AlarmFilteringAddDialog';
import Button from '@material-ui/core/Button';
import Card from '@symphony/design-system/components/Card/Card';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import {AlarmFilteringStatus} from './AlarmFilteringStatus';

import Switch from '@symphony/design-system/components/switch/Switch';

import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useValidation} from './common/useValidation';

import type {Node} from './AlarmFilteringTypes';

import AddAlarmFilterMutation from '../../mutations/AddAlarmFilterMutation';
import Event from '@material-ui/icons/Event';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MomentUtils from '@date-io/moment';
import classNames from 'classnames';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

const useStyles = makeStyles(() => ({
  root: {
    padding: '40px',
  },
  header: {
    marginBottom: '1rem',
  },
  containerStyle: {
    padding: '0 7px 30px 7px',
  },
  option: {
    width: '111px',
    height: '38px',
    alignSelf: 'flex-end',
  },
  containerEnabled: {
    display: 'flex !important',
    flexDirection: 'row-reverse !important',
    alignItems: 'center !important',
    marginBottom: '35px',
    '& span': {
      paddingRight: '8px',
    },
  },
  formField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#B8C2D3',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3984FF',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.85)',
    },
    '& .MuiFormControl-root': {
      marginBottom: '20px',
      width: '100%',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3984FF',
      },
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: '7px',
      paddingBottom: '7px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    '& label': {
      fontSize: '14px',
      lineHeight: '8px',
    },
  },
  gridStyleLeft: {
    paddingLeft: '22px',
  },
  gridStyleRight: {
    paddingRight: '22px',
  },
  StatusStyles: {
    position: 'fixed',
    width: '100%',
    marginLeft: '3.7rem !important',
  },
}));

type Props = $ReadOnly<{|
  returnTableAlarm: () => void,
  isCompleted: void => void,
  alarms: Array<Node>,
|}>;

const AlarmFilteringFormCreate = (props: Props) => {
  const {returnTableAlarm, isCompleted, alarms} = props;
  const classes = useStyles();
  const [AlarmFilter, setAlarmFilter] = useState<AlarmFilter>({data: {}});
  const [slotStartDate, setSlotStartDate] = useState(moment);
  const [slotEndDate, setSlotEndDate] = useState(moment);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const elementRef = useRef();

  const namesAlarms = alarms?.map(item => item.node.name);

  const handleDisable = useDisabledButton(AlarmFilter.data, namesAlarms, 3);

  const validationName = useValidation(
    AlarmFilter.data.name,
    namesAlarms,
    'Alarm',
  );

  function handleChange({target}) {
    setAlarmFilter({
      data: {
        ...AlarmFilter.data,
        [target.name]: target.value.trim(),
      },
    });
  }

  function handleClick() {
    const variables: AddAlarmFilterMutationVariables = {
      input: {
        name: AlarmFilter.data.name,
        networkResource: AlarmFilter.data.networkResource,
        enable: checked,
        beginTime: slotStartDate,
        endTime: slotEndDate,
        reason: AlarmFilter.data.reason,
        user: 'user',
        creationTime: moment(AlarmFilter.data.creationTime).format(),
      },
    };
    AddAlarmFilterMutation(variables, {onCompleted: () => isCompleted()});
    returnTableAlarm();
  }

  return (
    <Grid className={classes.root}>
      <Grid container>
        <Grid className={classes.header} container alignItems="center">
          <Grid>
            <Text variant="h6" weight="bold">
              {fbt('Create Alarm Filtering', ' ')}
            </Text>
          </Grid>
          <Grid item xs>
            <FormField>
              <Button
                style={{marginRight: '1rem'}}
                className={classes.option}
                variant="outlined"
                color="primary"
                onClick={() => returnTableAlarm()}>
                Cancel
              </Button>
            </FormField>
          </Grid>
          <Grid>
            <FormField>
              <Button
                onClick={() => setDialogOpen(true)}
                className={classes.option}
                variant="contained"
                color="primary"
                disabled={handleDisable}>
                Save
              </Button>
            </FormField>
          </Grid>
        </Grid>
        <Grid item xs>
          <Card>
            <Grid container className={classes.containerStyle}>
              <Grid className={classes.containerEnabled} item xs={12}>
                <Text color={'primary'} variant={'caption'}>
                  Enabled
                </Text>
                <Switch title={''} checked={checked} onChange={setChecked} />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  className={classNames(
                    classes.formField,
                    classes.gridStyleRight,
                  )}>
                  <TextField
                    required
                    label="Name"
                    variant="outlined"
                    name="name"
                    autoComplete="off"
                    onChange={handleChange}
                    {...validationName}
                  />
                </FormField>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  className={classNames(
                    classes.formField,
                    classes.gridStyleLeft,
                    classes.gridStyleRight,
                  )}>
                  <TextField
                    required
                    label="Network Resource"
                    variant="outlined"
                    name="networkResource"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </FormField>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  className={classNames(
                    classes.formField,
                    classes.gridStyleLeft,
                  )}>
                  <TextField
                    disabled
                    label="ID"
                    variant="outlined"
                    name="id"
                    autoComplete="off"
                    InputLabelProps={{shrink: true}}
                    onChange={handleChange}
                  />
                </FormField>
              </Grid>
              <Grid item xs={12}>
                <FormField className={classes.formField}>
                  <TextField
                    required
                    label="Reason"
                    variant="outlined"
                    name="reason"
                    autoComplete="off"
                    inputProps={{maxLength: 120}}
                    onChange={handleChange}
                  />
                </FormField>
              </Grid>
              <Grid container item xs={12} md={8}>
                <Grid item xs={12} md={6}>
                  <FormField
                    className={classNames(
                      classes.formField,
                      classes.gridStyleRight,
                    )}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        label="Start"
                        variant="inline"
                        inputVariant="outlined"
                        value={slotStartDate}
                        onChange={setSlotStartDate}
                        format="yyyy/MM/DD HH:mm a"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <Event style={{color: '#8895AD'}} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </FormField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormField className={classes.formField}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        label="End"
                        variant="inline"
                        inputVariant="outlined"
                        value={slotEndDate}
                        onChange={setSlotEndDate}
                        format="yyyy/MM/DD HH:mm a"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <Event style={{color: '#8895AD'}} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </FormField>
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                alignItems="center"
                style={{marginTop: '7px'}}>
                <Grid item>
                  <Text variant="subtitle2" weight="bold">
                    Status
                  </Text>
                </Grid>
                <Grid item xs={1} className={classes.StatusStyles}>
                  <AlarmFilteringStatus
                    creationDate={moment(
                      AlarmFilter.data.creationTime,
                    ).format()}
                    beginDate={String(slotStartDate)}
                    endDate={String(slotEndDate)}
                    forwardedRef={elementRef}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {dialogOpen && (
        <AlarmFilteringAddDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAlarmSelected={handleClick}
          alarmName={AlarmFilter.data.name}
          initDate={String(slotStartDate)}
          endDate={String(slotEndDate)}
        />
      )}
    </Grid>
  );
};
export default AlarmFilteringFormCreate;
