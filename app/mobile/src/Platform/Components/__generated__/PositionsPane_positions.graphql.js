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
declare export opaque type PositionsPane_positions$ref: FragmentReference;
declare export opaque type PositionsPane_positions$fragmentType: PositionsPane_positions$ref;
export type PositionsPane_positions = $ReadOnlyArray<{|
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
  |},
  +parentEquipment: {|
    +id: string
  |},
  +$refType: PositionsPane_positions$ref,
|}>;
export type PositionsPane_positions$data = PositionsPane_positions;
export type PositionsPane_positions$key = $ReadOnlyArray<{
  +$data?: PositionsPane_positions$data,
  +$fragmentRefs: PositionsPane_positions$ref,
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
  "name": "PositionsPane_positions",
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
        (v1/*: any*/)
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
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "EquipmentPosition"
};
})();
// prettier-ignore
(node/*: any*/).hash = '40b46d9765c16e308b31b27c21454ca6';

module.exports = node;
