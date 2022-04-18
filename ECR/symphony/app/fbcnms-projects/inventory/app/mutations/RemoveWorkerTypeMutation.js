/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {MutationCallbacks} from './MutationCallbacks.js';
import type {
  RemoveWorkerTypeMutation,
  RemoveWorkerTypeMutationResponse,
  RemoveWorkerTypeMutationVariables,
} from './__generated__/RemoveWorkerTypeMutation.graphql';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {ConnectionHandler} from 'relay-runtime';
import {commitMutation, graphql} from 'react-relay';
import {getGraphError} from '../common/EntUtils';

const mutation = graphql`
  mutation RemoveWorkerTypeMutation($id: ID!) {
    removeWorkerType(id: $id)
  }
`;

export const deleteWorkerType = (workerTypeId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    CommitRemoveWorkerTypeMutation(
      {
        id: workerTypeId,
      },
      {
        onCompleted: (response, errors) => {
          if (errors && errors[0]) {
            return reject(getGraphError(errors[0]));
          }
          resolve();
        },
        onError: (error: Error) => reject(getGraphError(error)),
      },
      store => {
        const rootQuery = store.getRoot();
        const workerTypes = ConnectionHandler.getConnection(
          rootQuery,
          'Configure_workerTypes',
        );
        if (workerTypes != null) {
          ConnectionHandler.deleteNode(workerTypes, workerTypeId);
        }
        store.delete(workerTypeId);
      },
    );
  });
};

const CommitRemoveWorkerTypeMutation = (
  variables: RemoveWorkerTypeMutationVariables,
  callbacks?: MutationCallbacks<RemoveWorkerTypeMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<RemoveWorkerTypeMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};

export default CommitRemoveWorkerTypeMutation;
