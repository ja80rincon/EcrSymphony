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
type CellScanViewOnlyCheckListItem_item$ref = any;
type MultipleChoiceViewOnlyCheckListItem_item$ref = any;
type PhotosViewOnlyCheckListItem_item$ref = any;
type SimpleViewOnlyCheckListItem_item$ref = any;
type StringViewOnlyCheckListItem_item$ref = any;
type WiFiScanViewOnlyCheckListItem_item$ref = any;
type YesNoViewOnlyCheckListItem_item$ref = any;
export type CheckListItemType = "cell_scan" | "enum" | "files" | "simple" | "string" | "wifi_scan" | "yes_no" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderCheckListItem_item$ref: FragmentReference;
declare export opaque type WorkOrderCheckListItem_item$fragmentType: WorkOrderCheckListItem_item$ref;
export type WorkOrderCheckListItem_item = {|
  +id: string,
  +title: string,
  +type: CheckListItemType,
  +isMandatory: ?boolean,
  +$fragmentRefs: StringViewOnlyCheckListItem_item$ref & SimpleViewOnlyCheckListItem_item$ref & MultipleChoiceViewOnlyCheckListItem_item$ref & YesNoViewOnlyCheckListItem_item$ref & WiFiScanViewOnlyCheckListItem_item$ref & CellScanViewOnlyCheckListItem_item$ref & PhotosViewOnlyCheckListItem_item$ref,
  +$refType: WorkOrderCheckListItem_item$ref,
|};
export type WorkOrderCheckListItem_item$data = WorkOrderCheckListItem_item;
export type WorkOrderCheckListItem_item$key = {
  +$data?: WorkOrderCheckListItem_item$data,
  +$fragmentRefs: WorkOrderCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderCheckListItem_item",
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
      "name": "type",
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "StringViewOnlyCheckListItem_item"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SimpleViewOnlyCheckListItem_item"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MultipleChoiceViewOnlyCheckListItem_item"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "YesNoViewOnlyCheckListItem_item"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WiFiScanViewOnlyCheckListItem_item"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CellScanViewOnlyCheckListItem_item"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PhotosViewOnlyCheckListItem_item"
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '0d9d085f38e14836b5a8bb90a7891c2c';

module.exports = node;
