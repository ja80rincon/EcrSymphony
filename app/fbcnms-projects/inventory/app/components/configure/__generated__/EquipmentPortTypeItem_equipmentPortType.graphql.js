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
type DynamicPropertyTypesGrid_propertyTypes$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type EquipmentPortTypeItem_equipmentPortType$ref: FragmentReference;
declare export opaque type EquipmentPortTypeItem_equipmentPortType$fragmentType: EquipmentPortTypeItem_equipmentPortType$ref;
export type EquipmentPortTypeItem_equipmentPortType = {|
  +id: string,
  +name: string,
  +numberOfPortDefinitions: number,
  +propertyTypes: $ReadOnlyArray<?{|
    +$fragmentRefs: DynamicPropertyTypesGrid_propertyTypes$ref
  |}>,
  +linkPropertyTypes: $ReadOnlyArray<?{|
    +$fragmentRefs: DynamicPropertyTypesGrid_propertyTypes$ref
  |}>,
  +$refType: EquipmentPortTypeItem_equipmentPortType$ref,
|};
export type EquipmentPortTypeItem_equipmentPortType$data = EquipmentPortTypeItem_equipmentPortType;
export type EquipmentPortTypeItem_equipmentPortType$key = {
  +$data?: EquipmentPortTypeItem_equipmentPortType$data,
  +$fragmentRefs: EquipmentPortTypeItem_equipmentPortType$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "DynamicPropertyTypesGrid_propertyTypes"
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EquipmentPortTypeItem_equipmentPortType",
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
      "kind": "ScalarField",
      "name": "numberOfPortDefinitions",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PropertyType",
      "kind": "LinkedField",
      "name": "propertyTypes",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PropertyType",
      "kind": "LinkedField",
      "name": "linkPropertyTypes",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "EquipmentPortType",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '64680fb091846a1ed120759b8199a89c';

module.exports = node;
