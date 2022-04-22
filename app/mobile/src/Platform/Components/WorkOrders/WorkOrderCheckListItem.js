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

import type {WorkOrderCheckListItem_item} from './__generated__/WorkOrderCheckListItem_item.graphql';

import ListItem from '@fbcmobile/ui/Components/ListItem';
import React from 'react';
import {CheckListItemTypes} from 'Platform/Components/WorkOrders/CheckListItemTypes';
import {StyleSheet} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = {|
  +item: WorkOrderCheckListItem_item,
|};

const WorkOrderCheckListItem = ({item}: Props) => {
  const itemConfig = CheckListItemTypes[item.type];
  if (itemConfig == null) {
    return null;
  }

  const ViewOnlyComponent = itemConfig.viewingComponent;
  return ViewOnlyComponent != null ? (
    <ListItem key={item.id} hideDivider={true} style={styles.viewOnlyItem}>
      <ViewOnlyComponent item={item} />
    </ListItem>
  ) : null;
};

const styles = StyleSheet.create({
  viewOnlyItem: {
    paddingVertical: 16,
  },
});

export default createFragmentContainer(WorkOrderCheckListItem, {
  item: graphql`
    fragment WorkOrderCheckListItem_item on CheckListItem {
      id
      title
      type
      isMandatory
      ...StringViewOnlyCheckListItem_item
      ...SimpleViewOnlyCheckListItem_item
      ...MultipleChoiceViewOnlyCheckListItem_item
      ...YesNoViewOnlyCheckListItem_item
      ...WiFiScanViewOnlyCheckListItem_item
      ...CellScanViewOnlyCheckListItem_item
      ...PhotosViewOnlyCheckListItem_item
    }
  `,
});
