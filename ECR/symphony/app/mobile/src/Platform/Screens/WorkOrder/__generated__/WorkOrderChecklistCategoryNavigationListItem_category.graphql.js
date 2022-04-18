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
declare export opaque type WorkOrderChecklistCategoryNavigationListItem_category$ref: FragmentReference;
declare export opaque type WorkOrderChecklistCategoryNavigationListItem_category$fragmentType: WorkOrderChecklistCategoryNavigationListItem_category$ref;
export type WorkOrderChecklistCategoryNavigationListItem_category = {|
  +id: string,
  +title: string,
  +description: ?string,
  +$refType: WorkOrderChecklistCategoryNavigationListItem_category$ref,
|};
export type WorkOrderChecklistCategoryNavigationListItem_category$data = WorkOrderChecklistCategoryNavigationListItem_category;
export type WorkOrderChecklistCategoryNavigationListItem_category$key = {
  +$data?: WorkOrderChecklistCategoryNavigationListItem_category$data,
  +$fragmentRefs: WorkOrderChecklistCategoryNavigationListItem_category$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderChecklistCategoryNavigationListItem_category",
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
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "CheckListCategory"
};
// prettier-ignore
(node/*: any*/).hash = '4ddc4ca67e7411238e7f18cb3af43423';

module.exports = node;
