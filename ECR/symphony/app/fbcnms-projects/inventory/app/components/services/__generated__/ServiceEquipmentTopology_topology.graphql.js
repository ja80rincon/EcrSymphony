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
type ForceNetworkTopology_topology$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type ServiceEquipmentTopology_topology$ref: FragmentReference;
declare export opaque type ServiceEquipmentTopology_topology$fragmentType: ServiceEquipmentTopology_topology$ref;
export type ServiceEquipmentTopology_topology = {|
  +nodes: $ReadOnlyArray<{|
    +id?: string,
    +name?: string,
  |}>,
  +$fragmentRefs: ForceNetworkTopology_topology$ref,
  +$refType: ServiceEquipmentTopology_topology$ref,
|};
export type ServiceEquipmentTopology_topology$data = ServiceEquipmentTopology_topology;
export type ServiceEquipmentTopology_topology$key = {
  +$data?: ServiceEquipmentTopology_topology$data,
  +$fragmentRefs: ServiceEquipmentTopology_topology$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ServiceEquipmentTopology_topology",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "nodes",
      "plural": true,
      "selections": [
        {
          "kind": "InlineFragment",
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
              "name": "name",
              "storageKey": null
            }
          ],
          "type": "Equipment",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ForceNetworkTopology_topology"
    }
  ],
  "type": "NetworkTopology",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '3aacf7059c6ccea42895132c69cbb030';

module.exports = node;
