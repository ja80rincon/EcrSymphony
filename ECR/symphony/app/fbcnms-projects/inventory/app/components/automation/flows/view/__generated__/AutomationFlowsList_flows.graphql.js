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
type AutomationFlowCard_flow$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AutomationFlowsList_flows$ref: FragmentReference;
declare export opaque type AutomationFlowsList_flows$fragmentType: AutomationFlowsList_flows$ref;
export type AutomationFlowsList_flows = $ReadOnlyArray<{|
  +id: string,
  +$fragmentRefs: AutomationFlowCard_flow$ref,
  +$refType: AutomationFlowsList_flows$ref,
|}>;
export type AutomationFlowsList_flows$data = AutomationFlowsList_flows;
export type AutomationFlowsList_flows$key = $ReadOnlyArray<{
  +$data?: AutomationFlowsList_flows$data,
  +$fragmentRefs: AutomationFlowsList_flows$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "AutomationFlowsList_flows",
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
      "name": "AutomationFlowCard_flow"
    }
  ],
  "type": "Flow",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '0ada389a273fe87c90f4a231cae2021b';

module.exports = node;
