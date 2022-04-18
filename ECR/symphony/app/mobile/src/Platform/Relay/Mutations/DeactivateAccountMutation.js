/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {
  DeactivateAccountMutation,
  DeactivateAccountMutationResponse,
  DeactivateAccountMutationVariables,
} from './__generated__/DeactivateAccountMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks';

import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import graphql from 'babel-plugin-relay/macro';
import {commitMutation} from 'react-relay';

const mutation = graphql`
  mutation DeactivateAccountMutation($input: EditUserInput!) {
    editUser(input: $input) {
      id
    }
  }
`;

export default (
  variables: DeactivateAccountMutationVariables,
  callbacks?: MutationCallbacks<DeactivateAccountMutationResponse>,
  updater?: (store: any) => void,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<DeactivateAccountMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
