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

import type {StringViewOnlyCheckListItem_item} from './__generated__/StringViewOnlyCheckListItem_item.graphql';

import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import React from 'react';
import {CHECKLIST_ITEM_NOT_APPLICABLE_LABEL} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = $ReadOnly<{|
  +item: StringViewOnlyCheckListItem_item,
|}>;

const StringViewOnlyCheckListItem = ({item}: Props) => {
  return (
    <LabeledTextSection
      title={item.title}
      content={item.stringValue ?? CHECKLIST_ITEM_NOT_APPLICABLE_LABEL}
    />
  );
};

export default createFragmentContainer(StringViewOnlyCheckListItem, {
  item: graphql`
    fragment StringViewOnlyCheckListItem_item on CheckListItem {
      id
      title
      stringValue
    }
  `,
});
