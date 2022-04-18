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
  AddAlarmFilterMutation,
  AddAlarmFilterMutationResponse,
  AddAlarmFilterMutationVariables,
} from './__generated__/AddAlarmFilterMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddAlarmFilterMutation($input: AddAlarmFilterInput!) {
    addAlarmFilter(input: $input) {
      id
      name
      networkResource
      enable
      beginTime
      endTime
      reason
      user
      creationTime
      alarmStatus {
        id
        name
      }
    }
  }
`;

export default (
  variables: AddAlarmFilterMutationVariables,
  callbacks?: MutationCallbacks<AddAlarmFilterMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddAlarmFilterMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
