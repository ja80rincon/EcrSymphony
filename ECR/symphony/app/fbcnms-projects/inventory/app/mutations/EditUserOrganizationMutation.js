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
  EditUserOrganizationMutation,
  EditUserOrganizationMutationResponse,
  EditUserOrganizationMutationVariables,
} from './__generated__/EditUserOrganizationMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironemnt from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditUserOrganizationMutation($input: EditUserInput!) {
    editUser(input: $input) {
      ...UserManagementUtils_user @relay(mask: false)
      organizationFk {
        id
        name
        description
      }
    }
  }
`;

export default (
  variables: EditUserOrganizationMutationVariables,
  callbacks?: MutationCallbacks<EditUserOrganizationMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditUserOrganizationMutation>(RelayEnvironemnt, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
