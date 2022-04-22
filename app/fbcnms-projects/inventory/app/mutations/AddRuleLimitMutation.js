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
  AddRuleLimitMutation,
  AddRuleLimitMutationResponse,
  AddRuleLimitMutationVariables,
} from './__generated__/AddRuleLimitMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddRuleLimitMutation($input: AddRuleLimitInput!) {
    addRuleLimit(input: $input) {
      id
      number
    }
  }
`;

export default (
  variables: AddRuleLimitMutationVariables,
  callbacks?: MutationCallbacks<AddRuleLimitMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddRuleLimitMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
