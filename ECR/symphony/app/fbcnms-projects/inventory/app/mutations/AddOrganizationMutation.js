/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import {
  AddOrganizationMutation,
  AddOrganizationMutationResponse,
  AddOrganizationMutationVariables,
} from './__generated__/AddOrganizationMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironemnt from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddOrganizationMutation($input: AddOrganizationInput!) {
    addOrganization(input: $input) {
      ...UserManagementUtils_organization @relay(mask: false)
    }
  }
`;

export default (
  variables: AddOrganizationMutationVariables,
  callbacks?: MutationCallbacks<AddOrganizationMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddOrganizationMutation>(RelayEnvironemnt, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
