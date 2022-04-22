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
type ServiceDetailsPanel_service$ref = any;
type ServiceEquipmentTopology_endpoints$ref = any;
type ServiceEquipmentTopology_topology$ref = any;
type ServicePanel_service$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type ServiceCard_service$ref: FragmentReference;
declare export opaque type ServiceCard_service$fragmentType: ServiceCard_service$ref;
export type ServiceCard_service = {|
  +id: string,
  +name: string,
  +topology: {|
    +$fragmentRefs: ServiceEquipmentTopology_topology$ref
  |},
  +endpoints: $ReadOnlyArray<?{|
    +$fragmentRefs: ServiceEquipmentTopology_endpoints$ref
  |}>,
  +$fragmentRefs: ServiceDetailsPanel_service$ref & ServicePanel_service$ref,
  +$refType: ServiceCard_service$ref,
|};
export type ServiceCard_service$data = ServiceCard_service;
export type ServiceCard_service$key = {
  +$data?: ServiceCard_service$data,
  +$fragmentRefs: ServiceCard_service$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ServiceCard_service",
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "NetworkTopology",
      "kind": "LinkedField",
      "name": "topology",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ServiceEquipmentTopology_topology"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ServiceEndpoint",
      "kind": "LinkedField",
      "name": "endpoints",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ServiceEquipmentTopology_endpoints"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ServiceDetailsPanel_service"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ServicePanel_service"
    }
  ],
  "type": "Service",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'b365b307bdc31d3d737c3f7f1b6d33fe';

module.exports = node;
