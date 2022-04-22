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
type WorkOrderCheckListItem_item$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderViewOnlyCategoryChecklist_category$ref: FragmentReference;
declare export opaque type WorkOrderViewOnlyCategoryChecklist_category$fragmentType: WorkOrderViewOnlyCategoryChecklist_category$ref;
export type WorkOrderViewOnlyCategoryChecklist_category = {|
  +checkList: $ReadOnlyArray<{|
    +id: string,
    +index: ?number,
    +$fragmentRefs: WorkOrderCheckListItem_item$ref,
  |}>,
  +$refType: WorkOrderViewOnlyCategoryChecklist_category$ref,
|};
export type WorkOrderViewOnlyCategoryChecklist_category$data = WorkOrderViewOnlyCategoryChecklist_category;
export type WorkOrderViewOnlyCategoryChecklist_category$key = {
  +$data?: WorkOrderViewOnlyCategoryChecklist_category$data,
  +$fragmentRefs: WorkOrderViewOnlyCategoryChecklist_category$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderViewOnlyCategoryChecklist_category",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CheckListItem",
      "kind": "LinkedField",
      "name": "checkList",
      "plural": true,
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
          "name": "index",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "WorkOrderCheckListItem_item"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CheckListCategory"
};
// prettier-ignore
(node/*: any*/).hash = '78bfa3f3d05293e9d03c08b1b409b57f';

module.exports = node;
