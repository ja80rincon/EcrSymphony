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
export type RemovePropertyCategoryTypeMutationVariables = {|
  id: string
|};
export type RemovePropertyCategoryTypeMutationResponse = {|
  +removePropertyCategory: string
|};
export type RemovePropertyCategoryTypeMutation = {|
  variables: RemovePropertyCategoryTypeMutationVariables,
  response: RemovePropertyCategoryTypeMutationResponse,
|};
*/


/*
mutation RemovePropertyCategoryTypeMutation(
  $id: ID!
) {
  removePropertyCategory(id: $id)
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
    "name": "removePropertyCategory",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemovePropertyCategoryTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemovePropertyCategoryTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fe06879ed1d000a4217908062b414c72",
    "id": null,
    "metadata": {},
    "name": "RemovePropertyCategoryTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemovePropertyCategoryTypeMutation(\n  $id: ID!\n) {\n  removePropertyCategory(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ec4aeac576c00627f01cf128ea07cc26';

module.exports = node;
