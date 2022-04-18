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
export type RemoveRuleMutationVariables = {|
  id: string
|};
export type RemoveRuleMutationResponse = {|
  +removeRule: string
|};
export type RemoveRuleMutation = {|
  variables: RemoveRuleMutationVariables,
  response: RemoveRuleMutationResponse,
|};
*/


/*
mutation RemoveRuleMutation(
  $id: ID!
) {
  removeRule(id: $id)
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
    "name": "removeRule",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveRuleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveRuleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cc6aae169c385d00a6554a8c256f4288",
    "id": null,
    "metadata": {},
    "name": "RemoveRuleMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveRuleMutation(\n  $id: ID!\n) {\n  removeRule(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8924a6240b6f3ef2f40d9a2b5ccc8ee2';

module.exports = node;
