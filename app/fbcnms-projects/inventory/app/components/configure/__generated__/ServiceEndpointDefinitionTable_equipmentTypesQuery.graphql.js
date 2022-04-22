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
export type ServiceEndpointDefinitionTable_equipmentTypesQueryVariables = {||};
export type ServiceEndpointDefinitionTable_equipmentTypesQueryResponse = {|
  +equipmentTypes: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
      |}
    |}>
  |}
|};
export type ServiceEndpointDefinitionTable_equipmentTypesQuery = {|
  variables: ServiceEndpointDefinitionTable_equipmentTypesQueryVariables,
  response: ServiceEndpointDefinitionTable_equipmentTypesQueryResponse,
|};
*/


/*
query ServiceEndpointDefinitionTable_equipmentTypesQuery {
  equipmentTypes(first: 500) {
    edges {
      node {
        id
        name
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "EquipmentTypeEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EquipmentType",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
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
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 500
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ServiceEndpointDefinitionTable_equipmentTypesQuery",
    "selections": [
      {
        "alias": "equipmentTypes",
        "args": null,
        "concreteType": "EquipmentTypeConnection",
        "kind": "LinkedField",
        "name": "__ServiceEndpointDefinitionTable_equipmentTypes_connection",
        "plural": false,
        "selections": (v0/*: any*/),
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
    "name": "ServiceEndpointDefinitionTable_equipmentTypesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EquipmentTypeConnection",
        "kind": "LinkedField",
        "name": "equipmentTypes",
        "plural": false,
        "selections": (v0/*: any*/),
        "storageKey": "equipmentTypes(first:500)"
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "ServiceEndpointDefinitionTable_equipmentTypes",
        "kind": "LinkedHandle",
        "name": "equipmentTypes"
      }
    ]
  },
  "params": {
    "cacheID": "6f05bd5f0989be4dadc690f4f7881005",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "equipmentTypes"
          ]
        }
      ]
    },
    "name": "ServiceEndpointDefinitionTable_equipmentTypesQuery",
    "operationKind": "query",
    "text": "query ServiceEndpointDefinitionTable_equipmentTypesQuery {\n  equipmentTypes(first: 500) {\n    edges {\n      node {\n        id\n        name\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '88a844a623c430a24a1944839e78684d';

module.exports = node;
