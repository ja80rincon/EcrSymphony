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
export type AddAppointmentInput = {|
  creatorId?: ?string,
  assigneeID: string,
  workorderID: string,
  date: any,
  duration: number,
|};
export type AddAppointmentMutationVariables = {|
  input: AddAppointmentInput
|};
export type AddAppointmentMutationResponse = {|
  +addAppointment: {|
    +id: string,
    +workOrder: {|
      +id: string
    |},
    +assignee: {|
      +id: string,
      +authID: string,
      +firstName: string,
      +lastName: string,
      +email: string,
    |},
    +start: any,
    +end: any,
  |}
|};
export type AddAppointmentMutation = {|
  variables: AddAppointmentMutationVariables,
  response: AddAppointmentMutationResponse,
|};
*/


/*
mutation AddAppointmentMutation(
  $input: AddAppointmentInput!
) {
  addAppointment(input: $input) {
    id
    workOrder {
      id
    }
    assignee {
      id
      authID
      firstName
      lastName
      email
    }
    start
    end
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Appointment",
    "kind": "LinkedField",
    "name": "addAppointment",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "WorkOrder",
        "kind": "LinkedField",
        "name": "workOrder",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "assignee",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "authID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "firstName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "lastName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "start",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "end",
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
    "name": "AddAppointmentMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddAppointmentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "28a31c86caae81f8cd7496af203f93b6",
    "id": null,
    "metadata": {},
    "name": "AddAppointmentMutation",
    "operationKind": "mutation",
    "text": "mutation AddAppointmentMutation(\n  $input: AddAppointmentInput!\n) {\n  addAppointment(input: $input) {\n    id\n    workOrder {\n      id\n    }\n    assignee {\n      id\n      authID\n      firstName\n      lastName\n      email\n    }\n    start\n    end\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6feed58e73f06e4f5d7d642dd30c5b81';

module.exports = node;
