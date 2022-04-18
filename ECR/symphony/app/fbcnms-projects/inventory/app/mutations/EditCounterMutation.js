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
  EditCounterMutation,
  EditCounterMutationResponse,
  EditCounterMutationVariables,
} from './__generated__/EditCounterMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditCounterMutation($input: EditCounterInput!) {
    editCounter(input: $input) {
      id
      name
      externalID
      networkManagerSystem
    }
  }
`;

export default (
  variables: EditCounterMutationVariables,
  callbacks?: MutationCallbacks<EditCounterMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditCounterMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
