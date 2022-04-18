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
type ServiceEndpointsView_endpoints$ref = any;
type ServiceLinksAndPortsView_links$ref = any;
type ServiceLinksAndPortsView_ports$ref = any;
export type DiscoveryMethod = "INVENTORY" | "MANUAL" | "%future added value";
export type ServiceStatus = "DISCONNECTED" | "IN_SERVICE" | "MAINTENANCE" | "PENDING" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ServicePanel_service$ref: FragmentReference;
declare export opaque type ServicePanel_service$fragmentType: ServicePanel_service$ref;
export type ServicePanel_service = {|
  +id: string,
  +name: string,
  +externalId: ?string,
  +status: ServiceStatus,
  +customer: ?{|
    +name: string
  |},
  +serviceType: {|
    +name: string,
    +discoveryMethod: DiscoveryMethod,
    +endpointDefinitions: $ReadOnlyArray<{|
      +id: string,
      +name: string,
      +role: ?string,
      +equipmentType: {|
        +id: string,
        +name: string,
      |},
    |}>,
  |},
  +links: $ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: ServiceLinksAndPortsView_links$ref,
  |}>,
  +ports: $ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: ServiceLinksAndPortsView_ports$ref,
  |}>,
  +endpoints: $ReadOnlyArray<?{|
    +id: string,
    +definition: {|
      +id: string,
      +name: string,
    |},
    +$fragmentRefs: ServiceEndpointsView_endpoints$ref,
  |}>,
  +$refType: ServicePanel_service$ref,
|};
export type ServicePanel_service$data = ServicePanel_service;
export type ServicePanel_service$key = {
  +$data?: ServicePanel_service$data,
  +$fragmentRefs: ServicePanel_service$ref,
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
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ServicePanel_service",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "externalId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Customer",
      "kind": "LinkedField",
      "name": "customer",
      "plural": false,
      "selections": [
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ServiceType",
      "kind": "LinkedField",
      "name": "serviceType",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "discoveryMethod",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ServiceEndpointDefinition",
          "kind": "LinkedField",
          "name": "endpointDefinitions",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "role",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "EquipmentType",
              "kind": "LinkedField",
              "name": "equipmentType",
              "plural": false,
              "selections": (v2/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Link",
      "kind": "LinkedField",
      "name": "links",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ServiceLinksAndPortsView_links"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPort",
      "kind": "LinkedField",
      "name": "ports",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ServiceLinksAndPortsView_ports"
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
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "ServiceEndpointDefinition",
          "kind": "LinkedField",
          "name": "definition",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ServiceEndpointsView_endpoints"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Service",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '462ddda2544779eb7db1b972279683c5';

module.exports = node;
