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
import fbt from 'fbt';

import ConfigureTitleSubItem from './common/ConfigureTitleSubItem';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextInput from '@symphony/design-system/components/Input/TextInput';

import Button from '@material-ui/core/Button';
import Card from '@symphony/design-system/components/Card/Card';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import {DARK} from '@symphony/design-system/theme/symphony';
import {MenuItem, Select} from '@material-ui/core';

import Switch from '@symphony/design-system/components/switch/Switch';

import type {EditKqiComparatorMutationVariables} from '../../mutations/__generated__/EditKqiComparatorMutation.graphql';
import type {EditKqiTargetMutationVariables} from '../../mutations/__generated__/EditKqiTargetMutation.graphql';
import type {KqiTarget} from './KqiFormEdit';
import type {RemoveKqiTargetMutationVariables} from '../../mutations/__generated__/RemoveKqiTargetMutation.graphql';

import EditKqiComparatorMutation from '../../mutations/EditKqiComparatorMutation';
import EditKqiTargetMutation from '../../mutations/EditKqiTargetMutation';
import RemoveKqiTargetMutation from '../../mutations/RemoveKqiTargetMutation';
import moment from 'moment';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButtonEdit} from './common/useDisabledButton';
import {useFormInput} from './common/useFormInput';
import {useValidationEdit} from './common/useValidation';

