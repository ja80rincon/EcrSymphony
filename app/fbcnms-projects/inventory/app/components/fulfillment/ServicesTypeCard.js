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
import DynamicPropertyTypes from './common/DynamicPropertyTypes';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import {DARK} from '@symphony/design-system/theme/symphony';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

import symphony from '@symphony/design-system/theme/symphony';

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: '7px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  insideContainer: {
    padding: '9px 15px',
  },
  view: {
    marginLeft: '1rem',
  },
  editIcon: {
    marginLeft: '1rem',
  },
  deleteIcon: {
    margin: '0px',
    color: DARK.D300,
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  serviceId: {
    paddingLeft: '4rem',
  },
  associatedService: {
    paddingRight: '4rem',
  },
  iconContainer: {
    borderRadius: '50%',
    marginRight: '1.5rem',
    backgroundColor: symphony.palette.D50,
    color: symphony.palette.D500,
    width: '48px',
    height: '48px',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    ...symphony.typography.h5,
  },
  gridEnd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  gridInner: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
}));

type Props = $ReadOnly<{|
  serviceType?: string,
  serviceTypeRes?: string,
  serviceId?: string,
  serviceIdRes?: string,
  description?: string,
  descriptionRes?: string,
  associatedServices?: string,
  associatedServicesRes?: string,
  open?: MouseEventHandler,
|}>;

const ServiceTypeCard = (props: Props) => {
  const {
    serviceType,
    serviceId,
    description,
    associatedServices,
    serviceTypeRes,
    serviceIdRes,
    associatedServicesRes,
    descriptionRes,
    open,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card margins={'none'} className={classes.container}>
        <Grid container className={classes.insideContainer}>
          <Grid item xs={2}>
            <div className={classes.inline}>
              <div className={classes.iconContainer}>
                <LinearScaleIcon />
              </div>
              <DynamicPropertyTypes name={serviceType} txt={serviceTypeRes} />
            </div>
          </Grid>

          <Grid
            xs={8}
            className={classNames(classes.inline, classes.gridInner)}>
            <DynamicPropertyTypes
              className={classes.serviceId}
              name={serviceId}
              txt={serviceIdRes}
            />
            <DynamicPropertyTypes name={description} txt={descriptionRes} />
            <DynamicPropertyTypes
              className={classes.associatedService}
              name={associatedServices}
              txt={associatedServicesRes}
            />
          </Grid>
          <Grid xs={2} className={classNames(classes.inline, classes.gridEnd)}>
            <DeleteOutlinedIcon className={classes.deleteIcon} />
            <IconButton className={classes.editIcon} icon={EditIcon} />
            <Button variant="text" className={classes.view} onClick={open}>
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
export default ServiceTypeCard;
