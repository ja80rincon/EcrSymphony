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
export type UsersByAuthIDQueryVariables = {|
  authID: string
|};
export type UsersByAuthIDQueryResponse = {|
  +user: ?{|
    +id: string
  |}
|};
export type UsersByAuthIDQuery = {|
  variables: UsersByAuthIDQueryVariables,
  response: UsersByAuthIDQueryResponse,
|};
*/


/*
query UsersByAuthIDQuery(
  $authID: String!
) {
  user(authID: $authID) {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "authID"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "authID",
        "variableName": "authID"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UsersByAuthIDQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UsersByAuthIDQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b290fe9119bb1d17416d9065d8be0b6d",
    "id": null,
    "metadata": {},
    "name": "UsersByAuthIDQuery",
    "operationKind": "query",
    "text": "query UsersByAuthIDQuery(\n  $authID: String!\n) {\n  user(authID: $authID) {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a242fdd9ce8fb33496aab66755ad0186';

module.exports = node;
