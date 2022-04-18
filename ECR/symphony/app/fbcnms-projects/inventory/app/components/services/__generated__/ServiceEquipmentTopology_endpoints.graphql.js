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
declare export opaque type ServiceEquipmentTopology_endpoints$ref: FragmentReference;
declare export opaque type ServiceEquipmentTopology_endpoints$fragmentType: ServiceEquipmentTopology_endpoints$ref;
export type ServiceEquipmentTopology_endpoints = $ReadOnlyArray<{|
  +definition: {|
    +role: ?string
  |},
  +equipment: {|
    +id: string,
    +positionHierarchy: $ReadOnlyArray<{|
      +parentEquipment: {|
        +id: string
      |}
    |}>,
  |},
  +$refType: ServiceEquipmentTopology_endpoints$ref,
|}>;
export type ServiceEquipmentTopology_endpoints$data = ServiceEquipmentTopology_endpoints;
export type ServiceEquipmentTopology_endpoints$key = $ReadOnlyArray<{
  +$data?: ServiceEquipmentTopology_endpoints$data,
  +$fragmentRefs: ServiceEquipmentTopology_endpoints$ref,
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "ServiceEquipmentTopology_endpoints",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ServiceEndpointDefinition",
      "kind": "LinkedField",
      "name": "definition",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "role",
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
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPosition",
          "kind": "LinkedField",
          "name": "positionHierarchy",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Equipment",
              "kind": "LinkedField",
              "name": "parentEquipment",
              "plural": false,
              "selections": [
                (v0/*: any*/)
              ],
              "storageKey": null
            }
          ],
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
(node/*: any*/).hash = '085a9519bd88793b015ab955f716fb5f';

module.exports = node;
