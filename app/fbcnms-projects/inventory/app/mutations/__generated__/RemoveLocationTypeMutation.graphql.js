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
export type RemoveLocationTypeMutationVariables = {|
  id: string
|};
export type RemoveLocationTypeMutationResponse = {|
  +removeLocationType: string
|};
export type RemoveLocationTypeMutation = {|
  variables: RemoveLocationTypeMutationVariables,
  response: RemoveLocationTypeMutationResponse,
|};
*/


/*
mutation RemoveLocationTypeMutation(
  $id: ID!
) {
  removeLocationType(id: $id)
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
    "name": "removeLocationType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveLocationTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveLocationTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a0cc305fa83ab3fa0e6a38e8ef8d6bf7",
    "id": null,
    "metadata": {},
    "name": "RemoveLocationTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveLocationTypeMutation(\n  $id: ID!\n) {\n  removeLocationType(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9df4715e9aebae6d3f5b3e7975c33de5';

module.exports = node;
