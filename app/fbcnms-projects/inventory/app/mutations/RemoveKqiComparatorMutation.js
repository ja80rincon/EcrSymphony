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
  RemoveKqiComparatorMutation,
  RemoveKqiComparatorMutationResponse,
  RemoveKqiComparatorMutationVariables,
} from './__generated__/RemoveKqiComparatorMutation.graphql';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation RemoveKqiComparatorMutation($id: ID!) {
    removeKqiComparator(id: $id)
  }
`;

export default (
  variables: RemoveKqiComparatorMutationVariables,
  callbacks?: MutationCallbacks<RemoveKqiComparatorMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<RemoveKqiComparatorMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
