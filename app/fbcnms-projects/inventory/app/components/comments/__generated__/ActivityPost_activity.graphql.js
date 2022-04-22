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
type GenericActivityText_activity$ref = any;
type WorkOrderCheckInActivityText_activity$ref = any;
type WorkOrderCheckOutActivityText_activity$ref = any;
export type ActivityField = "ASSIGNEE" | "CLOCK_IN" | "CLOCK_OUT" | "CREATION_DATE" | "DESCRIPTION" | "NAME" | "OWNER" | "PRIORITY" | "STATUS" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ActivityPost_activity$ref: FragmentReference;
declare export opaque type ActivityPost_activity$fragmentType: ActivityPost_activity$ref;
export type ActivityPost_activity = {|
  +id: string,
  +author: ?{|
    +email: string
  |},
  +newValue: ?string,
  +activityType: ActivityField,
  +createTime: any,
  +$fragmentRefs: GenericActivityText_activity$ref & WorkOrderCheckInActivityText_activity$ref & WorkOrderCheckOutActivityText_activity$ref,
  +$refType: ActivityPost_activity$ref,
|};
export type ActivityPost_activity$data = ActivityPost_activity;
export type ActivityPost_activity$key = {
  +$data?: ActivityPost_activity$data,
  +$fragmentRefs: ActivityPost_activity$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActivityPost_activity",
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
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "author",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "newValue",
      "storageKey": null
    },
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
      "kind": "ScalarField",
      "name": "createTime",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "GenericActivityText_activity"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderCheckInActivityText_activity"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderCheckOutActivityText_activity"
    }
  ],
  "type": "Activity",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'e905cb523dfbfd117ac5a40644a06bd7';

module.exports = node;
