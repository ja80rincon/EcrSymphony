/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FlowInstanceStatus as GraphQLStatusFlowType} from '../components/automation/__generated__/FlowInstancesView_query.graphql';

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

export const inProgressStatus = {
  key: 'in_progress',
  value: 'IN_PROGRESS',
  label: `${fbt('In Progress', '')}`,
};

export const failedStatus = {
  key: 'Failed',
  value: 'FAILED',
  label: `${fbt('Failed', '')}`,
};

export const completedStatus = {
  key: 'Completed',
  value: 'COMPLETED',
  label: `${fbt('Completed', '')}`,
};

export const canceledStatus = {
  key: 'Canceled',
  value: 'CANCELED',
  label: `${fbt('Canceled', '')}`,
};

const statusValues: Array<{|
  key: string,
  value: GraphQLStatusFlowType,
  label: string,
|}> = [
  inProgressStatus,
  failedStatus,
  canceledStatus,
  completedStatus,
];

export function useStatusValues() {
  return {statusValues, completedStatus};
}
