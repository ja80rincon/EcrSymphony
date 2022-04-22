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
declare export opaque type AddToEquipmentDialog_parentEquipment$ref: FragmentReference;
declare export opaque type AddToEquipmentDialog_parentEquipment$fragmentType: AddToEquipmentDialog_parentEquipment$ref;
export type AddToEquipmentDialog_parentEquipment = {|
  +id: string,
  +locationHierarchy: $ReadOnlyArray<{|
    +id: string
  |}>,
  +$refType: AddToEquipmentDialog_parentEquipment$ref,
|};
export type AddToEquipmentDialog_parentEquipment$data = AddToEquipmentDialog_parentEquipment;
export type AddToEquipmentDialog_parentEquipment$key = {
  +$data?: AddToEquipmentDialog_parentEquipment$data,
  +$fragmentRefs: AddToEquipmentDialog_parentEquipment$ref,
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddToEquipmentDialog_parentEquipment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "locationHierarchy",
      "plural": true,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Equipment",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '5f1bb222d3448e6445d42e84470b6d5c';

module.exports = node;
