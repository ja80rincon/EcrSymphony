/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {PropertyCategoryNodesQuery, PropertyCategoryNodesQueryVariables} from './__generated__/PropertyCategoryNodesQuery.graphql';
import type {NamedNode, OptionalNamedNode} from './EntUtils';
import {graphql, fetchQuery} from 'relay-runtime';
import {useLazyLoadQuery} from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';

export type PropertyCategory = {|
  ...NamedNode,
  index?: ?number,
  numberOfProperties?: ?number,
|};

export const GENERAL_CATEGORY_LABEL = 'GENERAL';

const propertyCategoryNodesQuery = graphql`
  query PropertyCategoryNodesQuery ($orderBy: PropertyCategoryOrder) {
    propertyCategories (orderBy: $orderBy) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export type PropertyCategoryNode = $Exact<OptionalNamedNode>;

export function usePropertyCategoryNodes(input: PropertyCategoryNodesQueryVariables): $ReadOnlyArray<PropertyCategoryNode> {
  const response = useLazyLoadQuery<PropertyCategoryNodesQuery>(
    propertyCategoryNodesQuery,
    input,
  );
  const propCategoryData = response.propertyCategories?.edges || [];
  const propCategory = propCategoryData.map(p => p.node).filter(Boolean);
  // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
  return propCategory;
}
