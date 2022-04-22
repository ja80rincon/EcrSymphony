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
    padding: '0  1rem 0.5rem 1rem',
  },
  action: {
    flexWrap: 'nowrap',
  },
  accionDelete: {
    marginRight: '1rem',
  },
}));

export const TitleTextCardsKqiSource = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={4}>
        <Text color="primary" useEllipsis={true} variant="subtitle2">
          KQI Source Name
        </Text>
      </Grid>
      <Grid item xs={6}>
        <Text color="primary" variant="subtitle2">
          ID
        </Text>
      </Grid>
      <Grid
        container
        alignItems="center"
        justify="flex-end"
        className={classes.action}
        item
        xs={2}>
        <Text
          className={classes.accionDelete}
          useEllipsis={true}
          color="primary"
          variant="subtitle2">
          Delete
        </Text>
        <Text useEllipsis={true} color="primary" variant="subtitle2">
          Edit
        </Text>
      </Grid>
    </Grid>
  );
};
