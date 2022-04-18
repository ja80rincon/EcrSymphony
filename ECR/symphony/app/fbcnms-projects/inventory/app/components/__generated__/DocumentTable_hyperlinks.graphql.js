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
type HyperlinkTableRow_hyperlink$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DocumentTable_hyperlinks$ref: FragmentReference;
declare export opaque type DocumentTable_hyperlinks$fragmentType: DocumentTable_hyperlinks$ref;
export type DocumentTable_hyperlinks = $ReadOnlyArray<{|
  +id: string,
  +category: ?string,
  +url: string,
  +displayName: ?string,
  +$fragmentRefs: HyperlinkTableRow_hyperlink$ref,
  +$refType: DocumentTable_hyperlinks$ref,
|}>;
export type DocumentTable_hyperlinks$data = DocumentTable_hyperlinks;
export type DocumentTable_hyperlinks$key = $ReadOnlyArray<{
  +$data?: DocumentTable_hyperlinks$data,
  +$fragmentRefs: DocumentTable_hyperlinks$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "DocumentTable_hyperlinks",
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
      "name": "category",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayName",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "HyperlinkTableRow_hyperlink"
    }
  ],
  "type": "Hyperlink",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'c9ea5f1896114cd428384654f0979a5e';

module.exports = node;
