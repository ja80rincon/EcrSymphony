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
type ImageAttachment_img$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type PhotosGrid_images$ref: FragmentReference;
declare export opaque type PhotosGrid_images$fragmentType: PhotosGrid_images$ref;
export type PhotosGrid_images = $ReadOnlyArray<{|
  +id: string,
  +$fragmentRefs: ImageAttachment_img$ref,
  +$refType: PhotosGrid_images$ref,
|}>;
export type PhotosGrid_images$data = PhotosGrid_images;
export type PhotosGrid_images$key = $ReadOnlyArray<{
  +$data?: PhotosGrid_images$data,
  +$fragmentRefs: PhotosGrid_images$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "PhotosGrid_images",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ImageAttachment_img"
    }
  ],
  "type": "File",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '80a98a9a4d57a8e83e65f977e4b203bb';

module.exports = node;
