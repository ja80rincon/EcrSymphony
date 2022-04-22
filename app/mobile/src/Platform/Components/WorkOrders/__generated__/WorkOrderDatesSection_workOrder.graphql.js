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
declare export opaque type WorkOrderDatesSection_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderDatesSection_workOrder$fragmentType: WorkOrderDatesSection_workOrder$ref;
export type WorkOrderDatesSection_workOrder = {|
  +creationDate: any,
  +installDate: ?any,
  +$refType: WorkOrderDatesSection_workOrder$ref,
|};
export type WorkOrderDatesSection_workOrder$data = WorkOrderDatesSection_workOrder;
export type WorkOrderDatesSection_workOrder$key = {
  +$data?: WorkOrderDatesSection_workOrder$data,
  +$fragmentRefs: WorkOrderDatesSection_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderDatesSection_workOrder",
  "selections": [
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
    }
  ],
  "type": "WorkOrder"
};
// prettier-ignore
(node/*: any*/).hash = 'af0275ffba837e71a3d79d995a72e5ba';

module.exports = node;
