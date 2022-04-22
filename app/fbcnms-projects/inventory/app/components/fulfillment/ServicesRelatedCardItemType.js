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
import Card from '@symphony/design-system/components/Card/Card';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';

import Button from '@symphony/design-system/components/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

import DynamicPropertyTypes from './common/DynamicPropertyTypes';

import type {MouseEventHandler} from '@symphony/design-system/components/Core/Clickable';

import symphony from '@symphony/design-system/theme/symphony';

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: '5px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  insideContainer: {
    padding: '0px 20px 0px 0px',
    // border: '1px solid red',
  },
  bold: {
    fontWeight: 'bold',
  },

  editIcon: {
    paddingLeft: '2rem',
  },
  deleteIcon: {
    margin: '0px',
    color: symphony.palette.D300,
  },
  inside: {
    margin: '2px 0',
    display: 'flex',
    alignItems: 'center',
    // border: '1px solid red',
  },
  serviceType: {
    justifyContent: 'flex-start',
  },
  serviceId: {
    justifyContent: 'center',
  },
  Description: {
    justifyContent: 'flex-end',
  },
  contIconViewDetail: {
    paddingLeft: '',
    justifyContent: 'flex-end',
  },
  view: {
    paddingLeft: '2rem',
  },
  inter: {
    // border: '1px solid red',
  },
}));

type Props = $ReadOnly<{|
  serviceType?: string,
  serviceTypeRes?: string,
  serviceIdInter?: string,
  serviceIdInterRes?: string,
  descriptionInter?: string,
  descriptionInterRes?: string,
  viewDetails?: MouseEventHandler,
|}>;

const ServicesRelatedCardItemType = (props: Props) => {
  const {
    serviceType,
    serviceTypeRes,
    serviceIdInter,
    serviceIdInterRes,
    descriptionInter,
    descriptionInterRes,
    viewDetails,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card variant={'none'} margins={'none'} className={classes.container}>
        <Grid container className={classes.insideContainer}>
          <Grid
            xs={3}
            className={classNames(classes.inside, classes.serviceType)}>
            <DynamicPropertyTypes name={serviceType} txt={serviceTypeRes} />
          </Grid>

          <Grid
            xs={3}
            className={classNames(classes.inside, classes.serviceId)}>
            <DynamicPropertyTypes
              name={serviceIdInter}
              txt={serviceIdInterRes}
            />
          </Grid>

          <Grid
            xs={3}
            className={classNames(classes.inside, classes.Description)}>
            <DynamicPropertyTypes
              name={descriptionInter}
              txt={descriptionInterRes}
            />
          </Grid>
          <Grid
            xs={3}
            className={classNames(classes.inside, classes.contIconViewDetail)}>
            <DeleteOutlinedIcon className={classes.deleteIcon} />
            <IconButton className={classes.editIcon} icon={EditIcon} />
            <Button
              variant="text"
              className={classes.view}
              onClick={viewDetails}>
              <Text weight={'bold'} color={'primary'}>
                {'View details'}
              </Text>
            </Button>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};
export default ServicesRelatedCardItemType;
