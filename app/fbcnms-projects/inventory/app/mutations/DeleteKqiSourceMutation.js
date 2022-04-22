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
  DeleteKqiSourceMutation,
  DeleteKqiSourceMutationResponse,
  DeleteKqiSourceMutationVariables,
} from './__generated__/DeleteKqiSourceMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation DeleteKqiSourceMutation($id: ID!) {
    removeKqiSource(id: $id)
  }
`;

export default (
  variables: DeleteKqiSourceMutationVariables,
  callbacks?: MutationCallbacks<DeleteKqiSourceMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<DeleteKqiSourceMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
