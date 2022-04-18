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
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderChecklistCategoryPane_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderChecklistCategoryPane_workOrder$fragmentType: WorkOrderChecklistCategoryPane_workOrder$ref;
export type WorkOrderChecklistCategoryPane_workOrder = {|
  +id: string,
  +status: WorkOrderStatus,
  +assignedTo: ?{|
    +authID: string
  |},
  +$refType: WorkOrderChecklistCategoryPane_workOrder$ref,
|};
export type WorkOrderChecklistCategoryPane_workOrder$data = WorkOrderChecklistCategoryPane_workOrder;
export type WorkOrderChecklistCategoryPane_workOrder$key = {
  +$data?: WorkOrderChecklistCategoryPane_workOrder$data,
  +$fragmentRefs: WorkOrderChecklistCategoryPane_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderChecklistCategoryPane_workOrder",
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "assignedTo",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "authID",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "WorkOrder"
};
// prettier-ignore
(node/*: any*/).hash = 'acf83a692601c0459513979166f70f9d';

module.exports = node;
