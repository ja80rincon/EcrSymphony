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
declare export opaque type ServiceEndpointDefinitionTable_serviceEndpointDefinitions$ref: FragmentReference;
declare export opaque type ServiceEndpointDefinitionTable_serviceEndpointDefinitions$fragmentType: ServiceEndpointDefinitionTable_serviceEndpointDefinitions$ref;
export type ServiceEndpointDefinitionTable_serviceEndpointDefinitions = $ReadOnlyArray<{|
  +id: string,
  +index: number,
  +role: ?string,
  +name: string,
  +equipmentType: {|
    +name: string,
    +id: string,
  |},
  +$refType: ServiceEndpointDefinitionTable_serviceEndpointDefinitions$ref,
|}>;
export type ServiceEndpointDefinitionTable_serviceEndpointDefinitions$data = ServiceEndpointDefinitionTable_serviceEndpointDefinitions;
export type ServiceEndpointDefinitionTable_serviceEndpointDefinitions$key = $ReadOnlyArray<{
  +$data?: ServiceEndpointDefinitionTable_serviceEndpointDefinitions$data,
  +$fragmentRefs: ServiceEndpointDefinitionTable_serviceEndpointDefinitions$ref,
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
  "name": "ServiceEndpointDefinitionTable_serviceEndpointDefinitions",
  "selections": [
    (v0/*: any*/),
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
      "name": "role",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentType",
      "kind": "LinkedField",
      "name": "equipmentType",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ServiceEndpointDefinition",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '5e4e6ca6fca81e3fafa893676cb515fa';

module.exports = node;
