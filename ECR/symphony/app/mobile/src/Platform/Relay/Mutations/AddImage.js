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
  AddImageMutation,
  AddImageMutationResponse,
  AddImageMutationVariables,
} from './__generated__/AddImageMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks';

import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import graphql from 'babel-plugin-relay/macro';
import {commitMutation} from 'react-relay';

const mutation = graphql`
  mutation AddImageMutation($input: AddImageInput!) {
    addImage(input: $input) {
      id
      storeKey
    }
  }
`;

export default (
  variables: AddImageMutationVariables,
  callbacks?: MutationCallbacks<AddImageMutationResponse>,
  updater?: (store: any) => void,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddImageMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
