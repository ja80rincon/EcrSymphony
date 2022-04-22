/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {EquipmentTypeItem_equipmentType} from './__generated__/EquipmentTypeItem_equipmentType.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithStyles} from '@material-ui/core';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ConfigureAccordion from './ConfigureAccordionPanel';
import DynamicPropertyTypesGrid from '../DynamicPropertyTypesGrid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PortDefinitionsTable from './PortDefinitionsTable';
import PositionDefinitionsTable from './PositionDefinitionsTable';
import React from 'react';
import RemoveEquipmentTypeMutation from '../../mutations/RemoveEquipmentTypeMutation';
import RouterIcon from '@material-ui/icons/Router';
import {ConnectionHandler} from 'relay-runtime';
import {createFragmentContainer, graphql} from 'react-relay';
import {withStyles} from '@material-ui/core/styles';

import withAlert from '@fbcnms/ui/components/Alert/withAlert';

type Props = {|
  equipmentType: EquipmentTypeItem_equipmentType,
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

class EquipmentTypeItem extends React.Component<Props> {
  render() {
    const {classes, equipmentType, onEdit} = this.props;
    return (
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ConfigureAccordion
              entityName="equipmentType"
              icon={<RouterIcon />}
              name={equipmentType.name}
              instanceCount={equipmentType.numberOfEquipment}
              instanceNameSingular="equipment instance"
              instanceNamePlural="equipment instances"
              onDelete={this.onDelete}
              onEdit={onEdit}
            />
          </AccordionSummary>
          <AccordionDetails className={classes.detailsRoot}>
            <div className={classes.detailsContainer}>
              <div className={classes.section}>
                <DynamicPropertyTypesGrid
                  key={equipmentType.id}
                  // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                  propertyTypes={equipmentType.propertyTypes}
                />
              </div>
              <div className={classes.section}>
                <PositionDefinitionsTable
                  // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                  positionDefinitions={equipmentType.positionDefinitions}
                />
              </div>
              <div className={classes.section}>
                <PortDefinitionsTable
                  // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                  portDefinitions={equipmentType.portDefinitions}
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
      .confirm(
        `Are you sure you want to delete "${this.props.equipmentType.name}"?`,
      )
      .then(confirm => {
        if (confirm) {
          RemoveEquipmentTypeMutation(
            {id: this.props.equipmentType.id},
            {
              onError: (error: any) => {
                this.props.alert('Error: ' + error.source?.errors[0]?.message);
              },
            },
            store => {
              const id = this.props.equipmentType.id;
              const types = ConnectionHandler.getConnection(
                store.getRoot(),
                'EquipmentTypes_equipmentTypes',
              );
              if (types != null) {
                ConnectionHandler.deleteNode(types, id);
              }
              store.delete(id);
            },
          );
        }
      });
  };
}

export default withAlert(
  withStyles(styles)(
    createFragmentContainer(EquipmentTypeItem, {
      equipmentType: graphql`
        fragment EquipmentTypeItem_equipmentType on EquipmentType {
          id
          name
          propertyTypes {
            ...DynamicPropertyTypesGrid_propertyTypes
          }
          positionDefinitions {
            ...PositionDefinitionsTable_positionDefinitions
          }
          portDefinitions {
            ...PortDefinitionsTable_portDefinitions
          }
          numberOfEquipment
        }
      `,
    }),
  ),
);
