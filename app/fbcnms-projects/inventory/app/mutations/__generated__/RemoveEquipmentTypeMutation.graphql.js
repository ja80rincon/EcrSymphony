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
export type RemoveEquipmentTypeMutationVariables = {|
  id: string
|};
export type RemoveEquipmentTypeMutationResponse = {|
  +removeEquipmentType: string
|};
export type RemoveEquipmentTypeMutation = {|
  variables: RemoveEquipmentTypeMutationVariables,
  response: RemoveEquipmentTypeMutationResponse,
|};
*/


/*
mutation RemoveEquipmentTypeMutation(
  $id: ID!
) {
  removeEquipmentType(id: $id)
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
    "name": "removeEquipmentType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveEquipmentTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveEquipmentTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6352e52373e03fae9a28c8bf9d37e0fb",
    "id": null,
    "metadata": {},
    "name": "RemoveEquipmentTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveEquipmentTypeMutation(\n  $id: ID!\n) {\n  removeEquipmentType(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '11b09437ff00a0fb11b78dcc441c853f';

module.exports = node;
