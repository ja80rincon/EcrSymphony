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

import Button from '@material-ui/core/Button';
import Card from '@symphony/design-system/components/Card/Card';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import {MenuItem, Select} from '@material-ui/core';

import DialogConfirmDelete from './DialogConfirmDelete';

import KqiFormCreateTarget from './KqiFormCreateTarget';
import KqiFormEditTarget from './KqiFormEditTarget';
import KqiTableAssociatedTarget from './KqiTableAssociatedTarget';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {DARK} from '@symphony/design-system/theme/symphony';

import type {EditKqiMutationVariables} from '../../mutations/__generated__/EditKqiMutation.graphql';

import {makeStyles} from '@material-ui/styles';

import type {RemoveKqiMutationVariables} from '../../mutations/__generated__/RemoveKqiMutation.graphql';

import EditKqiMutation from '../../mutations/EditKqiMutation';

import RemoveKqiMutation from '../../mutations/RemoveKqiMutation';
import moment from 'moment';
import {useDisabledButtonEdit} from './common/useDisabledButton';
import {useFormInput} from './common/useFormInput';
import {useValidationEdit} from './common/useValidation';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Event from '@material-ui/icons/Event';

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

export type KqiTarget = {
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
};

type Comparator = {
  id: string,
  name: string,
};

type Props = $ReadOnly<{|
  formValues: {
    item: {
      id: string,
      name: string,
      description: string,
      formula: string,
      startDateTime: string,
      endDateTime: string,
      kqiCategory: {
        id: string,
        name: string,
      },
      kqiPerspective: {
        id: string,
        name: string,
      },
      kqiSource: {
        id: string,
        name: string,
      },
      kqiTemporalFrequency: {
        id: string,
        name: string,
      },
    },
  },

  dataPerspectives: Array<KqiPerspectives>,
  dataSources: Array<KqiSources>,
  dataCategories: Array<KqiCategories>,
  dataTemporalFrequencies: Array<KqiTemporalFrequency>,
  returnTableKqi: () => void,
  dataKqiTarget: Array<KqiTarget>,
  dataComparator: Array<Comparator>,
  dataKqi: Array<Kqis>,
  isCompleted: void => void,
|}>;

