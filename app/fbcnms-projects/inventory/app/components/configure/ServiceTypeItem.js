/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {ServiceTypeItem_serviceType} from './__generated__/ServiceTypeItem_serviceType.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithStyles} from '@material-ui/core';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import CommonStrings from '@fbcnms/strings/Strings';
import ConfigureAccordion from './ConfigureAccordionPanel';
import DynamicPropertyTypesGrid from '../DynamicPropertyTypesGrid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import React from 'react';
import RemoveServiceTypeMutation from '../../mutations/RemoveServiceTypeMutation';
import ServiceEndpointDefinitionStaticTable from './ServiceEndpointDefinitionStaticTable';
import fbt from 'fbt';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {ConnectionHandler} from 'relay-runtime';
import {createFragmentContainer, graphql} from 'react-relay';
import {withStyles} from '@material-ui/core/styles';

type Props = {|
  serviceType: ServiceTypeItem_serviceType,
  onEdit: () => void,
|} & WithAlert &
  WithStyles<typeof styles>;

const styles = {
  detailsContainer: {
    width: '100%',
  },
  section: {
    marginBottom: '24px',
  },
};

class ServiceTypeItem extends React.Component<Props> {
  render() {
    const {classes, serviceType, onEdit} = this.props;
    return (
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ConfigureAccordion
              entityName="serviceType"
              icon={<LinearScaleIcon />}
              name={serviceType.name}
              instanceCount={serviceType.numberOfServices}
              instanceNameSingular="service"
              instanceNamePlural="services"
              onDelete={this.onDelete}
              allowDelete={true}
              onEdit={onEdit}
            />
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.detailsContainer}>
              <div className={classes.section}>
                <DynamicPropertyTypesGrid
                  key={serviceType.id}
                  // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                  propertyTypes={serviceType.propertyTypes}
                />
              </div>
              <div className={classes.section}>
                <ServiceEndpointDefinitionStaticTable
                  serviceEndpointDefinitions={serviceType.endpointDefinitions}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  onDelete = () => {
    this.props
      .confirm({
        title: <fbt desc="">Delete Service Type?</fbt>,
        message: fbt(
          'Are you sure you want to delete' +
            fbt.param('service name', this.props.serviceType.name) +
            "? The service type, and all it's instances will be deleted soon, in the background",
          'deletion message',
        ),
        cancelLabel: CommonStrings.common.cancelButton,
        confirmLabel: CommonStrings.common.deleteButton,
        skin: 'red',
      })
      .then(confirm => {
        if (!confirm) {
          return;
        }
        RemoveServiceTypeMutation(
          {id: this.props.serviceType.id},
          {
            onError: (error: any) => {
              this.props.alert('Error: ' + error.source?.errors[0]?.message);
            },
          },
          store => {
            const rootQuery = store.getRoot();
            const serviceTypes = ConnectionHandler.getConnection(
              rootQuery,
              'ServiceTypes_serviceTypes',
            );
            if (serviceTypes != null) {
              ConnectionHandler.deleteNode(
                serviceTypes,
                this.props.serviceType.id,
              );
            }
            store.delete(this.props.serviceType.id);
          },
        );
      });
  };
}

export default withStyles(styles)(
  withAlert(
    createFragmentContainer(ServiceTypeItem, {
      serviceType: graphql`
        fragment ServiceTypeItem_serviceType on ServiceType {
          id
          name
          discoveryMethod
          propertyTypes {
            ...PropertyTypeFormField_propertyType
          }
          endpointDefinitions {
            ...ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions
          }
          numberOfServices
        }
      `,
    }),
  ),
);
