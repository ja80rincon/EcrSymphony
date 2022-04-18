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
declare export opaque type PortDefinitionsTable_portDefinitions$ref: FragmentReference;
declare export opaque type PortDefinitionsTable_portDefinitions$fragmentType: PortDefinitionsTable_portDefinitions$ref;
export type PortDefinitionsTable_portDefinitions = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +index: ?number,
  +visibleLabel: ?string,
  +portType: ?{|
    +id: string,
    +name: string,
  |},
  +connectedPorts: ?$ReadOnlyArray<{|
    +id: string,
    +name: string,
  |}>,
  +$refType: PortDefinitionsTable_portDefinitions$ref,
|}>;
export type PortDefinitionsTable_portDefinitions$data = PortDefinitionsTable_portDefinitions;
export type PortDefinitionsTable_portDefinitions$key = $ReadOnlyArray<{
  +$data?: PortDefinitionsTable_portDefinitions$data,
  +$fragmentRefs: PortDefinitionsTable_portDefinitions$ref,
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
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "PortDefinitionsTable_portDefinitions",
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPortType",
      "kind": "LinkedField",
      "name": "portType",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPortDefinition",
      "kind": "LinkedField",
      "name": "connectedPorts",
      "plural": true,
      "selections": (v2/*: any*/),
      "storageKey": null
    }
  ],
  "type": "EquipmentPortDefinition",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '214290ff7d5ae32d63df37643bf60009';

module.exports = node;
