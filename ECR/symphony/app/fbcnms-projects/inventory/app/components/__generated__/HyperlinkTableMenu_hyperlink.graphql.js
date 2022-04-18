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
declare export opaque type HyperlinkTableMenu_hyperlink$ref: FragmentReference;
declare export opaque type HyperlinkTableMenu_hyperlink$fragmentType: HyperlinkTableMenu_hyperlink$ref;
export type HyperlinkTableMenu_hyperlink = {|
  +id: string,
  +displayName: ?string,
  +url: string,
  +$refType: HyperlinkTableMenu_hyperlink$ref,
|};
export type HyperlinkTableMenu_hyperlink$data = HyperlinkTableMenu_hyperlink;
export type HyperlinkTableMenu_hyperlink$key = {
  +$data?: HyperlinkTableMenu_hyperlink$data,
  +$fragmentRefs: HyperlinkTableMenu_hyperlink$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HyperlinkTableMenu_hyperlink",
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
      "name": "displayName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    }
  ],
  "type": "Hyperlink",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '1d16009f99a7a3585100b509e897c1a6';

module.exports = node;
