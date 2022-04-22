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
declare export opaque type WorkOrderTemplateNameSection_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderTemplateNameSection_workOrder$fragmentType: WorkOrderTemplateNameSection_workOrder$ref;
export type WorkOrderTemplateNameSection_workOrder = {|
  +workOrderTemplate: ?{|
    +name: string
  |},
  +$refType: WorkOrderTemplateNameSection_workOrder$ref,
|};
export type WorkOrderTemplateNameSection_workOrder$data = WorkOrderTemplateNameSection_workOrder;
export type WorkOrderTemplateNameSection_workOrder$key = {
  +$data?: WorkOrderTemplateNameSection_workOrder$data,
  +$fragmentRefs: WorkOrderTemplateNameSection_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderTemplateNameSection_workOrder",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "WorkOrderTemplate",
      "kind": "LinkedField",
      "name": "workOrderTemplate",
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
(node/*: any*/).hash = '8e133e5d1c7dc23e4650b1dcbd994f4d';

module.exports = node;
