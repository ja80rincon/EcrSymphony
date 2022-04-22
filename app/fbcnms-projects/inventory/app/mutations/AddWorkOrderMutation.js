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
  AddWorkOrderMutation,
  AddWorkOrderMutationResponse,
  AddWorkOrderMutationVariables,
} from './__generated__/AddWorkOrderMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddWorkOrderMutation($input: AddWorkOrderInput!) {
    addWorkOrder(input: $input) {
      id
      organizationFk {
        id
        name
      }
    }
  }
`;

export default (
  variables: AddWorkOrderMutationVariables,
  callbacks?: MutationCallbacks<AddWorkOrderMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddWorkOrderMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
