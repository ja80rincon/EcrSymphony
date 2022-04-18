/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Text from '@symphony/design-system/components/Text';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: '1',
    padding: '0 4rem 0.5rem 1rem',
  },
  nameThreshold: {
    paddingLeft: '1.3rem',
  },
  editButton: {
    paddingLeft: '1rem',
  },
  status: {
    flexWrap: 'nowrap',
  },
  actions: {
    flexWrap: 'nowrap',
  },
}));

function TitleTextCardsThresholds() {
  const classes = useStyles();
  return (
    <Grid
      container
      xs={12}
      item
      justify="center"
      alignItems="center"
      className={classes.root}>
      <Grid container className={classes.status} item xs={2} md={3}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Enable
        </Text>

        <Text
          className={classes.nameThreshold}
          useEllipsis={true}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Threshold name
        </Text>
      </Grid>
      <Grid item xs={2} md={3}>
        <Text color="primary" variant="subtitle2" weight={'medium'}>
          ID
        </Text>
      </Grid>
      <Grid item xs={6} md={5}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Associated KPI
        </Text>
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        justify="flex-end"
        className={classes.actions}
        xs={2}
        md={1}>
        <Text color="primary" variant="subtitle2" weight={'medium'}>
          Delete
        </Text>
        <Text
          className={classes.editButton}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Edit
        </Text>
      </Grid>
    </Grid>
  );
}
export default TitleTextCardsThresholds;
