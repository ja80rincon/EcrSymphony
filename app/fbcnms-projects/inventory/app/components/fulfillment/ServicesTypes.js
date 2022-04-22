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
import fbt from 'fbt';

// COMPONENTS //
import Button from '@symphony/design-system/components/Button';
import ConfigureTitle from './common/ConfigureTitle';
import {Grid, List} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

import ServiceTypeCard from './ServicesTypeCard';
import ServicesTypeCardDetails from './ServicesTypeCardDetails';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: '1',
    margin: '40px',
  },
  paper: {
    padding: theme.spacing(2),
  },
  title: {
    marginLeft: '0.3rem',
  },
  containerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '0 2rem',
    marginRight: '0.7rem',
  },
}));

const handleClickAdd = () => {
  console.log('Agregar service');
};

const st = 'Service type';
const str = 'CFS';
const si = 'Service ID';
const sir = '112';
const de = 'Description';
const der = 'CFS Access';
const as = 'Associated services';
const asr = '2 RFS';

const ServicesTypes = () => {
  const classes = useStyles();
  const [showEditCard, setShowEditCard] = useState(false);

  const showServicesTypeCardDetails = () => {
    console.log('view');
    setShowEditCard(true);
  };
  if (showEditCard) {
    return (
      <ServicesTypeCardDetails
        serviceType={st}
        serviceTypeRes={str}
        serviceId={si}
        serviceIdRes={sir}
        description={de}
        descriptionRes={der}
        associatedServices={as}
        associatedServicesRes={asr}
      />
    );
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <ConfigureTitle
            className={classes.title}
            title={fbt('Service', '')}
            subtitle={fbt(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
              '',
            )}
          />
        </Grid>
        <Grid xs={2} className={classes.containerButton}>
          <Button onClick={handleClickAdd} className={classes.button}>
            Add Service
          </Button>
        </Grid>
        <Grid className={classes.paper} item xs={12}>
          <List disablePadding>
            <ServiceTypeCard
              serviceType={st}
              serviceTypeRes={str}
              serviceId={si}
              serviceIdRes={sir}
              description={de}
              descriptionRes={der}
              associatedServices={as}
              associatedServicesRes={asr}
              open={() => showServicesTypeCardDetails()}
            />
            <ServiceTypeCard
              serviceType={st}
              serviceTypeRes={'str'}
              serviceId={si}
              serviceIdRes={'sir'}
              description={de}
              descriptionRes={'der'}
              associatedServices={as}
              associatedServicesRes={'asr'}
            />
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default ServicesTypes;
