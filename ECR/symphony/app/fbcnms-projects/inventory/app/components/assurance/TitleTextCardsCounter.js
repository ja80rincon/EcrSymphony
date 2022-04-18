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
    padding: '0 3.8rem 0.5rem 0.7rem',
  },
  actionDelete: {
    marginRight: '1rem',
  },
  action: {
    flexWrap: 'nowrap',
  },
}));

function TitleTextCardsCounter() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={5}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="body2"
          weight="medium">
          Counter name
        </Text>
      </Grid>
      <Grid item xs={3}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="body2"
          weight="medium">
          Network Manager System
        </Text>
      </Grid>
      <Grid item xs={2}>
        <Text
          useEllipsis={true}
          color="primary"
          variant="body2"
          weight="medium">
          Vendor name
        </Text>
      </Grid>
      <Grid
        item
        xs={2}
        container
        alignItems="center"
        justify="flex-end"
        className={classes.action}>
        <Text
          className={classes.actionDelete}
          useEllipsis={true}
          color="primary"
          variant="body2"
          weight="medium">
          Delete
        </Text>
        <Text
          useEllipsis={true}
          color="primary"
          variant="body2"
          weight="medium">
          Edit
        </Text>
      </Grid>
    </Grid>
  );
}
export default TitleTextCardsCounter;
