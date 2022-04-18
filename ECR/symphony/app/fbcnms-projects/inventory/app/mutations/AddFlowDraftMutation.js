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
  AddFlowDraftMutation,
  AddFlowDraftMutationResponse,
  AddFlowDraftMutationVariables,
} from './__generated__/AddFlowDraftMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddFlowDraftMutation($input: AddFlowDraftInput!) {
    addFlowDraft(input: $input) {
      id
    }
  }
`;

export default (
  variables: AddFlowDraftMutationVariables,
  callbacks?: MutationCallbacks<AddFlowDraftMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddFlowDraftMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
