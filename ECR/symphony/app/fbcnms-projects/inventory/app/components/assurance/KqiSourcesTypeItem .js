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

import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import Text from '@symphony/design-system/components/Text';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: '10px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '0px',
  },
  insideContainer: {
    padding: '17px 15px',
  },
  deleteIcon: {
    marginRight: '1rem',
  },
}));

type Props = $ReadOnly<{|
  id: string,
  name: string,
  edit: MouseEventHandler,
  handleRemove: void => void,
|}>;

const KqiSourcesTypeItem = (props: Props) => {
  const {name, id, edit, handleRemove} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card margins={'none'} className={classes.container}>
        <Grid container item xs={12} className={classes.insideContainer}>
          <Grid item xs={4}>
            <Button variant="text" onClick={edit}>
              <Text weight="bold" color="primary">
                {name}
              </Text>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Text useEllipsis={true} weight="bold">
              {id}
            </Text>
          </Grid>
          <Grid item xs={2} container justify="flex-end" alignItems="center">
            <Button skin="brightGray" variant="text">
              <DeleteOutlinedIcon
                className={classes.deleteIcon}
                onClick={handleRemove}
              />
            </Button>
            <IconButton icon={EditIcon} onClick={edit} />
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};
export default KqiSourcesTypeItem;
