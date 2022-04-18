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

// DESING SYSTEM //
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Breadcrumbs from '@fbcnms/ui/components/Breadcrumbs';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DynamicPropertyTypes from './common/DynamicPropertyTypes';
import Grid from '@material-ui/core/Grid';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import Text from '@symphony/design-system/components/Text';
import {makeStyles} from '@material-ui/styles';

import ServicesTypes from './ServicesTypes';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';

import ServicesTypeCardDetails from './ServicesTypeCardDetails';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: '1',
    margin: '40px',
    '&. MuiAccordionSummary-content': {
      margin: '4px 0',
    },
  },
  header: {
    marginBottom: '1.5rem',
  },
  card: {
    marginBottom: '7px',
  },
  ServiceIdDescription: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  serviceId: {
    paddingLeft: '2rem',
  },
  AccordionDetails: {
    margin: '0 70px',
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
}));

const ServicesRelatedCardDetailsInner = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [returnServiceTypes, setReturnServiceTypes] = useState(false);
  const [returnServiceAndRelated, setReturnServiceAndRelated] = useState(false);

  const showServicesTypes = () => {
    setReturnServiceTypes(true);
  };
  if (returnServiceTypes) {
    return <ServicesTypes />;
  }
  const showServicesAndRelated = () => {
    setReturnServiceAndRelated(true);
  };
  if (returnServiceAndRelated) {
    return <ServicesTypeCardDetails />;
  }
  return (
    <div className={classes.root}>
      <Grid className={classes.header}>
        <Breadcrumbs
          breadcrumbs={[
            {
              id: 'initial',
              name: 'Services',
              onClick: () => showServicesTypes(),
            },
            {
              id: 'id',
              name: `CFS ID 112`,
              onClick: () => showServicesAndRelated(),
            },
            true && {
              id: 'RFS_ID_57',
              name: `RFS ID 57`,
            },
          ]}
          size="large"
        />
        <Text variant={'subtitle2'}>
          {fbt(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
            '',
          )}
        </Text>
      </Grid>
      <Accordion
        className={classes.card}
        container
        alignItems="center"
        expanded={open}>
        <AccordionSummary
          container
          expandIcon={<ExpandMoreIcon onClick={() => setOpen(!open)} />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Grid container>
            <Grid xs={4}>
              <div className={classes.inline}>
                <div className={classes.iconContainer}>
                  <LinearScaleIcon />
                </div>
                <Text variant={'h6'} weight={'bold'}>
                  RFS
                </Text>
              </div>
            </Grid>

            <Grid xs={7} className={classes.ServiceIdDescription}>
              <DynamicPropertyTypes
                className={classes.serviceId}
                name={'Service ID'}
                txt={'57'}
              />
              <DynamicPropertyTypes
                name={'Description'}
                txt={'RFS Last Mile'}
              />
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails className={classes.AccordionDetails}>
          <Grid container spacing={0}>
            <Grid xs={6}>
              <DynamicPropertyTypes
                name={'Description'}
                txt={'RFS Last Mile'}
              />
              <DynamicPropertyTypes name={'HasStarted'} txt={'False'} />
              <DynamicPropertyTypes name={'IsBundle'} txt={'False'} />
              <DynamicPropertyTypes name={'IsServiceEnabled'} txt={'False'} />
              <DynamicPropertyTypes name={'IsStateful'} txt={'Planed'} />
            </Grid>
            <Grid xs={6} className={''}>
              <DynamicPropertyTypes name={'Name'} txt={'RFS_LM_001'} />
              <DynamicPropertyTypes name={'ServiceState'} txt={'Planned'} />
              <DynamicPropertyTypes name={'ServiceType'} txt={'BSA'} />
              <DynamicPropertyTypes name={'State'} txt={'Planned'} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default ServicesRelatedCardDetailsInner;
