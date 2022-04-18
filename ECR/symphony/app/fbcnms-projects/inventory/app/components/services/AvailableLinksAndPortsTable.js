/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {AvailableLinksAndPortsTable_links} from './__generated__/AvailableLinksAndPortsTable_links.graphql';
import type {AvailableLinksAndPortsTable_ports} from './__generated__/AvailableLinksAndPortsTable_ports.graphql';
import type {Equipment, EquipmentPort, Link} from '../../common/Equipment';
import type {WithStyles} from '@material-ui/core';

import 'react-virtualized/styles.css';
import EquipmentBreadcrumbs from '../equipment/EquipmentBreadcrumbs';
import React from 'react';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {AutoSizer, Column, Table} from 'react-virtualized';
import {createFragmentContainer, graphql} from 'react-relay';
import {sortLexicographically} from '@symphony/design-system/utils/displayUtils';
import {withStyles} from '@material-ui/core/styles';

const styles = {
  noResultsRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100px',
  },
  noResultsLabel: {
    color: symphony.palette.D600,
  },
  futureState: {
    textTransform: 'capitalize',
    maxWidth: '50px',
  },
  checked: {
    backgroundColor: symphony.palette.B50,
  },
  row: {
    '&:hover': {
      backgroundColor: symphony.palette.B50,
    },
    '&:focus': {
      outline: 'none',
    },
  },
  table: {
    outline: 'none',
  },
  cell: {
    padding: '14px 16px',
  },
  header: {
    borderBottom: '2px solid #f0f0f0',
    margin: '0px',
  },
  column: {
    '&&': {
      margin: '0px',
      textTransform: 'none',
    },
  },
};

type Props = $ReadOnly<{|
  equipment: Equipment,
  links: AvailableLinksAndPortsTable_links,
  ports?: ?AvailableLinksAndPortsTable_ports,
  selectedLink: ?Link,
  onLinkSelected: (link: Link) => void,
|}> &
  WithStyles<typeof styles>;

type LinkPorts = Link & {
  srcPort: EquipmentPort,
  dstPort: ?EquipmentPort,
};

const showLinksByOrder = (
  srcEquipment: Equipment,
  links: AvailableLinksAndPortsTable_links,
  ports: AvailableLinksAndPortsTable_ports,
): Array<LinkPorts> => {
  const linksAndPorts = links
    .map(link => ({
      ...link,
      srcPort: link.ports[0],
      dstPort: link.ports[1],
    }))
    .map(link => {
      if (
        link.srcPort?.parentEquipment.id != srcEquipment.id &&
        !link.srcPort?.parentEquipment.positionHierarchy
          .map(position => position.parentEquipment.id)
          .includes(srcEquipment.id)
      ) {
        // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
        return {
          ...link,
          // $FlowFixMe[incompatible-return] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
          srcPort: link.dstPort,
          // $FlowFixMe[incompatible-return] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
          dstPort: link.srcPort,
        };
      }
      // $FlowFixMe[incompatible-return] $FlowFixMe T74239404 Found via relay types
      // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
      // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
      return link;
    })
    .sort((linkA, linkB) =>
      sortLexicographically(
        linkA.srcPort?.definition.name ?? '',
        linkB.srcPort?.definition.name ?? '',
      ),
    );
  ports.forEach(port => {
    linksAndPorts.push({
      id: `${port.id}_noLink`,
      ports: [port, null],
      srcPort: port,
      dstPort: null,
    });
  });
  // $FlowFixMe[incompatible-return] $FlowFixMe T74239404 Found via relay types
  // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
  // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
  return linksAndPorts;
};

