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
export type KqiSourcesTypesQueryVariables = {||};
export type KqiSourcesTypesQueryResponse = {|
  +kqiSources: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
      |}
    |}>
  |}
|};
export type KqiSourcesTypesQuery = {|
  variables: KqiSourcesTypesQueryVariables,
  response: KqiSourcesTypesQueryResponse,
|};
*/


/*
query KqiSourcesTypesQuery {
  kqiSources {
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
    "concreteType": "KqiSourceConnection",
    "kind": "LinkedField",
    "name": "kqiSources",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "KqiSourceEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "KqiSource",
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
    "name": "KqiSourcesTypesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "KqiSourcesTypesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "bd9a833d54a105a1f13e2fbd47b94b6f",
    "id": null,
    "metadata": {},
    "name": "KqiSourcesTypesQuery",
    "operationKind": "query",
    "text": "query KqiSourcesTypesQuery {\n  kqiSources {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1b9274f6e21b3ebaf03930a2ee417716';

module.exports = node;
