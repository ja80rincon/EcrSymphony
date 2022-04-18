/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AddServiceDetailsServiceTypeQuery} from './__generated__/AddServiceDetailsServiceTypeQuery.graphql';
import type {
  AddServiceMutationResponse,
  AddServiceMutationVariables,
} from '../../mutations/__generated__/AddServiceMutation.graphql';
import type {Customer} from '../../common/Service';
import type {MutationCallbacks} from '../../mutations/MutationCallbacks.js';
import type {Property} from '../../common/Property';
import type {ServiceType} from '../../common/ServiceType';

import * as React from 'react';
import AddServiceMutation from '../../mutations/AddServiceMutation';
import CustomerTypeahead from '../typeahead/CustomerTypeahead';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormField from '@symphony/design-system/components/FormField/FormField';
import FormSaveCancelPanel from '@symphony/design-system/components/Form/FormSaveCancelPanel';
import Grid from '@material-ui/core/Grid';
import NameInput from '@symphony/design-system/components/Form/NameInput';
import PropertyValueInput from '../form/PropertyValueInput';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import Text from '@symphony/design-system/components/Text';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import nullthrows from '@fbcnms/util/nullthrows';
import symphony from '@symphony/design-system/theme/symphony';
import update from 'immutability-helper';
import {FormContextProvider} from '../../common/FormContext';
import {LogEvents, ServerLogger} from '../../common/LoggingUtils';
import {getGraphError} from '../../common/EntUtils';
import {getInitialPropertyFromType} from '../../common/PropertyType';
import {graphql, useLazyLoadQuery} from 'react-relay/hooks';
import {makeStyles} from '@material-ui/styles';
import {sortPropertiesByIndex} from '../../common/Property';
import {toPropertyInput} from '../../common/Property';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';
import {useState} from 'react';

const useStyles = makeStyles(_ => ({
  separator: {
    borderBottom: `1px solid ${symphony.palette.separator}`,
    margin: '0 0 24px 0px',
    paddingBottom: '24px',
  },
  propInput: {
    width: '100%',
    paddingBottom: '0px',
    marginLeft: '0px',
  },
  detailInput: {
    display: 'inline-flex',
  },
  contentRoot: {
    marginLeft: '24px',
    marginRight: '24px',
  },
  loading: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTitle: {
    padding: '24px',
    paddingBottom: '16px',
  },
  serviceCreateDialogContent: {
    padding: 0,
    maxHeight: '500px',
    overflowY: 'auto',
  },
  dialogActions: {
    padding: '24px',
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: symphony.palette.white,
  },
}));

const serviceTypeQuery = graphql`
  query AddServiceDetailsServiceTypeQuery($serviceTypeId: ID!) {
    node(id: $serviceTypeId) {
      ... on ServiceType {
        id
        name
        propertyTypes {
          id
          name
          type
          nodeType
          index
          stringValue
          intValue
          booleanValue
          floatValue
          latitudeValue
          longitudeValue
          rangeFromValue
          rangeToValue
          isEditable
          isInstanceProperty
          isMandatory
        }
      }
    }
  }
`;

type Props = $ReadOnly<{|
  serviceTypeId: string,
  onBackClicked: () => void,
  onServiceCreated: (id: string) => void,
|}>;

type ServiceDetails = {
  name: string,
  externalId: ?string,
  customer: ?Customer,
  serviceType: ServiceType,
  properties: Array<Property>,
};

