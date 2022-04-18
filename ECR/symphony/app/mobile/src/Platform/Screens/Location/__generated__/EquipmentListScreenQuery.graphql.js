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
type EquipmentPane_equipment$ref = any;
export type EquipmentListScreenQueryVariables = {|
  locationId: string
|};
export type EquipmentListScreenQueryResponse = {|
  +node: ?{|
    +equipments?: $ReadOnlyArray<?{|
      +$fragmentRefs: EquipmentPane_equipment$ref
    |}>
  |}
|};
export type EquipmentListScreenQuery = {|
  variables: EquipmentListScreenQueryVariables,
  response: EquipmentListScreenQueryResponse,
|};
*/


/*
query EquipmentListScreenQuery(
  $locationId: ID!
) {
  node(id: $locationId) {
    __typename
    ... on Location {
      equipments {
        ...EquipmentPane_equipment
        id
      }
    }
    id
  }
}

fragment EquipmentPane_equipment on Equipment {
  id
  name
  equipmentType {
    name
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "locationId"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EquipmentListScreenQuery",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Equipment",
                "kind": "LinkedField",
                "name": "equipments",
                "plural": true,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "EquipmentPane_equipment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Location"
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
    "name": "EquipmentListScreenQuery",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Equipment",
                "kind": "LinkedField",
                "name": "equipments",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EquipmentType",
                    "kind": "LinkedField",
                    "name": "equipmentType",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Location"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "EquipmentListScreenQuery",
    "operationKind": "query",
    "text": "query EquipmentListScreenQuery(\n  $locationId: ID!\n) {\n  node(id: $locationId) {\n    __typename\n    ... on Location {\n      equipments {\n        ...EquipmentPane_equipment\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment EquipmentPane_equipment on Equipment {\n  id\n  name\n  equipmentType {\n    name\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9aa6f962ffb14ef39d4c693a70436b04';

module.exports = node;