const useStyles = makeStyles(() => ({
  root: {
    padding: '40px',
  },
  header: {
    marginBottom: '1rem',
  },
  container: {
    '& .MuiGrid-spacing-xs-3': {
      '@media (max-width: 768px)': {
        margin: '0 -12px',
      },
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
      marginBottom: '31px',
      '@media (max-width: 768px)': {
        marginBottom: '7px',
      },
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
  textarea: {
    minHeight: '60px',
    '& textarea': {
      height: '100%',
      overflow: 'auto',
      lineHeight: '1.5',
    },
  },
  gridStyleTitle: {
    paddingRight: '31px',
  },
  title: {
    marginTop: '-26px',
    marginBottom: '6px',
    '@media (max-width: 425px)': {
      marginTop: '0',
    },
  },
  subtitle: {
    marginBottom: '31px',
    '@media (max-width: 768px)': {
      marginBottom: '7px !important',
    },
  },
  onlyOnDesk: {
    display: 'block',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  option: {
    width: '111px',
    height: '36px',
    alignSelf: 'flex-end',
  },
}));

type Comparator = {
  id: string,
  name: string,
};

type Props = $ReadOnly<{|
  isCompleted: void => void,
  dataTarget: Array<KqiTarget>,
  nameKqi: string,
  dataComparatorSelect: Array<Comparator>,
  returnFormEdit: () => void,
  formValues: {
    item: {
      id: string,
      name: string,
      impact: string,
      period: number,
      allowedVariation: number,
      initTime: string,
      endTime: string,
      status: boolean,
      kqi: {
        id: string,
      },
      kqiComparator: {
        id: string,
        number: Number,
        comparatorType: string,
        kqiTargetFk: {
          name: string,
          id: string,
        },
        comparatorFk: {
          id: string,
          name: string,
        },
      },
    },
  },
|}>;

const KqiFormEditTarget = (props: Props) => {
  const {
    returnFormEdit,
    formValues,
    dataComparatorSelect,
    nameKqi,
    dataTarget,
    isCompleted,
  } = props;
  const classes = useStyles();
  const [checked, setChecked] = useState(formValues.item.status);

  const name = useFormInput(formValues.item.name);
  const impact = useFormInput(formValues.item.impact.trim());
  const period = useFormInput(formValues.item.period);
  const allowedVariation = useFormInput(formValues.item.allowedVariation);
  const initTime = useFormInput(moment(formValues.item.initTime).format('HH'));
  const endTime = useFormInput(moment(formValues.item.endTime).format('HH'));

  const comparatorSelect = useFormInput(
    formValues.item.kqiComparator[0].comparatorFk.id,
  );
  const comparatorNumber = useFormInput(
    formValues.item.kqiComparator[0].number,
  );

  const warningComparatorSelect = useFormInput(
    formValues.item.kqiComparator[1].comparatorFk.id,
  );
  const warningComparatorNumber = useFormInput(
    formValues.item.kqiComparator[1].number,
  );

  const dataNameKqi = dataTarget.map(item => item.name);

  const dataInputsObject = [
    name.value.trim(),
    impact.value.trim(),
    period.value,
    allowedVariation.value,
    initTime.value,
    endTime.value,
    comparatorNumber.value,
    warningComparatorNumber.value,
    comparatorSelect.value,
    warningComparatorSelect.value,
  ];

  const inputFilter = () => {
    return (
      dataNameKqi?.filter(
        item =>
          item === name.value.trim() && item !== formValues.item.name.trim(),
      ) || []
    );
  };

  const handleDisable = useDisabledButtonEdit(
    dataInputsObject,
    10,
    inputFilter,
  );

  const validationName = useValidationEdit(inputFilter, 'Kqi Target');

  const handleRemove = id => {
    const variables: RemoveKqiTargetMutationVariables = {
      id: id,
    };
    RemoveKqiTargetMutation(variables, {onCompleted: () => isCompleted()});
  };

  const handleClick = () => {
    const variables: EditKqiTargetMutationVariables = {
      input: {
        id: formValues.item.id,
        name: name.value.trim(),
        impact: impact.value.trim(),
        period: Number(period.value),
        allowedVariation: Number(allowedVariation.value),
        initTime: moment(initTime.value, 'HH'),
        endTime: moment(endTime.value, 'HH'),
        status: checked,
        kqi: formValues.item.kqi.id,
      },
    };

    const variablesUpper: EditKqiComparatorMutationVariables = {
      input: {
        id: formValues.item.kqiComparator[0].id,
        number: Number(comparatorNumber.value),
        comparatorType: 'COMPARATOR',
        kqiTargetFk: formValues.item.kqiComparator[0].kqiTargetFk.id,
        comparatorFk: comparatorSelect.value,
      },
    };
    const variablesLower: EditKqiComparatorMutationVariables = {
      input: {
        id: formValues.item.kqiComparator[1].id,
        number: Number(warningComparatorNumber.value),
        comparatorType: 'WARNING_COMPARATOR',
        kqiTargetFk: formValues.item.kqiComparator[1].kqiTargetFk.id,
        comparatorFk: warningComparatorSelect.value,
      },
    };
    EditKqiComparatorMutation(variablesUpper, {
      onCompleted: () => isCompleted(),
    });
    EditKqiComparatorMutation(variablesLower, {
      onCompleted: () => isCompleted(),
    });
    EditKqiTargetMutation(variables, {onCompleted: () => isCompleted()});
    returnFormEdit();
  };

  return (
    <div className={classes.root}>
      <Grid
        className={classes.header}
        container
        direction="row"
        justify="flex-end"
        alignItems="center">
        <Grid item xs>
          <ConfigureTitleSubItem
            title={fbt('KQI Catalog/', '') + ` ${nameKqi}/`}
            tag={` ${formValues.item.name}`}
          />
        </Grid>
        <Grid style={{marginRight: '1rem'}}>
          <IconButton
            onClick={() => {
              handleRemove(formValues.item.id);
              returnFormEdit();
            }}>
            <DeleteOutlinedIcon style={{color: DARK.D300}} />
          </IconButton>
        </Grid>
        <Grid style={{marginRight: '1rem'}}>
          <FormField>
            <Button
              className={classes.option}
              variant="outlined"
              color="primary"
              onClick={() => returnFormEdit()}>
              Cancel
            </Button>
          </FormField>
        </Grid>
        <Grid>
          <FormField>
            <Button
              onClick={handleClick}
              className={classes.option}
              variant="contained"
              color="primary"
              disabled={handleDisable}>
              Save
            </Button>
          </FormField>
        </Grid>
      </Grid>
      <Grid className={classes.container} item xs>
        <Card>
          <Grid container className={classes.formField} spacing={3}>
            <Grid style={{marginTop: '-10px'}} item xs={12} sm={1}>
              <Text style={{fontSize: '12px'}}>Enable</Text>
              <br />
              <Switch checked={checked} title={''} onChange={setChecked} />
            </Grid>
            <Grid item xs={12} sm={11}>
              <TextField
                required
                fullWidth
                label="Target name"
                variant="outlined"
                name="name"
                {...name}
                {...validationName}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.formField} spacing={3}>
            <Grid item xs={12} sm={6} lg>
              <TextField
                select
                required
                label="Comparator"
                fullWidth
                name="comparatorSelect"
                {...comparatorSelect}
                variant="outlined">
                {dataComparatorSelect?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <TextField
                required
                fullWidth
                variant="outlined"
                name="comparatorNumber"
                type="number"
                placeholder="Number"
                {...comparatorNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <TextField
                select
                required
                label="Warning comparator"
                fullWidth
                name="warningComparatorSelect"
                variant="outlined"
                {...warningComparatorSelect}>
                {dataComparatorSelect?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <TextField
                required
                fullWidth
                variant="outlined"
                name="warningComparatorNumber"
                type="number"
                placeholder="Number"
                {...warningComparatorNumber}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={5}>
              <TextField
                required
                fullWidth
                multiline
                rows={2}
                label="Impact"
                variant="outlined"
                name="impact"
                className={classes.textarea}
                inputProps={{maxLength: 200}}
                {...impact}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.formField} spacing={3}>
            <Grid item xs={12} sm={6} lg>
              <TextField
                required
                fullWidth
                type="number"
                label="Periods"
                placeholder="Number"
                variant="outlined"
                name="period"
                {...period}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <TextField
                required
                fullWidth
                type="number"
                label="Allowed Variation"
                placeholder="Number"
                variant="outlined"
                name="allowedVariation"
                {...allowedVariation}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <Grid item xs={12} className={classes.title}>
                <Text style={{fontSize: '14px'}}>Active Hours</Text>
              </Grid>
              <Grid
                container
                item
                xs={12}
                alignItems="center">
                <Grid className={classes.subtitle} item xs={3} lg={3} xl={2}>
                  <Text variant="caption">From</Text>
                </Grid>
                <Grid item xs={9} lg={9} xl={10}>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    name="initTime"
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">hrs</InputAdornment>
                      ),
                    }}
                    {...initTime}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <Grid container item xs={12} alignItems="center">
                <Grid className={classes.subtitle} item xs={3} xl={1}>
                  <Text variant="caption">to</Text>
                </Grid>
                <Grid item xs={9} xl={11}>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    name="endTime"
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">hrs</InputAdornment>
                      ),
                    }}
                    {...endTime}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid className={classes.onlyOnDesk} item lg={5} />
          </Grid>
        </Card>
      </Grid>
    </div>
  );
};
export default KqiFormEditTarget;
