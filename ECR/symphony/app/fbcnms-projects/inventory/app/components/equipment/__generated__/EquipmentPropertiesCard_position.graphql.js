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
import type { ReaderFragment } from 'relay-runtime';
export type FutureState = "INSTALL" | "REMOVE" | "%future added value";
export type WorkOrderStatus = "BLOCKED" | "CANCELED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "SUSPENDED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type EquipmentPropertiesCard_position$ref: FragmentReference;
declare export opaque type EquipmentPropertiesCard_position$fragmentType: EquipmentPropertiesCard_position$ref;
export type EquipmentPropertiesCard_position = {
  +id: string,
  +definition: {
    +id: string,
    +name: string,
    +index: ?number,
    +visibleLabel: ?string,
    ...
  },
  +attachedEquipment: ?{
    +id: string,
    +name: string,
    +futureState: ?FutureState,
    +workOrder: ?{
      +id: string,
      +status: WorkOrderStatus,
      ...
    },
    ...
  },
  ...
};
export type EquipmentPropertiesCard_position$data = EquipmentPropertiesCard_position;
export type EquipmentPropertiesCard_position$key = {
  +$data?: EquipmentPropertiesCard_position$data,
  +$fragmentRefs: EquipmentPropertiesCard_position$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "mask": false
  },
  "name": "EquipmentPropertiesCard_position",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPositionDefinition",
      "kind": "LinkedField",
      "name": "definition",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
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
        (v0/*: any*/),
        (v1/*: any*/),
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
            (v0/*: any*/),
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
  "type": "EquipmentPosition",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd1e6f2ef9ef3182e98188066491a9856';

module.exports = node;
