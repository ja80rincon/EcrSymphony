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
  AddAppointmentMutation,
  AddAppointmentMutationResponse,
  AddAppointmentMutationVariables,
} from './__generated__/AddAppointmentMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddAppointmentMutation($input: AddAppointmentInput!) {
    addAppointment(input: $input) {
      id
      workOrder {
        id
      }
      assignee {
        id
        authID
        firstName
        lastName
        email
      }
      start
      end
    }
  }
`;

export default (
  variables: AddAppointmentMutationVariables,
  callbacks?: MutationCallbacks<AddAppointmentMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddAppointmentMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
