/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrderStatus as GraphQLStatusType} from '../components/work_orders/__generated__/WorkOrderDetails_workOrder.graphql.js';

import fbt from 'fbt';

export type PriorityType = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export const priorityValues = [
  {
    key: 'urgent',
    value: 'URGENT',
    label: 'Urgent',
  },
  {
    key: 'high',
    value: 'HIGH',
    label: 'High',
  },
  {
    key: 'medium',
    value: 'MEDIUM',
    label: 'Medium',
  },
  {
    key: 'low',
    value: 'LOW',
    label: 'Low',
  },
  {
    key: 'none',
    value: 'NONE',
    label: 'None',
  },
];

export const prioritySortingValues = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  NONE: 4,
};

export const doneStatus = {
  key: 'done',
  value: 'DONE',
  label: 'Done',
};

export const closedStatus = {
  key: 'closed',
  value: 'CLOSED',
  label: `${fbt('Closed', '')}`,
};

export const plannedStatus = {
  key: 'planned',
  value: 'PLANNED',
  label: `${fbt('Planned', '')}`,
};

export const pendingStatus = {
  key: 'pending',
  value: 'PENDING',
  label: 'Pending',
};

export const inProgressStatus = {
  key: 'in_progress',
  value: 'IN_PROGRESS',
  label: `${fbt('In Progress', '')}`,
};

export const submittedStatus = {
  key: 'submitted',
  value: 'SUBMITTED',
  label: `${fbt('Submitted', '')}`,
};

export const blockedStatus = {
  key: 'blocked',
  value: 'BLOCKED',
  label: `${fbt('Blocked', '')}`,
};

export const canceledStatus = {
  key: 'Canceled',
  value: 'CANCELED',
  label: `${fbt('Canceled', '')}`,
};

export const suspendedStatus = {
  key: 'Suspended',
  value: 'SUSPENDED',
  label: `${fbt('Suspended', '')}`,
};

const statusValues: Array<{|
  key: string,
  value: GraphQLStatusType,
  label: string,
|}> = [
  plannedStatus,
  inProgressStatus,
  submittedStatus,
  closedStatus,
  blockedStatus,
  canceledStatus,
  suspendedStatus,
];

export function useStatusValues() {
  return {statusValues, closedStatus, canceledStatus};
}
