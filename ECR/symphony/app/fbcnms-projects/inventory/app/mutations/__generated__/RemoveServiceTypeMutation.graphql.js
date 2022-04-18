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
export type RemoveServiceTypeMutationVariables = {|
  id: string
|};
export type RemoveServiceTypeMutationResponse = {|
  +removeServiceType: string
|};
export type RemoveServiceTypeMutation = {|
  variables: RemoveServiceTypeMutationVariables,
  response: RemoveServiceTypeMutationResponse,
|};
*/


/*
mutation RemoveServiceTypeMutation(
  $id: ID!
) {
  removeServiceType(id: $id)
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
    "name": "removeServiceType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveServiceTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveServiceTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "715f3d875852571a9c025a7059e8aedb",
    "id": null,
    "metadata": {},
    "name": "RemoveServiceTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveServiceTypeMutation(\n  $id: ID!\n) {\n  removeServiceType(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '499330f58e6161c5f94f25863abdd098';

module.exports = node;
