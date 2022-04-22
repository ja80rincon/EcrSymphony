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
  EditThresholdMutation,
  EditThresholdMutationResponse,
  EditThresholdMutationVariables,
} from './__generated__/EditThresholdMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditThresholdMutation($input: EditThresholdInput!) {
    editThreshold(input: $input) {
      id
      name
      description
      status
      kpi {
        id
        name
      }
    }
  }
`;

export default (
  variables: EditThresholdMutationVariables,
  callbacks?: MutationCallbacks<EditThresholdMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditThresholdMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
