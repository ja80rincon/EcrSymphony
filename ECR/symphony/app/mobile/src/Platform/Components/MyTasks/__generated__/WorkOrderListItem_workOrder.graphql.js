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
type MyTaskListItem_location$ref = any;
export type WorkOrderPriority = "HIGH" | "LOW" | "MEDIUM" | "NONE" | "URGENT" | "%future added value";
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderListItem_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderListItem_workOrder$fragmentType: WorkOrderListItem_workOrder$ref;
export type WorkOrderListItem_workOrder = {|
  +id: string,
  +name: string,
  +priority: WorkOrderPriority,
  +status: WorkOrderStatus,
  +location: ?{|
    +$fragmentRefs: MyTaskListItem_location$ref
  |},
  +$refType: WorkOrderListItem_workOrder$ref,
|};
export type WorkOrderListItem_workOrder$data = WorkOrderListItem_workOrder;
export type WorkOrderListItem_workOrder$key = {
  +$data?: WorkOrderListItem_workOrder$data,
  +$fragmentRefs: WorkOrderListItem_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderListItem_workOrder",
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
      "name": "priority",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "location",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "MyTaskListItem_location"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "WorkOrder"
};
// prettier-ignore
(node/*: any*/).hash = 'c4014dd71f2bab8f73a5b62b45394f71';

module.exports = node;
