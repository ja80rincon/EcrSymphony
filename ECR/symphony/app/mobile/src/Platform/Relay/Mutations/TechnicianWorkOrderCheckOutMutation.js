/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {
  ClockOutReason,
  TechnicianWorkOrderCheckOutMutation,
  TechnicianWorkOrderCheckOutMutationResponse,
  TechnicianWorkOrderCheckOutMutationVariables,
} from './__generated__/TechnicianWorkOrderCheckOutMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks';

import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import graphql from 'babel-plugin-relay/macro';
import {Statuses} from '@fbcmobile/ui/Components/StatusPill';
import {commitMutation} from 'react-relay-offline';

const mutation = graphql`
  mutation TechnicianWorkOrderCheckOutMutation(
    $input: TechnicianWorkOrderCheckOutInput!
  ) {
    technicianWorkOrderCheckOut(input: $input) {
      id
      status
    }
  }
`;

const getOptimisticResponse = (
  workOrderId: string,
  clockOutReason: ClockOutReason,
): TechnicianWorkOrderCheckOutMutationResponse => {
  let newStatus = Statuses.IN_PROGRESS;
  switch (clockOutReason) {
    case 'BLOCKED':
      newStatus = Statuses.BLOCKED;
      break;
    case 'PAUSE':
      newStatus = Statuses.IN_PROGRESS;
      break;
    case 'SUBMIT_INCOMPLETE':
    case 'SUBMIT':
      newStatus = Statuses.SUBMITTED;
      break;
    default:
      break;
  }
  return {
    technicianWorkOrderCheckOut: {
      id: workOrderId,
      status: newStatus,
    },
  };
};

export default (
  variables: TechnicianWorkOrderCheckOutMutationVariables,
  callbacks?: MutationCallbacks<TechnicianWorkOrderCheckOutMutationResponse>,
  updater?: (store: any) => void,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<TechnicianWorkOrderCheckOutMutation>(RelayEnvironment, {
    mutation,
    variables,
    optimisticResponse: getOptimisticResponse(
      variables.input.workOrderId,
      variables.input.reason,
    ),
    updater,
    onCompleted,
    onError,
  });
};
