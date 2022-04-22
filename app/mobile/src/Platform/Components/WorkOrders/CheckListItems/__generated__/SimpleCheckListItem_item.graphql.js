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
declare export opaque type SimpleCheckListItem_item$ref: FragmentReference;
declare export opaque type SimpleCheckListItem_item$fragmentType: SimpleCheckListItem_item$ref;
export type SimpleCheckListItem_item = {|
  +id: string,
  +title: string,
  +helpText: ?string,
  +checked: ?boolean,
  +$refType: SimpleCheckListItem_item$ref,
|};
export type SimpleCheckListItem_item$data = SimpleCheckListItem_item;
export type SimpleCheckListItem_item$key = {
  +$data?: SimpleCheckListItem_item$data,
  +$fragmentRefs: SimpleCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SimpleCheckListItem_item",
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
      "name": "checked",
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '69c4f52ba2045e561dd091d99daffc22';

module.exports = node;