const AddServiceDetails = (props: Props) => {
  const {serviceTypeId, onBackClicked, onServiceCreated} = props;
  const [serviceState, setServiceState] = useState<?ServiceDetails>(null);
  const classes = useStyles();
  const enqueueSnackbar = useEnqueueSnackbar();

  const data = useLazyLoadQuery<AddServiceDetailsServiceTypeQuery>(
    serviceTypeQuery,
    {
      serviceTypeId: serviceTypeId,
    },
  );

  const getService = () => {
    if (!serviceState) {
      const serviceType = data.node;
      // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
      // $FlowFixMe[incompatible-use] $FlowFixMe T74239404 Found via relay types
      const initialProps = (serviceType.propertyTypes || [])
        // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
        // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
        // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
        .map(propType => getInitialPropertyFromType(propType))
        .sort(sortPropertiesByIndex);
      const service = {
        name: '',
        externalId: null,
        customer: null,
        serviceType: serviceType,
        properties: initialProps,
      };
      // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
      // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
      // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
      setServiceState(service);
      return service;
    }
    return serviceState;
  };

  const service = getService();

  const propertyChangedHandler = index => property => {
    setServiceState(
      update(service, {
        properties: {[index]: {$set: property}},
      }),
    );
  };

  const enqueueError = (message: string) => {
    enqueueSnackbar(message, {
      children: key => (
        <SnackbarItem id={key} message={message} variant="error" />
      ),
    });
  };

  const saveService = () => {
    const {name, externalId, customer, properties} = nullthrows(service);
    // $FlowFixMe[incompatible-use] $FlowFixMe T74239404 Found via relay types
    const serviceTypeId = nullthrows(service?.serviceType.id);
    const variables: AddServiceMutationVariables = {
      data: {
        name,
        externalId: externalId != null && externalId !== '' ? externalId : null,
        status: 'PENDING',
        serviceTypeId,
        customerId: customer?.id,
        properties: toPropertyInput(properties),
        upstreamServiceIds: [],
      },
    };

    const callbacks: MutationCallbacks<AddServiceMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          enqueueError(errors[0].message);
        } else {
          // navigate to main page
          onServiceCreated(nullthrows(response.addService?.id));
        }
      },
      onError: (error: Error) => {
        const errMsg = getGraphError(error);
        enqueueSnackbar(errMsg, {
          children: key => (
            <SnackbarItem id={key} message={errMsg} variant="error" />
          ),
        });
      },
    };

    ServerLogger.info(LogEvents.SAVE_SERVICE_BUTTON_CLICKED, {
      source: 'service_details',
    });
    AddServiceMutation(variables, callbacks);
  };

  return (
    <FormContextProvider
      permissions={{
        entity: 'service',
        action: 'create',
      }}>
      <DialogTitle className={classes.dialogTitle}>
        {/* $FlowFixMe[incompatible-use] $FlowFixMe T74239404 Found via relay
         * types */}
        <Text variant="h6">{service.serviceType.name}</Text>
      </DialogTitle>
      <DialogContent className={classes.serviceCreateDialogContent}>
        <div className={classes.contentRoot}>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <NameInput
                  value={(serviceState && serviceState.name) || ''}
                  onChange={event =>
                    // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
                    // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
                    // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
                    setServiceState({...service, name: event.target.value})
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormField label="Service ID">
                  <TextInput
                    type="string"
                    className={classes.detailInput}
                    onChange={event =>
                      // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
                      // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
                      // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
                      setServiceState({
                        ...service,
                        externalId: event.target.value,
                      })
                    }
                  />
                </FormField>
              </Grid>
              <Grid item xs={6}>
                <FormField label="Customer">
                  <CustomerTypeahead
                    className={classes.detailInput}
                    onCustomerSelection={customer =>
                      // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
                      // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
                      // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
                      setServiceState({...service, customer: customer})
                    }
                    required={false}
                    margin="dense"
                  />
                </FormField>
              </Grid>
            </Grid>
            <div className={classes.separator} />
            {service.properties.length > 0 ? (
              <Grid container spacing={2}>
                {service.properties.map((property, index) => (
                  <Grid key={property.id} item xs={6}>
                    <PropertyValueInput
                      required={!!property.propertyType.isMandatory}
                      disabled={!property.propertyType.isInstanceProperty}
                      label={property.propertyType.name}
                      className={classes.propInput}
                      inputType="Property"
                      property={property}
                      onChange={propertyChangedHandler(index)}
                      headlineVariant="form"
                    />
                  </Grid>
                ))}
              </Grid>
            ) : null}
          </div>
        </div>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <FormSaveCancelPanel
          onCancel={onBackClicked}
          onSave={saveService}
          captions={{cancelButton: 'Back', saveButton: 'Create'}}
        />
      </DialogActions>
    </FormContextProvider>
  );
};

export default AddServiceDetails;
