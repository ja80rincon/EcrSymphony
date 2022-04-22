/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AddWorkerTypeInput} from '../mutations/__generated__/AddWorkerTypeMutation.graphql';
import type {PropertyType} from './PropertyType';

import {convertPropertyTypeToMutationInput} from './PropertyType';

export type WorkerType = {
  id: string,
  name: string,
  description: ?string,
  propertyTypes: Array<PropertyType>,
};

export const convertWorkerTypeToMutationInput = (
  workerType: WorkerType,
): AddWorkerTypeInput => {
  return {
    name: workerType.name,
    description: workerType.description,
    propertyTypes: convertPropertyTypeToMutationInput(workerType.propertyTypes),
  };
};
