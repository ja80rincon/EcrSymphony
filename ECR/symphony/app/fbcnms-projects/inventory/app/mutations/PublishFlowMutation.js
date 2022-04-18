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
import type {SelectorStoreUpdater} from 'relay-runtime';

import type {
  PublishFlowMutation,
  PublishFlowMutationResponse,
  PublishFlowMutationVariables,
} from './__generated__/PublishFlowMutation.graphql';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation PublishFlowMutation($input: PublishFlowInput!) {
    publishFlow(input: $input) {
      id
      name
    }
  }
`;

export default (
  variables: PublishFlowMutationVariables,
  callbacks?: MutationCallbacks<PublishFlowMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<PublishFlowMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
