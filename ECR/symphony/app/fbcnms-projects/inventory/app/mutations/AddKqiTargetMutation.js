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
  AddKqiTargetMutation,
  AddKqiTargetMutationResponse,
  AddKqiTargetMutationVariables,
} from './__generated__/AddKqiTargetMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddKqiTargetMutation($input: AddKqiTargetInput!) {
    addKqiTarget(input: $input) {
      id
      name
      impact
      allowedVariation
      initTime
      endTime
      status
      kqiComparator {
        id
        number
        comparatorType
        kqiTargetFk {
          id
          name
        }
        comparatorFk {
          id
          name
        }
      }
    }
  }
`;

export default (
  variables: AddKqiTargetMutationVariables,
  callbacks?: MutationCallbacks<AddKqiTargetMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddKqiTargetMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
