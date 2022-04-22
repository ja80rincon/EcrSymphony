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
declare export opaque type ServiceLinksAndPortsView_ports$ref: FragmentReference;
declare export opaque type ServiceLinksAndPortsView_ports$fragmentType: ServiceLinksAndPortsView_ports$ref;
export type ServiceLinksAndPortsView_ports = $ReadOnlyArray<{|
  +id: string,
  +parentEquipment: {|
    +id: string,
    +name: string,
    +equipmentType: {|
      +name: string
    |},
  |},
  +definition: {|
    +id: string,
    +name: string,
  |},
  +$refType: ServiceLinksAndPortsView_ports$ref,
|}>;
export type ServiceLinksAndPortsView_ports$data = ServiceLinksAndPortsView_ports;
export type ServiceLinksAndPortsView_ports$key = $ReadOnlyArray<{
  +$data?: ServiceLinksAndPortsView_ports$data,
  +$fragmentRefs: ServiceLinksAndPortsView_ports$ref,
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "ServiceLinksAndPortsView_ports",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Equipment",
      "kind": "LinkedField",
      "name": "parentEquipment",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentType",
          "kind": "LinkedField",
          "name": "equipmentType",
          "plural": false,
          "selections": [
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
  "type": "EquipmentPort",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '3c5ec3c451149626125b19ee8257c1c4';

module.exports = node;
