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
    EditAlarmFilterMutation,
    EditAlarmFilterMutationResponse,
    EditAlarmFilterMutationVariables,
  } from './__generated__/EditAlarmFilterMutation.graphql';
  import type {MutationCallbacks} from './MutationCallbacks.js';
  import type {SelectorStoreUpdater} from 'relay-runtime';
  
  import RelayEnvironment from '../common/RelayEnvironment.js';
  import {commitMutation, graphql} from 'react-relay';
  
const mutation = graphql`
  mutation EditAlarmFilterMutation($input: EditAlarmFilterInput!) {
    editAlarmFilter(input: $input) {
      id
      name
      networkResource
      enable
      beginTime
      endTime
      reason
      user
      creationTime
      alarmStatus	{
        id
        name
      }
    }
  }
`;

  export default (
    variables: EditAlarmFilterMutationVariables,
    callbacks?: MutationCallbacks<EditAlarmFilterMutationResponse>,
    updater?: SelectorStoreUpdater,
  ) => {
    const {onCompleted, onError} = callbacks ? callbacks : {};
    commitMutation<EditAlarmFilterMutation>(RelayEnvironment, {
      mutation,
      variables,
      updater,
      onCompleted,
      onError,
    });
  };