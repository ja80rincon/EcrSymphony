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
declare export opaque type SimpleViewOnlyCheckListItem_item$ref: FragmentReference;
declare export opaque type SimpleViewOnlyCheckListItem_item$fragmentType: SimpleViewOnlyCheckListItem_item$ref;
export type SimpleViewOnlyCheckListItem_item = {|
  +id: string,
  +title: string,
  +checked: ?boolean,
  +$refType: SimpleViewOnlyCheckListItem_item$ref,
|};
export type SimpleViewOnlyCheckListItem_item$data = SimpleViewOnlyCheckListItem_item;
export type SimpleViewOnlyCheckListItem_item$key = {
  +$data?: SimpleViewOnlyCheckListItem_item$data,
  +$fragmentRefs: SimpleViewOnlyCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SimpleViewOnlyCheckListItem_item",
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
      "name": "checked",
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '7939e4449730adb4da9967715a3b197c';

module.exports = node;
