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
declare export opaque type WorkOrdersPane_workOrder$ref: FragmentReference;
declare export opaque type WorkOrdersPane_workOrder$fragmentType: WorkOrdersPane_workOrder$ref;
export type WorkOrdersPane_workOrder = {
  +id: string,
  +name: string,
  ...
};
export type WorkOrdersPane_workOrder$data = WorkOrdersPane_workOrder;
export type WorkOrdersPane_workOrder$key = {
  +$data?: WorkOrdersPane_workOrder$data,
  +$fragmentRefs: WorkOrdersPane_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "mask": false
  },
  "name": "WorkOrdersPane_workOrder",
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
    }
  ],
  "type": "WorkOrder",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '944b8648852d096f3bf6f11462155af6';

module.exports = node;
