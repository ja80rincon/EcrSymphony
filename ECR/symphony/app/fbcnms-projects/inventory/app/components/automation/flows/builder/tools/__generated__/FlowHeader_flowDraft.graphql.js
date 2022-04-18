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
declare export opaque type FlowHeader_flowDraft$ref: FragmentReference;
declare export opaque type FlowHeader_flowDraft$fragmentType: FlowHeader_flowDraft$ref;
export type FlowHeader_flowDraft = {|
  +name: string,
  +$refType: FlowHeader_flowDraft$ref,
|};
export type FlowHeader_flowDraft$data = FlowHeader_flowDraft;
export type FlowHeader_flowDraft$key = {
  +$data?: FlowHeader_flowDraft$data,
  +$fragmentRefs: FlowHeader_flowDraft$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FlowHeader_flowDraft",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "FlowDraft",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '8a09a4fba597f491788768174bdc95a6';

module.exports = node;
