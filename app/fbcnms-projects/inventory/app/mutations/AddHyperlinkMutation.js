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
  AddHyperlinkMutation,
  AddHyperlinkMutationResponse,
  AddHyperlinkMutationVariables,
} from './__generated__/AddHyperlinkMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddHyperlinkMutation($input: AddHyperlinkInput!) {
    addHyperlink(input: $input) {
      id
      url
      displayName
      category
      createTime
    }
  }
`;

export default (
  variables: AddHyperlinkMutationVariables,
  callbacks?: MutationCallbacks<AddHyperlinkMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddHyperlinkMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
