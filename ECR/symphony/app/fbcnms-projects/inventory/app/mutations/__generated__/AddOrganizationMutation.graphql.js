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
export type AddOrganizationInput = {|
  name: string,
  description: string,
|};
export type AddOrganizationMutationVariables = {|
  input: AddOrganizationInput
|};
export type AddOrganizationMutationResponse = {|
  +addOrganization: {|
    +id: string,
    +name: string,
    +description: string,
  |}
|};
export type AddOrganizationMutation = {|
  variables: AddOrganizationMutationVariables,
  response: AddOrganizationMutationResponse,
|};
*/


/*
mutation AddOrganizationMutation(
  $input: AddOrganizationInput!
) {
  addOrganization(input: $input) {
    id
    name
    description
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
    "concreteType": "Organization",
    "kind": "LinkedField",
    "name": "addOrganization",
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
        "name": "description",
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
    "name": "AddOrganizationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddOrganizationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d9f30d0d20c0f7e922ba5cdf065b57c8",
    "id": null,
    "metadata": {},
    "name": "AddOrganizationMutation",
    "operationKind": "mutation",
    "text": "mutation AddOrganizationMutation(\n  $input: AddOrganizationInput!\n) {\n  addOrganization(input: $input) {\n    id\n    name\n    description\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e9fad2e4efa1cd8f352717895ea96286';

module.exports = node;
