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
type PortDefinitionsTable_portDefinitions$ref = any;
type PositionDefinitionsTable_positionDefinitions$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type EquipmentTypeItem_equipmentType$ref: FragmentReference;
declare export opaque type EquipmentTypeItem_equipmentType$fragmentType: EquipmentTypeItem_equipmentType$ref;
export type EquipmentTypeItem_equipmentType = {|
  +id: string,
  +name: string,
  +propertyTypes: $ReadOnlyArray<?{|
    +$fragmentRefs: DynamicPropertyTypesGrid_propertyTypes$ref
  |}>,
  +positionDefinitions: $ReadOnlyArray<?{|
    +$fragmentRefs: PositionDefinitionsTable_positionDefinitions$ref
  |}>,
  +portDefinitions: $ReadOnlyArray<?{|
    +$fragmentRefs: PortDefinitionsTable_portDefinitions$ref
  |}>,
  +numberOfEquipment: number,
  +$refType: EquipmentTypeItem_equipmentType$ref,
|};
export type EquipmentTypeItem_equipmentType$data = EquipmentTypeItem_equipmentType;
export type EquipmentTypeItem_equipmentType$key = {
  +$data?: EquipmentTypeItem_equipmentType$data,
  +$fragmentRefs: EquipmentTypeItem_equipmentType$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EquipmentTypeItem_equipmentType",
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
      "concreteType": "PropertyType",
      "kind": "LinkedField",
      "name": "propertyTypes",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "DynamicPropertyTypesGrid_propertyTypes"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPositionDefinition",
      "kind": "LinkedField",
      "name": "positionDefinitions",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "PositionDefinitionsTable_positionDefinitions"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPortDefinition",
      "kind": "LinkedField",
      "name": "portDefinitions",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "PortDefinitionsTable_portDefinitions"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "numberOfEquipment",
      "storageKey": null
    }
  ],
  "type": "EquipmentType",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'c31a356dc2022425956e57facd0ae246';

module.exports = node;
