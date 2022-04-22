/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FlowInstanceTemplateNodesQuery} from './__generated__/FlowInstanceTemplateNodesQuery.graphql';
import type {NamedNode} from './EntUtils';

import {graphql} from 'relay-runtime';
import {useLazyLoadQuery} from 'react-relay/hooks';

const flowInstanceTemplateNodesQuery = graphql`
  query FlowInstanceTemplateNodesQuery {
    flows {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export type FlowInstanceTemplateNode = $Exact<NamedNode>;

// eslint-disable-next-line max-len
export function useFlowInstanceTemplateNodes(): $ReadOnlyArray<FlowInstanceTemplateNode> {
  const response = useLazyLoadQuery<FlowInstanceTemplateNodesQuery>(
    flowInstanceTemplateNodesQuery,
    {},
  );
  const flowInstanceTemplatesData = response.flows?.edges || [];
  const flowInstanceTemplates = flowInstanceTemplatesData
    .map(p => p.node)
    .filter(Boolean);
  // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
  return flowInstanceTemplates;
}
