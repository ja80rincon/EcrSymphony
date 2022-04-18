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
type ActivityPost_activity$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type CommentsActivitiesLog_activities$ref: FragmentReference;
declare export opaque type CommentsActivitiesLog_activities$fragmentType: CommentsActivitiesLog_activities$ref;
export type CommentsActivitiesLog_activities = $ReadOnlyArray<{|
  +id: string,
  +createTime: any,
  +$fragmentRefs: ActivityPost_activity$ref,
  +$refType: CommentsActivitiesLog_activities$ref,
|}>;
export type CommentsActivitiesLog_activities$data = CommentsActivitiesLog_activities;
export type CommentsActivitiesLog_activities$key = $ReadOnlyArray<{
  +$data?: CommentsActivitiesLog_activities$data,
  +$fragmentRefs: CommentsActivitiesLog_activities$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "CommentsActivitiesLog_activities",
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
      "name": "createTime",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ActivityPost_activity"
    }
  ],
  "type": "Activity",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'dd73667e5b82cd9bacd860e1b733531e';

module.exports = node;
