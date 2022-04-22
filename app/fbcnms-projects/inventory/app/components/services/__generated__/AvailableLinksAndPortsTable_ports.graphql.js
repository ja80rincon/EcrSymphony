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
declare export opaque type AvailableLinksAndPortsTable_ports$ref: FragmentReference;
declare export opaque type AvailableLinksAndPortsTable_ports$fragmentType: AvailableLinksAndPortsTable_ports$ref;
export type AvailableLinksAndPortsTable_ports = $ReadOnlyArray<{|
  +id: string,
  +parentEquipment: {|
    +id: string,
    +name: string,
    +positionHierarchy: $ReadOnlyArray<{|
      +parentEquipment: {|
        +id: string
      |}
    |}>,
    +$fragmentRefs: EquipmentBreadcrumbs_equipment$ref,
  |},
  +definition: {|
    +id: string,
    +name: string,
  |},
  +$refType: AvailableLinksAndPortsTable_ports$ref,
|}>;
export type AvailableLinksAndPortsTable_ports$data = AvailableLinksAndPortsTable_ports;
export type AvailableLinksAndPortsTable_ports$key = $ReadOnlyArray<{
  +$data?: AvailableLinksAndPortsTable_ports$data,
  +$fragmentRefs: AvailableLinksAndPortsTable_ports$ref,
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
  "name": "AvailableLinksAndPortsTable_ports",
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
        },
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
(node/*: any*/).hash = '4e8a9abce5dd51248563b09c37b80558';

module.exports = node;
