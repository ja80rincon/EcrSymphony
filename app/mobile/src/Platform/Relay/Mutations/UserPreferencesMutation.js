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

import type {MutationCallbacks} from './MutationCallbacks';
import type {
  UserPreferencesMutation,
  UserPreferencesMutationResponse,
  UserPreferencesMutationVariables,
} from './__generated__/UserPreferencesMutation.graphql';

import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import graphql from 'babel-plugin-relay/macro';
import {commitMutation} from 'react-relay';

const mutation = graphql`
  mutation UserPreferencesMutation($input: EditUserInput!) {
    editUser(input: $input) {
      distanceUnit
    }
  }
`;

export default (
  variables: UserPreferencesMutationVariables,
  callbacks?: MutationCallbacks<UserPreferencesMutationResponse>,
  updater?: (store: any) => void,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<UserPreferencesMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
