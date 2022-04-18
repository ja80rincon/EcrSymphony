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
type WorkOrderAssigneeSection_workOrder$ref = any;
type WorkOrderDatesSection_workOrder$ref = any;
type WorkOrderLocationSection_workOrder$ref = any;
type WorkOrderProjectSection_workOrder$ref = any;
type WorkOrderTemplateNameSection_workOrder$ref = any;
export type WorkOrderPriority = "HIGH" | "LOW" | "MEDIUM" | "NONE" | "URGENT" | "%future added value";
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderDetailsSection_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderDetailsSection_workOrder$fragmentType: WorkOrderDetailsSection_workOrder$ref;
export type WorkOrderDetailsSection_workOrder = {|
  +id: string,
  +creationDate: any,
  +installDate: ?any,
  +description: ?string,
  +priority: WorkOrderPriority,
  +status: WorkOrderStatus,
  +workOrderTemplate: ?{|
    +name: string
  |},
  +location: ?{|
    +name: string,
    +latitude: number,
    +longitude: number,
  |},
  +project: ?{|
    +name: string
  |},
  +assignedTo: ?{|
    +name: string
  |},
  +$fragmentRefs: WorkOrderLocationSection_workOrder$ref & WorkOrderDatesSection_workOrder$ref & WorkOrderProjectSection_workOrder$ref & WorkOrderAssigneeSection_workOrder$ref & WorkOrderTemplateNameSection_workOrder$ref,
  +$refType: WorkOrderDetailsSection_workOrder$ref,
|};
export type WorkOrderDetailsSection_workOrder$data = WorkOrderDetailsSection_workOrder;
export type WorkOrderDetailsSection_workOrder$key = {
  +$data?: WorkOrderDetailsSection_workOrder$data,
  +$fragmentRefs: WorkOrderDetailsSection_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderDetailsSection_workOrder",
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
      "name": "creationDate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "installDate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
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
      "concreteType": "WorkOrderTemplate",
      "kind": "LinkedField",
      "name": "workOrderTemplate",
      "plural": false,
      "selections": (v1/*: any*/),
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
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "latitude",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "longitude",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Project",
      "kind": "LinkedField",
      "name": "project",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "assignedTo",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderLocationSection_workOrder"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderDatesSection_workOrder"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderProjectSection_workOrder"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderAssigneeSection_workOrder"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderTemplateNameSection_workOrder"
    }
  ],
  "type": "WorkOrder"
};
})();
// prettier-ignore
(node/*: any*/).hash = '4d545e0b259876223a0bce03fb34d5d2';

module.exports = node;
