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
  AddKqiComparatorMutation,
  AddKqiComparatorMutationResponse,
  AddKqiComparatorMutationVariables,
} from './__generated__/AddKqiComparatorMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddKqiComparatorMutation($input: AddKqiComparatorInput!) {
    addKqiComparator(input: $input) {
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
`;

export default (
  variables: AddKqiComparatorMutationVariables,
  callbacks?: MutationCallbacks<AddKqiComparatorMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddKqiComparatorMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
