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
  AddFormulaMutation,
  AddFormulaMutationResponse,
  AddFormulaMutationVariables,
} from './__generated__/AddFormulaMutation.graphql';
import type {MutationCallbacks} from './MutationCallbacks.js';
import type {SelectorStoreUpdater} from 'relay-runtime';

import RelayEnvironment from '../common/RelayEnvironment.js';
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation AddFormulaMutation($input: AddFormulaInput!) {
    addFormula(input: $input) {
      id
      textFormula
    }
  }
`;

export default (
  variables: AddFormulaMutationVariables,
  callbacks?: MutationCallbacks<AddFormulaMutationResponse>,
  updater?: SelectorStoreUpdater,
) => {
  const {onCompleted, onError} = callbacks ? callbacks : {};
  commitMutation<AddFormulaMutation>(RelayEnvironment, {
    mutation,
    variables,
    updater,
    onCompleted,
    onError,
  });
};
