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
  EditKqiSourceMutation,
  EditKqiSourceMutationResponse,
  EditKqiSourceMutationVariables,
} from './__generated__/EditKqiSourceMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditKqiSourceMutation($input: EditKqiSourceInput!) {
    editKqiSource(input: $input) {
      id
      name
    }
  }
`;

export default (
  variables: EditKqiSourceMutationVariables,
  callbacks?: MutationCallbacks<EditKqiSourceMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditKqiSourceMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
