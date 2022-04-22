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
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DynamicPropertyTypes from './common/DynamicPropertyTypes';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import ServicesRelatedCardDetails from './ServicesRelatedCardDetails';
import Text from '@symphony/design-system/components/Text';
import {DARK} from '@symphony/design-system/theme/symphony';
import {EditIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

import fbt from 'fbt';

import ServicesTypes from './ServicesTypes';
import symphony from '@symphony/design-system/theme/symphony';

import ServicesRelatedCardDetailsInner from './ServicesRelatedCardDetailsInner';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: '1',
    margin: '40px',
    '&. MuiAccordionSummary-content': {
      margin: '4px 0',
    },
  },
  breadcrumbs: {
    paddingBottom: '0',
  },
  header: {
    marginBottom: '1.5rem',
  },
  card: {
    marginBottom: '7px',
  },
  serviceIdDescription: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsDeleteEdit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editIcon: {
    margin: '0 2rem',
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
    paddingLeft: '2rem',
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

type Props = $ReadOnly<{|
  serviceType?: string,
  serviceTypeRes?: string,
  serviceId?: string,
  serviceIdRes?: string,
  description?: string,
  descriptionRes?: string,
  associatedServices?: string,
  associatedServicesRes?: string,
  onClose?: () => void,
|}>;

const ServicesTypeCardDetails = (props: Props) => {
  const {
    serviceType,
    serviceId,
    description,
    serviceTypeRes,
    serviceIdRes,
    descriptionRes,
    associatedServices,
    associatedServicesRes,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [returnServiceTypes, setReturnServiceTypes] = useState(false);

  const showServicesRelatedCardDetailsInner = () => {
    console.log('view');
    setShowEditCard(true);
  };
  if (showEditCard) {
    return <ServicesRelatedCardDetailsInner />;
  }

  const showServicesTypes = () => {
    setReturnServiceTypes(true);
  };
  if (returnServiceTypes) {
    return <ServicesTypes />;
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.header}>
        <Breadcrumbs
          className={classes.breadcrumbs}
          breadcrumbs={[
            {
              id: 'Services',
              name: 'Services',
              onClick: () => showServicesTypes(),
            },
            true && {
              id: 'id',
              name: `CFS ID 122`,
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
                  {serviceType} {serviceTypeRes}
                </Text>
              </div>
            </Grid>

            <Grid xs={6} className={classes.serviceIdDescription}>
              <DynamicPropertyTypes
                className={classes.serviceId}
                name={serviceId}
                txt={serviceIdRes}
              />
              <DynamicPropertyTypes name={description} txt={descriptionRes} />
            </Grid>

            <Grid xs={2} className={classes.buttonsDeleteEdit}>
              <DeleteOutlinedIcon
                className={classes.deleteIcon}
                // onClick={handleRemove}
              />
              <IconButton
                className={classes.editIcon}
                icon={EditIcon}
                // onClick={edit}
              />
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails className={''}>
          <Grid container spacing={0}>
            <Grid xs={6}>
              <DynamicPropertyTypes name={'ExternalId'} txt={'C000000005'} />
              <DynamicPropertyTypes name={'HasStarted'} txt={'False'} />
              <DynamicPropertyTypes name={'IsBundle'} txt={'False'} />
              <DynamicPropertyTypes name={'IsServiceEnabled'} txt={'False'} />
              <DynamicPropertyTypes name={'IsStateful'} txt={'False'} />
              <DynamicPropertyTypes name={'Name'} txt={'CFS_ACC_001'} />
            </Grid>
            <Grid xs={6} className={''}>
              <DynamicPropertyTypes
                name={'SchemaLocation'}
                btn={
                  'https://mycsp.com:8080/tmf-api/schema/Service/vCPE.schema.json'
                }
              />
              <DynamicPropertyTypes
                name={'ServiceDate'}
                txt={'2018-01-15T12:26:11.747Z'}
              />
              <DynamicPropertyTypes name={'ServiceState'} txt={'Planned'} />
              <DynamicPropertyTypes name={'ServiceType'} txt={'BSA'} />
              <DynamicPropertyTypes name={'State'} txt={'Planned'} />
              <DynamicPropertyTypes name={'Type'} txt={'CFS'} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <ServicesRelatedCardDetails
        serviceType={serviceType}
        serviceTypeRes={serviceTypeRes}
        associatedServicesRes={associatedServicesRes}
        associatedServices={associatedServices}
        viewDetails={() => showServicesRelatedCardDetailsInner()}
      />
    </div>
  );
};
export default ServicesTypeCardDetails;
