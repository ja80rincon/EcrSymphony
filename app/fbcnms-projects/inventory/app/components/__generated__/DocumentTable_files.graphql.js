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
type FileAttachment_file$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DocumentTable_files$ref: FragmentReference;
declare export opaque type DocumentTable_files$fragmentType: DocumentTable_files$ref;
export type DocumentTable_files = $ReadOnlyArray<{|
  +id: string,
  +fileName: string,
  +category: ?string,
  +$fragmentRefs: FileAttachment_file$ref,
  +$refType: DocumentTable_files$ref,
|}>;
export type DocumentTable_files$data = DocumentTable_files;
export type DocumentTable_files$key = $ReadOnlyArray<{
  +$data?: DocumentTable_files$data,
  +$fragmentRefs: DocumentTable_files$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "DocumentTable_files",
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
      "name": "fileName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "category",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FileAttachment_file"
    }
  ],
  "type": "File",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '171a55fcd66fd996e20dd78e3d3db780';

module.exports = node;
