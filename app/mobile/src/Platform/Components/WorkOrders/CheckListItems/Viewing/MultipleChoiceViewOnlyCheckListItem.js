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

import type {MultipleChoiceViewOnlyCheckListItem_item} from './__generated__/MultipleChoiceViewOnlyCheckListItem_item.graphql';

import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import React from 'react';
import {CHECKLIST_ITEM_NOT_APPLICABLE_LABEL} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = $ReadOnly<{|
  +item: MultipleChoiceViewOnlyCheckListItem_item,
|}>;

const MultipleChoiceViewOnlyCheckListItem = ({item}: Props) => {
  return (
    <LabeledTextSection
      title={item.title}
      content={
        item.selectedEnumValues?.replace(',', ', ') ??
        CHECKLIST_ITEM_NOT_APPLICABLE_LABEL
      }
    />
  );
};

export default createFragmentContainer(MultipleChoiceViewOnlyCheckListItem, {
  item: graphql`
    fragment MultipleChoiceViewOnlyCheckListItem_item on CheckListItem {
      id
      title
      selectedEnumValues
    }
  `,
});
