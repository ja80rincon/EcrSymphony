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
declare export opaque type PhotosSection_images$ref: FragmentReference;
declare export opaque type PhotosSection_images$fragmentType: PhotosSection_images$ref;
export type PhotosSection_images = $ReadOnlyArray<{|
  +id: string,
  +storeKey: ?string,
  +$refType: PhotosSection_images$ref,
|}>;
export type PhotosSection_images$data = PhotosSection_images;
export type PhotosSection_images$key = $ReadOnlyArray<{
  +$data?: PhotosSection_images$data,
  +$fragmentRefs: PhotosSection_images$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "PhotosSection_images",
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
      "name": "storeKey",
      "storageKey": null
    }
  ],
  "type": "File"
};
// prettier-ignore
(node/*: any*/).hash = 'd151152bbe5297d29c9d3c59179a131e';

module.exports = node;
