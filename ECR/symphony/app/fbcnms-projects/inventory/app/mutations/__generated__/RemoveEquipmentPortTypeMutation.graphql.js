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
import type { ConcreteRequest } from 'relay-runtime';
export type RemoveEquipmentPortTypeMutationVariables = {|
  id: string
|};
export type RemoveEquipmentPortTypeMutationResponse = {|
  +removeEquipmentPortType: string
|};
export type RemoveEquipmentPortTypeMutation = {|
  variables: RemoveEquipmentPortTypeMutationVariables,
  response: RemoveEquipmentPortTypeMutationResponse,
|};
*/


/*
mutation RemoveEquipmentPortTypeMutation(
  $id: ID!
) {
  removeEquipmentPortType(id: $id)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "removeEquipmentPortType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveEquipmentPortTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveEquipmentPortTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "850aa7791a94353972b0ad317b3f9c81",
    "id": null,
    "metadata": {},
    "name": "RemoveEquipmentPortTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveEquipmentPortTypeMutation(\n  $id: ID!\n) {\n  removeEquipmentPortType(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f14522f936273971e9cd0691f19f241e';

module.exports = node;
