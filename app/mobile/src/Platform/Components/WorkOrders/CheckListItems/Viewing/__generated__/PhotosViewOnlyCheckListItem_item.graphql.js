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
declare export opaque type PhotosViewOnlyCheckListItem_item$ref: FragmentReference;
declare export opaque type PhotosViewOnlyCheckListItem_item$fragmentType: PhotosViewOnlyCheckListItem_item$ref;
export type PhotosViewOnlyCheckListItem_item = {|
  +id: string,
  +title: string,
  +files: ?$ReadOnlyArray<{|
    +id: string,
    +fileName: string,
    +storeKey: ?string,
    +mimeType: ?string,
    +sizeInBytes: ?number,
    +modified: ?any,
    +uploaded: ?any,
    +annotation: ?string,
  |}>,
  +$refType: PhotosViewOnlyCheckListItem_item$ref,
|};
export type PhotosViewOnlyCheckListItem_item$data = PhotosViewOnlyCheckListItem_item;
export type PhotosViewOnlyCheckListItem_item$key = {
  +$data?: PhotosViewOnlyCheckListItem_item$data,
  +$fragmentRefs: PhotosViewOnlyCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PhotosViewOnlyCheckListItem_item",
  "selections": [
    (v0/*: any*/),
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
      "concreteType": "File",
      "kind": "LinkedField",
      "name": "files",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fileName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "storeKey",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "mimeType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "sizeInBytes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "modified",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "uploaded",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "annotation",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CheckListItem"
};
})();
// prettier-ignore
(node/*: any*/).hash = '36f2b6343c9d0b80bb66f3e505b8ad02';

module.exports = node;
