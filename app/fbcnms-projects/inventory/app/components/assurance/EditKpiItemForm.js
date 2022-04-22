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
import {useFormInput} from './common/useFormInput';

// MUTATIONS //
import type {EditKpiMutationVariables} from '../../mutations/__generated__/EditKpiMutation.graphql';

import EditKpiMutation from '../../mutations/EditKpiMutation';

// DESIGN SYSTEM //
import type {Counter, Formula} from './KpiTypes';
import type {EditKpiItemFormQuery} from './__generated__/EditKpiItemFormQuery.graphql';

import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import ConfigureTitleSubItem from './common/ConfigureTitleSubItem';
import EditFormulaDialog from './EditFormulaDialog';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Switch from '@symphony/design-system/components/switch/Switch';
import TableFormulas from './TableFormulas';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import symphony from '@symphony/design-system/theme/symphony';
import {Grid, MenuItem} from '@material-ui/core';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButtonEdit} from './common/useDisabledButton';
import {useLazyLoadQuery} from 'react-relay/hooks';
import {useValidationEdit} from './common/useValidation';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: '40px',
  },
  header: {
    margin: '0 0 1rem 1.4rem',
  },
  formField: {
    margin: '0 22px 0px 22px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: symphony.palette.D200,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: symphony.palette.B600,
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.75)',
    },
    '& .MuiFormControl-root': {
      marginBottom: '36px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: symphony.palette.B600,
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
  headerTable: {
    padding: '0 0 0 22px',
  },
  headerTableContainer: {
    paddingBottom: '10px',
  },
  headerCardEdit: {
    padding: '17px 22px 17px 0',
  },
  cardHeader: {
    margin: '32px 43px 22px 22px',
  },
  containerEnabled: {
    display: 'flex',
    alignItems: 'center',
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
  addKpi: {
    marginRight: '1.5rem',
    width: '98px',
    alignSelf: 'flex-end',
  },
}));

