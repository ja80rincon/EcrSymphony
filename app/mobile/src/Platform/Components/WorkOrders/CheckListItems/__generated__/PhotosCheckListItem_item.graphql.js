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
declare export opaque type PhotosCheckListItem_item$ref: FragmentReference;
declare export opaque type PhotosCheckListItem_item$fragmentType: PhotosCheckListItem_item$ref;
export type PhotosCheckListItem_item = {|
  +id: string,
  +title: string,
  +helpText: ?string,
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
  +$refType: PhotosCheckListItem_item$ref,
|};
export type PhotosCheckListItem_item$data = PhotosCheckListItem_item;
export type PhotosCheckListItem_item$key = {
  +$data?: PhotosCheckListItem_item$data,
  +$fragmentRefs: PhotosCheckListItem_item$ref,
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
  "name": "PhotosCheckListItem_item",
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
      "kind": "ScalarField",
      "name": "helpText",
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
(node/*: any*/).hash = 'a34867c8fb9492f450d29202de6d6c4b';

module.exports = node;
