/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {EquipmentPort, Link} from '../../common/Equipment';
import type {ServiceLinksAndPortsView_links} from './__generated__/ServiceLinksAndPortsView_links.graphql';
import type {ServiceLinksAndPortsView_ports} from './__generated__/ServiceLinksAndPortsView_ports.graphql';

import * as React from 'react';
import ServiceLinkDetails from './ServiceLinkDetails';
import ServicePortDetails from './ServicePortDetails';
import symphony from '@symphony/design-system/theme/symphony';
import useFeatureFlag from '@fbcnms/ui/context/useFeatureFlag';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';

type Props = $ReadOnly<{|
  links: ServiceLinksAndPortsView_links,
  ports: ServiceLinksAndPortsView_ports,
  onDeleteLink: ?(link: Link) => void,
  onDeletePort: ?(port: EquipmentPort) => void,
  onCreateLink: ?(port: EquipmentPort) => void,
|}>;

const useStyles = makeStyles(() => ({
  separator: {
    borderBottom: `1px solid ${symphony.palette.separator}`,
    marginTop: '16px',
    marginBottom: '16px',
  },
}));

const ServiceLinksAndPortsView = (props: Props) => {
  const addPortToServiceEnabled = useFeatureFlag('add_port_to_service');
  const classes = useStyles();
  const {links, onDeleteLink, onDeletePort, ports, onCreateLink} = props;

  return (
    <div>
      {links.map(link => (
        <ServiceLinkDetails
          // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
          link={link}
          // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
          onDeleteLink={onDeleteLink ? () => onDeleteLink(link) : null}
        />
      ))}
      {addPortToServiceEnabled && (
        <>
          <div className={classes.separator} />
          {ports.map(port => (
            <ServicePortDetails
              // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
              // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
              port={port}
              // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
              // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
              onDeletePort={onDeletePort ? () => onDeletePort(port) : null}
              // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
              // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
              onCreateLink={onCreateLink ? () => onCreateLink(port) : null}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default createFragmentContainer(ServiceLinksAndPortsView, {
  links: graphql`
    fragment ServiceLinksAndPortsView_links on Link @relay(plural: true) {
      id
      ports {
        parentEquipment {
          id
          name
        }
        definition {
          id
          name
        }
      }
    }
  `,
  ports: graphql`
    fragment ServiceLinksAndPortsView_ports on EquipmentPort
      @relay(plural: true) {
      id
      parentEquipment {
        id
        name
        equipmentType {
          name
        }
      }
      definition {
        id
        name
      }
    }
  `,
});
