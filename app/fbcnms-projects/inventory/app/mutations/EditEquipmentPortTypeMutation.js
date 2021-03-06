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
  EditEquipmentPortTypeMutation,
  EditEquipmentPortTypeMutationResponse,
  EditEquipmentPortTypeMutationVariables,
} from './__generated__/EditEquipmentPortTypeMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

export const mutation = graphql`
  mutation EditEquipmentPortTypeMutation($input: EditEquipmentPortTypeInput!) {
    editEquipmentPortType(input: $input) {
      id
      name
      ...EquipmentPortTypeItem_equipmentPortType
      ...AddEditEquipmentPortTypeCard_editingEquipmentPortType
    }
  }
`;

export default (
  variables: EditEquipmentPortTypeMutationVariables,
  callbacks?: MutationCallbacks<EditEquipmentPortTypeMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditEquipmentPortTypeMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
