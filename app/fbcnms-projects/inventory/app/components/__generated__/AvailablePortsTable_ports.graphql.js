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
declare export opaque type AvailablePortsTable_ports$ref: FragmentReference;
declare export opaque type AvailablePortsTable_ports$fragmentType: AvailablePortsTable_ports$ref;
export type AvailablePortsTable_ports = $ReadOnlyArray<{|
  +id: string,
  +parentEquipment: {|
    +id: string,
    +name: string,
    +$fragmentRefs: EquipmentBreadcrumbs_equipment$ref,
  |},
  +definition: {|
    +id: string,
    +name: string,
    +portType: ?{|
      +name: string
    |},
    +visibleLabel: ?string,
  |},
  +$refType: AvailablePortsTable_ports$ref,
|}>;
export type AvailablePortsTable_ports$data = AvailablePortsTable_ports;
export type AvailablePortsTable_ports$key = $ReadOnlyArray<{
  +$data?: AvailablePortsTable_ports$data,
  +$fragmentRefs: AvailablePortsTable_ports$ref,
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
  "name": "AvailablePortsTable_ports",
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "EquipmentBreadcrumbs_equipment"
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
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPortType",
          "kind": "LinkedField",
          "name": "portType",
          "plural": false,
          "selections": [
            (v1/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "visibleLabel",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "EquipmentPort",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '28fb7ac76ca11ecf2ff60dae1869a25b';

module.exports = node;
