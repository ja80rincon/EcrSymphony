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

import type {YesNoViewOnlyCheckListItem_item} from './__generated__/YesNoViewOnlyCheckListItem_item.graphql';

import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import React from 'react';
import {CHECKLIST_ITEM_NOT_APPLICABLE_LABEL} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {YesNoOptions} from 'Platform/Components/WorkOrders/CheckListItems/Editing/YesNoCheckListItem';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = $ReadOnly<{|
  +item: YesNoViewOnlyCheckListItem_item,
|}>;

const YesNoViewOnlyCheckListItem = ({item}: Props) => {
  const label = YesNoOptions.find(option => option.value === item.yesNoResponse)
    ?.label;
  return (
    <LabeledTextSection
      title={item.title}
      content={label ?? CHECKLIST_ITEM_NOT_APPLICABLE_LABEL}
    />
  );
};

export default createFragmentContainer(YesNoViewOnlyCheckListItem, {
  item: graphql`
    fragment YesNoViewOnlyCheckListItem_item on CheckListItem {
      id
      title
      yesNoResponse
    }
  `,
});
