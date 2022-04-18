/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import fbt from 'fbt';

import moment from 'moment';

import Button from '@material-ui/core/Button';
import Card from '@symphony/design-system/components/Card/Card';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import type {EditAlarmFilterMutationVariables} from '../../mutations/__generated__/EditAlarmFilterMutation.graphql';

import Switch from '@symphony/design-system/components/switch/Switch';
import {makeStyles} from '@material-ui/styles';
import {useFormInput} from './common/useFormInput';

import type {RemoveAlarmFilterMutationVariables} from '../../mutations/__generated__/RemoveAlarmFilterMutation.graphql';

import EditAlarmFilterMutation from '../../mutations/EditAlarmFilterMutation';

import RemoveAlarmFilterMutation from '../../mutations/RemoveAlarmFilterMutation';
import {AlarmFilteringStatus} from './AlarmFilteringStatus';
import {useDisabledButtonEdit} from './common/useDisabledButton';
import {useValidationEdit} from './common/useValidation';

import type {Node} from './AlarmFilteringTypes';

import Event from '@material-ui/icons/Event';
import MomentUtils from '@date-io/moment';
import classNames from 'classnames';
import {DARK} from '@symphony/design-system/theme/symphony';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

const useStyles = makeStyles(() => ({
  root: {
    padding: '40px',
  },
  header: {
    marginBottom: '36px',
  },
  containerStyle: {
    padding: '0 7px 22px 7px',
  },
  option: {
    width: '111px',
    height: '38px',
    alignSelf: 'flex-end',
  },
  titleSwitch: {
    '& .followingText': {
      color: '#3984FF',
      fontSize: '12px',
    },
  },
  containerEnabled: {
    display: 'flex !important',
    flexDirection: 'row-reverse !important',
    alignItems: 'center !important',
    marginBottom: '35px',
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
}));

type Props = $ReadOnly<{|
  closeEditForm: () => void,
  formValues: {
    item: {
      id: string,
      name: string,
      networkResource: string,
      enable: boolean,
      beginTime: string,
      endTime: string,
      reason: string,
      user: string,
      creationTime: string,
    },
  },
  isCompleted: void => void,
  alarms?: Array<Node>,
|}>;

const EditAlarmFilteringItemForm = (props: Props) => {
  const {closeEditForm, formValues, isCompleted, alarms} = props;
  const classes = useStyles();
  const id = useFormInput(formValues.item.id);
  const name = useFormInput(formValues.item.name);
  const networkResource = useFormInput(formValues.item.networkResource);
  const reason = useFormInput(formValues.item.reason);
  const creationTime = useFormInput(formValues.item.creationTime);
  const [checked, setChecked] = useState(formValues.item.enable);
  const [valueStatus, setValueStatus] = useState();
  const [slotStartDate, setSlotStartDate] = useState(
    moment(formValues.item.beginTime),
  );
  const [slotEndDate, setSlotEndDate] = useState(
    moment(formValues.item.endTime),
  );
  const elementRef = useRef();

  useEffect(() => {
    setValueStatus(elementRef.current?.value);
  }, []);

  const DisableButton = valueStatus === 'Active';

  const namesAlarms = alarms?.map(item => item.node.name);

  const dataInputsObject = [
    name.value.trim(),
    networkResource.value.trim(),
    reason.value.trim(),
    slotStartDate,
    slotEndDate,
  ];
  const inputFilter = () => {
    return (
      namesAlarms?.filter(
        item =>
          item === name.value.trim() && item !== formValues.item.name.trim(),
      ) || []
    );
  };
  const handleDisable = useDisabledButtonEdit(dataInputsObject, 5, inputFilter);

  const validationName = useValidationEdit(inputFilter, 'Alarm');

  const handleRemove = id => {
    const variables: RemoveAlarmFilterMutationVariables = {
      id: id,
    };
    RemoveAlarmFilterMutation(variables, {onCompleted: () => isCompleted()});
  };

  function handleClickEdit() {
    const variables: EditAlarmFilterMutationVariables = {
      input: {
        id: id.value,
        name: name.value,
        networkResource: networkResource.value,
        enable: checked,
        beginTime: slotStartDate,
        endTime: slotEndDate,
        reason: reason.value,
      },
    };
    EditAlarmFilterMutation(variables, {onCompleted: () => isCompleted()});
  }

  return (
    <Grid className={classes.root}>
      <Grid container>
        <Grid className={classes.header} container alignItems="center">
          <Grid item xs>
            <Text variant="h6" weight="bold">
              {fbt('Edit Alarm Filtering', ' ')}
            </Text>
          </Grid>
          <Grid>
            <IconButton
              style={{marginRight: '1rem'}}
              onClick={() => {
                handleRemove(formValues.item.id);
                closeEditForm();
              }}>
              <DeleteOutlinedIcon
                style={{color: DARK.D300}}
                icon={DeleteOutlinedIcon}
              />
            </IconButton>
          </Grid>
          <Grid>
            <FormField>
              <Button
                style={{marginRight: '1rem'}}
                className={classes.option}
                variant="outlined"
                color="primary"
                onClick={() => closeEditForm()}>
                Cancel
              </Button>
            </FormField>
          </Grid>
          <Grid>
            <FormField>
              <Button
                onClick={() => {
                  handleClickEdit();
                  closeEditForm();
                }}
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
                <Switch
                  className={classes.titleSwitch}
                  title={'Enabled'}
                  checked={checked}
                  onChange={setChecked}
                />
              </Grid>
              <Grid item xs={4}>
                <FormField
                  {...validationName}
                  className={classNames(
                    classes.formField,
                    classes.gridStyleRight,
                  )}>
                  <TextField
                    {...name}
                    required
                    label="Name"
                    variant="outlined"
                    autoComplete="off"
                    disabled
                    name="name"
                    type="string"
                  />
                </FormField>
              </Grid>
              <Grid item xs={4}>
                <FormField
                  className={classNames(
                    classes.formField,
                    classes.gridStyleLeft,
                    classes.gridStyleRight,
                  )}>
                  <TextField
                    {...networkResource}
                    label="Network Resource"
                    variant="outlined"
                    autoComplete="off"
                    name="networkResource"
                  />
                </FormField>
              </Grid>
              <Grid item xs={4}>
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
                    {...id}
                  />
                </FormField>
              </Grid>
              <Grid item xs={12}>
                <FormField className={classes.formField}>
                  <TextField
                    {...reason}
                    label="Reason"
                    variant="outlined"
                    autoComplete="off"
                    name="reason"
                    inputProps={{maxLength: 120}}
                  />
                </FormField>
              </Grid>
              <Grid container item xs={8}>
                <Grid item xs={6}>
                  <FormField
                    className={classNames(
                      classes.formField,
                      classes.gridStyleRight,
                    )}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        disabled={DisableButton}
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
                <Grid item xs={6}>
                  <FormField
                    className={classNames(
                      classes.formField,
                      classes.gridStyleLeft,
                      classes.gridStyleRight,
                    )}>
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
              <Grid container item xs={12} alignItems="center">
                <Grid item style={{marginRight: '17px'}}>
                  <Text variant="subtitle2" weight="bold">
                    Status
                  </Text>
                </Grid>
                <Grid item xs={1}>
                  <AlarmFilteringStatus
                    creationDate={creationTime.value}
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
    </Grid>
  );
};
export default EditAlarmFilteringItemForm;
