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
type PositionsPane_positionDefinitions$ref = any;
type PositionsPane_positions$ref = any;
export type EquipmentPositionsListScreenQueryVariables = {|
  equipmentId: string
|};
export type EquipmentPositionsListScreenQueryResponse = {|
  +node: ?{|
    +equipmentType?: {|
      +positionDefinitions: $ReadOnlyArray<?{|
        +$fragmentRefs: PositionsPane_positionDefinitions$ref
      |}>
    |},
    +positions?: $ReadOnlyArray<?{|
      +$fragmentRefs: PositionsPane_positions$ref
    |}>,
  |}
|};
export type EquipmentPositionsListScreenQuery = {|
  variables: EquipmentPositionsListScreenQueryVariables,
  response: EquipmentPositionsListScreenQueryResponse,
|};
*/


/*
query EquipmentPositionsListScreenQuery(
  $equipmentId: ID!
) {
  node(id: $equipmentId) {
    __typename
    ... on Equipment {
      equipmentType {
        positionDefinitions {
          ...PositionsPane_positionDefinitions
          id
        }
        id
      }
      positions {
        ...PositionsPane_positions
        id
      }
    }
    id
  }
}

fragment PositionsPane_positionDefinitions on EquipmentPositionDefinition {
  id
  name
  index
  visibleLabel
}

fragment PositionsPane_positions on EquipmentPosition {
  id
  definition {
    id
    name
    index
    visibleLabel
  }
  attachedEquipment {
    id
    name
  }
  parentEquipment {
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
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "index",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "visibleLabel",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EquipmentPositionsListScreenQuery",
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
                "concreteType": "EquipmentType",
                "kind": "LinkedField",
                "name": "equipmentType",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EquipmentPositionDefinition",
                    "kind": "LinkedField",
                    "name": "positionDefinitions",
                    "plural": true,
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "PositionsPane_positionDefinitions"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "EquipmentPosition",
                "kind": "LinkedField",
                "name": "positions",
                "plural": true,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PositionsPane_positions"
                  }
                ],
                "storageKey": null
              }
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
    "name": "EquipmentPositionsListScreenQuery",
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
                "concreteType": "EquipmentType",
                "kind": "LinkedField",
                "name": "equipmentType",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EquipmentPositionDefinition",
                    "kind": "LinkedField",
                    "name": "positionDefinitions",
                    "plural": true,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "EquipmentPosition",
                "kind": "LinkedField",
                "name": "positions",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EquipmentPositionDefinition",
                    "kind": "LinkedField",
                    "name": "definition",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Equipment",
                    "kind": "LinkedField",
                    "name": "attachedEquipment",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Equipment",
                    "kind": "LinkedField",
                    "name": "parentEquipment",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
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
    "name": "EquipmentPositionsListScreenQuery",
    "operationKind": "query",
    "text": "query EquipmentPositionsListScreenQuery(\n  $equipmentId: ID!\n) {\n  node(id: $equipmentId) {\n    __typename\n    ... on Equipment {\n      equipmentType {\n        positionDefinitions {\n          ...PositionsPane_positionDefinitions\n          id\n        }\n        id\n      }\n      positions {\n        ...PositionsPane_positions\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment PositionsPane_positionDefinitions on EquipmentPositionDefinition {\n  id\n  name\n  index\n  visibleLabel\n}\n\nfragment PositionsPane_positions on EquipmentPosition {\n  id\n  definition {\n    id\n    name\n    index\n    visibleLabel\n  }\n  attachedEquipment {\n    id\n    name\n  }\n  parentEquipment {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '177526ea93feb411c006bead8b97f805';

module.exports = node;
