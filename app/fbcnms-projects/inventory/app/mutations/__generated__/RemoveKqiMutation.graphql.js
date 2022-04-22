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
export type RemoveKqiMutationVariables = {|
  id: string
|};
export type RemoveKqiMutationResponse = {|
  +removeKqi: string
|};
export type RemoveKqiMutation = {|
  variables: RemoveKqiMutationVariables,
  response: RemoveKqiMutationResponse,
|};
*/


/*
mutation RemoveKqiMutation(
  $id: ID!
) {
  removeKqi(id: $id)
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
    "name": "removeKqi",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveKqiMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveKqiMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8c964acd26e90c320a7bbff3ff4dd6da",
    "id": null,
    "metadata": {},
    "name": "RemoveKqiMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveKqiMutation(\n  $id: ID!\n) {\n  removeKqi(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'acaa13888bfb2dddec36a5d3742f9e78';

module.exports = node;
