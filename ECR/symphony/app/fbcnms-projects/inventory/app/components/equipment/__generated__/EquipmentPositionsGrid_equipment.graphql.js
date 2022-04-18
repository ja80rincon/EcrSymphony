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
type AddToEquipmentDialog_parentEquipment$ref = any;
export type FutureState = "INSTALL" | "REMOVE" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type EquipmentPositionsGrid_equipment$ref: FragmentReference;
declare export opaque type EquipmentPositionsGrid_equipment$fragmentType: EquipmentPositionsGrid_equipment$ref;
export type EquipmentPositionsGrid_equipment = {|
  +id: string,
  +positions: $ReadOnlyArray<?{|
    +id: string,
    +definition: {|
      +id: string,
      +name: string,
      +index: ?number,
      +visibleLabel: ?string,
    |},
    +attachedEquipment: ?{|
      +id: string,
      +name: string,
      +futureState: ?FutureState,
      +services: $ReadOnlyArray<?{|
        +id: string
      |}>,
    |},
    +parentEquipment: {|
      +id: string
    |},
  |}>,
  +equipmentType: {|
    +positionDefinitions: $ReadOnlyArray<?{|
      +id: string,
      +name: string,
      +index: ?number,
      +visibleLabel: ?string,
    |}>
  |},
  +$fragmentRefs: AddToEquipmentDialog_parentEquipment$ref,
  +$refType: EquipmentPositionsGrid_equipment$ref,
|};
export type EquipmentPositionsGrid_equipment$data = EquipmentPositionsGrid_equipment;
export type EquipmentPositionsGrid_equipment$key = {
  +$data?: EquipmentPositionsGrid_equipment$data,
  +$fragmentRefs: EquipmentPositionsGrid_equipment$ref,
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
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "index",
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
v3 = [
  (v0/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EquipmentPositionsGrid_equipment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPosition",
      "kind": "LinkedField",
      "name": "positions",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPositionDefinition",
          "kind": "LinkedField",
          "name": "definition",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Equipment",
          "kind": "LinkedField",
          "name": "attachedEquipment",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "futureState",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Service",
              "kind": "LinkedField",
              "name": "services",
              "plural": true,
              "selections": (v3/*: any*/),
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
          "name": "parentEquipment",
          "plural": false,
          "selections": (v3/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentType",
      "kind": "LinkedField",
      "name": "equipmentType",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPositionDefinition",
          "kind": "LinkedField",
          "name": "positionDefinitions",
          "plural": true,
          "selections": (v2/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AddToEquipmentDialog_parentEquipment"
    }
  ],
  "type": "Equipment",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c4ed56ad25227e14dccf883ee79b3e2d';

module.exports = node;
