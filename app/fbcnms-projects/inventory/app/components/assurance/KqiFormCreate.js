/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {AddKqiMutationVariables} from '../../mutations/__generated__/AddKqiMutation.graphql';

import AddKqiMutation from '../../mutations/AddKqiMutation';
import Button from '@material-ui/core/Button';
import Card from '@symphony/design-system/components/Card/Card';
import Event from '@material-ui/icons/Event';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MomentUtils from '@date-io/moment';
import React, {useState} from 'react';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import fbt from 'fbt';
import moment from 'moment';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
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
    paddingBottom: '31px',
  },
  option: {
    width: '111px',
    height: '36px',
    alignSelf: 'flex-end',
  },
  inputId: {
    '@media (min-width:426px) and (max-width: 768px)': {
      marginBottom: '31px !important',
    },
  },
  calendar: {
    '@media (max-width: 768px)': {
      marginBottom: '31px !important',
    },
    '& .MuiOutlinedInput-input': {
      height: '24px',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(157, 169, 190, 0.49)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(157, 169, 190, 0.49)',
      },
    },
  },
}));

type KqiPerspectives = {
  id: string,
  name: string,
};

type KqiSources = {
  id: string,
  name: string,
};

type KqiCategories = {
  id: string,
  name: string,
};

type KqiTemporalFrequency = {
  id: string,
  name: string,
};

type Kqis = {
  name: string,
  data: {
    id: string,
    name: string,
    description: string,
    formula: string,
    startDateTime: string,
    endDateTime: string,
    kqiCategory: string,
    kqiPerspective: string,
    kqiSource: string,
    kqiTemporalFrequency: string,
  },
};

type Props = $ReadOnly<{|
  isCompleted: void => void,
  returnTableKqi: () => void,
  dataPerspectives: Array<KqiPerspectives>,
  dataSources: Array<KqiSources>,
  dataCategories: Array<KqiCategories>,
  dataTemporalFrequencies: Array<KqiTemporalFrequency>,
  dataKqi: Array<Kqis>,
|}>;

const KqiFormCreate = (props: Props) => {
  const {
    returnTableKqi,
    dataPerspectives,
    dataSources,
    dataCategories,
    dataTemporalFrequencies,
    dataKqi,
    isCompleted,
  } = props;
  const classes = useStyles();
  const [Kqis, setKqis] = useState<Kqis>({data: {}});
  const [slotStartDate, setSlotStartDate] = useState(moment);
  const [slotEndDate, setSlotEndDate] = useState(moment);

  function handleChange({target}) {
    setKqis({
      data: {
        ...Kqis.data,
        [target.name]: target.value.trim(),
      },
    });
  }

  function handleClick() {
    const variables: AddKqiMutationVariables = {
      input: {
        name: Kqis.data.name,
        description: Kqis.data.description,
        formula: Kqis.data.formula,
        startDateTime: moment(Kqis.data.startDateTime).format(),
        endDateTime: moment(Kqis.data.endDateTime).format(),
        kqiCategory: Kqis.data.kqiCategory,
        kqiPerspective: Kqis.data.kqiPerspective,
        kqiSource: Kqis.data.kqiSource,
        kqiTemporalFrequency: Kqis.data.kqiTemporalFrequency,
      },
    };
    AddKqiMutation(variables, {onCompleted: () => isCompleted()});
    returnTableKqi();
  }

  const dataNameKqi = dataKqi.map(item => item.name);

  const handleDisable = useDisabledButton(Kqis.data, dataNameKqi, 7);

  const validationName = useValidation(Kqis.data.name, dataNameKqi, 'Kqi');

  return (
    <div className={classes.root}>
      <Grid
        className={classes.header}
        container
        direction="row"
        justify="flex-end"
        alignItems="center">
        <Grid>
          <Text variant="h6" weight={'bold'}>
            {fbt('Create KQI', ' ')}
          </Text>
        </Grid>
        <Grid item xs>
          <FormField>
            <Button
              style={{marginRight: '1rem'}}
              className={classes.option}
              variant="outlined"
              color="primary"
              onClick={() => returnTableKqi()}>
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
            <Grid item xs={12} sm={12} lg={6}>
              <TextField
                required
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                onChange={handleChange}
                {...validationName}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <TextField
                disabled
                fullWidth
                label="ID"
                variant="outlined"
                name="id"
              />
            </Grid>
          </Grid>
          <Grid container className={classes.formField} spacing={3}>
            <Grid item xs={12} sm={12} lg={3}>
              <TextField
                select
                required
                label="Category"
                fullWidth
                name="kqiCategory"
                defaultValue=""
                onChange={handleChange}
                variant="outlined">
                {dataCategories?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} lg={3}>
              <TextField
                select
                required
                label="Perspective"
                fullWidth
                name="kqiPerspective"
                defaultValue=""
                onChange={handleChange}
                variant="outlined">
                {dataPerspectives?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <form className={classes.formField} autoComplete="off">
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  variant="outlined"
                  name="description"
                  className={classes.textarea}
                  inputProps={{maxLength: 200}}
                  onChange={handleChange}
                />
              </form>
            </Grid>
          </Grid>
          <Grid container className={classes.gridStyleTitle} spacing={3}>
            <Grid item xs>
              <Text variant="subtitle1">Activation period</Text>
            </Grid>
          </Grid>
          <Grid container className={classes.formField} spacing={3}>
            <Grid item xs={12} lg={3}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  label="Start"
                  variant="inline"
                  inputVariant="outlined"
                  value={slotStartDate}
                  className={classes.calendar}
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
              <TextField
                select
                required
                label="Source"
                fullWidth
                name="kqiSource"
                defaultValue=""
                onChange={handleChange}
                variant="outlined">
                {dataSources?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} lg={3}>
              <form className={classes.formField}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DateTimePicker
                    label="End"
                    variant="inline"
                    inputVariant="outlined"
                    value={slotEndDate}
                    className={classes.calendar}
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
              </form>
              <Grid container alignItems="center">
                <Grid className={classes.gridStyleTitle} item xs={12} lg={4}>
                  <Text variant={'caption'}>Repeat every</Text>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      select
                      required
                      label="Temporal frequency"
                      fullWidth
                      name="kqiTemporalFrequency"
                      defaultValue=""
                      onChange={handleChange}
                      variant="outlined">
                      {dataTemporalFrequencies.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </form>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <form className={classes.formField} autoComplete="off">
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={7}
                  label="Formula"
                  variant="outlined"
                  name="formula"
                  className={classes.textarea}
                  inputProps={{maxLength: 1000}}
                  onChange={handleChange}
                />
              </form>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </div>
  );
};
export default KqiFormCreate;
