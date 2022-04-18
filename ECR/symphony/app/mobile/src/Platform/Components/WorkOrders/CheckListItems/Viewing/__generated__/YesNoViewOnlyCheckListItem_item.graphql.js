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
export type YesNoResponse = "NO" | "YES" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type YesNoViewOnlyCheckListItem_item$ref: FragmentReference;
declare export opaque type YesNoViewOnlyCheckListItem_item$fragmentType: YesNoViewOnlyCheckListItem_item$ref;
export type YesNoViewOnlyCheckListItem_item = {|
  +id: string,
  +title: string,
  +yesNoResponse: ?YesNoResponse,
  +$refType: YesNoViewOnlyCheckListItem_item$ref,
|};
export type YesNoViewOnlyCheckListItem_item$data = YesNoViewOnlyCheckListItem_item;
export type YesNoViewOnlyCheckListItem_item$key = {
  +$data?: YesNoViewOnlyCheckListItem_item$data,
  +$fragmentRefs: YesNoViewOnlyCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "YesNoViewOnlyCheckListItem_item",
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
      "name": "yesNoResponse",
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = 'f0c994c6526eb8ccb4665c61989a1b5f';

module.exports = node;
