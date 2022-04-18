/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {MutationCallbacks} from './MutationCallbacks.js';
import type {
  RemoveServicePortMutation,
  RemoveServicePortMutationResponse,
  RemoveServicePortMutationVariables,
} from './__generated__/RemoveServicePortMutation.graphql';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironemnt from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation RemoveServicePortMutation($id: ID!, $portId: ID!) {
    removeServicePort(id: $id, portId: $portId) {
      ...ServiceCard_service
    }
  }
`;

export default (
  variables: RemoveServicePortMutationVariables,
  callbacks?: MutationCallbacks<RemoveServicePortMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<RemoveServicePortMutation>(RelayEnvironemnt, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
