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
  EditKpiMutation,
  EditKpiMutationResponse,
  EditKpiMutationVariables,
} from './__generated__/EditKpiMutation.graphql';

import type {MutationCallbacks} from './MutationCallbacks.js';

import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditKpiMutation($input: EditKpiInput!) {
    editKpi(input: $input) {
      id
      name
      domainFk {
        id
        name
      }
    }
  }
`;

export default (
  variables: EditKpiMutationVariables,
  callbacks?: MutationCallbacks<EditKpiMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditKpiMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
