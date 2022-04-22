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
export type DeletePermissionsPolicyMutationVariables = {|
  id: string
|};
export type DeletePermissionsPolicyMutationResponse = {|
  +deletePermissionsPolicy: boolean
|};
export type DeletePermissionsPolicyMutation = {|
  variables: DeletePermissionsPolicyMutationVariables,
  response: DeletePermissionsPolicyMutationResponse,
|};
*/


/*
mutation DeletePermissionsPolicyMutation(
  $id: ID!
) {
  deletePermissionsPolicy(id: $id)
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
    "name": "deletePermissionsPolicy",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeletePermissionsPolicyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeletePermissionsPolicyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "86d74c4ec8af552134ed5cdedcdaf8f1",
    "id": null,
    "metadata": {},
    "name": "DeletePermissionsPolicyMutation",
    "operationKind": "mutation",
    "text": "mutation DeletePermissionsPolicyMutation(\n  $id: ID!\n) {\n  deletePermissionsPolicy(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '14f797ed5eccde6161e1583e51596f09';

module.exports = node;
