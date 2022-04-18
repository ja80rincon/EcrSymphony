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
export type RemoveThresholdMutationVariables = {|
  id: string
|};
export type RemoveThresholdMutationResponse = {|
  +removeThreshold: string
|};
export type RemoveThresholdMutation = {|
  variables: RemoveThresholdMutationVariables,
  response: RemoveThresholdMutationResponse,
|};
*/


/*
mutation RemoveThresholdMutation(
  $id: ID!
) {
  removeThreshold(id: $id)
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
    "name": "removeThreshold",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveThresholdMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveThresholdMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "10f4a4b50ef0bdb46e2444dc6675f5a2",
    "id": null,
    "metadata": {},
    "name": "RemoveThresholdMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveThresholdMutation(\n  $id: ID!\n) {\n  removeThreshold(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '787d8391415d17458e8d80f404f57bab';

module.exports = node;
