/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {AddKqiComparatorMutationVariables} from '../../mutations/__generated__/AddKqiComparatorMutation.graphql';
import type {AddKqiTargetMutationResponse} from '../../mutations/__generated__/AddKqiTargetMutation.graphql';
import type {AddKqiTargetMutationVariables} from '../../mutations/__generated__/AddKqiTargetMutation.graphql';
import type {MutationCallbacks} from '../../mutations/MutationCallbacks';

import AddKqiComparatorMutation from '../../mutations/AddKqiComparatorMutation';
import AddKqiTargetMutation from '../../mutations/AddKqiTargetMutation';
import Button from '@material-ui/core/Button';
import Card from '@symphony/design-system/components/Card/Card';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import React, {useState} from 'react';
import Switch from '@symphony/design-system/components/switch/Switch';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import fbt from 'fbt';
import moment from 'moment';
import {MenuItem} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useValidation} from './common/useValidation';

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
    '& .MuiFormControl-root': {
      marginBottom: '31px',
      '@media (max-width: 768px)': {
        marginBottom: '7px',
      },
      width: '100%',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3984FF',
      },
      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -3px) scale(0.85)',
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
    paddingBottom: '31px',
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
  idKqi: string,
  returnFormEdit: () => void,
  dataComparatorSelect: Array<Comparator>,
  dataTarget: any,
  isCompleted: void => void,
|}>;

const KqiFormCreateTarget = (props: Props) => {
  const {
    returnFormEdit,
    idKqi,
    dataComparatorSelect,
    dataTarget,
    isCompleted,
  } = props;
  const classes = useStyles();
  const [checked, setChecked] = useState(true);
  const [KqiTarget, setKqiTarget] = useState<KqiTarget>({data: {}});
  const dataNameTarget = dataTarget?.map(item => item?.name);

  const handleDisable = useDisabledButton(KqiTarget.data, dataNameTarget, 10);

  const validationName = useValidation(
    KqiTarget.data.name,
    dataNameTarget,
    'Kqi Target',
  );

  function handleChange({target}) {
    setKqiTarget({
      data: {
        ...KqiTarget.data,
        [target.name]: target.value.trim(),
      },
    });
  }

  function handleClick() {
    const variables: AddKqiTargetMutationVariables = {
      input: {
        name: KqiTarget.data.name,
        impact: KqiTarget.data.impact,
        period: KqiTarget.data.period,
        allowedVariation: KqiTarget.data.allowedVariation,
        initTime: moment(KqiTarget.data.initTime, 'HH'),
        endTime: moment(KqiTarget.data.endTime, 'HH'),
        status: checked,
        kqi: idKqi,
      },
    };
    const response: MutationCallbacks<AddKqiTargetMutationResponse> = {
      onCompleted: response => {
        const variablesUpper: AddKqiComparatorMutationVariables = {
          input: {
            number: Number(KqiTarget.data.comparatorNumber),
            comparatorType: 'COMPARATOR',
            kqiTargetFk: response.addKqiTarget.id,
            comparatorFk: KqiTarget.data.comparatorSelect,
          },
        };
        const variablesLower: AddKqiComparatorMutationVariables = {
          input: {
            number: Number(KqiTarget.data.warningComparatorNumber),
            comparatorType: 'WARNING_COMPARATOR',
            kqiTargetFk: response.addKqiTarget.id,
            comparatorFk: KqiTarget.data.warningComparatorSelect,
          },
        };
        AddKqiComparatorMutation(variablesUpper, {
          onCompleted: () => isCompleted(),
        });
        AddKqiComparatorMutation(variablesLower, {
          onCompleted: () => isCompleted(),
        });
      },
    };
    AddKqiTargetMutation(variables, response);
  }

  return (
    <div className={classes.root}>
      <Grid
        className={classes.header}
        container
        direction="row"
        justify="flex-end"
        alignItems="center">
        <Grid item xs>
          <Text variant="h6" weight={'bold'}>
            {fbt('Create target', ' ')}
          </Text>
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
              onClick={() => {
                handleClick();
                returnFormEdit();
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
                onChange={handleChange}
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
                defaultValue=""
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <TextField
                select
                required
                label="Warning comparator"
                fullWidth
                name="warningComparatorSelect"
                defaultValue=""
                onChange={handleChange}
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
                name="warningComparatorNumber"
                type="number"
                placeholder="Number"
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} lg>
              <Grid
                container
                item
                xs={12}
                alignItems="center">
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
                    onChange={handleChange}
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
export default KqiFormCreateTarget;