const EditKpiQuery = graphql`
  query EditKpiItemFormQuery {
    domains {
      edges {
        node {
          id
          name
        }
      }
    }
    kpiCategories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

type KpiThreshold = {
  node: {
    name: string,
    kpi: {
      name: string,
    },
  },
};

type Kpi = {
  name: string,
  domainFk: {
    id: string,
    name: string,
  },
};

type Props = $ReadOnly<{|
  formValues: {
    id: string,
    name: string,
    domainFk: {
      id: string,
      name: string,
    },
    kpiCategoryFK: {
      id: string,
      name: string,
    },
    status: boolean,
    description: string,
    formulaFk: Array<Formula>,
  },
  hideEditKpiForm: void => void,
  isCompleted: void => void,
  kpi: Array<Kpi>,
  threshold: Array<KpiThreshold>,
  parentEditCallback: ({}) => void,
  dataCounter: Array<Counter>,
  dataFormula: Array<Formula>,
  dataFormulaTable: Array<Formula>,
|}>;

export const EditKpiItemForm = (props: Props) => {
  const {
    kpi,
    formValues,
    hideEditKpiForm,
    threshold,
    isCompleted,
    parentEditCallback,
    dataCounter,
    dataFormula,
    dataFormulaTable,
  } = props;
  const classes = useStyles();

  const name = useFormInput(formValues.name);
  const domainFk = useFormInput(formValues.domainFk.id);
  const description = useFormInput(formValues.description);
  const kpiCategoryFK = useFormInput(formValues.kpiCategoryFK.id);
  const [checked, setChecked] = useState(formValues.status);
  const [openEditDialogFormula, setOpenEditDialogFormula] = useState(false);

  const data = useLazyLoadQuery<EditKpiItemFormQuery>(EditKpiQuery, {});

  const thresholdFromKpi = threshold.find(
    ({node}) => node.kpi?.name === formValues.name,
  );

  const filterFormulaTableById = dataFormulaTable?.filter(
    kpiData => kpiData?.kpiFk?.id === formValues.id,
  );

  const kpiNames = kpi?.map(item => item.name);

  const dataInputsObject = [
    name.value.trim(),
    domainFk.value,
    description.value.trim(),
    kpiCategoryFK.value,
  ];

  const inputFilter = () => {
    return (
      kpiNames?.filter(
        item => item === name.value.trim() && item !== formValues.name.trim(),
      ) || []
    );
  };

  const handleDisable = useDisabledButtonEdit(dataInputsObject, 4, inputFilter);

  const validationName = useValidationEdit(inputFilter, 'Kpi');

  const handleClick = () => {
    const variables: EditKpiMutationVariables = {
      input: {
        id: formValues.id,
        name: name.value,
        domainFk: domainFk.value,
        status: checked,
        description: description.value,
        kpiCategoryFK: kpiCategoryFK.value,
      },
    };
    EditKpiMutation(variables, {
      onCompleted: () => {
        isCompleted();
        hideEditKpiForm();
      },
    });
  };

  const handleEditFormulaKpiTable = () => {
    setOpenEditDialogFormula(true);
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid
          className={classes.header}
          container
          item
          direction="row"
          justifyContent="flex-end"
          alignItems="center">
          <Grid xs>
            <ConfigureTitleSubItem
              title={fbt('KPI Catalog/', 'KPI Catalog')}
              tag={` ${formValues.name}`}
            />
          </Grid>
          <Grid>
            <FormField>
              <Button
                className={classes.addKpi}
                onClick={() => {
                  handleClick();
                }}
                disabled={handleDisable}>
                Save
              </Button>
            </FormField>
          </Grid>
          <Grid>
            <FormField>
              <Button
                className={classes.addKpi}
                onClick={() => {
                  hideEditKpiForm();
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
              item
              direction="row"
              justifyContent="space-evenly"
              alignItems="center">
              <Grid xs>
                <Text
                  weight={'bold'}
                  variant={'h6'}
                  className={classes.cardHeader}>
                  Edit Kpi detail
                </Text>
              </Grid>
              <Grid className={classes.containerEnabled}>
                <Text
                  className={classes.EnabledName}
                  color={'primary'}
                  variant={'caption'}>
                  Enabled
                </Text>
                <Switch title={''} checked={checked} onChange={setChecked} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      required
                      className={classes.textInput}
                      id="kpi-name"
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
                      disabled
                      className={classes.textInput}
                      label="ID"
                      variant="outlined"
                      name="Id"
                      fullWidth
                      value={formValues.id}
                    />
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      required
                      disabled
                      className={classes.textInput}
                      label="Associated Threshold"
                      variant="outlined"
                      name="threshold"
                      fullWidth
                      value={
                        thresholdFromKpi === undefined
                          ? 'none'
                          : thresholdFromKpi.node.name
                      }
                    />
                  </form>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      id="outlined-select-vendor"
                      select
                      required
                      label="Network Type"
                      fullWidth
                      name="network"
                      variant="outlined"
                      {...kpiCategoryFK}>
                      {data.kpiCategories.edges.map((item, index) => (
                        <MenuItem key={index} value={item.node?.id}>
                          {item.node?.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      select
                      required
                      label="Domain"
                      fullWidth
                      name="domains"
                      variant="outlined"
                      {...domainFk}>
                      {data.domains.edges.map((item, index) => (
                        <MenuItem key={index} value={item.node?.id}>
                          {item.node?.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </form>
                </Grid>
              </Grid>
              <Grid xs={12} sm={12} md={4} lg={4} xl={4}>
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
              Formulas contained
            </Text>
          </Grid>
          <TableFormulas
            isCompleted={isCompleted}
            formulas={filterFormulaTableById}
            handleEditFormulaClick={handleEditFormulaKpiTable}
            parentEditCallback={parentEditCallback}
          />
          {openEditDialogFormula && (
            <EditFormulaDialog
              isCompleted={isCompleted}
              open={openEditDialogFormula}
              dataFormula={dataFormula}
              dataCounter={dataCounter}
              onClose={() => {
                setOpenEditDialogFormula(false);
              }}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};
