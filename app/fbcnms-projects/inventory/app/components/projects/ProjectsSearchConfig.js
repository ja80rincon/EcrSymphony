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

import PowerSearchProjectNameFilter from './PowerSearchProjectNameFilter';
import PowerSearchProjectOwnerFilter from './PowerSearchProjectOwnerFilter';
import PowerSearchProjectPriorityFilter from './PowerSearchProjectPriorityFilter';
import PowerSearchProjectTypeFilter from './PowerSearchProjectTypeFilter';

const ProjectSearchConfig: Array<EntityConfig> = [
  {
    type: 'project',
    label: 'Project',
    filters: [
      {
        key: 'project_name',
        name: 'project_name',
        entityType: 'project',
        label: 'Name',
        component: PowerSearchProjectNameFilter,
        defaultOperator: 'contains',
      },
      {
        key: 'project_owner',
        name: 'project_owned_by',
        entityType: 'project',
        label: 'Owner',
        component: PowerSearchProjectOwnerFilter,
        defaultOperator: 'is_one_of',
      },
      {
        key: 'project_type',
        name: 'project_type',
        entityType: 'project',
        label: 'Template',
        component: PowerSearchProjectTypeFilter,
        defaultOperator: 'is_one_of',
      },
      {
        key: 'project_priority',
        name: 'project_priority',
        entityType: 'project',
        label: 'Priority',
        component: PowerSearchProjectPriorityFilter,
        defaultOperator: 'is_one_of',
      },
    ],
  },
  {
    type: 'locations',
    label: 'Location',
    filters: [],
  },
  {
    type: 'properties',
    label: 'Properties',
    filters: [],
  },
];

export {ProjectSearchConfig};
