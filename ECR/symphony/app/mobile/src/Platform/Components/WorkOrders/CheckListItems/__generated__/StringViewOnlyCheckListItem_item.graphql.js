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
declare export opaque type StringViewOnlyCheckListItem_item$ref: FragmentReference;
declare export opaque type StringViewOnlyCheckListItem_item$fragmentType: StringViewOnlyCheckListItem_item$ref;
export type StringViewOnlyCheckListItem_item = {|
  +id: string,
  +title: string,
  +stringValue: ?string,
  +$refType: StringViewOnlyCheckListItem_item$ref,
|};
export type StringViewOnlyCheckListItem_item$data = StringViewOnlyCheckListItem_item;
export type StringViewOnlyCheckListItem_item$key = {
  +$data?: StringViewOnlyCheckListItem_item$data,
  +$fragmentRefs: StringViewOnlyCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StringViewOnlyCheckListItem_item",
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
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "stringValue",
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '6253d88dddff0325717fe2c76d5c25d6';

module.exports = node;
