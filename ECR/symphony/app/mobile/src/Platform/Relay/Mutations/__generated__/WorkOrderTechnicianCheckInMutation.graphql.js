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
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
export type TechnicianWorkOrderCheckInInput = {|
  distanceMeters?: ?number,
  checkInTime?: ?any,
|};
export type WorkOrderTechnicianCheckInMutationVariables = {|
  workOrderId: string,
  input?: ?TechnicianWorkOrderCheckInInput,
|};
export type WorkOrderTechnicianCheckInMutationResponse = {|
  +technicianWorkOrderCheckIn: {|
    +id: string,
    +status: WorkOrderStatus,
  |}
|};
export type WorkOrderTechnicianCheckInMutation = {|
  variables: WorkOrderTechnicianCheckInMutationVariables,
  response: WorkOrderTechnicianCheckInMutationResponse,
|};
*/


/*
mutation WorkOrderTechnicianCheckInMutation(
  $workOrderId: ID!
  $input: TechnicianWorkOrderCheckInInput
) {
  technicianWorkOrderCheckIn(workOrderId: $workOrderId, input: $input) {
    id
    status
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "workOrderId",
    "type": "ID!"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "TechnicianWorkOrderCheckInInput"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      },
      {
        "kind": "Variable",
        "name": "workOrderId",
        "variableName": "workOrderId"
      }
    ],
    "concreteType": "WorkOrder",
    "kind": "LinkedField",
    "name": "technicianWorkOrderCheckIn",
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
        "name": "status",
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
    "name": "WorkOrderTechnicianCheckInMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WorkOrderTechnicianCheckInMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "WorkOrderTechnicianCheckInMutation",
    "operationKind": "mutation",
    "text": "mutation WorkOrderTechnicianCheckInMutation(\n  $workOrderId: ID!\n  $input: TechnicianWorkOrderCheckInInput\n) {\n  technicianWorkOrderCheckIn(workOrderId: $workOrderId, input: $input) {\n    id\n    status\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'adb5549452c47d51a47db01d89d0c397';

module.exports = node;
