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
export type ActivityField = "ASSIGNEE" | "CLOCK_IN" | "CLOCK_OUT" | "CREATION_DATE" | "DESCRIPTION" | "NAME" | "OWNER" | "PRIORITY" | "STATUS" | "%future added value";
export type ClockOutReason = "BLOCKED" | "PAUSE" | "SUBMIT" | "SUBMIT_INCOMPLETE" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderCheckOutActivityText_activity$ref: FragmentReference;
declare export opaque type WorkOrderCheckOutActivityText_activity$fragmentType: WorkOrderCheckOutActivityText_activity$ref;
export type WorkOrderCheckOutActivityText_activity = {|
  +activityType: ActivityField,
  +clockDetails: ?{|
    +clockOutReason: ?ClockOutReason,
    +distanceMeters: ?number,
    +comment: ?string,
  |},
  +$refType: WorkOrderCheckOutActivityText_activity$ref,
|};
export type WorkOrderCheckOutActivityText_activity$data = WorkOrderCheckOutActivityText_activity;
export type WorkOrderCheckOutActivityText_activity$key = {
  +$data?: WorkOrderCheckOutActivityText_activity$data,
  +$fragmentRefs: WorkOrderCheckOutActivityText_activity$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderCheckOutActivityText_activity",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "activityType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ClockDetails",
      "kind": "LinkedField",
      "name": "clockDetails",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "clockOutReason",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "distanceMeters",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "comment",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Activity",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'ea0c20cd871d4c81310e5154f20e08c6';

module.exports = node;
