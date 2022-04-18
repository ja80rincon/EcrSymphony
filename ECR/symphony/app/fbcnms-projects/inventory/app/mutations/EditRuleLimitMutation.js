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
  EditRuleLimitMutation,
  EditRuleLimitMutationResponse,
  EditRuleLimitMutationVariables,
} from './__generated__/EditRuleLimitMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditRuleLimitMutation($input: EditRuleLimitInput!) {
    editRuleLimit(input: $input) {
      id
      number
    }
  }
`;

export default (
  variables: EditRuleLimitMutationVariables,
  callbacks?: MutationCallbacks<EditRuleLimitMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditRuleLimitMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
