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
  AddServicePortMutation,
  AddServicePortMutationResponse,
  AddServicePortMutationVariables,
} from './__generated__/AddServicePortMutation.graphql.js';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironemnt from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddServicePortMutation($id: ID!, $portId: ID!) {
    addServicePort(id: $id, portId: $portId) {
      ...ServiceCard_service
    }
  }
`;

export default (
  variables: AddServicePortMutationVariables,
  callbacks?: MutationCallbacks<AddServicePortMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddServicePortMutation>(RelayEnvironemnt, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
