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
declare export opaque type WorkOrderProjectSection_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderProjectSection_workOrder$fragmentType: WorkOrderProjectSection_workOrder$ref;
export type WorkOrderProjectSection_workOrder = {|
  +project: ?{|
    +name: string
  |},
  +$refType: WorkOrderProjectSection_workOrder$ref,
|};
export type WorkOrderProjectSection_workOrder$data = WorkOrderProjectSection_workOrder;
export type WorkOrderProjectSection_workOrder$key = {
  +$data?: WorkOrderProjectSection_workOrder$data,
  +$fragmentRefs: WorkOrderProjectSection_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderProjectSection_workOrder",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Project",
      "kind": "LinkedField",
      "name": "project",
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
(node/*: any*/).hash = 'aa4716e9af35195e832920abad94d971';

module.exports = node;
