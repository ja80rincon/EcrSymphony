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
export type AddKqiSourceInput = {|
  name: string
|};
export type AddKqiSourceMutationVariables = {|
  input: AddKqiSourceInput
|};
export type AddKqiSourceMutationResponse = {|
  +addKqiSource: {|
    +id: string,
    +name: string,
  |}
|};
export type AddKqiSourceMutation = {|
  variables: AddKqiSourceMutationVariables,
  response: AddKqiSourceMutationResponse,
|};
*/


/*
mutation AddKqiSourceMutation(
  $input: AddKqiSourceInput!
) {
  addKqiSource(input: $input) {
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
    "name": "addKqiSource",
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
    "name": "AddKqiSourceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddKqiSourceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "82bd1e8c7ab225cd2edf97799348d944",
    "id": null,
    "metadata": {},
    "name": "AddKqiSourceMutation",
    "operationKind": "mutation",
    "text": "mutation AddKqiSourceMutation(\n  $input: AddKqiSourceInput!\n) {\n  addKqiSource(input: $input) {\n    id\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ce84629b1478bdc909a1dca32b6e3871';

module.exports = node;
