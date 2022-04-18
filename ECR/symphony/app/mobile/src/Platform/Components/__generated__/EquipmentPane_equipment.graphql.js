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
declare export opaque type EquipmentPane_equipment$ref: FragmentReference;
declare export opaque type EquipmentPane_equipment$fragmentType: EquipmentPane_equipment$ref;
export type EquipmentPane_equipment = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +equipmentType: {|
    +name: string
  |},
  +$refType: EquipmentPane_equipment$ref,
|}>;
export type EquipmentPane_equipment$data = EquipmentPane_equipment;
export type EquipmentPane_equipment$key = $ReadOnlyArray<{
  +$data?: EquipmentPane_equipment$data,
  +$fragmentRefs: EquipmentPane_equipment$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
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
  "name": "EquipmentPane_equipment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentType",
      "kind": "LinkedField",
      "name": "equipmentType",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Equipment"
};
})();
// prettier-ignore
(node/*: any*/).hash = '1b4e1873924db15147eb39187bde76f7';

module.exports = node;
