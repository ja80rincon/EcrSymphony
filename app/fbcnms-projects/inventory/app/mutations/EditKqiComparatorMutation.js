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
  EditKqiComparatorMutation,
  EditKqiComparatorMutationResponse,
  EditKqiComparatorMutationVariables,
} from './__generated__/EditKqiComparatorMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditKqiComparatorMutation($input: EditKqiComparatorInput!) {
    editKqiComparator(input: $input) {
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
  variables: EditKqiComparatorMutationVariables,
  callbacks?: MutationCallbacks<EditKqiComparatorMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditKqiComparatorMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
