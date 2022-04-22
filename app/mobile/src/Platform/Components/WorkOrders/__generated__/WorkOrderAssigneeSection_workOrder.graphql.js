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
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderAssigneeSection_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderAssigneeSection_workOrder$fragmentType: WorkOrderAssigneeSection_workOrder$ref;
export type WorkOrderAssigneeSection_workOrder = {|
  +assignedTo: ?{|
    +name: string
  |},
  +$refType: WorkOrderAssigneeSection_workOrder$ref,
|};
export type WorkOrderAssigneeSection_workOrder$data = WorkOrderAssigneeSection_workOrder;
export type WorkOrderAssigneeSection_workOrder$key = {
  +$data?: WorkOrderAssigneeSection_workOrder$data,
  +$fragmentRefs: WorkOrderAssigneeSection_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderAssigneeSection_workOrder",
  "selections": [
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
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "WorkOrder"
};
// prettier-ignore
(node/*: any*/).hash = '3b8d4e2092cd51332febb8a433cc066e';

module.exports = node;
