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
type WorkOrderListItem_workOrder$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type TasksList_workOrders$ref: FragmentReference;
declare export opaque type TasksList_workOrders$fragmentType: TasksList_workOrders$ref;
export type TasksList_workOrders = $ReadOnlyArray<{|
  +id: string,
  +$fragmentRefs: WorkOrderListItem_workOrder$ref,
  +$refType: TasksList_workOrders$ref,
|}>;
export type TasksList_workOrders$data = TasksList_workOrders;
export type TasksList_workOrders$key = $ReadOnlyArray<{
  +$data?: TasksList_workOrders$data,
  +$fragmentRefs: TasksList_workOrders$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "TasksList_workOrders",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderListItem_workOrder"
    }
  ],
  "type": "WorkOrder"
};
// prettier-ignore
(node/*: any*/).hash = '9b6aaf7eac10e4194fd4e72237107fc3';

module.exports = node;
