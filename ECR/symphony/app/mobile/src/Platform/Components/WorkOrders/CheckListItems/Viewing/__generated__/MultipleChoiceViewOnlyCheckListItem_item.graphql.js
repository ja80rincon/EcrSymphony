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
declare export opaque type MultipleChoiceViewOnlyCheckListItem_item$ref: FragmentReference;
declare export opaque type MultipleChoiceViewOnlyCheckListItem_item$fragmentType: MultipleChoiceViewOnlyCheckListItem_item$ref;
export type MultipleChoiceViewOnlyCheckListItem_item = {|
  +id: string,
  +title: string,
  +selectedEnumValues: ?string,
  +$refType: MultipleChoiceViewOnlyCheckListItem_item$ref,
|};
export type MultipleChoiceViewOnlyCheckListItem_item$data = MultipleChoiceViewOnlyCheckListItem_item;
export type MultipleChoiceViewOnlyCheckListItem_item$key = {
  +$data?: MultipleChoiceViewOnlyCheckListItem_item$data,
  +$fragmentRefs: MultipleChoiceViewOnlyCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MultipleChoiceViewOnlyCheckListItem_item",
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
      "name": "selectedEnumValues",
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '1e8f4346d07d8bef4a2455774f04e898';

module.exports = node;
