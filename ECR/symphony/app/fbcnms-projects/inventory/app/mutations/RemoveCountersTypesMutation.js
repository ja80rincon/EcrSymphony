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
  RemoveCountersTypesMutation,
  RemoveCountersTypesMutationResponse,
  RemoveCountersTypesMutationVariables,
} from './__generated__/RemoveCountersTypesMutation.graphql';

import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation RemoveCountersTypesMutation($id: ID!) {
    removeCounter(id: $id)
  }
`;

export default (
  variables: RemoveCountersTypesMutationVariables,
  callbacks?: MutationCallbacks<RemoveCountersTypesMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<RemoveCountersTypesMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
