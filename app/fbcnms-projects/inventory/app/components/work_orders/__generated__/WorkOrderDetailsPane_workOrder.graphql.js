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
type WorkOrderDetailsPaneEquipmentItem_equipment$ref = any;
type WorkOrderDetailsPaneLinkItem_link$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderDetailsPane_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderDetailsPane_workOrder$fragmentType: WorkOrderDetailsPane_workOrder$ref;
export type WorkOrderDetailsPane_workOrder = {|
  +id: string,
  +name: string,
  +equipmentToAdd: $ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: WorkOrderDetailsPaneEquipmentItem_equipment$ref,
  |}>,
  +equipmentToRemove: $ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: WorkOrderDetailsPaneEquipmentItem_equipment$ref,
  |}>,
  +linksToAdd: $ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: WorkOrderDetailsPaneLinkItem_link$ref,
  |}>,
  +linksToRemove: $ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: WorkOrderDetailsPaneLinkItem_link$ref,
  |}>,
  +$refType: WorkOrderDetailsPane_workOrder$ref,
|};
export type WorkOrderDetailsPane_workOrder$data = WorkOrderDetailsPane_workOrder;
export type WorkOrderDetailsPane_workOrder$key = {
  +$data?: WorkOrderDetailsPane_workOrder$data,
  +$fragmentRefs: WorkOrderDetailsPane_workOrder$ref,
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
v1 = [
  (v0/*: any*/),
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "WorkOrderDetailsPaneEquipmentItem_equipment"
  }
],
v2 = [
  (v0/*: any*/),
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "WorkOrderDetailsPaneLinkItem_link"
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderDetailsPane_workOrder",
  "selections": [
    (v0/*: any*/),
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
      "concreteType": "Equipment",
      "kind": "LinkedField",
      "name": "equipmentToAdd",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Equipment",
      "kind": "LinkedField",
      "name": "equipmentToRemove",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Link",
      "kind": "LinkedField",
      "name": "linksToAdd",
      "plural": true,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Link",
      "kind": "LinkedField",
      "name": "linksToRemove",
      "plural": true,
      "selections": (v2/*: any*/),
      "storageKey": null
    }
  ],
  "type": "WorkOrder",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '4c85915884fc2d9d9f8c4fbee32cc2a4';

module.exports = node;
