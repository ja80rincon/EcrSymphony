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
  WorkOrderAddCommentMutation,
  WorkOrderAddCommentMutationResponse,
  WorkOrderAddCommentMutationVariables,
} from './__generated__/WorkOrderAddCommentMutation.graphql';

import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import graphql from 'babel-plugin-relay/macro';
import {commitMutation} from 'react-relay';

const mutation = graphql`
  mutation WorkOrderAddCommentMutation($input: CommentInput!) {
    addComment(input: $input) {
      ...WorkOrderCommentListItem_comment
    }
  }
`;

export default (
  variables: WorkOrderAddCommentMutationVariables,
  callbacks?: MutationCallbacks<WorkOrderAddCommentMutationResponse>,
  updater?: (store: any) => void,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<WorkOrderAddCommentMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
