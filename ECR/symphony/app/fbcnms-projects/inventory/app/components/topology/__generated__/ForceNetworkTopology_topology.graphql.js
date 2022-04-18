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
declare export opaque type ForceNetworkTopology_topology$ref: FragmentReference;
declare export opaque type ForceNetworkTopology_topology$fragmentType: ForceNetworkTopology_topology$ref;
export type ForceNetworkTopology_topology = {|
  +nodes: $ReadOnlyArray<{|
    +id: string
  |}>,
  +links: $ReadOnlyArray<{|
    +source: {|
      +id: string
    |},
    +target: {|
      +id: string
    |},
  |}>,
  +$refType: ForceNetworkTopology_topology$ref,
|};
export type ForceNetworkTopology_topology$data = ForceNetworkTopology_topology;
export type ForceNetworkTopology_topology$key = {
  +$data?: ForceNetworkTopology_topology$data,
  +$fragmentRefs: ForceNetworkTopology_topology$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ForceNetworkTopology_topology",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "nodes",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TopologyLink",
      "kind": "LinkedField",
      "name": "links",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "source",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "target",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "NetworkTopology",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '63b721aff87697366221cbc6250df26e';

module.exports = node;
