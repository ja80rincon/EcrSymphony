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
export type RemoveWorkerTypeMutationVariables = {|
  id: string
|};
export type RemoveWorkerTypeMutationResponse = {|
  +removeWorkerType: string
|};
export type RemoveWorkerTypeMutation = {|
  variables: RemoveWorkerTypeMutationVariables,
  response: RemoveWorkerTypeMutationResponse,
|};
*/


/*
mutation RemoveWorkerTypeMutation(
  $id: ID!
) {
  removeWorkerType(id: $id)
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
    "name": "removeWorkerType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveWorkerTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveWorkerTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "76ade44fec152ef87a9182d9d9471b65",
    "id": null,
    "metadata": {},
    "name": "RemoveWorkerTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveWorkerTypeMutation(\n  $id: ID!\n) {\n  removeWorkerType(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aec91383edb554d49a755214d5f78e19';

module.exports = node;