const KqiFormEdit = (props: Props) => {
  const {
    dataKqi,
    dataKqiTarget,
    formValues,
    dataComparator,
    dataPerspectives,
    dataSources,
    dataCategories,
    dataTemporalFrequencies,
    returnTableKqi,
    isCompleted,
  } = props;
  const classes = useStyles();
  const [showCreateTarget, setShowCreateTarget] = useState(false);
  const [showEditTarget, setShowEditTarget] = useState(false);
  const [dataEdit, setDataEdit] = useState<KqiTarget>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const name = useFormInput(formValues.item.name);
  const description = useFormInput(formValues.item.description);
  const formula = useFormInput(formValues.item.formula);
  const [slotStartDate, setSlotStartDate] = useState(
    moment(formValues.item.startDateTime),
  );
  const [slotEndDate, setSlotEndDate] = useState(
    moment(formValues.item.endDateTime),
  );

  const kqiCategory = useFormInput(formValues.item.kqiCategory.id);
  const kqiPerspective = useFormInput(formValues.item.kqiPerspective.id);
  const kqiSource = useFormInput(formValues.item.kqiSource.id);
  const kqiTemporalFrequency = useFormInput(
    formValues.item.kqiTemporalFrequency.id,
  );

  const filterKqiTargetsById = dataKqiTarget?.filter(
    kqiData => kqiData?.kqi?.id === formValues.item.id,
  );
  const dataNameKqi = dataKqi.map(item => item.name);

  const dataInputsObject = [
    name.value.trim(),
    description.value.trim(),
    formula.value.trim(),
    kqiCategory.value,
    kqiPerspective.value,
    slotStartDate,
    slotEndDate,
    kqiSource.value,
    kqiTemporalFrequency.value,
  ];

  const inputFilter = () => {
    return (
      dataNameKqi?.filter(
        item =>
          item === name.value.trim() && item !== formValues.item.name.trim(),
      ) || []
    );
  };

  const handleDisable = useDisabledButtonEdit(dataInputsObject, 9, inputFilter);

  const validationName = useValidationEdit(inputFilter, 'Kqi');

  const handleRemove = id => {
    const variables: RemoveKqiMutationVariables = {
      id: id,
    };
    RemoveKqiMutation(variables, {onCompleted: () => isCompleted()});
  };

  const handleClick = () => {
    const variables: EditKqiMutationVariables = {
      input: {
        id: formValues.item.id,
        name: name.value.trim(),
        description: description.value.trim(),
        formula: formula.value.trim(),
        startDateTime: slotStartDate,
        endDateTime: slotEndDate,
        kqiCategory: kqiCategory.value,
        kqiPerspective: kqiPerspective.value,
        kqiSource: kqiSource.value,
        kqiTemporalFrequency: kqiTemporalFrequency.value,
      },
    };
    EditKqiMutation(variables, {onCompleted: () => isCompleted()});
    returnTableKqi();
  };

  const showFormCreateTarget = () => {
    setShowCreateTarget(true);
  };

  if (showCreateTarget) {
    return (
      <KqiFormCreateTarget
        isCompleted={isCompleted}
        dataTarget={filterKqiTargetsById}
        idKqi={formValues.item.id}
        dataComparatorSelect={dataComparator}
        returnFormEdit={() => setShowCreateTarget(false)}
      />
    );
  }
  const showFormEditTarget = (kqiTarget: KqiTarget) => {
    setShowEditTarget(true);
    setDataEdit(kqiTarget);
  };

  if (showEditTarget) {
    return (
      <KqiFormEditTarget
        isCompleted={isCompleted}
        formValues={dataEdit}
        dataTarget={filterKqiTargetsById}
        nameKqi={formValues.item.name.trim()}
        dataComparatorSelect={dataComparator}
        returnFormEdit={() => setShowEditTarget(false)}
      />
    );
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
          <ConfigureTitleSubItem
            title={fbt('KQI catalog/', 'KQI catalog')}
            tag={` ${formValues.item.name}`}
          />
        </Grid>
        <Grid style={{marginRight: '1rem'}}>
          <IconButton onClick={() => setDialogOpen(true)}>
            <DeleteOutlinedIcon style={{color: DARK.D300}} />
          </IconButton>
        </Grid>
        <Grid>
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
                {...name}
                {...validationName}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <TextField
                disabled
                className={classes.textInput}
                label="ID"
                variant="outlined"
                name="id"
                value={formValues.item.id}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.formField} spacing={3}>
            <Grid item xs={12} lg={3}>
              <TextField
                select
                required
                label="Category"
                fullWidth
                name="kqiCategory"
                variant="outlined"
                {...kqiCategory}>
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
                variant="outlined"
                {...kqiPerspective}>
                {dataPerspectives?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
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
                {...description}
              />
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
                variant="outlined"
                {...kqiSource}>
                {dataSources?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} lg={3}>
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
              <Grid container alignItems="center">
                <Grid className={classes.gridStyleTitle} item xs={12} lg={4}>
                  <Text variant={'caption'}>Repeat every</Text>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <TextField
                    select
                    required
                    label="Temporal frequency"
                    fullWidth
                    name="kqiTemporalFrequency"
                    defaultValue=""
                    variant="outlined"
                    {...kqiTemporalFrequency}>
                    {dataTemporalFrequencies.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
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
                {...formula}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <KqiTableAssociatedTarget
          isCompleted={isCompleted}
          tableTargets={filterKqiTargetsById}
          create={() => showFormCreateTarget()}
          edit={showFormEditTarget}
        />
      </Grid>
      {dialogOpen && (
        <DialogConfirmDelete
          name={'kqi'}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          deleteItem={() => {
            handleRemove(formValues.item.id);
            returnTableKqi();
          }}
        />
      )}
    </div>
  );
};
export default KqiFormEdit;
