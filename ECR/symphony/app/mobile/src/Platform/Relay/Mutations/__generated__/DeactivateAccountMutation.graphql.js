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
export type DistanceUnit = "KILOMETER" | "MILE" | "%future added value";
export type UserRole = "ADMIN" | "OWNER" | "USER" | "%future added value";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "%future added value";
export type EditUserInput = {|
  id: string,
  firstName?: ?string,
  lastName?: ?string,
  status?: ?UserStatus,
  role?: ?UserRole,
  distanceUnit?: ?DistanceUnit,
|};
export type DeactivateAccountMutationVariables = {|
  input: EditUserInput
|};
export type DeactivateAccountMutationResponse = {|
  +editUser: {|
    +id: string
  |}
|};
export type DeactivateAccountMutation = {|
  variables: DeactivateAccountMutationVariables,
  response: DeactivateAccountMutationResponse,
|};
*/


/*
mutation DeactivateAccountMutation(
  $input: EditUserInput!
) {
  editUser(input: $input) {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "EditUserInput!"
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
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "editUser",
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
    "name": "DeactivateAccountMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeactivateAccountMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "DeactivateAccountMutation",
    "operationKind": "mutation",
    "text": "mutation DeactivateAccountMutation(\n  $input: EditUserInput!\n) {\n  editUser(input: $input) {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e2edb012fc0efba667a5171bfdab69ad';

module.exports = node;
