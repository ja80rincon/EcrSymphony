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
import Text from '@symphony/design-system/components/Text';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: '1',
    padding: '0 3.8rem 0.5rem 1rem',
  },
  nameKpi: {
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

function TitleTextCardsKpi() {
  const classes = useStyles();
  return (
    <Grid
      item
      xs={12}
      container
      justify="center"
      alignItems="center"
      className={classes.root}>
      <Grid container item className={classes.status} xs={4} md={3}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Status
        </Text>
        <Text
          useEllipsis={true}
          className={classes.nameKpi}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Kpi name
        </Text>
      </Grid>
      <Grid item xs={3} md={4}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Domain
        </Text>
      </Grid>
      <Grid item xs={3} md={3} lg={3} xl={4}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Category
        </Text>
      </Grid>
      <Grid
        container
        alignItems="center"
        justify="flex-end"
        className={classes.actions}
        item
        xs={2}
        md={2}
        xl={1}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="subtitle2"
          weight={'medium'}>
          Delete
        </Text>
        <Text
          useEllipsis={true}
          color="primary"
          className={classes.editButton}
          variant="subtitle2"
          weight={'medium'}>
          Edit
        </Text>
      </Grid>
    </Grid>
  );
}
export default TitleTextCardsKpi;
