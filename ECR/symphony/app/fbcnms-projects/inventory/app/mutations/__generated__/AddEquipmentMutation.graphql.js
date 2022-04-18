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
type EquipmentTable_equipments$ref = any;
export type AddEquipmentInput = {|
  name: string,
  type: string,
  location?: ?string,
  parent?: ?string,
  positionDefinition?: ?string,
  properties?: ?$ReadOnlyArray<PropertyInput>,
  workOrder?: ?string,
  externalId?: ?string,
|};
export type PropertyInput = {|
  id?: ?string,
  propertyTypeID: string,
  stringValue?: ?string,
  intValue?: ?number,
  booleanValue?: ?boolean,
  floatValue?: ?number,
  latitudeValue?: ?number,
  longitudeValue?: ?number,
  rangeFromValue?: ?number,
  rangeToValue?: ?number,
  nodeIDValue?: ?string,
  isEditable?: ?boolean,
  isInstanceProperty?: ?boolean,
|};
export type AddEquipmentMutationVariables = {|
  input: AddEquipmentInput
|};
export type AddEquipmentMutationResponse = {|
  +addEquipment: {|
    +$fragmentRefs: EquipmentTable_equipments$ref
  |}
|};
export type AddEquipmentMutation = {|
  variables: AddEquipmentMutationVariables,
  response: AddEquipmentMutationResponse,
|};
*/


/*
mutation AddEquipmentMutation(
  $input: AddEquipmentInput!
) {
  addEquipment(input: $input) {
    ...EquipmentTable_equipments
    id
  }
}

fragment EquipmentTable_equipments on Equipment {
  id
  name
  futureState
  equipmentType {
    id
    name
  }
  workOrder {
    id
    status
  }
  services {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
    "name": "AddEquipmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Equipment",
        "kind": "LinkedField",
        "name": "addEquipment",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EquipmentTable_equipments"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddEquipmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Equipment",
        "kind": "LinkedField",
        "name": "addEquipment",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
            "concreteType": "EquipmentType",
            "kind": "LinkedField",
            "name": "equipmentType",
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
            "concreteType": "WorkOrder",
            "kind": "LinkedField",
            "name": "workOrder",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Service",
            "kind": "LinkedField",
            "name": "services",
            "plural": true,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "24888dcd346733b47dd22d2f571243f0",
    "id": null,
    "metadata": {},
    "name": "AddEquipmentMutation",
    "operationKind": "mutation",
    "text": "mutation AddEquipmentMutation(\n  $input: AddEquipmentInput!\n) {\n  addEquipment(input: $input) {\n    ...EquipmentTable_equipments\n    id\n  }\n}\n\nfragment EquipmentTable_equipments on Equipment {\n  id\n  name\n  futureState\n  equipmentType {\n    id\n    name\n  }\n  workOrder {\n    id\n    status\n  }\n  services {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8ae42940d356604b163281a83494cce1';

module.exports = node;
