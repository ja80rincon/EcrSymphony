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

import AddLinkOrPortToServiceDialog from './AddLinkOrPortToServiceDialog';
import AddLinkToServiceDialog from './AddLinkToServiceDialog';
import React, {useState} from 'react';
import ServiceMenu from './ServiceMenu';
import fbt from 'fbt';
import useFeatureFlag from '@fbcnms/ui/context/useFeatureFlag';
import {LogEvents, ServerLogger} from '../../common/LoggingUtils';

type Props = $ReadOnly<{|
  service: $ReadOnly<{|id: string, name: string|}>,
  onAddLink: (link: Link) => Promise<void>,
  onAddPort: (port: EquipmentPort) => Promise<void>,
|}>;

const ServiceLinksSubservicesMenu = (props: Props) => {
  const {service, onAddLink, onAddPort} = props;
  const [addingEquipmentLink, setAddingEquipmentLink] = useState(false);
  const addPortToServiceEnabled = useFeatureFlag('add_port_to_service');
  let menuCaption = fbt(
    'Add Equipment Link',
    'Menu option to open a dialog to add link  to a service',
  );
  if (addPortToServiceEnabled) {
    menuCaption = fbt(
      'Add Equipment Link/Port',
      'Menu option to open a dialog to add link or port to a service',
    );
  }

  return (
    <ServiceMenu
      isOpen={addingEquipmentLink}
      onClose={() => setAddingEquipmentLink(false)}
      items={[
        {
          caption: menuCaption,
          onClick: () => {
            ServerLogger.info(LogEvents.ADD_EQUIPMENT_LINK_BUTTON_CLICKED);
            setAddingEquipmentLink(true);
          },
        },
      ]}>
      {addPortToServiceEnabled ? (
        <AddLinkOrPortToServiceDialog
          service={service}
          onClose={() => setAddingEquipmentLink(false)}
          onAddLink={link => {
            return onAddLink(link);
          }}
          onAddPort={onAddPort}
        />
      ) : (
        <AddLinkToServiceDialog
          service={service}
          onClose={() => setAddingEquipmentLink(false)}
          onAddLink={(link: Link) => {
            onAddLink(link);
            setAddingEquipmentLink(false);
          }}
        />
      )}
    </ServiceMenu>
  );
};

export default ServiceLinksSubservicesMenu;
