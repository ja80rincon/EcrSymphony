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
  AddCommentMutation,
  AddCommentMutationResponse,
  AddCommentMutationVariables,
} from './__generated__/AddCommentMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddCommentMutation($input: CommentInput!) {
    addComment(input: $input) {
      ...TextCommentPost_comment
    }
  }
`;

export default (
  variables: AddCommentMutationVariables,
  callbacks?: MutationCallbacks<AddCommentMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddCommentMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
