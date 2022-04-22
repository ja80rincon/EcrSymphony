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

import type {SimpleViewOnlyCheckListItem_item} from './__generated__/SimpleViewOnlyCheckListItem_item.graphql';

import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import React from 'react';
import fbt from 'fbt';
import {CHECKLIST_ITEM_NOT_APPLICABLE_LABEL} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = $ReadOnly<{|
  +item: SimpleViewOnlyCheckListItem_item,
|}>;

const SimpleViewOnlyCheckListItem = ({item}: Props) => {
  return (
    <LabeledTextSection
      title={item.title}
      content={
        item.checked === true
          ? fbt('Done', 'Done checklist item').toString()
          : item.checked === false
          ? fbt('Not completed', 'Not completed checklist item').toString()
          : CHECKLIST_ITEM_NOT_APPLICABLE_LABEL
      }
    />
  );
};

export default createFragmentContainer(SimpleViewOnlyCheckListItem, {
  item: graphql`
    fragment SimpleViewOnlyCheckListItem_item on CheckListItem {
      id
      title
      checked
    }
  `,
});
