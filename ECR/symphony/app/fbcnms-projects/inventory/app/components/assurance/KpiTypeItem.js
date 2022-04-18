/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import React, {useState} from 'react';

// COMPONENTS //
import TableFormulas from './TableFormulas';

// DESIGN SYSTEM //
import type {EditKpiMutationVariables} from '../../mutations/__generated__/EditKpiMutation.graphql';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@symphony/design-system/components/Button';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import EditKpiMutation from '../../mutations/EditKpiMutation';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import Switch from '@symphony/design-system/components/switch/Switch';
import Text from '@symphony/design-system/components/Text';
import symphony from '@symphony/design-system/theme/symphony';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

import type {Formula} from './KpiTypes';

import DialogConfirmDelete from './DialogConfirmDelete';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiExpansionPanelSummary-root:hover': {
      cursor: 'default',
    },
    marginBottom: '7px',
  },
  container: {
    align: 'center',
    '& .MuiAccordionSummary-root': {
      padding: '5px 16px',
    },
    '&.MuiPaper-elevation1': {
      boxShadow: '0px 1px 4px 0px rgb(0 0 0 / 17%)',
    },
  },
  nameKpi: {
    paddingLeft: '1rem',
  },
  deleteIcon: {
    marginRight: '1rem',
    color: symphony.palette.D300,
  },
  switch: {
    flexWrap: 'nowrap',
  },
}));

type KpiThreshold = {
  node: {
    name: string,
    kpi: {
      name: string,
    },
  },
};

type Props = $ReadOnly<{|
  id: string,
  name: string,
  status: boolean,
  domainFk: {
    id: string,
    name: string,
  },
  kpiCategoryFK: {
    id: string,
    name: string,
  },
  formulaFk: Array<Formula>,
  deleteItem: () => void,
  description: string,
  threshold: Array<KpiThreshold>,
  edit: void,
  onChange: void,
  handleEditFormulaClick: void => void,
  parentEditCallback: any,
  isCompleted: void => void,
|}>;

const KpiTypeItem = (props: Props) => {
  const {
    id,
    name,
    status,
    domainFk,
    kpiCategoryFK,
    description,
    formulaFk,
    threshold,
    edit,
    deleteItem,
    handleEditFormulaClick,
    parentEditCallback,
    isCompleted,
  } = props;
  const classes = useStyles();
  const [checked, setChecked] = useState(status);
  const [dialogOpen, setDialogOpen] = useState(false);

  const thresholdFromKpi = threshold.find(({node}) => node.kpi?.name === name);

  const handleClick = event => {
    event.stopPropagation();
    const variables: EditKpiMutationVariables = {
      input: {
        id: id,
        name: name,
        domainFk: domainFk.id,
        status: !checked,
        description: description,
        kpiCategoryFK: kpiCategoryFK.id,
      },
    };
    EditKpiMutation(variables, {onCompleted: () => isCompleted()});
  };

  const handleDelete = event => {
    event.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <div className={classes.root}>
      <Accordion className={classes.container}>
        <AccordionSummary
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Grid container item xs={12}>
            <Grid
              container
              alignItems="center"
              className={classes.switch}
              item
              xs={4}
              md={3}>
              <Switch
                title={''}
                checked={status}
                onChange={setChecked}
                onClick={handleClick}
              />
              <Text
                useEllipsis={true}
                className={classes.nameKpi}
                weight={'bold'}>
                {name}
              </Text>
            </Grid>

            <Grid
              item
              xs={3}
              md={4}
              container
              alignItems="center"
              justify="flex-start">
              <Button variant="text">
                <Text useEllipsis={true} color="primary" weight="regular">
                  {domainFk?.name}
                </Text>
              </Button>
            </Grid>

            <Grid
              item
              xs={3}
              md={3}
              lg={3}
              xl={4}
              container
              alignItems="center"
              justify="flex-start">
              <Button variant="text">
                <Text useEllipsis={true} color="primary" weight="regular">
                  {kpiCategoryFK?.name}
                </Text>
              </Button>
            </Grid>
            <Grid
              item
              xs={2}
              md={2}
              lg={2}
              xl={1}
              container
              justify="flex-end"
              alignItems="center">
              <DeleteOutlinedIcon
                className={classes.deleteIcon}
                onClick={handleDelete}
              />
              <IconButton icon={EditIcon} onClick={edit} />
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Text
                    style={{
                      color: symphony.palette.D600,
                      paddingRight: '0.5rem',
                    }}>
                    Associated threshold:
                  </Text>
                  <Button variant="text">
                    <Text color="primary" weight="bold">
                      {thresholdFromKpi === undefined
                        ? 'none'
                        : thresholdFromKpi.node.name}
                    </Text>
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Text
                    style={{
                      color: symphony.palette.D600,
                    }}>
                    ID:
                  </Text>
                  {`  ${id}`}
                </Grid>
                <Grid item xs={12}>
                  <Text
                    style={{
                      color: symphony.palette.D600,
                    }}>
                    Description:
                  </Text>
                  {` ${description === '' ? 'No description' : description}`}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={9}>
              <TableFormulas
                formulas={formulaFk}
                handleEditFormulaClick={handleEditFormulaClick}
                parentEditCallback={parentEditCallback}
                isCompleted={isCompleted}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {dialogOpen && (
        <DialogConfirmDelete
          name={'kpi'}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          deleteItem={deleteItem}
        />
      )}
    </div>
  );
};
export default KpiTypeItem;
