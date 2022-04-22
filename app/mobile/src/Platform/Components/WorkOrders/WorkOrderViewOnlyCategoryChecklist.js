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

import type {WorkOrderViewOnlyCategoryChecklist_category} from './__generated__/WorkOrderViewOnlyCategoryChecklist_category.graphql';

import React from 'react';
import WorkOrderCheckListItem from 'Platform/Components/WorkOrders/WorkOrderCheckListItem';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = {|
  +category: WorkOrderViewOnlyCategoryChecklist_category,
|};

const WorkOrderViewOnlyCategoryChecklist = ({category}: Props) => {
  return category.checkList
    .slice()
    .sort((c1, c2) => (c1.index ?? 0) - (c2.index ?? 0))
    .map(item => <WorkOrderCheckListItem key={item.id} item={item} />);
};

export default createFragmentContainer(WorkOrderViewOnlyCategoryChecklist, {
  category: graphql`
    fragment WorkOrderViewOnlyCategoryChecklist_category on CheckListCategory {
      checkList {
        id
        index
        ...WorkOrderCheckListItem_item
      }
    }
  `,
});
