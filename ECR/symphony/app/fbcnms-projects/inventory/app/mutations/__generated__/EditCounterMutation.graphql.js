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
export type EditCounterInput = {|
  id: string,
  name: string,
  externalID: string,
  networkManagerSystem: string,
  vendorFk: string,
|};
export type EditCounterMutationVariables = {|
  input: EditCounterInput
|};
export type EditCounterMutationResponse = {|
  +editCounter: {|
    +id: string,
    +name: string,
    +externalID: string,
    +networkManagerSystem: string,
  |}
|};
export type EditCounterMutation = {|
  variables: EditCounterMutationVariables,
  response: EditCounterMutationResponse,
|};
*/


/*
mutation EditCounterMutation(
  $input: EditCounterInput!
) {
  editCounter(input: $input) {
    id
    name
    externalID
    networkManagerSystem
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
    "name": "editCounter",
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "externalID",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "networkManagerSystem",
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
    "name": "EditCounterMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditCounterMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "efa814d23159e3002981b27e366f03b6",
    "id": null,
    "metadata": {},
    "name": "EditCounterMutation",
    "operationKind": "mutation",
    "text": "mutation EditCounterMutation(\n  $input: EditCounterInput!\n) {\n  editCounter(input: $input) {\n    id\n    name\n    externalID\n    networkManagerSystem\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd9bd655fa7f6480955a97850e6a7246f';

module.exports = node;
