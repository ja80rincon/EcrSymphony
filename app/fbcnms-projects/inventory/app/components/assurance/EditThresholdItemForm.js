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

// COMPONENTS //
import TableThreshold from './TableThreshold';
import {useFormInput} from './common/useFormInput';

// MUTATIONS //
import type {EditThresholdMutationVariables} from '../../mutations/__generated__/EditThresholdMutation.graphql';

import EditTresholdMutation from '../../mutations/EditThresholdMutation';

// DESIGN SYSTEM //
import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import ConfigureTitleSubItem from './common/ConfigureTitleSubItem';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import Switch from '@symphony/design-system/components/switch/Switch';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButtonEdit} from './common/useDisabledButton';
import {useValidationEdit} from './common/useValidation';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: '40px',
  },
  header: {
    margin: '0 0 1rem 1.4rem',
  },
  headerCardEdit: {
    padding: '17px 22px 17px 0',
  },
  formField: {
    margin: '0 22px 0px 22px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#B8C2D3',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3984FF',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.75)',
    },
    '& .MuiFormControl-root': {
      marginBottom: '36px',
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
  containerTable: {
    margin: '25px 0 20px 0',
  },
  headerTableContainer: {
    paddingBottom: '10px',
  },
  headerTable: {
    padding: '0 0 0 22px',
  },
  cardHeader: {
    margin: '0px 0px 0px 22px',
  },
  titleSwitch: {
    '& .followingText': {
      color: '#3984FF',
      fontSize: '12px',
    },
  },
  EnabledName: {
    paddingRight: '7px',
  },
  textInput: {
    minHeight: '36px',
  },
  description: {
    '& textarea': {
      height: '100%',
      overflow: 'auto',
      lineHeight: '1.5',
    },
  },
  action: {
    paddingRight: '1.3rem',
  },
  addThreshold: {
    marginRight: '1.5rem',
    width: '98px',
    alignSelf: 'flex-end',
  },
  title: {
    marginLeft: '10px',
  },
  select: {
    paddingTop: '10px',
    height: '36px',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: '36px',
    borderRadius: '4px',
    fontSize: '14px',
  },
}));

type Rule = {
  id: string,
  name: string,
  ruleType: {
    name: string,
  },
};

type Props = $ReadOnly<{|
  formValues: {
    id: string,
    name: string,
    description: string,
    status: boolean,
    kpi: {
      id: string,
      name: string,
    },
    rule: Array<Rule>,
  },
  thresholdNames: Array<string>,
  hideEditThresholdForm: void => void,
  editRule: void => void,
  isCompleted: void => void,
  dataRulesTable: Array<any>,
|}>;

const EditThresholdItemForm = (props: Props) => {
  const {
    thresholdNames,
    formValues,
    hideEditThresholdForm,
    editRule,
    isCompleted,
    dataRulesTable,
  } = props;
  const classes = useStyles();
  const name = useFormInput(formValues.name);
  const description = useFormInput(formValues.description);
  const [checked, setChecked] = useState(formValues.status);
  const dataInputsObject = [name.value.trim(), description.value.trim()];

  const filterRuleTableById = dataRulesTable?.filter(
    thresholdData => thresholdData?.id === formValues.id,
  );

  const capacitorRules = filterRuleTableById[0].rule?.map(rule => rule);

  const inputFilter = () => {
    return (
      thresholdNames?.filter(
        item => item === name.value.trim() && item !== formValues.name.trim(),
      ) || []
    );
  };

  const validationName = useValidationEdit(inputFilter, 'Threshold');

  const handleDisable = useDisabledButtonEdit(dataInputsObject, 2, inputFilter);

  const handleClick = () => {
    const variables: EditThresholdMutationVariables = {
      input: {
        id: formValues.id,
        name: name.value.trim(),
        description: description.value.trim(),
        status: checked,
      },
    };
    EditTresholdMutation(variables, {
      onCompleted: () => {
        isCompleted();
        hideEditThresholdForm();
      },
    });
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid
          className={classes.header}
          container
          direction="row"
          justifycontent="flex-end"
          alignItems="center">
          <Grid item xs>
            <ConfigureTitleSubItem
              title={fbt('Threshold Catalog/', 'Threshold Catalog')}
              tag={` ${formValues.name}`}
            />
          </Grid>
          <Grid>
            <FormField>
              <Button
                className={classes.addThreshold}
                onClick={() => {
                  handleClick();
                  hideEditThresholdForm();
                }}
                disabled={handleDisable}>
                Save
              </Button>
            </FormField>
          </Grid>
          <Grid>
            <FormField>
              <Button
                className={classes.addThreshold}
                onClick={() => {
                  hideEditThresholdForm();
                }}
                skin="brightGray">
                Cancel
              </Button>
            </FormField>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <Card margins={'none'}>
            <Grid
              className={classes.headerCardEdit}
              container
              direction="row"
              justifycontent="space-evenly"
              alignItems="center">
              <Grid item xs>
                <Text
                  weight={'bold'}
                  variant={'h6'}
                  className={classes.cardHeader}>
                  Edit container detail
                </Text>
              </Grid>
              <Grid>
                <Switch
                  className={classes.titleSwitch}
                  title={'Enabled'}
                  checked={checked}
                  onChange={setChecked}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={12} md={6}>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
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
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      required
                      fullWidth
                      className={classes.textInput}
                      label="ID"
                      variant="outlined"
                      name="id"
                      value={formValues.id}
                      disabled
                    />
                  </form>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      required
                      fullWidth
                      className={classes.textInput}
                      label="Associated KPI"
                      variant="outlined"
                      name="kpi"
                      value={formValues?.kpi.name}
                      disabled
                    />
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      multiline
                      rows={3}
                      required
                      className={classes.description}
                      label="Description"
                      variant="outlined"
                      name="description"
                      inputProps={{maxLength: 120}}
                      fullWidth
                      {...description}
                    />
                  </form>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid
          className={classes.containerTable}
          item
          xs={12}
          sm={12}
          lg={12}
          xl={12}>
          <Grid className={classes.headerTableContainer}>
            <Text
              weight={'bold'}
              variant={'h6'}
              className={classes.headerTable}>
              Rules contained
            </Text>
          </Grid>
          <TableThreshold
            isCompleted={isCompleted}
            rule={capacitorRules}
            editRule={editRule}
          />
        </Grid>
      </Grid>
    </div>
  );
};
export default EditThresholdItemForm;
