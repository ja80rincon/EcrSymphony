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
  AddKqiSourceMutation,
  AddKqiSourceMutationResponse,
  AddKqiSourceMutationVariables,
} from './__generated__/AddKqiSourceMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddKqiSourceMutation($input: AddKqiSourceInput!) {
    addKqiSource(input: $input) {
      id
      name
    }
  }
`;

export default (
  variables: AddKqiSourceMutationVariables,
  callbacks?: MutationCallbacks<AddKqiSourceMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddKqiSourceMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
