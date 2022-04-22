/**
 * @generated
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 **/

 /**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AutomationFlowsList_flows$ref = any;
export type AutomationFlowsViewQueryVariables = {||};
export type AutomationFlowsViewQueryResponse = {|
  +flows: {|
    +edges: ?$ReadOnlyArray<{|
      +node: ?{|
        +$fragmentRefs: AutomationFlowsList_flows$ref
      |}
    |}>
  |}
|};
export type AutomationFlowsViewQuery = {|
  variables: AutomationFlowsViewQueryVariables,
  response: AutomationFlowsViewQueryResponse,
|};
*/


/*
query AutomationFlowsViewQuery {
  flows(first: 500) {
    edges {
      node {
        ...AutomationFlowsList_flows
        id
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment AutomationFlowCard_flow on Flow {
  id
  name
  description
  status
  newInstancesPolicy
  draft {
    id
    sameAsFlow
  }
}

fragment AutomationFlowsList_flows on Flow {
  id
  ...AutomationFlowCard_flow
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 500
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AutomationFlowsViewQuery",
    "selections": [
      {
        "alias": "flows",
        "args": null,
        "concreteType": "FlowConnection",
        "kind": "LinkedField",
        "name": "__AutomationFlowsView_flows_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "FlowEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Flow",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "AutomationFlowsList_flows"
                  }
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AutomationFlowsViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "FlowConnection",
        "kind": "LinkedField",
        "name": "flows",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "FlowEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Flow",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "description",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "newInstancesPolicy",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FlowDraft",
                    "kind": "LinkedField",
                    "name": "draft",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "sameAsFlow",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "flows(first:500)"
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "AutomationFlowsView_flows",
        "kind": "LinkedHandle",
        "name": "flows"
      }
    ]
  },
  "params": {
    "cacheID": "a147cc066edfd7705b241be339a964e5",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "flows"
          ]
        }
      ]
    },
    "name": "AutomationFlowsViewQuery",
    "operationKind": "query",
    "text": "query AutomationFlowsViewQuery {\n  flows(first: 500) {\n    edges {\n      node {\n        ...AutomationFlowsList_flows\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AutomationFlowCard_flow on Flow {\n  id\n  name\n  description\n  status\n  newInstancesPolicy\n  draft {\n    id\n    sameAsFlow\n  }\n}\n\nfragment AutomationFlowsList_flows on Flow {\n  id\n  ...AutomationFlowCard_flow\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3df60d6c8a5b5100e28110cb39f3354c';

module.exports = node;
