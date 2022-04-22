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
  AddKqiMutation,
  AddKqiMutationResponse,
  AddKqiMutationVariables,
} from './__generated__/AddKqiMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddKqiMutation($input: AddKqiInput!) {
    addKqi(input: $input) {
      id
      name
      description
      formula
      startDateTime
      endDateTime
      kqiCategory {
        id
        name
      }
      kqiPerspective {
        id
        name
      }
      kqiSource {
        id
        name
      }
      kqiTemporalFrequency {
        id
        name
      }
    }
  }
`;

export default (
  variables: AddKqiMutationVariables,
  callbacks?: MutationCallbacks<AddKqiMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddKqiMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
