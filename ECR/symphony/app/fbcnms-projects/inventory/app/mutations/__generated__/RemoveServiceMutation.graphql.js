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
export type RemoveServiceMutationVariables = {|
  id: string
|};
export type RemoveServiceMutationResponse = {|
  +removeService: string
|};
export type RemoveServiceMutation = {|
  variables: RemoveServiceMutationVariables,
  response: RemoveServiceMutationResponse,
|};
*/


/*
mutation RemoveServiceMutation(
  $id: ID!
) {
  removeService(id: $id)
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
    "name": "removeService",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveServiceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveServiceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f0ccb340d8c08e67a78932389d50f269",
    "id": null,
    "metadata": {},
    "name": "RemoveServiceMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveServiceMutation(\n  $id: ID!\n) {\n  removeService(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0e33b688caed9845743fa09141151ba7';

module.exports = node;
