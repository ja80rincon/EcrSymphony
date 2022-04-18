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
declare export opaque type PositionDefinitionsAddEditTable_positionDefinition$ref: FragmentReference;
declare export opaque type PositionDefinitionsAddEditTable_positionDefinition$fragmentType: PositionDefinitionsAddEditTable_positionDefinition$ref;
export type PositionDefinitionsAddEditTable_positionDefinition = {
  +id: string,
  +name: string,
  +index: ?number,
  +visibleLabel: ?string,
  ...
};
export type PositionDefinitionsAddEditTable_positionDefinition$data = PositionDefinitionsAddEditTable_positionDefinition;
export type PositionDefinitionsAddEditTable_positionDefinition$key = {
  +$data?: PositionDefinitionsAddEditTable_positionDefinition$data,
  +$fragmentRefs: PositionDefinitionsAddEditTable_positionDefinition$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "mask": false
  },
  "name": "PositionDefinitionsAddEditTable_positionDefinition",
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
  "type": "EquipmentPositionDefinition",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '3952fd6597286104bfc0889a1d16bb1a';

module.exports = node;
