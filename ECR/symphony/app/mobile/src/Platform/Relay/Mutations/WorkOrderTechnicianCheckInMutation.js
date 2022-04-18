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

import type {MutationCallbacks} from './MutationCallbacks';
import type {
  WorkOrderTechnicianCheckInMutation,
  WorkOrderTechnicianCheckInMutationResponse,
  WorkOrderTechnicianCheckInMutationVariables,
} from './__generated__/WorkOrderTechnicianCheckInMutation.graphql';

import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import graphql from 'babel-plugin-relay/macro';
import {Statuses} from '@fbcmobile/ui/Components/StatusPill';
import {commitMutation} from 'react-relay-offline';

const mutation = graphql`
  mutation WorkOrderTechnicianCheckInMutation(
    $workOrderId: ID!
    $input: TechnicianWorkOrderCheckInInput
  ) {
    technicianWorkOrderCheckIn(workOrderId: $workOrderId, input: $input) {
      id
      status
    }
  }
`;

const getOptimisticResponse = (
  workOrderId: string,
): WorkOrderTechnicianCheckInMutationResponse => {
  return {
    technicianWorkOrderCheckIn: {
      id: workOrderId,
      status: Statuses.IN_PROGRESS,
    },
  };
};

export default (
  variables: WorkOrderTechnicianCheckInMutationVariables,
  callbacks?: MutationCallbacks<WorkOrderTechnicianCheckInMutationResponse>,
  updater?: (store: any) => void,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<WorkOrderTechnicianCheckInMutation>(RelayEnvironment, {
    mutation,
    variables,
    optimisticResponse: getOptimisticResponse(variables.workOrderId),
    updater,
    onCompleted,
    onError,
  });
};
