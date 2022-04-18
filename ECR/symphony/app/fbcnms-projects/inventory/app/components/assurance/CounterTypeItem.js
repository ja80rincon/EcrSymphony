/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import React from 'react';

// DESING SYSTEM //
import type {MouseEventHandler} from '@symphony/design-system/components/Core/Clickable';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import Text from '@symphony/design-system/components/Text';
import {DARK} from '@symphony/design-system/theme/symphony';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiExpansionPanelSummary-root:hover': {
      cursor: 'default',
    },
    marginBottom: '10px',
  },
  container: {
    '& .MuiAccordionSummary-root': {
      padding: '5px 15px',
    },
    align: 'center',
    '&.MuiPaper-elevation1': {
      boxShadow: '0px 1px 4px 0px rgb(0 0 0 / 17%)',
    },
  },
  familyName: {
    paddingBottom: '12px',
  },
  counterId: {
    paddingBottom: '12px',
  },
  titles: {
    marginRight: '0.8rem',
  },
  detailsRoot: {
    margin: '0.1rem 2.7rem 0 0.7rem',
  },
  deleteIcon: {
    marginRight: '1rem',
    color: DARK.D300,
  },
}));

type Props = $ReadOnly<{|
  externalID: string,
  name: string,
  networkManagerSystem: string,
  counterFamily: {
    name: string,
  },
  vendorFk: {
    name: string,
  },
  edit: MouseEventHandler,
  handleRemove: void => void,
|}>;

export default function CounterTypeItem(props: Props) {
  const {
    externalID,
    name,
    networkManagerSystem,
    counterFamily,
    vendorFk,
    edit,
    handleRemove,
  } = props;
  const classes = useStyles();

  const handleDelete = event => {
    event.stopPropagation();
    handleRemove();
  };

  return (
    <div className={classes.root}>
      <Accordion className={classes.container}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Grid container>
            <Grid item xs={5}>
              <Text useEllipsis={true} weight="bold">
                {name}
              </Text>
            </Grid>

            <Grid item xs={3}>
              <Text useEllipsis={true} color="primary" weight="regular">
                {networkManagerSystem}
              </Text>
            </Grid>

            <Grid item xs={2}>
              <Text useEllipsis={true} weight="regular">
                {vendorFk.name}
              </Text>
            </Grid>

            <Grid item xs={2} container justify="flex-end">
              <DeleteOutlinedIcon
                className={classes.deleteIcon}
                onClick={handleDelete}
              />
              <IconButton icon={EditIcon} onClick={edit} />
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails className={classes.detailsRoot}>
          <Grid container spacing={3}>
            <Grid item xs={5} className={classes.counterId}>
              <Text className={classes.titles} variant={'body2'} weight="bold">
                Counter ID:
              </Text>
              <Text variant={'body2'} weight="regular">
                {externalID}
              </Text>
            </Grid>
            <Grid item xs={7} className={classes.familyName}>
              <Text className={classes.titles} variant={'body2'} weight="bold">
                Family Name:
              </Text>
              <Text variant={'body2'} weight="regular">
                {counterFamily.name}
              </Text>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
