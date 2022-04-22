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
declare export opaque type WorkOrderLocationSection_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderLocationSection_workOrder$fragmentType: WorkOrderLocationSection_workOrder$ref;
export type WorkOrderLocationSection_workOrder = {|
  +location: ?{|
    +name: string,
    +latitude: number,
    +longitude: number,
  |},
  +$refType: WorkOrderLocationSection_workOrder$ref,
|};
export type WorkOrderLocationSection_workOrder$data = WorkOrderLocationSection_workOrder;
export type WorkOrderLocationSection_workOrder$key = {
  +$data?: WorkOrderLocationSection_workOrder$data,
  +$fragmentRefs: WorkOrderLocationSection_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderLocationSection_workOrder",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "location",
      "plural": false,
      "selections": [
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
    }
  ],
  "type": "WorkOrder"
};
// prettier-ignore
(node/*: any*/).hash = 'c0a25ab746e2027db2e79b019eeccf4f';

module.exports = node;
