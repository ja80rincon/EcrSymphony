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
declare export opaque type FlowSettings_flowDraft$ref: FragmentReference;
declare export opaque type FlowSettings_flowDraft$fragmentType: FlowSettings_flowDraft$ref;
export type FlowSettings_flowDraft = {|
  +name: string,
  +description: ?string,
  +$refType: FlowSettings_flowDraft$ref,
|};
export type FlowSettings_flowDraft$data = FlowSettings_flowDraft;
export type FlowSettings_flowDraft$key = {
  +$data?: FlowSettings_flowDraft$data,
  +$fragmentRefs: FlowSettings_flowDraft$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FlowSettings_flowDraft",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "FlowDraft",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '0be87cce99ace6b9eb97213537f38965';

module.exports = node;
