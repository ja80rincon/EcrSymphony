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
  AddBulkServiceLinksAndPortsMutation,
  AddBulkServiceLinksAndPortsMutationResponse,
  AddBulkServiceLinksAndPortsMutationVariables,
} from './__generated__/AddBulkServiceLinksAndPortsMutation.graphql';

import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';

import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddBulkServiceLinksAndPortsMutation(
    $input: AddBulkServiceLinksAndPortsInput!
  ) {
    addBulkServiceLinksAndPorts(input: $input) {
      ...ServiceCard_service
    }
  }
`;

export default (
  variables: AddBulkServiceLinksAndPortsMutationVariables,
  callbacks?: MutationCallbacks<AddBulkServiceLinksAndPortsMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddBulkServiceLinksAndPortsMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
