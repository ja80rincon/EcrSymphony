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
declare export opaque type YesNoCheckListItem_item$ref: FragmentReference;
declare export opaque type YesNoCheckListItem_item$fragmentType: YesNoCheckListItem_item$ref;
export type YesNoCheckListItem_item = {|
  +id: string,
  +title: string,
  +helpText: ?string,
  +yesNoResponse: ?YesNoResponse,
  +$refType: YesNoCheckListItem_item$ref,
|};
export type YesNoCheckListItem_item$data = YesNoCheckListItem_item;
export type YesNoCheckListItem_item$key = {
  +$data?: YesNoCheckListItem_item$data,
  +$fragmentRefs: YesNoCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "YesNoCheckListItem_item",
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
      "name": "helpText",
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
(node/*: any*/).hash = 'fef105680c49ebfb3673b057d4da3818';

module.exports = node;
