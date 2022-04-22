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
export type WorkOrderTemplateNodesQueryVariables = {||};
export type WorkOrderTemplateNodesQueryResponse = {|
  +workOrderTypes: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
      |}
    |}>
  |}
|};
export type WorkOrderTemplateNodesQuery = {|
  variables: WorkOrderTemplateNodesQueryVariables,
  response: WorkOrderTemplateNodesQueryResponse,
|};
*/


/*
query WorkOrderTemplateNodesQuery {
  workOrderTypes {
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
    "concreteType": "WorkOrderTypeConnection",
    "kind": "LinkedField",
    "name": "workOrderTypes",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "WorkOrderTypeEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "WorkOrderType",
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
    "name": "WorkOrderTemplateNodesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "WorkOrderTemplateNodesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "63e335913e056a362b0821003ee0dca2",
    "id": null,
    "metadata": {},
    "name": "WorkOrderTemplateNodesQuery",
    "operationKind": "query",
    "text": "query WorkOrderTemplateNodesQuery {\n  workOrderTypes {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7a892dd4443cb15717b92876c8c5989d';

module.exports = node;
