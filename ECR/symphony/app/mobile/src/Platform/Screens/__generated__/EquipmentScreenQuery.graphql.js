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
export type EquipmentScreenQueryVariables = {|
  equipmentId: string
|};
export type EquipmentScreenQueryResponse = {|
  +node: ?{|
    +id?: string,
    +name?: string,
    +equipmentType?: {|
      +id: string,
      +name: string,
    |},
    +locationHierarchy?: $ReadOnlyArray<{|
      +id: string,
      +name: string,
    |}>,
    +positionHierarchy?: $ReadOnlyArray<{|
      +id: string,
      +parentEquipment: {|
        +id: string,
        +name: string,
      |},
    |}>,
  |}
|};
export type EquipmentScreenQuery = {|
  variables: EquipmentScreenQueryVariables,
  response: EquipmentScreenQueryResponse,
|};
*/


/*
query EquipmentScreenQuery(
  $equipmentId: ID!
) {
  node(id: $equipmentId) {
    __typename
    ... on Equipment {
      id
      name
      equipmentType {
        id
        name
      }
      locationHierarchy {
        id
        name
      }
      positionHierarchy {
        id
        parentEquipment {
          id
          name
        }
      }
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "equipmentId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "equipmentId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "EquipmentType",
  "kind": "LinkedField",
  "name": "equipmentType",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "locationHierarchy",
  "plural": true,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "EquipmentPosition",
  "kind": "LinkedField",
  "name": "positionHierarchy",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Equipment",
      "kind": "LinkedField",
      "name": "parentEquipment",
      "plural": false,
      "selections": (v4/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EquipmentScreenQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "type": "Equipment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EquipmentScreenQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "type": "Equipment"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "EquipmentScreenQuery",
    "operationKind": "query",
    "text": "query EquipmentScreenQuery(\n  $equipmentId: ID!\n) {\n  node(id: $equipmentId) {\n    __typename\n    ... on Equipment {\n      id\n      name\n      equipmentType {\n        id\n        name\n      }\n      locationHierarchy {\n        id\n        name\n      }\n      positionHierarchy {\n        id\n        parentEquipment {\n          id\n          name\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '018ef83253e02e9344f171cd5a9290a6';

module.exports = node;
