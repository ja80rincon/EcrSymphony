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
export type EditAlarmFilterInput = {|
  id: string,
  name: string,
  networkResource: string,
  enable: boolean,
  beginTime: any,
  endTime: any,
  reason: string,
  alarmStatus?: ?string,
|};
export type EditAlarmFilterMutationVariables = {|
  input: EditAlarmFilterInput
|};
export type EditAlarmFilterMutationResponse = {|
  +editAlarmFilter: {|
    +id: string,
    +name: string,
    +networkResource: string,
    +enable: boolean,
    +beginTime: any,
    +endTime: any,
    +reason: string,
    +user: string,
    +creationTime: any,
    +alarmStatus: ?{|
      +id: string,
      +name: string,
    |},
  |}
|};
export type EditAlarmFilterMutation = {|
  variables: EditAlarmFilterMutationVariables,
  response: EditAlarmFilterMutationResponse,
|};
*/


/*
mutation EditAlarmFilterMutation(
  $input: EditAlarmFilterInput!
) {
  editAlarmFilter(input: $input) {
    id
    name
    networkResource
    enable
    beginTime
    endTime
    reason
    user
    creationTime
    alarmStatus {
      id
      name
    }
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AlarmFilter",
    "kind": "LinkedField",
    "name": "editAlarmFilter",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "networkResource",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "enable",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "beginTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reason",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "user",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "creationTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AlarmStatus",
        "kind": "LinkedField",
        "name": "alarmStatus",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
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
    "name": "EditAlarmFilterMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditAlarmFilterMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "5358cfb6f91308ac3d298d4ab54a2fd5",
    "id": null,
    "metadata": {},
    "name": "EditAlarmFilterMutation",
    "operationKind": "mutation",
    "text": "mutation EditAlarmFilterMutation(\n  $input: EditAlarmFilterInput!\n) {\n  editAlarmFilter(input: $input) {\n    id\n    name\n    networkResource\n    enable\n    beginTime\n    endTime\n    reason\n    user\n    creationTime\n    alarmStatus {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0a20c588592154748afe26dc27d5edcf';

module.exports = node;
