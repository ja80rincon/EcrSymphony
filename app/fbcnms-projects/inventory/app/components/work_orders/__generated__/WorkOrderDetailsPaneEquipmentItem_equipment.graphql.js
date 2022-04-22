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
declare export opaque type WorkOrderDetailsPaneEquipmentItem_equipment$ref: FragmentReference;
declare export opaque type WorkOrderDetailsPaneEquipmentItem_equipment$fragmentType: WorkOrderDetailsPaneEquipmentItem_equipment$ref;
export type WorkOrderDetailsPaneEquipmentItem_equipment = {|
  +id: string,
  +name: string,
  +equipmentType: {|
    +id: string,
    +name: string,
  |},
  +parentLocation: ?{|
    +id: string,
    +name: string,
    +locationType: {|
      +id: string,
      +name: string,
    |},
  |},
  +parentPosition: ?{|
    +id: string,
    +definition: {|
      +name: string,
      +visibleLabel: ?string,
    |},
    +parentEquipment: {|
      +id: string,
      +name: string,
    |},
  |},
  +$refType: WorkOrderDetailsPaneEquipmentItem_equipment$ref,
|};
export type WorkOrderDetailsPaneEquipmentItem_equipment$data = WorkOrderDetailsPaneEquipmentItem_equipment;
export type WorkOrderDetailsPaneEquipmentItem_equipment$key = {
  +$data?: WorkOrderDetailsPaneEquipmentItem_equipment$data,
  +$fragmentRefs: WorkOrderDetailsPaneEquipmentItem_equipment$ref,
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
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderDetailsPaneEquipmentItem_equipment",
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
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "parentLocation",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "LocationType",
          "kind": "LinkedField",
          "name": "locationType",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPosition",
      "kind": "LinkedField",
      "name": "parentPosition",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPositionDefinition",
          "kind": "LinkedField",
          "name": "definition",
          "plural": false,
          "selections": [
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "visibleLabel",
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
          "selections": (v2/*: any*/),
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
(node/*: any*/).hash = '50466f4314e67740e00fa80dc786d8e8';

module.exports = node;
