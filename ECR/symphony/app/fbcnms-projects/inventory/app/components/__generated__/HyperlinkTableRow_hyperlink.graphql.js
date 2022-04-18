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
type HyperlinkTableMenu_hyperlink$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type HyperlinkTableRow_hyperlink$ref: FragmentReference;
declare export opaque type HyperlinkTableRow_hyperlink$fragmentType: HyperlinkTableRow_hyperlink$ref;
export type HyperlinkTableRow_hyperlink = {|
  +id: string,
  +category: ?string,
  +url: string,
  +displayName: ?string,
  +createTime: any,
  +documentCategory: ?{|
    +id: string,
    +name: ?string,
  |},
  +$fragmentRefs: HyperlinkTableMenu_hyperlink$ref,
  +$refType: HyperlinkTableRow_hyperlink$ref,
|};
export type HyperlinkTableRow_hyperlink$data = HyperlinkTableRow_hyperlink;
export type HyperlinkTableRow_hyperlink$key = {
  +$data?: HyperlinkTableRow_hyperlink$data,
  +$fragmentRefs: HyperlinkTableRow_hyperlink$ref,
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
  "name": "HyperlinkTableRow_hyperlink",
  "selections": [
    (v0/*: any*/),
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createTime",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DocumentCategory",
      "kind": "LinkedField",
      "name": "documentCategory",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "HyperlinkTableMenu_hyperlink"
    }
  ],
  "type": "Hyperlink",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ef14736933385473d66c5a8a57f3634b';

module.exports = node;
