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
type EquipmentPropertiesCard_position$ref = any;
export type MoveEquipmentToPositionMutationVariables = {|
  parent_equipment_id: string,
  position_definition_id: string,
  equipment_id: string,
|};
export type MoveEquipmentToPositionMutationResponse = {|
  +moveEquipmentToPosition: {|
    +$fragmentRefs: EquipmentPropertiesCard_position$ref
  |}
|};
export type MoveEquipmentToPositionMutation = {|
  variables: MoveEquipmentToPositionMutationVariables,
  response: MoveEquipmentToPositionMutationResponse,
|};
*/


/*
mutation MoveEquipmentToPositionMutation(
  $parent_equipment_id: ID!
  $position_definition_id: ID!
  $equipment_id: ID!
) {
  moveEquipmentToPosition(parentEquipmentId: $parent_equipment_id, positionDefinitionId: $position_definition_id, equipmentId: $equipment_id) {
    ...EquipmentPropertiesCard_position
    id
  }
}

fragment EquipmentPropertiesCard_position on EquipmentPosition {
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
    futureState
    workOrder {
      id
      status
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "equipment_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "parent_equipment_id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "position_definition_id"
},
v3 = [
  {
    "kind": "Variable",
    "name": "equipmentId",
    "variableName": "equipment_id"
  },
  {
    "kind": "Variable",
    "name": "parentEquipmentId",
    "variableName": "parent_equipment_id"
  },
  {
    "kind": "Variable",
    "name": "positionDefinitionId",
    "variableName": "position_definition_id"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MoveEquipmentToPositionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "EquipmentPosition",
        "kind": "LinkedField",
        "name": "moveEquipmentToPosition",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EquipmentPropertiesCard_position"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "MoveEquipmentToPositionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "EquipmentPosition",
        "kind": "LinkedField",
        "name": "moveEquipmentToPosition",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "EquipmentPositionDefinition",
            "kind": "LinkedField",
            "name": "definition",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
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
            ],
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
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "futureState",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "WorkOrder",
                "kind": "LinkedField",
                "name": "workOrder",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
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
    ]
  },
  "params": {
    "cacheID": "9f089b846a7e737acc53a8a73b30e9b2",
    "id": null,
    "metadata": {},
    "name": "MoveEquipmentToPositionMutation",
    "operationKind": "mutation",
    "text": "mutation MoveEquipmentToPositionMutation(\n  $parent_equipment_id: ID!\n  $position_definition_id: ID!\n  $equipment_id: ID!\n) {\n  moveEquipmentToPosition(parentEquipmentId: $parent_equipment_id, positionDefinitionId: $position_definition_id, equipmentId: $equipment_id) {\n    ...EquipmentPropertiesCard_position\n    id\n  }\n}\n\nfragment EquipmentPropertiesCard_position on EquipmentPosition {\n  id\n  definition {\n    id\n    name\n    index\n    visibleLabel\n  }\n  attachedEquipment {\n    id\n    name\n    futureState\n    workOrder {\n      id\n      status\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '430126764e1619e37493a5a6ed0caba8';

module.exports = node;
