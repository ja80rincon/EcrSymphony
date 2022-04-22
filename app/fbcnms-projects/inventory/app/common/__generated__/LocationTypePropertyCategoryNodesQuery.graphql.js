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
export type LocationTypePropertyCategoryNodesQueryVariables = {||};
export type LocationTypePropertyCategoryNodesQueryResponse = {|
  +propertyCategories: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: ?string,
      |}
    |}>
  |}
|};
export type LocationTypePropertyCategoryNodesQuery = {|
  variables: LocationTypePropertyCategoryNodesQueryVariables,
  response: LocationTypePropertyCategoryNodesQueryResponse,
|};
*/


/*
query LocationTypePropertyCategoryNodesQuery {
  propertyCategories {
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
    "concreteType": "PropertyCategoryConnection",
    "kind": "LinkedField",
    "name": "propertyCategories",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PropertyCategoryEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PropertyCategory",
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
    "name": "LocationTypePropertyCategoryNodesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LocationTypePropertyCategoryNodesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "7b1ce153fbbf77b375ae6e3f5f6f6419",
    "id": null,
    "metadata": {},
    "name": "LocationTypePropertyCategoryNodesQuery",
    "operationKind": "query",
    "text": "query LocationTypePropertyCategoryNodesQuery {\n  propertyCategories {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '73a1971915682f7fb8e8fd94636c1165';

module.exports = node;
