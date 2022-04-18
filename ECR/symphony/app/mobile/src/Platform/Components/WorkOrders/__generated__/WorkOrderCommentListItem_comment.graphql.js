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
declare export opaque type WorkOrderCommentListItem_comment$ref: FragmentReference;
declare export opaque type WorkOrderCommentListItem_comment$fragmentType: WorkOrderCommentListItem_comment$ref;
export type WorkOrderCommentListItem_comment = {|
  +id: string,
  +author: {|
    +email: string
  |},
  +text: string,
  +createTime: any,
  +$refType: WorkOrderCommentListItem_comment$ref,
|};
export type WorkOrderCommentListItem_comment$data = WorkOrderCommentListItem_comment;
export type WorkOrderCommentListItem_comment$key = {
  +$data?: WorkOrderCommentListItem_comment$data,
  +$fragmentRefs: WorkOrderCommentListItem_comment$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderCommentListItem_comment",
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
      "name": "text",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createTime",
      "storageKey": null
    }
  ],
  "type": "Comment"
};
// prettier-ignore
(node/*: any*/).hash = '9013e94be260328092713c5aaca69700';

module.exports = node;
