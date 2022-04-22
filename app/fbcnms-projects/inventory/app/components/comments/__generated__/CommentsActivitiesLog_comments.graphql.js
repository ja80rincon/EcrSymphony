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
type TextCommentPost_comment$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type CommentsActivitiesLog_comments$ref: FragmentReference;
declare export opaque type CommentsActivitiesLog_comments$fragmentType: CommentsActivitiesLog_comments$ref;
export type CommentsActivitiesLog_comments = $ReadOnlyArray<{|
  +id: string,
  +createTime: any,
  +$fragmentRefs: TextCommentPost_comment$ref,
  +$refType: CommentsActivitiesLog_comments$ref,
|}>;
export type CommentsActivitiesLog_comments$data = CommentsActivitiesLog_comments;
export type CommentsActivitiesLog_comments$key = $ReadOnlyArray<{
  +$data?: CommentsActivitiesLog_comments$data,
  +$fragmentRefs: CommentsActivitiesLog_comments$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "CommentsActivitiesLog_comments",
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
      "name": "TextCommentPost_comment"
    }
  ],
  "type": "Comment",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'df495dc20009f04644722a4f796c7db9';

module.exports = node;
