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
    EditKqiMutation,
    EditKqiMutationResponse,
    EditKqiMutationVariables,
  } from './__generated__/EditKqiMutation.graphql';
  import type {MutationCallbacks} from './MutationCallbacks.js';
  import type {SelectorStoreUpdater} from 'relay-runtime';
  
  import RelayEnvironment from '../common/RelayEnvironment.js';
  import {commitMutation, graphql} from 'react-relay';
  
const mutation = graphql`
  mutation EditKqiMutation($input: EditKqiInput!) {
    editKqi(input: $input) {
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
    variables: EditKqiMutationVariables,
    callbacks?: MutationCallbacks<EditKqiMutationResponse>,
    updater?: SelectorStoreUpdater,
  ) => {
    const {onCompleted, onError} = callbacks ? callbacks : {};
    commitMutation<EditKqiMutation>(RelayEnvironment, {
      mutation,
      variables,
      updater,
      onCompleted,
      onError,
    });
  };