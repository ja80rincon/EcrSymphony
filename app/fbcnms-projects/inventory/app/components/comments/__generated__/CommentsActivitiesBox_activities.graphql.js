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
type CommentsActivitiesLog_activities$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type CommentsActivitiesBox_activities$ref: FragmentReference;
declare export opaque type CommentsActivitiesBox_activities$fragmentType: CommentsActivitiesBox_activities$ref;
export type CommentsActivitiesBox_activities = $ReadOnlyArray<{|
  +$fragmentRefs: CommentsActivitiesLog_activities$ref,
  +$refType: CommentsActivitiesBox_activities$ref,
|}>;
export type CommentsActivitiesBox_activities$data = CommentsActivitiesBox_activities;
export type CommentsActivitiesBox_activities$key = $ReadOnlyArray<{
  +$data?: CommentsActivitiesBox_activities$data,
  +$fragmentRefs: CommentsActivitiesBox_activities$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "CommentsActivitiesBox_activities",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommentsActivitiesLog_activities"
    }
  ],
  "type": "Activity",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'c4d3824e4498526273d2db703b8d85d6';

module.exports = node;
