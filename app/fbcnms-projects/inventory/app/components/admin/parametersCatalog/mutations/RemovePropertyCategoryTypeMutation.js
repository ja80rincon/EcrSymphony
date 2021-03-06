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
  RemovePropertyCategoryTypeMutation,
  RemovePropertyCategoryTypeMutationResponse,
  RemovePropertyCategoryTypeMutationVariables,
} from './__generated__/RemovePropertyCategoryTypeMutation.graphql';
import type {SelectorStoreUpdater} from 'relay-runtime';
import type {MutationCallbacks} from '../../../../mutations/MutationCallbacks.js';
import RelayEnvironment from '../../../../common/RelayEnvironment';

import {commitMutation, graphql} from 'react-relay';





const mutation = graphql`
  mutation RemovePropertyCategoryTypeMutation($id: ID!) {
     removePropertyCategory(id: $id)
  }
`;

export default (
  variables: RemovePropertyCategoryTypeMutationVariables,
  callbacks?: MutationCallbacks<RemovePropertyCategoryTypeMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<RemovePropertyCategoryTypeMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
