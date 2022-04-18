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
declare export opaque type EquipmentServicesTable_equipment$ref: FragmentReference;
declare export opaque type EquipmentServicesTable_equipment$fragmentType: EquipmentServicesTable_equipment$ref;
export type EquipmentServicesTable_equipment = {|
  +id: string,
  +name: string,
  +services: $ReadOnlyArray<?{|
    +id: string,
    +name: string,
    +externalId: ?string,
    +customer: ?{|
      +name: string
    |},
    +serviceType: {|
      +id: string,
      +name: string,
    |},
  |}>,
  +$refType: EquipmentServicesTable_equipment$ref,
|};
export type EquipmentServicesTable_equipment$data = EquipmentServicesTable_equipment;
export type EquipmentServicesTable_equipment$key = {
  +$data?: EquipmentServicesTable_equipment$data,
  +$fragmentRefs: EquipmentServicesTable_equipment$ref,
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EquipmentServicesTable_equipment",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Service",
      "kind": "LinkedField",
      "name": "services",
      "plural": true,
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
            (v0/*: any*/),
            (v1/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Equipment",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '26ffdbf9cc9e158c631da821bc4d0393';

module.exports = node;
