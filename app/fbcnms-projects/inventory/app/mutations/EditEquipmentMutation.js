/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  EditEquipmentMutation,
  EditEquipmentMutationResponse,
  EditEquipmentMutationVariables,
} from './__generated__/EditEquipmentMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

export const mutation = graphql`
  mutation EditEquipmentMutation($input: EditEquipmentInput!) {
    editEquipment(input: $input) {
      ...EquipmentTable_equipments
    }
  }
`;

export default (
  variables: EditEquipmentMutationVariables,
  callbacks?: MutationCallbacks<EditEquipmentMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditEquipmentMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
