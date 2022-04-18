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
declare export opaque type TextCommentPost_comment$ref: FragmentReference;
declare export opaque type TextCommentPost_comment$fragmentType: TextCommentPost_comment$ref;
export type TextCommentPost_comment = {|
  +id: string,
  +author: {|
    +email: string
  |},
  +text: string,
  +createTime: any,
  +$refType: TextCommentPost_comment$ref,
|};
export type TextCommentPost_comment$data = TextCommentPost_comment;
export type TextCommentPost_comment$key = {
  +$data?: TextCommentPost_comment$data,
  +$fragmentRefs: TextCommentPost_comment$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TextCommentPost_comment",
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
  "type": "Comment",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '2dc0bd1e406e6fde1cdd0196b9b245eb';

module.exports = node;
