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

import * as React from 'react';
import WorkOrderEditableCheckListItem from 'Platform/Components/WorkOrders/WorkOrderEditableCheckListItem';
import {useCachedWorkOrderCategory} from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

type Props = {|
  +validateValues: boolean,
  +workOrderId: string,
  +categoryId: string,
|};

const WorkOrderEditableCategoryChecklist = ({
  workOrderId,
  categoryId,
  validateValues,
}: Props) => {
  const cachedCategory = useCachedWorkOrderCategory(workOrderId, categoryId);
  if (cachedCategory == null) {
    return null;
  }

  return (
    <>
      {cachedCategory.checklist.map(item => (
        <WorkOrderEditableCheckListItem
          key={item.id}
          workOrderId={workOrderId}
          categoryId={categoryId}
          item={item}
          validateValue={validateValues}
        />
      ))}
    </>
  );
};

export default WorkOrderEditableCategoryChecklist;
