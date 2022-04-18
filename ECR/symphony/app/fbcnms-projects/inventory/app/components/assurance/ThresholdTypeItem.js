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
import AddButton from './common/AddButton';
import TableThreshold from './TableThreshold';

// DESIGN SYSTEM //
import type {EditThresholdMutationVariables} from '../../mutations/__generated__/EditThresholdMutation.graphql';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@symphony/design-system/components/Button';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import DialogConfirmDelete from './DialogConfirmDelete';
import EditTresholdMutation from '../../mutations/EditThresholdMutation';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import Switch from '@symphony/design-system/components/switch/Switch';
import Text from '@symphony/design-system/components/Text';
import {DARK} from '@symphony/design-system/theme/symphony';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

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
      padding: '1px 16px',
    },
    '&.MuiPaper-elevation1': {
      boxShadow: '0px 1px 4px 0px rgb(0 0 0 / 17%)',
    },
  },
  switchButton: {
    flexWrap: 'nowrap',
  },
  nameThreshold: {
    paddingLeft: '1rem',
  },
  deleteIcon: {
    marginRight: '1rem',
    color: DARK.D300,
  },
  descriptionKpi: {
    marginBottom: '20px',
  },
}));

type RuleLimit = {
  id: string,
  name: string,
  limitType: string,
  comparator: {
    id: string,
    name: string,
  },
};

type Rule = {
  id: string,
  name: string,
  gracePeriod: string,
  additionalInfo: string,
  specificProblem: string,
  eventTypeName: string,
  startDateTime: string,
  endDateTime: string,
  threshold: {
    id: string,
    name: string,
  },
  ruleLimit: Array<RuleLimit>,
  ruleType: {
    name: string,
  },
  eventSeverity: {
    id: string,
    name: string,
  },
  status: boolean,
};

type Props = $ReadOnly<{|
  id: string,
  name: string,
  description: string,
  kpi: {
    name: string,
  },
  deleteItem: string,
  edit: void,
  status: boolean,
  addRule: void => void,
  editRule: void => void,
  handleRemove: void => void,
  isCompleted: void => void,
  rule: Array<Rule>,
|}>;

export default function ThresholdTypeItem(props: Props) {
  const {
    name,
    description,
    kpi,
    id,
    edit,
    status,
    addRule,
    editRule,
    rule,
    deleteItem,
    isCompleted,
  } = props;
  const classes = useStyles();
  const [checked, setChecked] = useState(status);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = event => {
    event.stopPropagation();
    const variables: EditThresholdMutationVariables = {
      input: {
        id: id,
        name: name,
        status: !checked,
        description: description,
      },
    };
    EditTresholdMutation(variables, {onCompleted: () => isCompleted()});
  };

  const handleDelete = event => {
    event.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <div className={classes.root}>
      <Accordion className={classes.container}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Grid container item xs={12}>
            <Grid
              className={classes.switchButton}
              item
              xs={2}
              md={3}
              container
              alignItems="center">
              <Switch
                title={''}
                checked={status}
                onChange={setChecked}
                onClick={handleClick}
              />
              <Text
                weight="bold"
                useEllipsis={true}
                className={classes.nameThreshold}>
                {name}
              </Text>
            </Grid>

            <Grid
              item
              xs={2}
              md={3}
              container
              alignItems="center"
              justify="flex-start">
              <Button variant="text">
                <Text useEllipsis={true} weight="regular">
                  {id}
                </Text>
              </Button>
            </Grid>

            <Grid
              item
              xs={3}
              md={2}
              container
              alignItems="center"
              justify="flex-start">
              <Button variant="text">
                <Text useEllipsis={true} weight="regular" color="primary">
                  {kpi?.name}
                </Text>
              </Button>
            </Grid>

            <Grid
              item
              xs={3}
              md={2}
              lg={2}
              xl={3}
              container
              justify="center"
              alignItems="center">
              <AddButton
                disabled={false}
                textButton={'Add rule'}
                onClick={addRule}
              />
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
          <Grid
            container
            spacing={0}
            item
            xs={12}
            justify="center"
            alignItems="center">
            <Grid item xs={10} className={classes.descriptionKpi}>
              Description: {description}
            </Grid>
            <Grid item xs={10}>
              <Text weight="bold" variant="subtitle1">
                Rules contained
              </Text>
              <TableThreshold
                rule={rule}
                editRule={editRule}
                isCompleted={isCompleted}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {dialogOpen && (
        <DialogConfirmDelete
          name={'threshold'}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          deleteItem={deleteItem}
        />
      )}
    </div>
  );
}
