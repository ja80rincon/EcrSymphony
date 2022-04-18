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
  EditWorkerTypeMutation,
  EditWorkerTypeMutationResponse,
  EditWorkerTypeMutationVariables,
} from './__generated__/EditWorkerTypeMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';
import type {WorkerType} from '../common/Worker';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';
import {convertWorkerTypeToMutationInput} from '../common/Worker';
import {getGraphError} from '../common/EntUtils';

export const mutation = graphql`
  mutation EditWorkerTypeMutation($input: EditWorkerTypeInput!) {
    editWorkerType(input: $input) {
      id
      name
      ...AddEditWorkerTypeCard_workerType
    }
  }
`;

export const editWorkerType = (
  workerType: WorkerType,
): Promise<EditWorkerTypeMutationResponse> => {
  const variables: EditWorkerTypeMutationVariables = {
    input: {
      id: workerType.id,
      ...convertWorkerTypeToMutationInput(workerType),
    },
  };

  return new Promise((resolve, reject) => {
    const callbacks: MutationCallbacks<EditWorkerTypeMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          return reject(getGraphError(errors[0]));
        } else {
          resolve(response);
        }
      },
      onError: (error: Error) => reject(getGraphError(error)),
    };
    CommitEditWorkerTypeMutation(variables, callbacks);
  });
};

const CommitEditWorkerTypeMutation = (
  variables: EditWorkerTypeMutationVariables,
  callbacks?: MutationCallbacks<EditWorkerTypeMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditWorkerTypeMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};

export default CommitEditWorkerTypeMutation;
