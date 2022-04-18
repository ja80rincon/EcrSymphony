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
export type PowerSearchLocationFilterQueryVariables = {|
  name: string,
  types?: ?$ReadOnlyArray<string>,
|};
export type PowerSearchLocationFilterQueryResponse = {|
  +locations: ?{|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
        +parentLocation: ?{|
          +id: string,
          +name: string,
        |},
      |}
    |}>
  |}
|};
export type PowerSearchLocationFilterQuery = {|
  variables: PowerSearchLocationFilterQueryVariables,
  response: PowerSearchLocationFilterQueryResponse,
|};
*/


/*
query PowerSearchLocationFilterQuery(
  $name: String!
  $types: [ID!]
) {
  locations(name: $name, first: 10, types: $types) {
    edges {
      node {
        id
        name
        parentLocation {
          id
          name
        }
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "types"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 10
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "types",
        "variableName": "types"
      }
    ],
    "concreteType": "LocationConnection",
    "kind": "LinkedField",
    "name": "locations",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "LocationEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Location",
                "kind": "LinkedField",
                "name": "parentLocation",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/)
                ],
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PowerSearchLocationFilterQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PowerSearchLocationFilterQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "490d46f253599e2f682d68bb83418d1f",
    "id": null,
    "metadata": {},
    "name": "PowerSearchLocationFilterQuery",
    "operationKind": "query",
    "text": "query PowerSearchLocationFilterQuery(\n  $name: String!\n  $types: [ID!]\n) {\n  locations(name: $name, first: 10, types: $types) {\n    edges {\n      node {\n        id\n        name\n        parentLocation {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '4361823ce4f9bdf393a3e64e6060a46d';

module.exports = node;
