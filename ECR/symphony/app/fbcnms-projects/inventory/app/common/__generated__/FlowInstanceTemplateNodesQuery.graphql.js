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
export type FlowInstanceTemplateNodesQueryVariables = {||};
export type FlowInstanceTemplateNodesQueryResponse = {|
  +flows: {|
    +edges: ?$ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
      |}
    |}>
  |}
|};
export type FlowInstanceTemplateNodesQuery = {|
  variables: FlowInstanceTemplateNodesQueryVariables,
  response: FlowInstanceTemplateNodesQueryResponse,
|};
*/


/*
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FlowInstanceTemplateNodesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FlowInstanceTemplateNodesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "efb7cefa38ae87d8dcff2ebdbe9df55b",
    "id": null,
    "metadata": {},
    "name": "FlowInstanceTemplateNodesQuery",
    "operationKind": "query",
    "text": "query FlowInstanceTemplateNodesQuery {\n  flows {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e7f59705df7957453d766fe61d3363fb';

module.exports = node;
