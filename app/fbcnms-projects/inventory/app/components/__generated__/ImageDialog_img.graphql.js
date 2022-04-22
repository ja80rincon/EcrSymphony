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
declare export opaque type ImageDialog_img$ref: FragmentReference;
declare export opaque type ImageDialog_img$fragmentType: ImageDialog_img$ref;
export type ImageDialog_img = {|
  +storeKey: ?string,
  +fileName: string,
  +$refType: ImageDialog_img$ref,
|};
export type ImageDialog_img$data = ImageDialog_img;
export type ImageDialog_img$key = {
  +$data?: ImageDialog_img$data,
  +$fragmentRefs: ImageDialog_img$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ImageDialog_img",
  "selections": [
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
      "name": "fileName",
      "storageKey": null
    }
  ],
  "type": "File",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '9df3ae53271a85ffc0bd704420104cc5';

module.exports = node;
