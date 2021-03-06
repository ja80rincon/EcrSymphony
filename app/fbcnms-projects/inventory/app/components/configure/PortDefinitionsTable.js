/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {PortDefinitionsTable_portDefinitions} from './__generated__/PortDefinitionsTable_portDefinitions.graphql';

import CardSection from '../CardSection';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Text from '@symphony/design-system/components/Text';
import inventoryTheme from '../../common/theme';
import useFeatureFlag from '@fbcnms/ui/context/useFeatureFlag';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {sortByIndex} from '../draggable/DraggableUtils';

const useStyles = makeStyles(_theme => ({
  table: inventoryTheme.table,
  cell: {
    paddingLeft: '0px',
  },
}));

type Props = $ReadOnly<{|
  portDefinitions: PortDefinitionsTable_portDefinitions,
  onPortDefinitionsChanged?: ?(
    newPorts: PortDefinitionsTable_portDefinitions,
  ) => void,
|}>;

const PortDefinitionsTable = (props: Props) => {
  const {portDefinitions} = props;
  const classes = useStyles();
  const backplaneConnectionsEnabled = useFeatureFlag(
    'enable_backplane_connections',
  );
  if (portDefinitions.length === 0) {
    return null;
  }
  return (
    <CardSection title="Ports">
      <Table component="div" className={classes.table}>
        <TableHead component="div">
          <TableRow component="div">
            <TableCell component="div" className={classes.cell}>
              Port name
            </TableCell>
            <TableCell component="div" className={classes.cell}>
              Visible Label
            </TableCell>
            <TableCell component="div" className={classes.cell}>
              Type
            </TableCell>
            {backplaneConnectionsEnabled && (
              <TableCell component="div" className={classes.cell}>
                BackPlane Connections
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody component="div">
          {portDefinitions
            .slice()
            .sort(sortByIndex)
            .map(portDefinition => (
              <TableRow component="div" key={portDefinition.id}>
                <TableCell className={classes.cell} component="div" scope="row">
                  <Text variant="body2">{portDefinition.name}</Text>
                </TableCell>
                <TableCell className={classes.cell} component="div" scope="row">
                  <Text variant="body2">{portDefinition.visibleLabel}</Text>
                </TableCell>
                <TableCell className={classes.cell} component="div" scope="row">
                  <Text variant="body2">{portDefinition.portType?.name}</Text>
                </TableCell>
                {backplaneConnectionsEnabled && (
                  <TableCell
                    className={classes.cell}
                    component="div"
                    scope="row">
                    <Text variant="body2">
                      {portDefinition.connectedPorts &&
                        portDefinition.connectedPorts
                          .map(_port => _port.name)
                          .join(',')}
                    </Text>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </CardSection>
  );
};

export default createFragmentContainer(PortDefinitionsTable, {
  portDefinitions: graphql`
    fragment PortDefinitionsTable_portDefinitions on EquipmentPortDefinition
      @relay(plural: true) {
      id
      name
      index
      visibleLabel
      portType {
        id
        name
      }
      connectedPorts {
        id
        name
      }
    }
  `,
});
