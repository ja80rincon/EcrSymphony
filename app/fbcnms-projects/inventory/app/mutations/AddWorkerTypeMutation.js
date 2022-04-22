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
  AddWorkerTypeMutation,
  AddWorkerTypeMutationResponse,
  AddWorkerTypeMutationVariables,
} from './__generated__/AddWorkerTypeMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';
import type {WorkerType} from '../common/Worker';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {ConnectionHandler} from 'relay-runtime';
import {commitMutation, graphql} from 'react-relay';
import {convertWorkerTypeToMutationInput} from '../common/Worker';
import {getGraphError} from '../common/EntUtils';

const mutation = graphql`
  mutation AddWorkerTypeMutation($input: AddWorkerTypeInput!) {
    addWorkerType(input: $input) {
      ...AddEditWorkerTypeCard_workerType
    }
  }
`;

export const addWorkerType = (
  workerType: WorkerType,
): Promise<AddWorkerTypeMutationResponse> => {
  const variables: AddWorkerTypeMutationVariables = {
    input: convertWorkerTypeToMutationInput(workerType),
  };

  return new Promise((resolve, reject) => {
    const callbacks: MutationCallbacks<AddWorkerTypeMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          return reject(getGraphError(errors[0]));
        } else {
          resolve(response);
        }
      },
      onError: (error: Error) => reject(getGraphError(error)),
    };
    const updater = store => {
      const rootQuery = store.getRoot();
      const newNode = store.getRootField('addWorkerType');
      if (!newNode) {
        return;
      }
      const types = ConnectionHandler.getConnection(
        rootQuery,
        'Configure_workerTypes',
      );
      if (types == null) {
        return;
      }
      const edge = ConnectionHandler.createEdge(
        store,
        types,
        newNode,
        'WorkerTypesEdge',
      );
      ConnectionHandler.insertEdgeBefore(types, edge);
    };
    CommitWorkerTypeMutation(variables, callbacks, updater);
  });
};

const CommitWorkerTypeMutation = (
  variables: AddWorkerTypeMutationVariables,
  callbacks?: MutationCallbacks<AddWorkerTypeMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddWorkerTypeMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};

export default CommitWorkerTypeMutation;
