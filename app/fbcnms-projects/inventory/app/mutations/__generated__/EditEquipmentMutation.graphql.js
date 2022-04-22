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
export type EditEquipmentInput = {|
  id: string,
  name: string,
  properties?: ?$ReadOnlyArray<PropertyInput>,
  deviceID?: ?string,
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
export type EditEquipmentMutationVariables = {|
  input: EditEquipmentInput
|};
export type EditEquipmentMutationResponse = {|
  +editEquipment: {|
    +$fragmentRefs: EquipmentTable_equipments$ref
  |}
|};
export type EditEquipmentMutation = {|
  variables: EditEquipmentMutationVariables,
  response: EditEquipmentMutationResponse,
|};
*/


/*
mutation EditEquipmentMutation(
  $input: EditEquipmentInput!
) {
  editEquipment(input: $input) {
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
    "name": "EditEquipmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Equipment",
        "kind": "LinkedField",
        "name": "editEquipment",
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
    "name": "EditEquipmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Equipment",
        "kind": "LinkedField",
        "name": "editEquipment",
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
    "cacheID": "06973180c74bc22c099dd43c025d69c4",
    "id": null,
    "metadata": {},
    "name": "EditEquipmentMutation",
    "operationKind": "mutation",
    "text": "mutation EditEquipmentMutation(\n  $input: EditEquipmentInput!\n) {\n  editEquipment(input: $input) {\n    ...EquipmentTable_equipments\n    id\n  }\n}\n\nfragment EquipmentTable_equipments on Equipment {\n  id\n  name\n  futureState\n  equipmentType {\n    id\n    name\n  }\n  workOrder {\n    id\n    status\n  }\n  services {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ada7d8e59770e9396458e1647916ae79';

module.exports = node;
