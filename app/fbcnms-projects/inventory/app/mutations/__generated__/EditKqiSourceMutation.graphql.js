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
export type EditKqiSourceInput = {|
  id: string,
  name: string,
|};
export type EditKqiSourceMutationVariables = {|
  input: EditKqiSourceInput
|};
export type EditKqiSourceMutationResponse = {|
  +editKqiSource: {|
    +id: string,
    +name: string,
  |}
|};
export type EditKqiSourceMutation = {|
  variables: EditKqiSourceMutationVariables,
  response: EditKqiSourceMutationResponse,
|};
*/


/*
mutation EditKqiSourceMutation(
  $input: EditKqiSourceInput!
) {
  editKqiSource(input: $input) {
    id
    name
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "KqiSource",
    "kind": "LinkedField",
    "name": "editKqiSource",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
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
    "name": "EditKqiSourceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditKqiSourceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "37907ad157c178c5abe57a044d77879b",
    "id": null,
    "metadata": {},
    "name": "EditKqiSourceMutation",
    "operationKind": "mutation",
    "text": "mutation EditKqiSourceMutation(\n  $input: EditKqiSourceInput!\n) {\n  editKqiSource(input: $input) {\n    id\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'cf13959449f11f868382b73d5b7e22c9';

module.exports = node;
