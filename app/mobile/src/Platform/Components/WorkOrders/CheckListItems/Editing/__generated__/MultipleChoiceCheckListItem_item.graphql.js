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
export type CheckListItemEnumSelectionMode = "multiple" | "single" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type MultipleChoiceCheckListItem_item$ref: FragmentReference;
declare export opaque type MultipleChoiceCheckListItem_item$fragmentType: MultipleChoiceCheckListItem_item$ref;
export type MultipleChoiceCheckListItem_item = {|
  +id: string,
  +title: string,
  +helpText: ?string,
  +isMandatory: ?boolean,
  +enumValues: ?string,
  +selectedEnumValues: ?string,
  +enumSelectionMode: ?CheckListItemEnumSelectionMode,
  +$refType: MultipleChoiceCheckListItem_item$ref,
|};
export type MultipleChoiceCheckListItem_item$data = MultipleChoiceCheckListItem_item;
export type MultipleChoiceCheckListItem_item$key = {
  +$data?: MultipleChoiceCheckListItem_item$data,
  +$fragmentRefs: MultipleChoiceCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MultipleChoiceCheckListItem_item",
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
      "name": "enumValues",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "selectedEnumValues",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "enumSelectionMode",
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '1c5728e91299858feebaa9703587aaa3';

module.exports = node;
