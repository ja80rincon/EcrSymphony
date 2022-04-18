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
  EditKqiTargetMutation,
  EditKqiTargetMutationResponse,
  EditKqiTargetMutationVariables,
} from './__generated__/EditKqiTargetMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditKqiTargetMutation($input: EditKqiTargetInput!) {
    editKqiTarget(input: $input) {
      id
      name
      impact
      allowedVariation
      initTime
      endTime
      status
    }
  }
`;

export default (
  variables: EditKqiTargetMutationVariables,
  callbacks?: MutationCallbacks<EditKqiTargetMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditKqiTargetMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