const AvailableLinksAndPortsTable = (props: Props) => {
  const {
    equipment,
    links,
    // $FlowFixMe[incompatible-use] $FlowFixMe
    ports,
    selectedLink,
    onLinkSelected,
    classes,
  } = props;

  const headerRenderer = ({label}) => {
    return (
      <div className={classes.cell}>
        <Text variant="subtitle2">{label}</Text>
      </div>
    );
  };

  const cellRenderer = ({dataKey, _, cellData}) => {
    let content = null;
    if (cellData) {
      if (dataKey.startsWith('equipment_')) {
        content = (
          <EquipmentBreadcrumbs
            equipment={cellData}
            size="small"
            variant="body2"
          />
        );
      } else {
        content = (
          <Text variant={dataKey === 'port_b' ? 'subtitle2' : 'body2'}>
            {cellData}
          </Text>
        );
      }
    }
    return <div className={classes.cell}>{content}</div>;
  };

  const onRowClicked = ({_event, _index, rowData}) => {
    onLinkSelected(rowData);
  };

  const linksByOrder = showLinksByOrder(equipment, links, ports);
  if (linksByOrder.length === 0) {
    return (
      <div className={classes.noResultsRoot}>
        <Text variant="h6" className={classes.noResultsLabel}>
          {`${fbt(
            'No available links out of ' +
              fbt.param('equipment type name', equipment.equipmentType.name) +
              ' ' +
              fbt.param('equipment name', equipment.name),
            'Message when no available links found are for a chosen equipment',
          )}
          `}
        </Text>
      </div>
    );
  }

  return (
    <AutoSizer>
      {({height, width}) => (
        <Table
          className={classes.table}
          height={height}
          width={width}
          headerHeight={50}
          rowHeight={50}
          rowCount={linksByOrder.length}
          rowGetter={({index}) => linksByOrder[index]}
          gridClassName={classes.table}
          rowClassName={({index}) =>
            classNames({
              [classes.header]: index === -1,
              [classes.row]: index !== -1,
              [classes.checked]:
                selectedLink &&
                index !== -1 &&
                linksByOrder[index].id === selectedLink.id,
            })
          }
          onRowClick={onRowClicked}>
          <Column
            label="Equipment A (Selected)"
            dataKey="equipment_a"
            width={250}
            flexGrow={1}
            cellDataGetter={({rowData}) => rowData.srcPort.parentEquipment}
            headerRenderer={headerRenderer}
            cellRenderer={cellRenderer}
            headerClassName={classes.column}
            className={classes.column}
          />
          <Column
            label="Port A"
            dataKey="port_a"
            width={250}
            flexGrow={1}
            cellDataGetter={({rowData}) => rowData.srcPort.definition.name}
            headerRenderer={headerRenderer}
            cellRenderer={cellRenderer}
            headerClassName={classes.column}
            className={classes.column}
          />
          <Column
            label="Equipment B"
            dataKey="equipment_b"
            width={250}
            flexGrow={1}
            cellDataGetter={({rowData}) =>
              rowData.dstPort ? rowData.dstPort.parentEquipment : null
            }
            headerRenderer={headerRenderer}
            cellRenderer={cellRenderer}
            headerClassName={classes.column}
            className={classes.column}
          />
          <Column
            label="Port B"
            dataKey="port_b"
            width={250}
            flexGrow={1}
            cellDataGetter={({rowData}) =>
              rowData.dstPort ? rowData.dstPort.definition.name : null
            }
            headerRenderer={headerRenderer}
            cellRenderer={cellRenderer}
            headerClassName={classes.column}
            className={classes.column}
          />
        </Table>
      )}
    </AutoSizer>
  );
};

export default withStyles(styles)(
  createFragmentContainer(AvailableLinksAndPortsTable, {
    links: graphql`
      fragment AvailableLinksAndPortsTable_links on Link @relay(plural: true) {
        id
        ports {
          parentEquipment {
            id
            name
            positionHierarchy {
              parentEquipment {
                id
              }
            }
            ...EquipmentBreadcrumbs_equipment
          }
          definition {
            id
            name
          }
        }
      }
    `,
    ports: graphql`
      fragment AvailableLinksAndPortsTable_ports on EquipmentPort
        @relay(plural: true) {
        id
        parentEquipment {
          id
          name
          positionHierarchy {
            parentEquipment {
              id
            }
          }
          ...EquipmentBreadcrumbs_equipment
        }
        definition {
          id
          name
        }
      }
    `,
  }),
);
