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

import type {WorkOrderListItem_workOrder} from './__generated__/WorkOrderListItem_workOrder.graphql';

import MyTaskListItem from './MyTaskListItem';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React from 'react';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {Statuses} from '@fbcmobile/ui/Components/StatusPill';
import {createFragmentContainer} from 'react-relay-offline';
import {useWorkOrderCachedData} from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +workOrder: WorkOrderListItem_workOrder,
};

const WorkOrderListItem = ({workOrder}: Props) => {
  const cache = useWorkOrderCachedData(workOrder.id);
  return (
    <MyTaskListItem
      id={workOrder.id}
      name={workOrder.name}
      location={workOrder.location}
      onClick={() =>
        NavigationService.push(Screens.WorkOrderScreen, {
          workOrderId: workOrder.id,
        })
      }
      priority={workOrder.priority === 'NONE' ? null : workOrder.priority}
      status={workOrder.status}
      isUploadRequired={
        workOrder.status === Statuses.IN_PROGRESS &&
        (cache?.categories.length ?? 0) > 0
      }
    />
  );
};

export default createFragmentContainer(WorkOrderListItem, {
  workOrder: graphql`
    fragment WorkOrderListItem_workOrder on WorkOrder {
      id
      name
      priority
      status
      location {
        ...MyTaskListItem_location
      }
    }
  `,
});
