/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
import type {EditKqiSourceMutationVariables} from '../../mutations/__generated__/EditKqiSourceMutation.graphql';

import EditKqiSourceMutation from '../../mutations/EditKqiSourceMutation';

import React from 'react';
import fbt from 'fbt';

import Button from '@material-ui/core/Button';
import Card from '@symphony/design-system/components/Card/Card';
import ConfigureTitle from './common/ConfigureTitle';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {useDisabledButtonEdit} from './common/useDisabledButton';
import {useFormInput} from './common/useFormInput';
import {useValidationEdit} from './common/useValidation';

import Text from '@symphony/design-system/components/Text';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: '40px',
  },
  formField: {
    marginTop: '15px',
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
      marginBottom: '15px',
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
  formFieldStatus: {
    marginTop: '1rem',
  },
  textInput: {
    minHeight: '36px',
  },
  header: {
    marginBottom: '1rem',
  },
  option: {
    width: '111px',
    height: '36px',
    alignSelf: 'flex-end',
  },
  delete: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  title: {
    marginLeft: '10px',
  },
  textTitle: {
    paddingLeft: '2.5rem',
  },
  titleButtons: {
    padding: '0 2rem 0 4rem',
    alignItems: 'center',
  },
  reason: {
    minHeight: '100px',
  },
  status: {
    paddingTop: '40px',
  },
  time: {
    marginBottom: '20px',
  },
}));

type Props = $ReadOnly<{|
  formValues: {
    id: string,
    name: string,
  },
  hideKqiSourceFormEdit: void => void,
  kqiSourcesNames: Array<string>,
  isCompleted: void => void,
|}>;
const KqiSourceFormEdit = (props: Props) => {
  const {
    formValues,
    hideKqiSourceFormEdit,
    kqiSourcesNames,
    isCompleted,
  } = props;
  const classes = useStyles();

  const id = useFormInput(formValues.id);
  const name = useFormInput(formValues.name.trim());

  const dataInputsObject = [name.value.trim()];

  const inputFilter = () => {
    return (
      kqiSourcesNames?.filter(
        item => item === name.value.trim() && item !== formValues.name.trim(),
      ) || []
    );
  };

  const validationName = useValidationEdit(inputFilter, 'Kqi Source');

  const handleDisable = useDisabledButtonEdit(dataInputsObject, 1, inputFilter);

  const handleClick = () => {
    const variables: EditKqiSourceMutationVariables = {
      input: {
        id: formValues.id,
        name: name.value.trim(),
      },
    };

    EditKqiSourceMutation(variables, {
      onCompleted: () => {
        isCompleted();
        hideKqiSourceFormEdit();
      },
    });
  };

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
            {fbt('Edit KQI Source', ' ')}
          </Text>
        </Grid>
        <Grid item xs>
          <FormField>
            <Button
              style={{marginRight: '1rem'}}
              className={classes.option}
              variant="outlined"
              color="primary"
              onClick={() => hideKqiSourceFormEdit()}>
              Cancel
            </Button>
          </FormField>
        </Grid>
        <Grid>
          <FormField>
            <Button
              className={classes.option}
              variant="contained"
              color="primary"
              onClick={() => {
                hideKqiSourceFormEdit();
                handleClick();
              }}
              disabled={handleDisable}>
              Save
            </Button>
          </FormField>
        </Grid>
      </Grid>
      <Grid className={classes.container} item xs>
        <Card>
          <Grid container className={classes.formField} spacing={2}>
            <Grid item xs={12} lg={6}>
              <TextField
                required
                className={classes.textInput}
                label="Name"
                variant="outlined"
                name="name"
                fullWidth
                {...name}
                {...validationName}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                required
                disabled
                className={classes.textInput}
                label="ID"
                variant="outlined"
                name="iD"
                fullWidth
                {...id}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </div>
  );
};
export default KqiSourceFormEdit;
