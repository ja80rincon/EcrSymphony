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
export type FutureState = "INSTALL" | "REMOVE" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type PowerSearchLinkFirstEquipmentResultsTable_equipment$ref: FragmentReference;
declare export opaque type PowerSearchLinkFirstEquipmentResultsTable_equipment$fragmentType: PowerSearchLinkFirstEquipmentResultsTable_equipment$ref;
export type PowerSearchLinkFirstEquipmentResultsTable_equipment = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +futureState: ?FutureState,
  +equipmentType: {|
    +id: string,
    +name: string,
  |},
  +$fragmentRefs: EquipmentBreadcrumbs_equipment$ref,
  +$refType: PowerSearchLinkFirstEquipmentResultsTable_equipment$ref,
|}>;
export type PowerSearchLinkFirstEquipmentResultsTable_equipment$data = PowerSearchLinkFirstEquipmentResultsTable_equipment;
export type PowerSearchLinkFirstEquipmentResultsTable_equipment$key = $ReadOnlyArray<{
  +$data?: PowerSearchLinkFirstEquipmentResultsTable_equipment$data,
  +$fragmentRefs: PowerSearchLinkFirstEquipmentResultsTable_equipment$ref,
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
  "name": "PowerSearchLinkFirstEquipmentResultsTable_equipment",
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
      "concreteType": "EquipmentType",
      "kind": "LinkedField",
      "name": "equipmentType",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EquipmentBreadcrumbs_equipment"
    }
  ],
  "type": "Equipment",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '1716ce00a6510aae7310a382182ce067';

module.exports = node;
