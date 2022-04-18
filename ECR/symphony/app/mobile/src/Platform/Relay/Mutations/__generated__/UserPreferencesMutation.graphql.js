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
export type UserPreferencesMutationVariables = {|
  input: EditUserInput
|};
export type UserPreferencesMutationResponse = {|
  +editUser: {|
    +distanceUnit: ?DistanceUnit
  |}
|};
export type UserPreferencesMutation = {|
  variables: UserPreferencesMutationVariables,
  response: UserPreferencesMutationResponse,
|};
*/


/*
mutation UserPreferencesMutation(
  $input: EditUserInput!
) {
  editUser(input: $input) {
    distanceUnit
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "distanceUnit",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UserPreferencesMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "editUser",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserPreferencesMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "editUser",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "UserPreferencesMutation",
    "operationKind": "mutation",
    "text": "mutation UserPreferencesMutation(\n  $input: EditUserInput!\n) {\n  editUser(input: $input) {\n    distanceUnit\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7fbdb3f200cfe91f9d815a9e87e2d87d';

module.exports = node;
