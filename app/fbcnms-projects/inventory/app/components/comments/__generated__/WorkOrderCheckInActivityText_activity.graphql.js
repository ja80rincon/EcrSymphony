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
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderCheckInActivityText_activity$ref: FragmentReference;
declare export opaque type WorkOrderCheckInActivityText_activity$fragmentType: WorkOrderCheckInActivityText_activity$ref;
export type WorkOrderCheckInActivityText_activity = {|
  +activityType: ActivityField,
  +clockDetails: ?{|
    +distanceMeters: ?number
  |},
  +$refType: WorkOrderCheckInActivityText_activity$ref,
|};
export type WorkOrderCheckInActivityText_activity$data = WorkOrderCheckInActivityText_activity;
export type WorkOrderCheckInActivityText_activity$key = {
  +$data?: WorkOrderCheckInActivityText_activity$data,
  +$fragmentRefs: WorkOrderCheckInActivityText_activity$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderCheckInActivityText_activity",
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
          "name": "distanceMeters",
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
(node/*: any*/).hash = '513a2d60c4ab7db83b792dcc5c328f75';

module.exports = node;
