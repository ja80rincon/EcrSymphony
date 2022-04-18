/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {WiFiScanViewOnlyCheckListItem_item} from './__generated__/WiFiScanViewOnlyCheckListItem_item.graphql';

import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import React from 'react';
import WiFiScanResults from '@fbcmobile/ui/Components/Views/WiFiScanResults';
import {CHECKLIST_ITEM_NOT_APPLICABLE_LABEL} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = $ReadOnly<{|
  +item: WiFiScanViewOnlyCheckListItem_item,
|}>;

const WiFiScanViewOnlyCheckListItem = ({item}: Props) => {
  const wifiData =
    item.wifiData != null ? item.wifiData.slice().map(d => ({...d})) : null;
  return (
    <LabeledTextSection
      title={item.title}
      content={
        wifiData != null ? (
          <WiFiScanResults scanResults={wifiData} />
        ) : (
          CHECKLIST_ITEM_NOT_APPLICABLE_LABEL
        )
      }
    />
  );
};

export default createFragmentContainer(WiFiScanViewOnlyCheckListItem, {
  item: graphql`
    fragment WiFiScanViewOnlyCheckListItem_item on CheckListItem {
      id
      title
      wifiData {
        timestamp
        frequency
        channel
        bssid
        strength
        ssid
        band
        channelWidth
        capabilities
        latitude
        longitude
      }
    }
  `,
});
