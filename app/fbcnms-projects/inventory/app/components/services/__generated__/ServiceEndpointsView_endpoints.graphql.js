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
type EquipmentBreadcrumbs_equipment$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type ServiceEndpointsView_endpoints$ref: FragmentReference;
declare export opaque type ServiceEndpointsView_endpoints$fragmentType: ServiceEndpointsView_endpoints$ref;
export type ServiceEndpointsView_endpoints = $ReadOnlyArray<{|
  +id: string,
  +port: ?{|
    +parentEquipment: {|
      +name: string,
      +$fragmentRefs: EquipmentBreadcrumbs_equipment$ref,
    |},
    +definition: {|
      +id: string,
      +name: string,
    |},
  |},
  +equipment: {|
    +name: string,
    +$fragmentRefs: EquipmentBreadcrumbs_equipment$ref,
  |},
  +definition: {|
    +name: string,
    +role: ?string,
  |},
  +$refType: ServiceEndpointsView_endpoints$ref,
|}>;
export type ServiceEndpointsView_endpoints$data = ServiceEndpointsView_endpoints;
export type ServiceEndpointsView_endpoints$key = $ReadOnlyArray<{
  +$data?: ServiceEndpointsView_endpoints$data,
  +$fragmentRefs: ServiceEndpointsView_endpoints$ref,
  ...
}>;
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
  (v1/*: any*/),
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "EquipmentBreadcrumbs_equipment"
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "ServiceEndpointsView_endpoints",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPort",
      "kind": "LinkedField",
      "name": "port",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Equipment",
          "kind": "LinkedField",
          "name": "parentEquipment",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPortDefinition",
          "kind": "LinkedField",
          "name": "definition",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Equipment",
      "kind": "LinkedField",
      "name": "equipment",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ServiceEndpointDefinition",
      "kind": "LinkedField",
      "name": "definition",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "role",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ServiceEndpoint",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c9bdfa0f5793f7884b71103e23e3c420';

module.exports = node;
