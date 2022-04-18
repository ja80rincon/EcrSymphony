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
export type OrderDirection = "ASC" | "DESC" | "%future added value";
export type PropertyCategoryOrderField = "INDEX" | "NAME" | "%future added value";
export type PropertyCategoryOrder = {|
  direction: OrderDirection,
  field?: ?PropertyCategoryOrderField,
|};
export type PropertyCategoryNodesQueryVariables = {|
  orderBy?: ?PropertyCategoryOrder
|};
export type PropertyCategoryNodesQueryResponse = {|
  +propertyCategories: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: ?string,
      |}
    |}>
  |}
|};
export type PropertyCategoryNodesQuery = {|
  variables: PropertyCategoryNodesQueryVariables,
  response: PropertyCategoryNodesQueryResponse,
|};
*/


/*
query PropertyCategoryNodesQuery(
  $orderBy: PropertyCategoryOrder
) {
  propertyCategories(orderBy: $orderBy) {
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderBy"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "orderBy",
        "variableName": "orderBy"
      }
    ],
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PropertyCategoryNodesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PropertyCategoryNodesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4da8cc82096c90e20b2b1cb09f46e2a2",
    "id": null,
    "metadata": {},
    "name": "PropertyCategoryNodesQuery",
    "operationKind": "query",
    "text": "query PropertyCategoryNodesQuery(\n  $orderBy: PropertyCategoryOrder\n) {\n  propertyCategories(orderBy: $orderBy) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1182fd52b2477ae0f30223efeadd8943';

module.exports = node;
