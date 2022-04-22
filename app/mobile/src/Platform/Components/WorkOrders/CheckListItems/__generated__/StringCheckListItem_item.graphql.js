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
declare export opaque type StringCheckListItem_item$ref: FragmentReference;
declare export opaque type StringCheckListItem_item$fragmentType: StringCheckListItem_item$ref;
export type StringCheckListItem_item = {|
  +id: string,
  +title: string,
  +helpText: ?string,
  +stringValue: ?string,
  +$refType: StringCheckListItem_item$ref,
|};
export type StringCheckListItem_item$data = StringCheckListItem_item;
export type StringCheckListItem_item$key = {
  +$data?: StringCheckListItem_item$data,
  +$fragmentRefs: StringCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StringCheckListItem_item",
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
      "name": "stringValue",
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '086a66a5e45d4cb2ab9c15fe397f6538';

module.exports = node;
