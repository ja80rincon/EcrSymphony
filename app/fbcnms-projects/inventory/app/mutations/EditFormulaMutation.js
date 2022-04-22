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
  EditFormulaMutation,
  EditFormulaMutationResponse,
  EditFormulaMutationVariables,
} from './__generated__/EditFormulaMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation EditFormulaMutation($input: EditFormulaInput!) {
    editFormula(input: $input) {
      id
      textFormula
    }
  }
`;

export default (
  variables: EditFormulaMutationVariables,
  callbacks?: MutationCallbacks<EditFormulaMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<EditFormulaMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
