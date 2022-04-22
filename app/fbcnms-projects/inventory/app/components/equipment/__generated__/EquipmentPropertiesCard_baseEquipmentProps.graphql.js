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
export type FutureState = "INSTALL" | "REMOVE" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type EquipmentPropertiesCard_baseEquipmentProps$ref: FragmentReference;
declare export opaque type EquipmentPropertiesCard_baseEquipmentProps$fragmentType: EquipmentPropertiesCard_baseEquipmentProps$ref;
export type EquipmentPropertiesCard_baseEquipmentProps = {
  +id: string,
  +name: string,
  +futureState: ?FutureState,
  +parentLocation: ?{
    +id: string,
    +name: string,
    ...
  },
  ...
};
export type EquipmentPropertiesCard_baseEquipmentProps$data = EquipmentPropertiesCard_baseEquipmentProps;
export type EquipmentPropertiesCard_baseEquipmentProps$key = {
  +$data?: EquipmentPropertiesCard_baseEquipmentProps$data,
  +$fragmentRefs: EquipmentPropertiesCard_baseEquipmentProps$ref,
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "mask": false
  },
  "name": "EquipmentPropertiesCard_baseEquipmentProps",
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
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "parentLocation",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Equipment",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '38c108dd662662f36827a889ffc2706f';

module.exports = node;
