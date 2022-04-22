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
  EditPropertyCategoryTypeMutation,
  EditPropertyCategoryTypeMutationVariables,
  EditPropertyCategoryTypeMutationResponse,
} from './__generated__/EditPropertyCategoryTypeMutation.graphql';
import type {SelectorStoreUpdater} from 'relay-runtime';

import type {MutationCallbacks} from '../../../../mutations/MutationCallbacks.js';

import RelayEnvironment from '../../../../common/RelayEnvironment';
import {commitMutation, graphql} from 'react-relay';

export const mutation = graphql`
  mutation EditPropertyCategoryTypeMutation(
    $propertyCategories: [EditPropertyCategoryInput!]!
  ) {
    editPropertyCategories(propertyCategories: $propertyCategories) {
      id
      name
      index
      numberOfProperties
    }
  }
`;

export default (
  variables: EditPropertyCategoryTypeMutationVariables,
  callbacks?: MutationCallbacks<EditPropertyCategoryTypeMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditPropertyCategoryTypeMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
