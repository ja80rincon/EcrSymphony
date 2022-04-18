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
declare export opaque type PositionDefinitionsTable_positionDefinitions$ref: FragmentReference;
declare export opaque type PositionDefinitionsTable_positionDefinitions$fragmentType: PositionDefinitionsTable_positionDefinitions$ref;
export type PositionDefinitionsTable_positionDefinitions = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +index: ?number,
  +visibleLabel: ?string,
  +$refType: PositionDefinitionsTable_positionDefinitions$ref,
|}>;
export type PositionDefinitionsTable_positionDefinitions$data = PositionDefinitionsTable_positionDefinitions;
export type PositionDefinitionsTable_positionDefinitions$key = $ReadOnlyArray<{
  +$data?: PositionDefinitionsTable_positionDefinitions$data,
  +$fragmentRefs: PositionDefinitionsTable_positionDefinitions$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "PositionDefinitionsTable_positionDefinitions",
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
(node/*: any*/).hash = 'e380bf28ed2fa9bb1090ea936f6e7b25';

module.exports = node;
