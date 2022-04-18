/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {EntityConfig} from '../comparison_view/ComparisonViewTypes';

import PowerSearchBssCodeFilter from './PowerSearchBssCodeFilter';
import PowerSearchFlowInstanceStatusFilter from './PowerSearchFlowInstanceStatusFilter';
import PowerSearchFlowInstanceTypeFilter from './PowerSearchFlowInstanceTypeFilter';
import PowerSearchServiceInventoryCodeFilter from './PowerSearchServiceInventoryCodeFilter';

const FlowInstanceSearchConfig: Array<EntityConfig> = [
  {
    type: 'flow_instance',
    label: 'Flow Instance',
    filters: [
      {
        key: 'flow_instance_status',
        name: 'flow_instance_status',
        entityType: 'flow_instance',
        label: 'Status',
        component: PowerSearchFlowInstanceStatusFilter,
        defaultOperator: 'is_one_of',
      },
      {
        key: 'flow_instance_type',
        name: 'flow_instance_type',
        entityType: 'flow_instance',
        label: 'Type',
        component: PowerSearchFlowInstanceTypeFilter,
        defaultOperator: 'is_one_of',
      },
      {
        key: 'flow_instance_bss_code',
        name: 'flow_instance_bss_code',
        entityType: 'flow_instance',
        label: 'BSS Code',
        component: PowerSearchBssCodeFilter,
        defaultOperator: 'contains',
      },
      {
        key: 'flow_instance_service_instance_code',
        name: 'flow_instance_service_instance_code',
        entityType: 'flow_instance',
        label: 'Service Instance Code',
        component: PowerSearchServiceInventoryCodeFilter,
        defaultOperator: 'contains',
      },
    ],
  },
];

const FLOW_INSTANCE_FILTERS = Object.freeze({
  STATUS: 'flow_instance_status',
  TYPE: 'flow_instance_type',
  BSS_CODE: 'flow_instance_bss_code',
  SERVICE_INSTANCE_CODE: 'flow_instance_service_instance_code',
});

export {FlowInstanceSearchConfig, FLOW_INSTANCE_FILTERS};
