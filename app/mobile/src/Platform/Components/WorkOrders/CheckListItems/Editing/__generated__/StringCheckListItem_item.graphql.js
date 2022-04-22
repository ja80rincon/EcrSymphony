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
  +isMandatory: ?boolean,
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
      "name": "isMandatory",
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
(node/*: any*/).hash = '97d53ae855cc8aea1367eba5e19ce32b';

module.exports = node;
