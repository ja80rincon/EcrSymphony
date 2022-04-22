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
export type DeleteKqiSourceMutationVariables = {|
  id: string
|};
export type DeleteKqiSourceMutationResponse = {|
  +removeKqiSource: string
|};
export type DeleteKqiSourceMutation = {|
  variables: DeleteKqiSourceMutationVariables,
  response: DeleteKqiSourceMutationResponse,
|};
*/


/*
mutation DeleteKqiSourceMutation(
  $id: ID!
) {
  removeKqiSource(id: $id)
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
    "name": "removeKqiSource",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteKqiSourceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteKqiSourceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "869689069a5ccd0d9a67da43232c0a06",
    "id": null,
    "metadata": {},
    "name": "DeleteKqiSourceMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteKqiSourceMutation(\n  $id: ID!\n) {\n  removeKqiSource(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '617601309b2a80d61f7bc7078298a88f';

module.exports = node;
