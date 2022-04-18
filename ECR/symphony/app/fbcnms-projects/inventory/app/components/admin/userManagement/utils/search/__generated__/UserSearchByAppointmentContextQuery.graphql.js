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
export type FilterOperator = "CONTAINS" | "DATE_GREATER_OR_EQUAL_THAN" | "DATE_GREATER_THAN" | "DATE_LESS_OR_EQUAL_THAN" | "DATE_LESS_THAN" | "IS" | "IS_NIL" | "IS_NIL_OR_DATE_GREATER_OR_EQUAL_THAN" | "IS_NOT_ONE_OF" | "IS_ONE_OF" | "%future added value";
export type PropertyKind = "bool" | "date" | "datetime_local" | "email" | "enum" | "float" | "gps_location" | "int" | "node" | "range" | "string" | "%future added value";
export type UserFilterType = "USER_NAME" | "USER_ORGANIZATION" | "USER_STATUS" | "%future added value";
export type UserRole = "ADMIN" | "OWNER" | "USER" | "%future added value";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "%future added value";
export type UserFilterInput = {|
  filterType: UserFilterType,
  operator: FilterOperator,
  stringValue?: ?string,
  propertyValue?: ?PropertyTypeInput,
  statusValue?: ?UserStatus,
  idSet?: ?$ReadOnlyArray<string>,
  stringSet?: ?$ReadOnlyArray<string>,
  maxDepth?: ?number,
|};
export type PropertyTypeInput = {|
  id?: ?string,
  externalId?: ?string,
  name: string,
  type: PropertyKind,
  nodeType?: ?string,
  index?: ?number,
  category?: ?string,
  stringValue?: ?string,
  intValue?: ?number,
  booleanValue?: ?boolean,
  floatValue?: ?number,
  latitudeValue?: ?number,
  longitudeValue?: ?number,
  rangeFromValue?: ?number,
  rangeToValue?: ?number,
  isEditable?: ?boolean,
  isInstanceProperty?: ?boolean,
  isMandatory?: ?boolean,
  isDeleted?: ?boolean,
  propertyCategoryID?: ?string,
  isListable?: ?boolean,
|};
export type SlotFilterInput = {|
  slotStartDate: any,
  slotEndDate: any,
|};
export type RegularHoursInput = {|
  workdayStartHour: number,
  workdayStartMinute: number,
  workdayEndHour: number,
  workdayEndMinute: number,
  timezone?: ?string,
|};
export type UserSearchByAppointmentContextQueryVariables = {|
  filterBy: $ReadOnlyArray<UserFilterInput>,
  slottedBy: SlotFilterInput,
  workday: RegularHoursInput,
  duration: number,
|};
export type UserSearchByAppointmentContextQueryResponse = {|
  +usersAvailability: ?$ReadOnlyArray<{|
    +user: {|
      +id: string,
      +authID: string,
      +email: string,
      +role: UserRole,
      +status: UserStatus,
      +firstName: string,
      +lastName: string,
    |},
    +slotStartDate: any,
    +slotEndDate: any,
  |}>
|};
export type UserSearchByAppointmentContextQuery = {|
  variables: UserSearchByAppointmentContextQueryVariables,
  response: UserSearchByAppointmentContextQueryResponse,
|};
*/


/*
query UserSearchByAppointmentContextQuery(
  $filterBy: [UserFilterInput!]!
  $slottedBy: SlotFilterInput!
  $workday: RegularHoursInput!
  $duration: Float!
) {
  usersAvailability(filterBy: $filterBy, slotFilterBy: $slottedBy, regularHours: $workday, duration: $duration) {
    user {
      id
      authID
      email
      role
      status
      firstName
      lastName
    }
    slotStartDate
    slotEndDate
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "duration"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "filterBy"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slottedBy"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workday"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "duration",
        "variableName": "duration"
      },
      {
        "kind": "Variable",
        "name": "filterBy",
        "variableName": "filterBy"
      },
      {
        "kind": "Variable",
        "name": "regularHours",
        "variableName": "workday"
      },
      {
        "kind": "Variable",
        "name": "slotFilterBy",
        "variableName": "slottedBy"
      }
    ],
    "concreteType": "UserAvailability",
    "kind": "LinkedField",
    "name": "usersAvailability",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
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
          },
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
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "role",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
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
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "slotStartDate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "slotEndDate",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserSearchByAppointmentContextQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "UserSearchByAppointmentContextQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "ca5c4c32fee09956122e50aed9fadf17",
    "id": null,
    "metadata": {},
    "name": "UserSearchByAppointmentContextQuery",
    "operationKind": "query",
    "text": "query UserSearchByAppointmentContextQuery(\n  $filterBy: [UserFilterInput!]!\n  $slottedBy: SlotFilterInput!\n  $workday: RegularHoursInput!\n  $duration: Float!\n) {\n  usersAvailability(filterBy: $filterBy, slotFilterBy: $slottedBy, regularHours: $workday, duration: $duration) {\n    user {\n      id\n      authID\n      email\n      role\n      status\n      firstName\n      lastName\n    }\n    slotStartDate\n    slotEndDate\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '58cf4069d0c3a3fc7fcefcabeea9266c';

module.exports = node;
