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
export type AddCounterInput = {|
  name: string,
  externalID: string,
  networkManagerSystem: string,
  counterFamily: string,
  vendorFk: string,
|};
export type AddCounterMutationVariables = {|
  input: AddCounterInput
|};
export type AddCounterMutationResponse = {|
  +addCounter: {|
    +id: string,
    +name: string,
  |}
|};
export type AddCounterMutation = {|
  variables: AddCounterMutationVariables,
  response: AddCounterMutationResponse,
|};
*/


/*
mutation AddCounterMutation(
  $input: AddCounterInput!
) {
  addCounter(input: $input) {
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
    "concreteType": "Counter",
    "kind": "LinkedField",
    "name": "addCounter",
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
    "name": "AddCounterMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddCounterMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5a92a0596fbe46c5ed06a70945087405",
    "id": null,
    "metadata": {},
    "name": "AddCounterMutation",
    "operationKind": "mutation",
    "text": "mutation AddCounterMutation(\n  $input: AddCounterInput!\n) {\n  addCounter(input: $input) {\n    id\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ea55240b40f19c7038f41b1ca59c0abc';

module.exports = node;
