/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {EquipmentPortTypeItem_equipmentPortType} from './__generated__/EquipmentPortTypeItem_equipmentPortType.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithStyles} from '@material-ui/core';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import CardSection from '../CardSection';
import ConfigureAccordion from './ConfigureAccordionPanel';
import DynamicPropertyTypesGrid from '../DynamicPropertyTypesGrid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import RemoveEquipmentPortTypeMutation from '../../mutations/RemoveEquipmentPortTypeMutation';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import {createFragmentContainer, graphql} from 'react-relay';
import {withStyles} from '@material-ui/core/styles';

import withAlert from '@fbcnms/ui/components/Alert/withAlert';

type Props = {|
  equipmentPortType: EquipmentPortTypeItem_equipmentPortType,
  onEdit: () => void,
|} & WithAlert &
  WithStyles<typeof styles>;

const styles = {
  detailsRoot: {
    display: 'block',
  },
  detailsContainer: {
    width: '100%',
  },
  section: {
    marginBottom: '24px',
  },
};

class EquipmentPortTypeItem extends React.Component<Props> {
  render() {
    const {classes, equipmentPortType, onEdit} = this.props;
    return (
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ConfigureAccordion
              entityName="portType"
              icon={<SettingsEthernetIcon />}
              name={equipmentPortType.name}
              instanceCount={equipmentPortType.numberOfPortDefinitions}
              instanceNameSingular="port type"
              instanceNamePlural="port types"
              onDelete={this.onDelete}
              onEdit={onEdit}
            />
          </AccordionSummary>
          <AccordionDetails className={classes.detailsRoot}>
            <div className={classes.detailsContainer}>
              <CardSection title="Port Properties">
                <DynamicPropertyTypesGrid
                  key={equipmentPortType.id}
                  // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                  propertyTypes={equipmentPortType.propertyTypes}
                />
              </CardSection>
              <CardSection title="Link Properties">
                <DynamicPropertyTypesGrid
                  key={equipmentPortType.id}
                  // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                  propertyTypes={equipmentPortType.linkPropertyTypes}
                />
              </CardSection>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  onDelete = () => {
    this.props
      .confirm(
        `Are you sure you want to delete "${this.props.equipmentPortType.name}"?`,
      )
      .then(confirm => {
        if (confirm) {
          RemoveEquipmentPortTypeMutation(
            {id: this.props.equipmentPortType.id},
            {
              onError: (error: any) => {
                this.props.alert('Error: ' + error.source?.errors[0]?.message);
              },
            },
            store => store.delete(this.props.equipmentPortType.id),
          );
        }
      });
  };
}

export default withAlert(
  withStyles(styles)(
    createFragmentContainer(EquipmentPortTypeItem, {
      equipmentPortType: graphql`
        fragment EquipmentPortTypeItem_equipmentPortType on EquipmentPortType {
          id
          name
          numberOfPortDefinitions
          propertyTypes {
            ...DynamicPropertyTypesGrid_propertyTypes
          }
          linkPropertyTypes {
            ...DynamicPropertyTypesGrid_propertyTypes
          }
        }
      `,
    }),
  ),
);
