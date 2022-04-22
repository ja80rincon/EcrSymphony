/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {LocationTypeItem_locationType} from './__generated__/LocationTypeItem_locationType.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithSnackbarProps} from 'notistack';
import type {WithStyles} from '@material-ui/core';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ConfigureAccordion from './ConfigureAccordionPanel';
import DraggableTableRow from '../draggable/DraggableTableRow';
import DynamicPropertyTypesGrid from '../DynamicPropertyTypesGrid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import RemoveLocationTypeMutation from '../../mutations/RemoveLocationTypeMutation';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {ConnectionHandler} from 'relay-runtime';
import {createFragmentContainer, graphql} from 'react-relay';
import {withSnackbar} from 'notistack';
import {withStyles} from '@material-ui/core/styles';

type Props = {|
  locationType: LocationTypeItem_locationType,
  onEdit: () => void,
  position: number,
|} & WithAlert &
  WithStyles<typeof styles> &
  WithSnackbarProps;

const styles = theme => ({
  properties: {
    marginBottom: '24px',
    width: '100%',
  },
  draggableRow: {
    display: 'flex',
    paddingLeft: '10px',
    alignItems: 'center',
    boxShadow: theme.shadows[1],
    borderRadius: 4,
  },
  row: {
    flexGrow: 1,
  },
  panel: {
    width: '100%',
    boxShadow: 'none',
  },
  cell: {
    border: 'none',
    paddingLeft: '10px',
  },
  removeBefore: {
    '&:before': {
      backgroundColor: 'transparent',
    },
  },
});

class LocationTypeItem extends React.Component<Props> {
  render() {
    const {classes, locationType, onEdit, position} = this.props;
    return (
      <div>
        <DraggableTableRow
          className={classes.draggableRow}
          draggableCellClassName={classes.cell}
          id={locationType.id}
          index={position}
          key={locationType.id}>
          <Accordion
            className={classes.panel}
            classes={{root: classes.removeBefore}}>
            <AccordionSummary
              className={classes.row}
              expandIcon={<ExpandMoreIcon />}>
              <ConfigureAccordion
                entityName="locationType"
                icon={<div>{position + 1}</div>}
                name={locationType.name}
                instanceCount={locationType.numberOfLocations}
                instanceNameSingular="location"
                instanceNamePlural="locations"
                onDelete={this.onDelete}
                onEdit={onEdit}
              />
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.properties}>
                <DynamicPropertyTypesGrid
                  key={locationType.id}
                  // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                  propertyTypes={locationType.propertyTypes}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </DraggableTableRow>
      </div>
    );
  }

  onDelete = () => {
    this.props
      .confirm(
        `Are you sure you want to delete "${this.props.locationType.name}"?`,
      )
      .then(confirm => {
        if (!confirm) {
          return;
        }
        RemoveLocationTypeMutation(
          {id: this.props.locationType.id},
          {
            onError: (error: any) => {
              this.props.alert('Error: ' + error.source?.errors[0]?.message);
            },
          },
          store => {
            const rootQuery = store.getRoot();
            const locationTypes = ConnectionHandler.getConnection(
              rootQuery,
              'Catalog_locationTypes',
            );
            if (locationTypes != null) {
              ConnectionHandler.deleteNode(
                locationTypes,
                this.props.locationType.id,
              );
            }
            store.delete(this.props.locationType.id);
          },
        );
      });
  };
}

export default withSnackbar(
  withStyles(styles)(
    withAlert(
      createFragmentContainer(LocationTypeItem, {
        locationType: graphql`
          fragment LocationTypeItem_locationType on LocationType {
            id
            name
            index
            propertyTypes {
              ...DynamicPropertyTypesGrid_propertyTypes
            }
            numberOfLocations
          }
        `,
      }),
    ),
  ),
);
