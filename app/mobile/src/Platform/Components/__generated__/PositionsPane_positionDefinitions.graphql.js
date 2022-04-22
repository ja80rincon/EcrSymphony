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
declare export opaque type PositionsPane_positionDefinitions$ref: FragmentReference;
declare export opaque type PositionsPane_positionDefinitions$fragmentType: PositionsPane_positionDefinitions$ref;
export type PositionsPane_positionDefinitions = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +index: ?number,
  +visibleLabel: ?string,
  +$refType: PositionsPane_positionDefinitions$ref,
|}>;
export type PositionsPane_positionDefinitions$data = PositionsPane_positionDefinitions;
export type PositionsPane_positionDefinitions$key = $ReadOnlyArray<{
  +$data?: PositionsPane_positionDefinitions$data,
  +$fragmentRefs: PositionsPane_positionDefinitions$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "PositionsPane_positionDefinitions",
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
  "type": "EquipmentPositionDefinition"
};
// prettier-ignore
(node/*: any*/).hash = '97690d8e9be06652beaee59626744593';

module.exports = node;
